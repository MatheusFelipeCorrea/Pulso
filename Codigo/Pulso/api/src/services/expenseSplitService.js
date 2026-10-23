const AppError = require('../utils/appError');
const expenseSplitRepository = require('../repositories/expenseSplitRepository');
const reminderService = require('../services/reminderService');
const { mapDivisao } = require('../utils/expenseSplitMapper');
const { splitEqual, validarSomaPersonalizada } = require('../utils/expenseSplitUtils');
const { roundMoney } = require('../utils/debtBalanceUtils');
const { formatPersonName } = require('../utils/personName');
const { addDays } = require('../utils/dateTimezone');

const parseData = (input) => {
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        throw new AppError('Data inválida', 400);
    }
    return parsed;
};

const buscarDivisaoOuFalhar = async (divisaoId, usuarioId) => {
    const divisao = await expenseSplitRepository.buscarPorId(divisaoId, usuarioId);
    if (!divisao) {
        throw new AppError('Divisão não encontrada', 404);
    }
    return divisao;
};

/**
 * RN-081/084: monta as linhas de participante (incluindo o organizador, "Você")
 * e resolve, por nome, quem adiantou o valor (RN-081 "quem pagou").
 */
const construirParticipantes = ({ tipo, valorTotal, participantes, pagoPor, valorOrganizador }) => {
    if (!Array.isArray(participantes) || participantes.length === 0) {
        throw new AppError('Uma divisão precisa de pelo menos 1 outro participante além de você', 400);
    }

    const outros = participantes.map((item) => ({
        nome: formatPersonName(item.nome),
        ehOrganizador: false,
    }));

    const nomesVistos = new Set();
    for (const item of outros) {
        const chave = item.nome.toLowerCase();
        if (chave === 'você' || nomesVistos.has(chave)) {
            throw new AppError(
                'Os nomes dos participantes devem ser únicos e diferentes de "Você"',
                400
            );
        }
        nomesVistos.add(chave);
    }

    const todos = [...outros, { nome: 'Você', ehOrganizador: true }];

    let valores;
    if (tipo === 'PERSONALIZADA') {
        const valoresInformados = participantes.map((item) => Number(item.valor));
        if (valoresInformados.some((valor) => !(valor > 0))) {
            throw new AppError('Todo participante precisa de um valor maior que zero', 400);
        }
        if (!(Number(valorOrganizador) > 0)) {
            throw new AppError('Informe o valor da sua própria parte', 400);
        }
        valores = [...valoresInformados, Number(valorOrganizador)];
        if (!validarSomaPersonalizada(valorTotal, valores)) {
            throw new AppError('A soma dos valores personalizados deve ser igual ao valor total', 400);
        }
    } else {
        valores = splitEqual(valorTotal, todos.length);
    }

    const pagoPorNormalizado = String(pagoPor ?? '').trim();
    if (!pagoPorNormalizado) {
        throw new AppError('Informe quem pagou a conta', 400);
    }

    let encontrouPagador = false;
    const linhas = todos.map((item, index) => {
        const ehPagador =
            pagoPorNormalizado.toUpperCase() === 'VOCE'
                ? item.ehOrganizador
                : formatPersonName(pagoPorNormalizado).toLowerCase() === item.nome.toLowerCase();

        if (ehPagador) encontrouPagador = true;

        return {
            nome: item.nome,
            valor: roundMoney(valores[index]),
            ehOrganizador: item.ehOrganizador,
            pagouAConta: ehPagador,
            status: ehPagador ? 'PAGO' : 'PENDENTE',
            dataPagamento: ehPagador ? new Date() : null,
        };
    });

    if (!encontrouPagador) {
        throw new AppError('Quem pagou a conta precisa ser um dos participantes (ou "Você")', 400);
    }

    return linhas;
};

