const AppError = require('../utils/appError');
const reminderRepository = require('../repositories/reminderRepository');
const googleCalendarSync = require('./googleCalendarSyncService');
const { mapLembrete } = require('../utils/reminderMapper');
const { normalizeCategoria } = require('../constants/reminderCategories');
const {
    formatDateOnly,
    parseVencimentoDate,
    startOfDayInTimezone,
    endOfDayInTimezone,
} = require('../utils/dateTimezone');

const startOfDay = startOfDayInTimezone;
const endOfDay = endOfDayInTimezone;

const diasAteVencimento = (dataVencimento) => {
    const hoje = formatDateOnly(new Date());
    const vencimento = formatDateOnly(dataVencimento);
    const [hy, hm, hd] = hoje.split('-').map(Number);
    const [vy, vm, vd] = vencimento.split('-').map(Number);
    const hojeUtc = Date.UTC(hy, hm - 1, hd);
    const vencimentoUtc = Date.UTC(vy, vm - 1, vd);
    return Math.round((vencimentoUtc - hojeUtc) / (1000 * 60 * 60 * 24));
};

const camposAfetamSync = (body) =>
    body.titulo != null ||
    body.valor !== undefined ||
    body.dataVencimento != null ||
    body.antecedencia != null ||
    body.categoria != null;

const normalizarRecorrencia = (body, dataVencimento) => {
    if (!body.repetirMensal) {
        return { repetirMensal: false, diaRecorrencia: null };
    }
    const dia = body.diaRecorrencia ?? Number(formatDateOnly(dataVencimento).split('-')[2]);
    return { repetirMensal: true, diaRecorrencia: Math.min(Math.max(dia, 1), 28) };
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
    const dataVencimento = parseVencimentoDate(body.dataVencimento);
    const wantsSync = Boolean(body.sincronizarGoogle);

    const recorrencia = normalizarRecorrencia(body, dataVencimento);

    const lembrete = await reminderRepository.criar({
        usuarioId,
        titulo: body.titulo.trim(),
        valor: body.valor ?? null,
        dataVencimento,
        antecedencia: body.antecedencia ?? 'UM_DIA',
        categoria: normalizeCategoria(body.categoria ?? 'OUTRO'),
        sincronizado: false,
        googleEventId: null,
        ...recorrencia,
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
    if (body.dataVencimento != null) data.dataVencimento = parseVencimentoDate(body.dataVencimento);
    if (body.antecedencia != null) data.antecedencia = body.antecedencia;
    if (body.categoria != null) data.categoria = normalizeCategoria(body.categoria);
    if (body.pago !== undefined) data.pago = Boolean(body.pago);
    if (body.repetirMensal !== undefined || body.diaRecorrencia !== undefined) {
        const baseDate = body.dataVencimento != null ? parseVencimentoDate(body.dataVencimento) : existente.dataVencimento;
        Object.assign(
            data,
            normalizarRecorrencia(
                {
                    repetirMensal: body.repetirMensal ?? existente.repetirMensal,
                    diaRecorrencia: body.diaRecorrencia ?? existente.diaRecorrencia,
                },
                baseDate
            )
        );
    }

    const wantsSync =
        body.sincronizarGoogle !== undefined
            ? Boolean(body.sincronizarGoogle)
            : Boolean(existente.sincronizado || existente.googleEventId);

    if (wantsSync && camposAfetamSync(body)) {
        data.sincronizado = false;
    }

    const parcial = await reminderRepository.atualizar(id, data);
    const merged = { ...existente, ...parcial };

    try {
        const syncData = await aplicarSyncGoogle(usuarioId, merged, wantsSync);
        const final = await reminderRepository.atualizar(id, syncData);
        return mapLembreteComContagem(final);
    } catch (error) {
        if (wantsSync) {
            await reminderRepository.atualizar(id, { sincronizado: false });
        }
        throw error;
    }
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

    if (existente.googleEventId) {
        await googleCalendarSync.removerEventoLembrete(usuarioId, existente.googleEventId);
    }

    const atualizado = await reminderRepository.atualizar(id, {
        pago: true,
        googleEventId: null,
        sincronizado: false,
    });
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
