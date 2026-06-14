const notificationService = require('./notificationService');
const debtRepository = require('../repositories/debtRepository');
const { calcSaldoDivida } = require('../utils/debtBalanceUtils');
const { formatDateOnly, todayInTimezone } = require('../utils/dateTimezone');

const DIAS_ALERTA = [7, 2, 0];

const formatCurrency = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const diasAteVencimento = (prazoDevolucao) => {
    const hoje = todayInTimezone();
    const vencimento = formatDateOnly(prazoDevolucao);
    const hojeDate = new Date(`${hoje}T12:00:00.000Z`);
    const vencDate = new Date(`${vencimento}T12:00:00.000Z`);
    return Math.round((vencDate - hojeDate) / (1000 * 60 * 60 * 24));
};

const criarNotificacaoDivida = async (divida, diasRestantes, dataAlerta, valorRestante) => {
    const metadados = {
        dividaId: divida.id,
        nomePessoa: divida.nomePessoa,
        valor: Number(valorRestante).toFixed(2),
        prazoDevolucao: formatDateOnly(divida.prazoDevolucao),
        direcao: divida.direcao,
        dataAlerta,
        diasRestantes,
    };

    const duplicada = await notificationService.verificarNotificacaoDuplicadaDivida(
        divida.usuarioId,
        'DIVIDA_COBRANCA',
        metadados
    );
    if (duplicada) return null;

    const quando =
        diasRestantes === 0 ? 'hoje' : diasRestantes === 1 ? 'amanhã' : `em ${diasRestantes} dias`;

    return notificationService.criarNotificacao(divida.usuarioId, {
        tipo: 'DIVIDA_COBRANCA',
        titulo: 'Vencimento de dívida',
        mensagem: `A dívida com ${divida.nomePessoa} vence ${quando}. Saldo restante: ${formatCurrency(valorRestante)}`,
        linkAcao: '/debts',
        metadados,
    });
};

const verificarDividasENotificar = async () => {
    const hoje = todayInTimezone();
    const dividas = await debtRepository.buscarParaAlertas();

    let criadas = 0;

    for (const divida of dividas) {
        const { valorRestante } = calcSaldoDivida(divida, divida.pagamentos ?? []);
        if (valorRestante <= 0) continue;

        const diasRestantes = diasAteVencimento(divida.prazoDevolucao);
        if (!DIAS_ALERTA.includes(diasRestantes)) continue;

        const notif = await criarNotificacaoDivida(
            divida,
            diasRestantes,
            hoje,
            valorRestante
        );
        if (notif) criadas += 1;
    }

    return { criadas, verificadas: dividas.length };
};

module.exports = {
    verificarDividasENotificar,
};