const sincronizarStatusDivisao = async (divisao) => {
    const participantes = divisao.participantes ?? [];
    const todosPagos = participantes.length > 0 && participantes.every((p) => p.status === 'PAGO');

    if (todosPagos && divisao.status !== 'QUITADA') {
        const atualizada = await expenseSplitRepository.quitar(divisao.id, divisao.usuarioId);
        return mapDivisao({ ...atualizada, participantes });
    }

    if (!todosPagos && divisao.status === 'QUITADA') {
        const reaberta = await expenseSplitRepository.reabrir(divisao.id, divisao.usuarioId);
        return mapDivisao({ ...reaberta, participantes });
    }

    return mapDivisao(divisao);
};

const listarAtivas = async (usuarioId) => {
    const divisoes = await expenseSplitRepository.listarAtivas(usuarioId);
    return divisoes.map(mapDivisao);
};

const listarHistorico = async (usuarioId, filtros = {}) => {
    const pagina = Number(filtros.pagina) || 1;
    const limite = Number(filtros.limite) || 10;

    const { divisoes, total } = await expenseSplitRepository.listarHistorico(usuarioId, {
        pagina,
        limite,
    });

    return {
        divisoes: divisoes.map(mapDivisao),
        total,
        paginas: Math.max(1, Math.ceil(total / limite)),
        pagina,
    };
};

const calcularResumo = async (usuarioId) => {
    const [ativas, totalCriadas] = await Promise.all([
        expenseSplitRepository.listarAtivasComParticipantes(usuarioId),
        expenseSplitRepository.contarTodasCriadas(usuarioId),
    ]);

    let meDevem = 0;
    let euDevo = 0;

    for (const divisao of ativas) {
        const participantes = divisao.participantes ?? [];
        const organizador = participantes.find((p) => p.ehOrganizador);
        if (!organizador) continue;

        if (organizador.pagouAConta) {
            const pendentes = participantes.filter((p) => !p.ehOrganizador && p.status === 'PENDENTE');
            meDevem += pendentes.reduce((acc, p) => acc + Number(p.valor), 0);
        } else if (organizador.status === 'PENDENTE') {
            euDevo += Number(organizador.valor);
        }
    }

    meDevem = roundMoney(meDevem);
    euDevo = roundMoney(euDevo);

    return {
        meDevem,
        euDevo,
        saldo: roundMoney(meDevem - euDevo),
        possuiDivisoes: totalCriadas > 0,
    };
};

const criarDivisao = async (usuarioId, dados) => {
    if (!dados.titulo?.trim()) {
        throw new AppError('Informe um título para a divisão', 400);
    }
    if (!(Number(dados.valorTotal) > 0)) {
        throw new AppError('Valor total deve ser maior que zero', 400);
    }

    const valorTotal = roundMoney(dados.valorTotal);
    // Sempre há pelo menos 1 outro participante além do organizador, e só quem pagou
    // a conta nasce PAGO — logo, ao criar, nunca está tudo pago (RN-085 só se aplica a partir daqui).
    const linhas = construirParticipantes({ ...dados, valorTotal });

    const divisao = await expenseSplitRepository.criar({
        usuarioId,
        titulo: dados.titulo.trim(),
        valorTotal,
        tipo: dados.tipo === 'PERSONALIZADA' ? 'PERSONALIZADA' : 'IGUAL',
        status: 'ATIVA',
        data: parseData(dados.data),
        icone: dados.icone ?? null,
        cor: dados.cor ?? null,
        observacao: dados.observacao?.trim() || null,
        quitadaEm: null,
        participantes: { create: linhas },
    });

    return mapDivisao(divisao);
};

/** Alguém além de quem pagou a conta original já quitou manualmente sua parte (marcarParticipantePago). */
const possuiPagamentoManual = (divisao) =>
    (divisao.participantes ?? []).some((p) => !p.pagouAConta && p.status === 'PAGO');

