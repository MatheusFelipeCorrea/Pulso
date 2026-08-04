const AppError = require('../utils/appError');
const { storeGrupoImage } = require('./grupoImageStorageService');
const grupoRepository = require('../repositories/grupoRepository');
const viagemRepository = require('../repositories/viagemRepository');
const { attachCoverImage } = require('./tripDestinationImageService');
const tripFlightPriceService = require('./tripFlightPriceService');
const grupoNotificationService = require('./grupoNotificationService');
const { mapGrupoResumo, mapGrupoDetalhe, mapGrupoPreview } = require('../utils/grupoMapper');

const CODIGO_REGEX = /^PULSO-[A-Z0-9]{4}$/;
const CODIGO_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const CATEGORIAS_DESPESA = [
    'TRANSPORTE',
    'HOSPEDAGEM',
    'ALIMENTACAO',
    'PASSEIOS',
    'COMPRAS',
    'DOCUMENTACAO',
    'SAUDE',
    'EMERGENCIAS',
    'ENTRETENIMENTO',
    'OUTROS',
];

const normalizarCodigoConvite = (codigo) =>
    String(codigo ?? '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '');

const gerarCodigoConvite = () => {
    let suffix = '';
    for (let i = 0; i < 4; i += 1) {
        suffix += CODIGO_CHARS[Math.floor(Math.random() * CODIGO_CHARS.length)];
    }
    return `PULSO-${suffix}`;
};

const gerarCodigoUnico = async () => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
        const codigo = gerarCodigoConvite();
        const existe = await grupoRepository.codigoConviteExiste(codigo);
        if (!existe) return codigo;
    }
    throw new AppError('Não foi possível gerar código de convite', 500);
};

const validarTexto = (valor, campo, { min = 1, max = 100 } = {}) => {
    const texto = String(valor ?? '').trim();
    if (texto.length < min) {
        throw new AppError(`${campo} é obrigatório`, 400);
    }
    if (texto.length > max) {
        throw new AppError(`${campo} deve ter no máximo ${max} caracteres`, 400);
    }
    return texto;
};

const validarDescricao = (descricao) => {
    if (descricao == null || descricao === '') return null;
    const texto = String(descricao).trim();
    if (texto.length > 500) {
        throw new AppError('Descrição deve ter no máximo 500 caracteres', 400);
    }
    return texto || null;
};

const validarUrlImagem = (urlImagem) => {
    if (urlImagem == null || urlImagem === '') return null;
    const texto = String(urlImagem).trim();
    if (!texto) return null;
    if (texto.length > 2048) {
        throw new AppError('URL da imagem deve ter no máximo 2048 caracteres', 400);
    }
    try {
        const parsed = new URL(texto);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error('invalid protocol');
        }
    } catch {
        throw new AppError('URL da imagem inválida', 400);
    }
    return texto;
};

const buscarGrupoDoUsuario = async (grupoId, usuarioId) => {
    const grupo = await grupoRepository.buscarPorId(grupoId, usuarioId);
    if (!grupo) {
        throw new AppError('Grupo não encontrado', 404);
    }
    return grupo;
};

const buscarMembroAdmin = async (grupoId, usuarioId) => {
    const membro = await grupoRepository.buscarMembro(grupoId, usuarioId);
    if (!membro) {
        throw new AppError('Você não participa deste grupo', 403);
    }
    if (membro.papel !== 'ADMIN') {
        throw new AppError('Apenas administradores podem realizar esta ação', 403);
    }
    return membro;
};

const listarGrupos = async (usuarioId) => {
    const grupos = await grupoRepository.listarPorUsuario(usuarioId);
    return grupos.map((grupo) => mapGrupoResumo(grupo, usuarioId));
};

