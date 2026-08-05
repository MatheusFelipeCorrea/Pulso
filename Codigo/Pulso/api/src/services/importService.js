const crypto = require('crypto');
const AppError = require('../utils/appError');
const { parseStatementFile } = require('../parsers');
const transactionRepository = require('../repositories/transactionRepository');
const categoryRepository = require('../repositories/categoryRepository');
const { sugerirCategoriaId } = require('../utils/categorySuggestionUtils');
const { encontrarCategoriaPorRegra, isOutros } = require('../utils/importCategoryRules');
const { buildImportHash } = require('../utils/importHashUtils');
const { validarRecursoCategoria } = require('../utils/recursoCategoriaRules');
const {
    isOrigemComSaldoExtrato,
    isOrigemBeneficio,
    categoriaCompativelImportacao,
    encontrarCategoriaAjusteSaldo,
    AJUSTE_SALDO_IMPORTACAO_DESCRICAO,
} = require('../utils/importBeneficioUtils');
const { calcularSaldosPorRecurso } = require('../utils/resourceBalanceUtils');
const { parseVencimentoDate, toDateOnlyInTimezone, todayInTimezone } = require('../utils/dateTimezone');
const prisma = require('../config/database');

const RECURSO_BY_ORIGEM = {
    CONTA: 'DINHEIRO',
    VT: 'VT',
    VA: 'VA',
    VR: 'VR',
};

const round2 = (value) => Math.round(Number(value) * 100) / 100;

const buildDedupeSet = async (usuarioId) => {
    const existentes = await transactionRepository.listarParaDedupeImportacao(usuarioId);
    return new Set(
        existentes.map((tx) => buildImportHash(tx.data, tx.valor, tx.descricao))
    );
};

const sugerirCategorias = async (usuarioId, linhas, categorias, origem) => {
    const historicoReceita = await transactionRepository.listarDescricoesPorTipo(usuarioId, 'RECEITA');
    const historicoDespesa = await transactionRepository.listarDescricoesPorTipo(usuarioId, 'DESPESA');
    const origemComSaldoExtrato = isOrigemComSaldoExtrato(origem);

    return linhas.map((linha) => {
        const historico = linha.tipo === 'RECEITA' ? historicoReceita : historicoDespesa;

        let categoriaId = encontrarCategoriaPorRegra(linha.descricao, categorias, linha.tipo);

        if (!categoriaId) {
            const historicoId = sugerirCategoriaId(linha.descricao, historico);
            const historicoCat = categorias.find((cat) => cat.id === historicoId) ?? null;
            if (historicoId && historicoCat && !isOutros(historicoCat)) {
                categoriaId = historicoId;
            }
        }

        if (!categoriaId && origemComSaldoExtrato) {
            categoriaId = encontrarCategoriaAjusteSaldo(categorias, origem, linha.tipo)?.id ?? null;
        }

        let categoria = categorias.find((cat) => cat.id === categoriaId) ?? null;
        if (
            isOrigemBeneficio(origem) &&
            (!categoria || !categoriaCompativelImportacao(categoria, origem, linha.tipo))
        ) {
            categoria = encontrarCategoriaAjusteSaldo(categorias, origem, linha.tipo);
            categoriaId = categoria?.id ?? null;
        }

        return {
            ...linha,
            categoriaId,
            categoriaNome: categoria?.nome ?? null,
        };
    });
};

const calcularSaldoRecurso = async (usuarioId, recurso) => {
    const transacoes = await transactionRepository.listarPorRecurso(usuarioId, recurso);
    return calcularSaldosPorRecurso(transacoes)[recurso] ?? 0;
};

const calcularDeltaImportacao = (linhas = []) =>
    linhas.reduce((acc, linha) => {
        const valor = Number(linha.valor);
        return linha.tipo === 'RECEITA' ? acc + valor : acc - valor;
    }, 0);

const dataMaisRecenteImportacao = (linhas = []) => {
    if (!linhas.length) {
        return parseVencimentoDate(todayInTimezone());
    }

    return linhas.reduce((max, linha) => {
        const data = parseVencimentoDate(toDateOnlyInTimezone(linha.data));
        return data > max ? data : max;
    }, parseVencimentoDate(toDateOnlyInTimezone(linhas[0].data)));
};

