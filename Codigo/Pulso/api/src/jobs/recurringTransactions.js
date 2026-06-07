const prisma = require('../config/database');
const transactionRepository = require('../repositories/transactionRepository');
const logger = require('../utils/logger');

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

/** Verifica se hoje é um dia de ocorrência simples baseado na RRULE básica */
const isOccurrenceToday = (regra, dataBase) => {
    if (!regra) return false;

    const hoje = startOfDay(new Date());
    const base = startOfDay(dataBase);

    if (regra.includes('UNTIL=')) {
        const untilMatch = regra.match(/UNTIL=(\d{8})/);
        if (untilMatch) {
            const y = untilMatch[1].slice(0, 4);
            const m = untilMatch[1].slice(4, 6);
            const d = untilMatch[1].slice(6, 8);
            const until = startOfDay(new Date(`${y}-${m}-${d}T12:00:00`));
            if (hoje > until) return false;
        }
    }

    if (regra.includes('FREQ=WEEKLY')) {
        const intervalMatch = regra.match(/INTERVAL=(\d+)/);
        const interval = intervalMatch ? Number(intervalMatch[1]) : 1;
        const diffWeeks = Math.floor((hoje - base) / (7 * 24 * 60 * 60 * 1000));
        return diffWeeks >= 0 && diffWeeks % interval === 0 && hoje.getDay() === base.getDay();
    }

    if (regra.includes('FREQ=MONTHLY')) {
        return hoje.getDate() === base.getDate() && hoje >= base;
    }

    if (regra.includes('FREQ=YEARLY')) {
        return (
            hoje.getDate() === base.getDate() &&
            hoje.getMonth() === base.getMonth() &&
            hoje >= base
        );
    }

    return false;
};

const runRecurringTransactions = async () => {
    const maes = await transactionRepository.listarRecorrentesMae();
    let criadas = 0;

    for (const mae of maes) {
        if (!isOccurrenceToday(mae.regraRecorrencia, mae.data)) continue;

        const existente = await prisma.transacao.findFirst({
            where: {
                paiId: mae.id,
                data: {
                    gte: startOfDay(new Date()),
                    lte: new Date(startOfDay(new Date()).getTime() + 86400000 - 1),
                },
            },
        });

        if (existente) continue;

        const filha = await transactionRepository.criar({
            usuarioId: mae.usuarioId,
            categoriaId: mae.categoriaId,
            tipo: mae.tipo,
            recurso: mae.recurso,
            valor: mae.valor,
            descricao: mae.descricao,
            data: startOfDay(new Date()),
            recorrente: false,
            regraRecorrencia: null,
            paiId: mae.id,
        });

        const tagIds = mae.tags?.map((t) => t.tagId) ?? [];
        if (tagIds.length) {
            await transactionRepository.vincularTags(filha.id, tagIds);
        }

        criadas += 1;
    }

    if (criadas > 0) {
        logger.info(`🔄 Transações recorrentes geradas: ${criadas}`);
    }
};

module.exports = { runRecurringTransactions };