const obterGrupo = async (usuarioId, grupoId) => {
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const criarGrupo = async (usuarioId, dados) => {
    const nome = validarTexto(dados.nome, 'Nome do grupo', { max: 100 });
    const descricao = validarDescricao(dados.descricao);
    const codigoConvite = await gerarCodigoUnico();

    const grupo = await grupoRepository.criar({
        nome,
        descricao,
        codigoConvite,
        criadorId: usuarioId,
    });

    return mapGrupoDetalhe(grupo, usuarioId);
};

const editarGrupo = async (usuarioId, grupoId, dados) => {
    await buscarMembroAdmin(grupoId, usuarioId);

    const payload = {};
    if (dados.nome !== undefined) {
        payload.nome = validarTexto(dados.nome, 'Nome do grupo', { max: 100 });
    }
    if (dados.descricao !== undefined) {
        payload.descricao = validarDescricao(dados.descricao);
    }
    if (dados.urlImagem !== undefined) {
        payload.urlImagem = validarUrlImagem(dados.urlImagem);
    }

    if (!Object.keys(payload).length) {
        throw new AppError('Informe ao menos um campo para atualizar', 400);
    }

    await grupoRepository.atualizar(grupoId, payload);
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const atualizarModoDivisao = async (usuarioId, grupoId, modoDivisao) => {
    await buscarGrupoDoUsuario(grupoId, usuarioId);
    await grupoRepository.atualizar(grupoId, { modoDivisao });
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const enviarImagemGrupo = async (usuarioId, grupoId, file) => {
    await buscarMembroAdmin(grupoId, usuarioId);
    const urlImagem = await storeGrupoImage(grupoId, file);
    await grupoRepository.atualizar(grupoId, { urlImagem });
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const excluirGrupo = async (usuarioId, grupoId) => {
    await buscarMembroAdmin(grupoId, usuarioId);
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    await grupoRepository.excluir(grupoId);
    await grupoNotificationService.notificarExclusaoGrupo(grupo, usuarioId);
};

const sairDoGrupo = async (usuarioId, grupoId) => {
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    const membro = grupo.membros.find((m) => m.usuarioId === usuarioId);
    if (!membro) {
        throw new AppError('Você não participa deste grupo', 403);
    }

    const admins = grupo.membros.filter((m) => m.papel === 'ADMIN');
    if (membro.papel === 'ADMIN' && admins.length === 1 && grupo.membros.length > 1) {
        throw new AppError(
            'Transfira a administração antes de sair ou exclua o grupo',
            400
        );
    }

    const nome = grupoNotificationService.nomeUsuarioNoGrupo(grupo, usuarioId);

    if (grupo.membros.length === 1) {
        await grupoRepository.excluir(grupoId);
        return;
    }

    await grupoRepository.removerMembro(grupoId, usuarioId);
    await grupoNotificationService.notificarGrupoAtividade(
        grupo,
        usuarioId,
        `${nome} saiu do grupo.`
    );
};

const removerMembroGrupo = async (adminId, grupoId, membroId) => {
    await buscarMembroAdmin(grupoId, adminId);

    if (membroId === adminId) {
        throw new AppError('Use a opção sair do grupo para remover a si mesmo', 400);
    }

    const grupo = await buscarGrupoDoUsuario(grupoId, adminId);
    const alvo = grupo.membros.find((m) => m.usuarioId === membroId);
    if (!alvo) {
        throw new AppError('Membro não encontrado neste grupo', 404);
    }

    const nome = grupoNotificationService.nomeUsuarioNoGrupo(grupo, membroId);
    await grupoRepository.removerMembro(grupoId, membroId);

    await grupoNotificationService.notificarGrupoAtividade(
        grupo,
        adminId,
        `${nome} foi removido do grupo.`
    );
};

const alterarPapelMembro = async (adminId, grupoId, membroId, papel) => {
    await buscarMembroAdmin(grupoId, adminId);

    if (!['ADMIN', 'MEMBRO'].includes(papel)) {
        throw new AppError('Papel inválido', 400);
    }

    const grupo = await buscarGrupoDoUsuario(grupoId, adminId);
    const alvo = grupo.membros.find((m) => m.usuarioId === membroId);
    if (!alvo) {
        throw new AppError('Membro não encontrado neste grupo', 404);
    }

    if (alvo.papel === 'ADMIN' && papel === 'MEMBRO') {
        const admins = grupo.membros.filter((m) => m.papel === 'ADMIN');
        if (admins.length === 1) {
            throw new AppError('O grupo precisa de pelo menos um administrador', 400);
        }
    }

    await grupoRepository.atualizarMembro(grupoId, membroId, { papel });

    const nome = grupoNotificationService.nomeUsuarioNoGrupo(grupo, membroId);
    const mensagem =
        papel === 'ADMIN'
            ? `${nome} agora é administrador do grupo.`
            : `${nome} não é mais administrador.`;

    await grupoNotificationService.notificarGrupoAtividade(grupo, adminId, mensagem);

    const atualizado = await buscarGrupoDoUsuario(grupoId, adminId);
    return mapGrupoDetalhe(atualizado, adminId);
};

const renovarCodigoConvite = async (usuarioId, grupoId) => {
    await buscarMembroAdmin(grupoId, usuarioId);
    const codigoConvite = await gerarCodigoUnico();
    await grupoRepository.atualizar(grupoId, { codigoConvite });
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const criarViagemGrupo = async (usuarioId, grupoId, dados) => {
    await buscarGrupoDoUsuario(grupoId, usuarioId);

    const existentes = await grupoRepository.contarViagens(grupoId);
    if (existentes > 0) {
        throw new AppError('Este grupo já possui uma viagem vinculada', 400);
    }

    let destino;
    let moeda;
    let dataPrevista;
    let destinoMeta = null;

    if (dados.viagemId) {
        const viagem = await viagemRepository.buscarPorId(dados.viagemId, usuarioId);
        if (!viagem) {
            throw new AppError('Viagem não encontrada', 404);
        }
        destino = viagem.destino;
        moeda = viagem.moeda;
        dataPrevista = viagem.dataPrevista;
        destinoMeta =
            viagem.destinoMeta && typeof viagem.destinoMeta === 'object' ? viagem.destinoMeta : null;
    } else {
        destino = validarTexto(dados.destino, 'Destino', { max: 120 });
        moeda = String(dados.moeda ?? 'BRL')
            .trim()
            .toUpperCase();
        if (!/^[A-Z]{3}$/.test(moeda)) {
            throw new AppError('Moeda inválida', 400);
        }
        if (!dados.dataPrevista) {
            throw new AppError('Data prevista é obrigatória', 400);
        }
        dataPrevista = new Date(dados.dataPrevista);
        destinoMeta =
            dados.destinoMeta && typeof dados.destinoMeta === 'object' ? dados.destinoMeta : null;
    }

    try {
        destinoMeta = await attachCoverImage(destinoMeta, destino);
    } catch {
        destinoMeta = destinoMeta && typeof destinoMeta === 'object' ? destinoMeta : null;
    }

    await grupoRepository.criarViagem(grupoId, {
        destino,
        destinoMeta,
        moeda,
        dataPrevista,
    });

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const criarMetasGrupo = async (usuarioId, grupoId, metasInput) => {
    await buscarGrupoDoUsuario(grupoId, usuarioId);

    const ativas = await grupoRepository.contarMetasAtivas(grupoId);
    if (ativas >= 5) {
        throw new AppError('O grupo já possui o máximo de 5 metas ativas', 400);
    }

    if (!Array.isArray(metasInput) || metasInput.length === 0) {
        throw new AppError('Informe ao menos uma meta', 400);
    }
    if (metasInput.length > 5) {
        throw new AppError('Máximo de 5 metas por vez', 400);
    }
    if (ativas + metasInput.length > 5) {
        throw new AppError(`Só é possível ter 5 metas ativas (restam ${5 - ativas})`, 400);
    }

    const metas = metasInput.map((item, index) => {
        const nome = validarTexto(item.nome, `Nome da meta ${index + 1}`, { max: 100 });
        const valorAlvo = Number(item.valorAlvo);
        if (!Number.isFinite(valorAlvo) || valorAlvo <= 0) {
            throw new AppError(`Valor alvo da meta ${index + 1} deve ser maior que zero`, 400);
        }
        if (!item.prazo) {
            throw new AppError(`Prazo da meta ${index + 1} é obrigatório`, 400);
        }
        return {
            nome,
            valorAlvo,
            prazo: new Date(item.prazo),
            descricao: validarDescricao(item.descricao),
        };
    });

    await grupoRepository.criarMetas(grupoId, metas);

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    const nome = grupoNotificationService.nomeUsuarioNoGrupo(grupo, usuarioId);
    const label = metas.length === 1 ? `a meta "${metas[0].nome}"` : `${metas.length} metas`;
    await grupoNotificationService.notificarGrupoAtividade(
        grupo,
        usuarioId,
        `${nome} criou ${label} no grupo.`
    );

    return mapGrupoDetalhe(grupo, usuarioId);
};

const obterMediaPassagemViagemGrupo = async (usuarioId, grupoId, origemId) => {
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    const viagem = grupo.viagens?.[0];

    if (!viagem) {
        throw new AppError('Este grupo não possui viagem vinculada', 404);
    }

    return tripFlightPriceService.obterMediaPassagemPorViagem(viagem, origemId);
};

const buscarViagemGrupoDoMembro = async (grupoId, usuarioId) => {
    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    const viagem = grupo.viagens?.[0];

    if (!viagem) {
        throw new AppError('Este grupo não possui viagem vinculada', 404);
    }

    return viagem;
};

const validarDespesaViagemGrupo = (dados) => {
    const categoria = String(dados.categoria ?? '').toUpperCase();
    if (!CATEGORIAS_DESPESA.includes(categoria)) {
        throw new AppError('Categoria de despesa inválida', 400);
    }

    const valor = Number(dados.valorEstimado);
    if (!Number.isFinite(valor) || valor <= 0) {
        throw new AppError('Informe um valor estimado maior que zero', 400);
    }

    return {
        categoria,
        descricao: dados.descricao?.trim() || null,
        valorEstimado: valor,
    };
};

const criarDespesaViagemGrupo = async (usuarioId, grupoId, dados) => {
    const viagem = await buscarViagemGrupoDoMembro(grupoId, usuarioId);
    const despesa = validarDespesaViagemGrupo(dados);

    await grupoRepository.criarDespesaViagem({
        viagemGrupoId: viagem.id,
        adicionadoPorId: usuarioId,
        ...despesa,
    });

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    const nome = grupoNotificationService.nomeUsuarioNoGrupo(grupo, usuarioId);
    await grupoNotificationService.notificarGrupoAtividade(
        grupo,
        usuarioId,
        `${nome} adicionou pretensão no grupo.`
    );

    return mapGrupoDetalhe(grupo, usuarioId);
};

const editarDespesaViagemGrupo = async (usuarioId, grupoId, despesaId, dados) => {
    const viagem = await buscarViagemGrupoDoMembro(grupoId, usuarioId);
    const existente = await grupoRepository.buscarDespesaViagem(despesaId, viagem.id, usuarioId);

    if (!existente) {
        throw new AppError('Pretensão não encontrada', 404);
    }

    const payload = {};
    if (dados.categoria !== undefined) {
        const categoria = String(dados.categoria).toUpperCase();
        if (!CATEGORIAS_DESPESA.includes(categoria)) {
            throw new AppError('Categoria de despesa inválida', 400);
        }
        payload.categoria = categoria;
    }
    if (dados.descricao !== undefined) {
        payload.descricao = dados.descricao?.trim() || null;
    }
    if (dados.valorEstimado !== undefined) {
        const valor = Number(dados.valorEstimado);
        if (!Number.isFinite(valor) || valor <= 0) {
            throw new AppError('Informe um valor estimado maior que zero', 400);
        }
        payload.valorEstimado = valor;
    }

    if (Object.keys(payload).length === 0) {
        throw new AppError('Informe ao menos um campo para atualizar', 400);
    }

    await grupoRepository.atualizarDespesaViagem(despesaId, payload);

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const excluirDespesaViagemGrupo = async (usuarioId, grupoId, despesaId) => {
    const viagem = await buscarViagemGrupoDoMembro(grupoId, usuarioId);
    const existente = await grupoRepository.buscarDespesaViagem(despesaId, viagem.id, usuarioId);

    if (!existente) {
        throw new AppError('Pretensão não encontrada', 404);
    }

    await grupoRepository.excluirDespesaViagem(despesaId);

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const registrarAporteGrupo = async (usuarioId, grupoId, metaGrupoId, dados) => {
    await buscarGrupoDoUsuario(grupoId, usuarioId);

    const meta = await grupoRepository.buscarMetaDoGrupo(grupoId, metaGrupoId);
    if (!meta) {
        throw new AppError('Meta do grupo não encontrada', 404);
    }

    const valor = Number(dados.valor);
    if (!Number.isFinite(valor) || valor <= 0) {
        throw new AppError('Valor do aporte deve ser maior que zero', 400);
    }
    if (!dados.data) {
        throw new AppError('Data do aporte é obrigatória', 400);
    }

    const { concluida, metaNome, metaId } = await grupoRepository.criarAporte(metaGrupoId, usuarioId, {
        valor,
        data: new Date(dados.data),
    });

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);

    if (concluida) {
        await grupoNotificationService.notificarMetaGrupoAtingida(grupo, metaNome, metaId);
    }

    return mapGrupoDetalhe(grupo, usuarioId);
};

const editarViagemGrupo = async (usuarioId, grupoId, dados) => {
    await buscarMembroAdmin(grupoId, usuarioId);
    const viagem = await buscarViagemGrupoDoMembro(grupoId, usuarioId);

    const payload = {};
    if (dados.destino !== undefined) {
        payload.destino = validarTexto(dados.destino, 'Destino', { max: 120 });
    }
    if (dados.moeda !== undefined) {
        const moeda = String(dados.moeda).trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(moeda)) {
            throw new AppError('Moeda inválida', 400);
        }
        payload.moeda = moeda;
    }
    if (dados.dataPrevista !== undefined) {
        payload.dataPrevista = new Date(dados.dataPrevista);
    }
    if (dados.destinoMeta !== undefined) {
        let destinoMeta =
            dados.destinoMeta && typeof dados.destinoMeta === 'object' ? dados.destinoMeta : null;
        try {
            destinoMeta = await attachCoverImage(destinoMeta, payload.destino ?? viagem.destino);
        } catch {
            destinoMeta = destinoMeta && typeof destinoMeta === 'object' ? destinoMeta : null;
        }
        payload.destinoMeta = destinoMeta;
    }

    if (!Object.keys(payload).length) {
        throw new AppError('Informe ao menos um campo para atualizar', 400);
    }

    await grupoRepository.atualizarViagem(viagem.id, payload);

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const desvincularViagemGrupo = async (usuarioId, grupoId) => {
    await buscarMembroAdmin(grupoId, usuarioId);
    const viagem = await buscarViagemGrupoDoMembro(grupoId, usuarioId);
    await grupoRepository.excluirViagem(viagem.id);

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    await grupoNotificationService.notificarGrupoAtividade(
        grupo,
        usuarioId,
        'A viagem foi desvinculada do grupo.'
    );

    return mapGrupoDetalhe(grupo, usuarioId);
};

const previewPorCodigo = async (usuarioId, codigoRaw) => {
    const codigo = normalizarCodigoConvite(codigoRaw);
    if (!CODIGO_REGEX.test(codigo)) {
        throw new AppError('Código inválido ou grupo não encontrado', 404);
    }

    const grupo = await grupoRepository.buscarPorCodigoConvite(codigo);
    if (!grupo) {
        throw new AppError('Código inválido ou grupo não encontrado', 404);
    }

    return mapGrupoPreview(grupo, usuarioId);
};

const entrarPorCodigo = async (usuarioId, codigoRaw) => {
    const codigo = normalizarCodigoConvite(codigoRaw);
    if (!CODIGO_REGEX.test(codigo)) {
        throw new AppError('Código inválido ou grupo não encontrado', 404);
    }

    const grupo = await grupoRepository.buscarPorCodigoConvite(codigo);
    if (!grupo) {
        throw new AppError('Código inválido ou grupo não encontrado', 404);
    }

    const existente = await grupoRepository.buscarMembro(grupo.id, usuarioId);
    if (existente) {
        return mapGrupoDetalhe(grupo, usuarioId);
    }

    await grupoRepository.adicionarMembro(grupo.id, usuarioId, 'MEMBRO');
    const atualizado = await grupoRepository.buscarPorId(grupo.id, usuarioId);

    const nome = grupoNotificationService.nomeUsuarioNoGrupo(atualizado, usuarioId);
    await grupoNotificationService.notificarGrupoAtividade(
        atualizado,
        usuarioId,
        `${nome} entrou no grupo.`
    );

    return mapGrupoDetalhe(atualizado, usuarioId);
};

const validarConteudoMensagem = (conteudo) => {
    const texto = String(conteudo ?? '').trim();
    if (texto.length < 1) {
        throw new AppError('Mensagem não pode estar vazia', 400);
    }
    if (texto.length > 2000) {
        throw new AppError('Mensagem deve ter no máximo 2000 caracteres', 400);
    }
    return texto;
};

const enviarMensagemGrupo = async (usuarioId, grupoId, dados) => {
    await buscarGrupoDoUsuario(grupoId, usuarioId);
    const conteudo = validarConteudoMensagem(dados.conteudo);

    await grupoRepository.criarMensagemChat(grupoId, usuarioId, conteudo);

    const grupo = await buscarGrupoDoUsuario(grupoId, usuarioId);
    return mapGrupoDetalhe(grupo, usuarioId);
};

const listarMensagensGrupo = async (usuarioId, grupoId, filtros = {}) => {
    await buscarGrupoDoUsuario(grupoId, usuarioId);
    const resultado = await grupoRepository.listarMensagens(grupoId, filtros);

    return {
        mensagens: resultado.items.map((m) => ({
            id: m.id,
            usuarioId: m.usuario.id,
            nome: m.usuario.nome,
            urlAvatar: m.usuario.urlAvatar,
            conteudo: m.conteudo,
            criadoEm: m.criadoEm?.toISOString?.() ?? m.criadoEm,
        })),
        total: resultado.total,
        paginas: resultado.paginas,
        pagina: resultado.pagina,
    };
};

module.exports = {
    listarGrupos,
    obterGrupo,
    criarGrupo,
    editarGrupo,
    atualizarModoDivisao,
    enviarImagemGrupo,
    excluirGrupo,
    sairDoGrupo,
    removerMembroGrupo,
    alterarPapelMembro,
    renovarCodigoConvite,
    criarViagemGrupo,
    editarViagemGrupo,
    desvincularViagemGrupo,
    obterMediaPassagemViagemGrupo,
    criarDespesaViagemGrupo,
    editarDespesaViagemGrupo,
    excluirDespesaViagemGrupo,
    criarMetasGrupo,
    registrarAporteGrupo,
    previewPorCodigo,
    entrarPorCodigo,
    enviarMensagemGrupo,
    listarMensagensGrupo,
    normalizarCodigoConvite,
    CODIGO_REGEX,
};
