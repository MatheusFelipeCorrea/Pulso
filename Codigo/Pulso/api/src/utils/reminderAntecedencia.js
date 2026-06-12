const { HORA_PADRAO_LEMBRETE } = require('./dateTimezone');

const ANTECEDENCIA_LABELS = {
    NO_DIA: 'No dia',
    UM_DIA: '1 dia antes',
    TRES_DIAS: '3 dias antes',
    CINCO_DIAS: '5 dias antes',
    UMA_SEMANA: '1 semana antes',
};

/** Dias antes do vencimento para alerta interno do Pulso */
const ANTECEDENCIA_DIAS = {
    NO_DIA: 0,
    UM_DIA: 1,
    TRES_DIAS: 3,
    CINCO_DIAS: 5,
    UMA_SEMANA: 7,
};

/**
 * Minutos antes do evento (10:00) para popup no Google Calendar.
 * Ex.: vencimento na sexta + 1 dia antes → alerta na quinta às 10:00.
 */
const ANTECEDENCIA_MINUTOS = {
    NO_DIA: 0,
    UM_DIA: 24 * 60,
    TRES_DIAS: 3 * 24 * 60,
    CINCO_DIAS: 5 * 24 * 60,
    UMA_SEMANA: 7 * 24 * 60,
};

module.exports = {
    ANTECEDENCIA_LABELS,
    ANTECEDENCIA_DIAS,
    ANTECEDENCIA_MINUTOS,
    HORA_PADRAO_LEMBRETE,
};

