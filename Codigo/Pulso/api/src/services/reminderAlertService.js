const prisma = require('../config/database');
const notificationService = require('./notificationService');
const { ANTECEDENCIA_DIAS, ANTECEDENCIA_LABELS } = require('../utils/reminderAntecedencia');
const { formatDateOnly, addDays, todayInTimezone } = require('../utils/dateTimezone');

const formatCurrency = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const obterDataAlerta = (dataVencimento, antecedencia) => {
    const dias = ANTECEDENCIA_DIAS[antecedencia] ?? ANTECEDENCIA_DIAS.UM_DIA;
    return formatDateOnly(addDays(dataVencimento, -dias));
};

const criarNotificacaoLembrete = async (lembrete, dataAlerta) => {
    const metadados = {
        lembreteId: lembrete.id,
        dataVencimento: formatDateOnly(lembrete.dataVencimento),
        dataAlerta,
        antecedencia: lembrete.antecedencia,
    };

    const duplicada = await notificationService.verificarNotificacaoDuplicadaLembrete(
        lembrete.usuarioId,
        'LEMBRETE_VENCIMENTO',
        metadados
    );
    if (duplicada) return null;

    const antecedenciaLabel = ANTECEDENCIA_LABELS[lembrete.antecedencia] ?? 'Em breve';
    const valorTexto =
        lembrete.valor != null && Number(lembrete.valor) > 0
            ? ` Valor: ${formatCurrency(lembrete.valor)}.`
            : '';

    return notificationService.criarNotificacao(lembrete.usuarioId, {
        tipo: 'LEMBRETE_VENCIMENTO',
        titulo: `Lembrete: ${lembrete.titulo}`,
        mensagem: `${antecedenciaLabel} do vencimento (${formatDateOnly(lembrete.dataVencimento).split('-').reverse().join('/')}).${valorTexto}`,
        linkAcao: '/calendar',
        metadados,
    });
};

const verificarLembretesENotificar = async () => {
    const hoje = todayInTimezone();
    const lembretes = await prisma.lembrete.findMany({
        where: { pago: false },
        orderBy: { dataVencimento: 'asc' },
    });

    let criadas = 0;

    for (const lembrete of lembretes) {
        const dataAlerta = obterDataAlerta(lembrete.dataVencimento, lembrete.antecedencia);
        if (dataAlerta !== hoje) continue;

        const notif = await criarNotificacaoLembrete(lembrete, dataAlerta);
        if (notif) criadas += 1;
    }

    return { criadas, verificados: lembretes.length, dataReferencia: hoje };
};

module.exports = {
    verificarLembretesENotificar,
    obterDataAlerta,
};