const editarDivisao = async (usuarioId, divisaoId, dados) => {
    const divisao = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    if (divisao.status === 'QUITADA') {
        throw new AppError('Não é possível editar uma divisão já quitada', 400);
    }

    const substituiParticipantes = dados.participantes !== undefined;

    if (dados.valorTotal !== undefined && !substituiParticipantes) {
        throw new AppError(
            'Para alterar o valor total é preciso reenviar a lista de participantes, para recalcular os valores de cada um',
            400
        );
    }

    if (substituiParticipantes && possuiPagamentoManual(divisao)) {
        throw new AppError(
            'Não é possível alterar participantes ou valores: já existe pagamento registrado nesta divisão. Desfaça os pagamentos primeiro ou crie uma nova divisão.',
            400
        );
    }

    const payload = {};
    if (dados.titulo !== undefined) payload.titulo = dados.titulo.trim();
    if (dados.data !== undefined) payload.data = parseData(dados.data);
    if (dados.icone !== undefined) payload.icone = dados.icone;
    if (dados.cor !== undefined) payload.cor = dados.cor;
    if (dados.observacao !== undefined) payload.observacao = dados.observacao?.trim() || null;

    if (substituiParticipantes) {
        const valorTotal = dados.valorTotal !== undefined ? roundMoney(dados.valorTotal) : Number(divisao.valorTotal);
        payload.valorTotal = valorTotal;
        if (dados.tipo !== undefined) payload.tipo = dados.tipo === 'PERSONALIZADA' ? 'PERSONALIZADA' : 'IGUAL';

        const linhas = construirParticipantes({
            tipo: payload.tipo ?? divisao.tipo,
            valorTotal,
            participantes: dados.participantes,
            pagoPor: dados.pagoPor,
            valorOrganizador: dados.valorOrganizador,
        });

        await expenseSplitRepository.atualizar(divisaoId, usuarioId, payload);
        await expenseSplitRepository.substituirParticipantes(divisaoId, linhas);
    } else {
        await expenseSplitRepository.atualizar(divisaoId, usuarioId, payload);
    }

    const atualizada = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    return sincronizarStatusDivisao(atualizada);
};

const buscarParticipanteOuFalhar = (divisao, participanteId) => {
    const participante = divisao.participantes.find((p) => p.id === participanteId);
    if (!participante) {
        throw new AppError('Participante não encontrado', 404);
    }
    return participante;
};

/**
 * Cancela (marca como pago) os lembretes de cobrança vinculados a um participante que já
 * está totalmente quitado, mas só quando TODOS os demais participantes cobertos pelo mesmo
 * lembrete (RN-086 permite 1 lembrete para N participantes) também já pagaram — senão o
 * lembrete continua servindo para cobrar quem ainda deve.
 */
const cancelarLembretesQuitados = async (usuarioId, participanteId) => {
    const lembretes = await expenseSplitRepository.listarLembretesAtivosDeParticipantes([participanteId]);

    for (const lembrete of lembretes) {
        const todosQuitados = lembrete.divisaoParticipantes.every(
            (p) => p.pagouAConta || p.status === 'PAGO'
        );
        if (todosQuitados) {
            await reminderService.marcarComoPago(usuarioId, lembrete.id);
        }
    }
};

const marcarParticipantePago = async (usuarioId, divisaoId, participanteId) => {
    const divisao = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    const participante = buscarParticipanteOuFalhar(divisao, participanteId);

    if (participante.pagouAConta) {
        throw new AppError('Quem pagou a conta já está quitado automaticamente', 400);
    }
    if (participante.status === 'PAGO') {
        throw new AppError('Participante já está marcado como pago', 400);
    }

    await expenseSplitRepository.atualizarParticipante(participanteId, {
        status: 'PAGO',
        dataPagamento: new Date(),
    });

    await cancelarLembretesQuitados(usuarioId, participanteId);

    const atualizada = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    return sincronizarStatusDivisao(atualizada);
};

