const ANTECEDENCIA_LABELS = {
    NO_DIA: 'No dia',
    UM_DIA: '1 dia antes',
    TRES_DIAS: '3 dias antes',
    CINCO_DIAS: '5 dias antes',
    UMA_SEMANA: '1 semana antes',
};

/** Minutos antes do evento para lembrete popup no Google Calendar */
const ANTECEDENCIA_MINUTOS = {
    NO_DIA: 0,
    UM_DIA: 24 * 60,
    TRES_DIAS: 3 * 24 * 60,
    CINCO_DIAS: 5 * 24 * 60,
    UMA_SEMANA: 7 * 24 * 60,
};

module.exports = { ANTECEDENCIA_LABELS, ANTECEDENCIA_MINUTOS };