const analisarArquivo = async (usuarioId, { buffer, filename, origem, mapeamento = {} }) => {
    const recurso = RECURSO_BY_ORIGEM[origem];
    if (!recurso) {
        throw new AppError('Origem de importação inválida', 400);
    }

    const parsed = await parseStatementFile({ buffer, filename, mapeamento });
    if (parsed.precisaMapeamento) {
        return {
            origem,
            recurso,
            precisaMapeamento: true,
            colunasDisponiveis: parsed.colunasDisponiveis,
            amostraLinhas: parsed.amostraLinhas,
            parser: parsed.parser,
        };
    }

    const dedupeSet = await buildDedupeSet(usuarioId);
    const categorias = await categoryRepository.listarPorUsuario(usuarioId);

    const brutas = parsed.linhas.map((linha) => {
        const id = crypto.randomUUID();
        const hash = buildImportHash(linha.data, linha.valor, linha.descricao);
        return {
            id,
            ...linha,
            recurso,
            incluir: true,
            duplicata: dedupeSet.has(hash),
        };
    });

    const linhas = await sugerirCategorias(usuarioId, brutas, categorias, origem);

    return {
        origem,
        recurso,
        parser: parsed.parser,
        arquivo: filename,
        saldoExtrato: parsed.saldoExtrato ?? null,
        totalDetectadas: linhas.length,
        duplicatas: linhas.filter((l) => l.duplicata).length,
        linhas,
    };
};

const confirmarImportacao = async (usuarioId, { origem, linhas = [], saldoExtrato = null }) => {
    const recurso = RECURSO_BY_ORIGEM[origem];
    if (!recurso) {
        throw new AppError('Origem de importação inválida', 400);
    }

    const selecionadas = linhas.filter((linha) => linha.incluir !== false);
    if (!selecionadas.length && (saldoExtrato == null || saldoExtrato === '')) {
        throw new AppError('Selecione ao menos uma transação para importar', 400);
    }

    const categorias = await categoryRepository.listarPorUsuario(usuarioId);
    const categoriasMap = new Map(categorias.map((cat) => [cat.id, cat]));
    const dedupeSet = await buildDedupeSet(usuarioId);

    const payload = [];
    let duplicatasIgnoradas = 0;

    for (const linha of selecionadas) {
        const hash = buildImportHash(linha.data, linha.valor, linha.descricao);
        if (linha.duplicata || dedupeSet.has(hash)) {
            duplicatasIgnoradas += 1;
            continue;
        }

        const categoria = categoriasMap.get(linha.categoriaId);
        if (!categoria) {
            throw new AppError('Categoria inválida na importação', 400);
        }
        if (categoria.tipo !== linha.tipo) {
            throw new AppError(`Categoria "${categoria.nome}" incompatível com ${linha.tipo}`, 400);
        }

        validarRecursoCategoria(recurso, categoria, linha.tipo);

        const data = parseVencimentoDate(toDateOnlyInTimezone(linha.data));
        if (Number.isNaN(data.getTime())) {
            throw new AppError('Data inválida em uma das linhas', 400);
        }

        payload.push({
            usuarioId,
            categoriaId: linha.categoriaId,
            tipo: linha.tipo,
            recurso,
            valor: linha.valor,
            descricao: linha.descricao?.slice(0, 255) ?? null,
            data,
            recorrente: false,
        });

        dedupeSet.add(hash);
    }

    const saldoInformado =
        saldoExtrato != null && saldoExtrato !== '' ? round2(saldoExtrato) : null;
    const aplicarAjusteSaldo = isOrigemComSaldoExtrato(origem) && saldoInformado != null;

    if (!payload.length && !aplicarAjusteSaldo) {
        throw new AppError('Todas as linhas selecionadas são duplicatas', 409);
    }

    const saldoAntes = await calcularSaldoRecurso(usuarioId, recurso);
    const saldoDepoisImportacao = round2(saldoAntes + calcularDeltaImportacao(payload));

    let ajustePayload = null;
    if (aplicarAjusteSaldo) {
        const delta = round2(saldoInformado - saldoDepoisImportacao);
        if (Math.abs(delta) >= 0.01) {
            const tipo = delta > 0 ? 'RECEITA' : 'DESPESA';
            const categoria = encontrarCategoriaAjusteSaldo(categorias, origem, tipo);
            if (!categoria) {
                throw new AppError('Não foi possível ajustar o saldo — categoria ausente', 500);
            }
            validarRecursoCategoria(recurso, categoria, tipo);

            ajustePayload = {
                usuarioId,
                categoriaId: categoria.id,
                tipo,
                recurso,
                valor: Math.abs(delta).toFixed(2),
                descricao: AJUSTE_SALDO_IMPORTACAO_DESCRICAO,
                data: dataMaisRecenteImportacao(payload),
                recorrente: false,
            };
        }
    }

    await prisma.$transaction(async (tx) => {
        for (const item of payload) {
            await tx.transacao.create({ data: item });
        }
        if (ajustePayload) {
            await tx.transacao.create({ data: ajustePayload });
        }
    });

    return {
        importadas: payload.length,
        ajusteSaldo: ajustePayload ? 1 : 0,
        saldoExtrato: saldoInformado,
        ignoradas: selecionadas.length - payload.length,
        duplicatasIgnoradas,
    };
};

module.exports = {
    analisarArquivo,
    confirmarImportacao,
    RECURSO_BY_ORIGEM,
};
