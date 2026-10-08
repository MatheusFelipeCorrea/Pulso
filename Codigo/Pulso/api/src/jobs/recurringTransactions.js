const prisma = require('../config/database');
const transactionRepository = require('../repositories/transactionRepository');
const logger = require('../utils/logger');
const { formatDateOnly, todayInTimezone, startOfDayInTimezone } = require('../utils/dateTimezone');

const parseYmd = (ymd) => {
    const [year, month, day] = ymd.split('-').map(Number);
    return { year, month, day };
};

const weekdayOfYmd = (ymd) => {
    const { year, month, day } = parseYmd(ymd);
    return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
};

const daysInMonth = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();

const diffCalendarDays = (fromYmd, toYmd) => {
    const a = parseYmd(fromYmd);
    const b = parseYmd(toYmd);
    const from = Date.UTC(a.year, a.month - 1, a.day);
    const to = Date.UTC(b.year, b.month - 1, b.day);
    return Math.round((to - from) / 86400000);
};

/** Verifica se hoje (America/Sao_Paulo) é ocorrência da RRULE básica. */
const isOccurrenceToday = (regra, dataBase) => {
    if (!regra) return false;

    const hoje = todayInTimezone();
    const base = formatDateOnly(dataBase);
    const hojeParts = parseYmd(hoje);
    const baseParts = parseYmd(base);

    if (hoje < base) return false;

    if (regra.includes('UNTIL=')) {
        const untilMatch = regra.match(/UNTIL=(\d{8})/);
        if (untilMatch) {
            const y = untilMatch[1].slice(0, 4);
            const m = untilMatch[1].slice(4, 6);
            const d = untilMatch[1].slice(6, 8);
            const until = `${y}-${m}-${d}`;
            if (hoje > until) return false;
        }
    }

    if (regra.includes('FREQ=DAILY')) {
        return true;
    }

    if (regra.includes('FREQ=WEEKLY')) {
        const intervalMatch = regra.match(/INTERVAL=(\d+)/);
        const interval = intervalMatch ? Number(intervalMatch[1]) : 1;
        const diffWeeks = Math.floor(diffCalendarDays(base, hoje) / 7);
        return diffWeeks % interval === 0 && weekdayOfYmd(hoje) === weekdayOfYmd(base);
    }

    if (regra.includes('FREQ=MONTHLY')) {
        const lastDay = daysInMonth(hojeParts.year, hojeParts.month);
        const dueDay = Math.min(baseParts.day, lastDay);
        return hojeParts.day === dueDay;
    }

    if (regra.includes('FREQ=YEARLY')) {
        return hojeParts.day === baseParts.day && hojeParts.month === baseParts.month;
    }

    return false;
};

const runRecurringTransactions = async () => {
    const maes = await transactionRepository.listarRecorrentesMae();
    let criadas = 0;
    const inicioHoje = startOfDayInTimezone(new Date());
    const fimHoje = new Date(inicioHoje.getTime() + 86400000 - 1);

    for (const mae of maes) {
        if (!isOccurrenceToday(mae.regraRecorrencia, mae.data)) continue;

        try {
            const created = await prisma.$transaction(
                async (tx) => {
                    const existente = await tx.transacao.findFirst({
                        where: {
                            paiId: mae.id,
                            data: { gte: inicioHoje, lte: fimHoje },
                        },
                    });
                    if (existente) return false;

                    const filha = await tx.transacao.create({
                        data: {
                            usuarioId: mae.usuarioId,
                            categoriaId: mae.categoriaId,
                            tipo: mae.tipo,
                            recurso: mae.recurso,
                            recursoDestino: mae.recursoDestino ?? null,
                            valor: mae.valor,
                            descricao: mae.descricao,
                            data: inicioHoje,
                            recorrente: false,
                            regraRecorrencia: null,
                            paiId: mae.id,
                        },
                    });

                    const tagIds = mae.tags?.map((t) => t.tagId) ?? [];
                    if (tagIds.length) {
                        await tx.transacaoTag.createMany({
                            data: tagIds.map((tagId) => ({ transacaoId: filha.id, tagId })),
                            skipDuplicates: true,
                        });
                    }
                    return true;
                },
                { isolationLevel: 'Serializable' }
            );
            if (created) criadas += 1;
        } catch (err) {
            logger.warn(`Recorrência ${mae.id} ignorada (concorrência ou falha): ${err.message}`);
        }
    }

    if (criadas > 0) {
        logger.info(`🔄 Transações recorrentes geradas: ${criadas}`);
    }
};

module.exports = { runRecurringTransactions, isOccurrenceToday };
