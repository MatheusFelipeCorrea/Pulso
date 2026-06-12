const notificationService = require('./notificationService');
const debtRepository = require('../repositories/debtRepository');
const { formatDateOnly, addDays, todayInTimezone } = require('../utils/dateTimezone');

const formatCurrency = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const diasAteVencimento = (prazoDevolucao) => {
    const hoje = todayInTimezone();
    const vencimento = formatDateOnly(prazoDevolucao);
    const hojeDate = new Date(`${hoje}T12:00:00.000Z`);
    const vencDate = new Date(`${vencimento}T12:00:00.000Z`);
    return Math.round((vencDate - hojeDate) / (1000 * 60 * 60 * 24));
};

const criarNotificacaoDivida = async (divida, diasRestantes, dataAlerta) => {
    const metadados = {
        dividaId: divida.id,
        nomePessoa: divida.nomePessoa,
        valor: Number(divida.valor).toFixed(2),
        prazoDevolucao: formatDateOnly(divida.prazoDevolucao),
        direcao: divida.direcao,
        dataAlerta,
    };

    const duplicada = await notificationService.verificarNotificacaoDuplicadaDivida(
        divida.usuarioId,
        'DIVIDA_COBRANCA',
        metadados
    );
    if (duplicada) return null;

    const quando =
        diasRestantes === 0 ? 'hoje' : diasRestantes === 2 ? 'em 2 dias' : `em ${diasRestantes} dias`;

    return notificationService.criarNotificacao(divida.usuarioId, {
        tipo: 'DIVIDA_COBRANCA',
        titulo: 'Vencimento de dívida',
        mensagem: `A dívida com ${divida.nomePessoa} vence ${quando}. Valor: ${formatCurrency(divida.valor)}`,
        linkAcao: '/debts',
        metadados,
    });
};

const verificarDividasENotificar = async () => {
    const hoje = todayInTimezone();
    const emDoisDias = formatDateOnly(addDays(hoje, 2));
    const dividas = await debtRepository.buscarParaAlertas();

    let criadas = 0;

    for (const divida of dividas) {
        const vencimento = formatDateOnly(divida.prazoDevolucao);
        if (vencimento !== hoje && vencimento !== emDoisDias) continue;

        const diasRestantes = diasAteVencimento(divida.prazoDevolucao);
        const notif = await criarNotificacaoDivida(divida, diasRestantes, hoje);
        if (notif) criadas += 1;
    }

    return { criadas, verificadas: dividas.length };
};

module.exports = {
    verificarDividasENotificar,
};
