const periodoAtual = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

const intervaloDoPeriodo = (periodo) => {
    const ref = periodo ?? periodoAtual();
    const [year, month] = ref.split('-').map(Number);
    const inicio = new Date(year, month - 1, 1);
    const fim = new Date(year, month, 0, 23, 59, 59, 999);
    return { inicio, fim };
};

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return startOfDay(d);
};

const MS_DIA = 86400000;

/** Countdown até o saldo VT resetar (1º dia do mês seguinte ao período). */
const calcularProximaRecarga = (periodo) => {
    const ref = periodo ?? periodoAtual();
    const [year, month] = ref.split('-').map(Number);
    const atual = periodoAtual();
    const hoje = startOfDay(new Date());

    const inicioMes = new Date(year, month - 1, 1);
    const totalDias = new Date(year, month, 0).getDate();
    const proximoReset = new Date(year, month, 1);

    if (ref < atual) {
        return {
            isMesAtual: false,
            diasRestantes: 0,
            progresso: 100,
            dataReset: proximoReset.toISOString(),
            status: 'Período encerrado',
        };
    }

    if (ref > atual) {
        return {
            isMesAtual: false,
            diasRestantes: 0,
            progresso: 0,
            dataReset: inicioMes.toISOString(),
            status: 'Período futuro',
        };
    }

    const diasRestantes = Math.max(
        0,
        Math.ceil((startOfDay(proximoReset).getTime() - hoje.getTime()) / MS_DIA)
    );
    const diasDecorridos = Math.max(0, totalDias - diasRestantes);
    const progresso = Math.min(
        100,
        Math.round((diasDecorridos / totalDias) * 100)
    );

    let status = 'Recarga hoje';
    if (diasRestantes === 1) status = 'Recarga amanhã';
    else if (diasRestantes > 1) status = `Recarga em ${diasRestantes} dias`;

    return {
        isMesAtual: true,
        diasRestantes,
        progresso,
        dataReset: proximoReset.toISOString(),
        status,
    };
};

module.exports = {
    periodoAtual,
    intervaloDoPeriodo,
    startOfDay,
    addDays,
    calcularProximaRecarga,
};
