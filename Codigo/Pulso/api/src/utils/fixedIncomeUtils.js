const MODOS_VT_AUTOMATICOS = new Set(['ESTAGIARIO', 'CLT']);

const diasNoMes = (year, month) => new Date(year, month, 0).getDate();

const clampDiaMes = (dia, year, month) => {
    const d = Number(dia);
    if (!Number.isFinite(d) || d < 1) return null;
    return Math.min(Math.floor(d), diasNoMes(year, month));
};

const podeExibirVt = (config) => {
    const modo = config?.modoUso ?? 'CLT';
    if (modo === 'PESSOA_FISICA') return false;
    if (MODOS_VT_AUTOMATICOS.has(modo)) return true;
    if (modo === 'PJ') return config?.vtHabilitado === true;
    return false;
};

const podeExibirVaVr = (config) => {
    const modo = config?.modoUso ?? 'CLT';
    return modo === 'ESTAGIARIO' || modo === 'CLT';
};

/**
 * Recebimentos fixos configurados (valores/dias vêm do onboarding ou config futura).
 * Só inclui itens com valor > 0.
 */
const obterRecebimentosFixosConfig = (config) => {
    if (!config) return [];

    const itens = [];
    const push = (tipo, label, valor, dia) => {
        const v = Number(valor);
        if (!Number.isFinite(v) || v <= 0) return;
        const d = Number(dia);
        if (!Number.isFinite(d) || d < 1 || d > 31) return;
        itens.push({ tipo, label, valor: v, dia: Math.floor(d) });
    };

    push('SALARIO', 'Salário', config.valorSalario, config.diaSalario);

    if (podeExibirVaVr(config)) {
        push('VA', 'Vale Alimentação', config.valorVa, config.diaVa);
        push('VR', 'Vale Refeição', config.valorVr, config.diaVr);
    }

    if (podeExibirVt(config)) {
        push('VT', 'Vale Transporte', config.valorVt, config.diaVt);
    }

    return itens;
};

const recebimentosFixosNoDia = (recebimentos, year, month, day) =>
    recebimentos.filter((item) => clampDiaMes(item.dia, year, month) === day);

const aplicarMarcadoresRecebimentoFixo = (dias, recebimentos, year, month) => {
    for (const item of recebimentos) {
        const diaEfetivo = clampDiaMes(item.dia, year, month);
        if (diaEfetivo === null) continue;

        const key = `${year}-${String(month).padStart(2, '0')}-${String(diaEfetivo).padStart(2, '0')}`;
        if (!dias[key]) {
            dias[key] = {
                receitas: 0,
                despesas: 0,
                lembretes: 0,
                temReceita: false,
                temDespesa: false,
                temLembrete: false,
                temRecebimentoFixo: false,
                recebimentosFixos: [],
            };
        }
        dias[key].temRecebimentoFixo = true;
        if (!dias[key].recebimentosFixos.includes(item.tipo)) {
            dias[key].recebimentosFixos.push(item.tipo);
        }
    }
};

module.exports = {
    obterRecebimentosFixosConfig,
    recebimentosFixosNoDia,
    aplicarMarcadoresRecebimentoFixo,
    clampDiaMes,
    diasNoMes,
};