const desmarcarParticipantePago = async (usuarioId, divisaoId, participanteId) => {
    const divisao = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    const participante = buscarParticipanteOuFalhar(divisao, participanteId);

    if (participante.pagouAConta) {
        throw new AppError('Quem pagou a conta não pode ser marcado como pendente', 400);
    }
    if (participante.status === 'PENDENTE') {
        throw new AppError('Participante já está pendente', 400);
    }

    await expenseSplitRepository.atualizarParticipante(participanteId, {
        status: 'PENDENTE',
        dataPagamento: null,
    });

    const atualizada = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    return sincronizarStatusDivisao(atualizada);
};

const excluirDivisao = async (usuarioId, divisaoId) => {
    const divisao = await buscarDivisaoOuFalhar(divisaoId, usuarioId);
    if (divisao.status === 'QUITADA') {
        throw new AppError(
            'Não é possível excluir uma divisão já quitada. A limpeza é automática após 180 dias',
            400
        );
    }

    // Sem isso, o lembrete de cobrança (RF-111) sobrevive órfão no calendário/Google Agenda,
    // cobrando uma divisão que deixou de existir.
    const lembretes = await expenseSplitRepository.listarLembretesDaDivisao(divisaoId);
    for (const lembrete of lembretes) {
        await reminderService.removerLembrete(usuarioId, lembrete.id);
    }

    await expenseSplitRepository.excluir(divisaoId, usuarioId);
};

const formatarListaNomes = (nomes) => {
    if (nomes.length === 1) return nomes[0];
    if (nomes.length === 2) return `${nomes[0]} e ${nomes[1]}`;
    return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
};

/** RF-111/RN-086 — um único lembrete de calendário cobrindo 1+ participantes pendentes. */
const criarLembreteCobranca = async (usuarioId, divisaoId, participanteIds, dadosLembrete = {}) => {
    const divisao = await buscarDivisaoOuFalhar(divisaoId, usuarioId);

    if (!Array.isArray(participanteIds) || participanteIds.length === 0) {
        throw new AppError('Selecione ao menos um participante para lembrar', 400);
    }

    const participantes = participanteIds.map((id) => buscarParticipanteOuFalhar(divisao, id));
    const invalido = participantes.find((p) => p.pagouAConta || p.status === 'PAGO');
    if (invalido) {
        throw new AppError(
            `${formatPersonName(invalido.nome)} já pagou (ou pagou a conta) e não precisa de lembrete`,
            400
        );
    }

    const lembretesExistentes = await expenseSplitRepository.listarLembretesAtivosDeParticipantes(participanteIds);
    if (lembretesExistentes.length > 0) {
        const idsComLembrete = new Set(
            lembretesExistentes.flatMap((l) => l.divisaoParticipantes.map((p) => p.id))
        );
        const participanteComLembrete = participantes.find((p) => idsComLembrete.has(p.id));
        if (participanteComLembrete) {
            throw new AppError(
                `${formatPersonName(participanteComLembrete.nome)} já tem um lembrete de cobrança pendente`,
                400
            );
        }
    }

    const valorSelecionado = roundMoney(participantes.reduce((acc, p) => acc + Number(p.valor), 0));
    const nomesTexto = formatarListaNomes(participantes.map((p) => formatPersonName(p.nome)));
    const dataVencimentoPadrao = addDays(new Date(), 2);

    const lembrete = await reminderService.criarLembrete(usuarioId, {
        ...dadosLembrete,
        titulo: dadosLembrete.titulo?.trim() || `Cobrar ${nomesTexto} — ${divisao.titulo}`,
        valor: dadosLembrete.valor ?? valorSelecionado,
        dataVencimento: dadosLembrete.dataVencimento ?? dataVencimentoPadrao,
    });

    await expenseSplitRepository.vincularLembreteAParticipantes(lembrete.id, participanteIds);

    return lembrete;
};

module.exports = {
    listarAtivas,
    listarHistorico,
    calcularResumo,
    criarDivisao,
    editarDivisao,
    marcarParticipantePago,
    desmarcarParticipantePago,
    excluirDivisao,
    criarLembreteCobranca,
};
