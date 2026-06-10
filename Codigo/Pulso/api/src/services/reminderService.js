const AppError = require('../utils/appError');
const reminderRepository = require('../repositories/reminderRepository');
const googleCalendarSync = require('./googleCalendarSyncService');
const { mapLembrete } = require('../utils/reminderMapper');
const { normalizeCategoria } = require('../constants/reminderCategories');

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const endOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

const diasAteVencimento = (dataVencimento) => {
    const hoje = startOfDay(new Date());
    const vencimento = startOfDay(dataVencimento);
    return Math.round((vencimento - hoje) / (1000 * 60 * 60 * 24));
};

const mapLembreteComContagem = (lembrete) => ({
    ...mapLembrete(lembrete),
    diasAteVencimento: diasAteVencimento(lembrete.dataVencimento),
});

const aplicarSyncGoogle = async (usuarioId, lembrete, wantsSync) => {
    if (!wantsSync) {
        if (lembrete.googleEventId) {
            await googleCalendarSync.removerEventoLembrete(usuarioId, lembrete.googleEventId);
        }
        return { googleEventId: null, sincronizado: false };
    }

    const conectado = await googleCalendarSync.estaConectado(usuarioId);
    if (!conectado) {
        throw new AppError('Conecte o Google Agenda para sincronizar lembretes.', 400);
    }

    const { googleEventId } = await googleCalendarSync.sincronizarLembrete(usuarioId, lembrete);
    return { googleEventId, sincronizado: true };
};

const listarLembretes = async (usuarioId, query = {}) => {
    let inicio;
    let fim;

    if (query.mes) {
        const [year, month] = query.mes.split('-').map(Number);
        inicio = new Date(year, month - 1, 1);
        fim = new Date(year, month, 0, 23, 59, 59, 999);
    }

    const items = await reminderRepository.listarPorUsuario(usuarioId, { inicio, fim });
    return items.map(mapLembreteComContagem);
};

const criarLembrete = async (usuarioId, body) => {
    const dataVencimento = startOfDay(body.dataVencimento);
    const wantsSync = Boolean(body.sincronizarGoogle);

    const lembrete = await reminderRepository.criar({
        usuarioId,
        titulo: body.titulo.trim(),
        valor: body.valor ?? null,
        dataVencimento,
        antecedencia: body.antecedencia ?? 'UM_DIA',
        categoria: normalizeCategoria(body.categoria ?? 'OUTRO'),
        sincronizado: false,
        googleEventId: null,
    });

    if (!wantsSync) {
        return mapLembreteComContagem(lembrete);
    }

    try {
        const syncData = await aplicarSyncGoogle(usuarioId, lembrete, true);
        const atualizado = await reminderRepository.atualizar(lembrete.id, syncData);
        return mapLembreteComContagem(atualizado);
    } catch (error) {
        await reminderRepository.deletar(lembrete.id);
        throw error;
    }
};

const atualizarLembrete = async (usuarioId, id, body) => {
    const existente = await reminderRepository.buscarPorId(id, usuarioId);
    if (!existente) throw new AppError('Lembrete não encontrado', 404);

    const data = {};
    if (body.titulo != null) data.titulo = body.titulo.trim();
    if (body.valor !== undefined) data.valor = body.valor;
    if (body.dataVencimento != null) data.dataVencimento = startOfDay(body.dataVencimento);
    if (body.antecedencia != null) data.antecedencia = body.antecedencia;
    if (body.categoria != null) data.categoria = normalizeCategoria(body.categoria);
    if (body.pago !== undefined) data.pago = Boolean(body.pago);

    const parcial = await reminderRepository.atualizar(id, data);
    const merged = { ...existente, ...parcial };

    const wantsSync =
        body.sincronizarGoogle !== undefined
            ? Boolean(body.sincronizarGoogle)
            : Boolean(existente.sincronizado);

    const syncData = await aplicarSyncGoogle(usuarioId, merged, wantsSync);
    const final = await reminderRepository.atualizar(id, syncData);

    return mapLembreteComContagem(final);
};

const removerLembrete = async (usuarioId, id) => {
    const existente = await reminderRepository.buscarPorId(id, usuarioId);
    if (!existente) throw new AppError('Lembrete não encontrado', 404);

    if (existente.googleEventId) {
        await googleCalendarSync.removerEventoLembrete(usuarioId, existente.googleEventId);
    }

    await reminderRepository.deletar(id);
};

const listarProximosVencimentos = async (usuarioId, limite = 10) => {
    const items = await reminderRepository.listarProximos(usuarioId, { limite });
    return items.map(mapLembreteComContagem);
};

const marcarComoPago = async (usuarioId, id) => {
    const existente = await reminderRepository.buscarPorId(id, usuarioId);
    if (!existente) throw new AppError('Lembrete não encontrado', 404);

    const atualizado = await reminderRepository.atualizar(id, { pago: true });
    return mapLembreteComContagem(atualizado);
};

module.exports = {
    listarLembretes,
    criarLembrete,
    atualizarLembrete,
    removerLembrete,
    marcarComoPago,
    listarProximosVencimentos,
    startOfDay,
    endOfDay,
    diasAteVencimento,
};
