const { ANTECEDENCIA_LABELS } = require('./reminderAntecedencia');
const { normalizeCategoria, CATEGORIA_LABELS } = require('../constants/reminderCategories');

const mapLembrete = (lembrete) => {
    const categoria = normalizeCategoria(lembrete.categoria ?? lembrete.tipo);

    return {
        id: lembrete.id,
        titulo: lembrete.titulo,
        valor: lembrete.valor != null ? Number(lembrete.valor).toFixed(2) : null,
        dataVencimento: lembrete.dataVencimento.toISOString(),
        antecedencia: lembrete.antecedencia,
        antecedenciaLabel: ANTECEDENCIA_LABELS[lembrete.antecedencia] ?? lembrete.antecedencia,
        categoria,
        categoriaLabel: CATEGORIA_LABELS[categoria] ?? categoria,
        pago: Boolean(lembrete.pago),
        googleEventId: lembrete.googleEventId,
        sincronizado: lembrete.sincronizado,
        repetirMensal: Boolean(lembrete.repetirMensal),
        diaRecorrencia: lembrete.diaRecorrencia ?? null,
        lembreteTemplateId: lembrete.lembreteTemplateId ?? null,
        criadoEm: lembrete.criadoEm.toISOString(),
        atualizadoEm: lembrete.atualizadoEm.toISOString(),
    };
};

module.exports = { mapLembrete };
