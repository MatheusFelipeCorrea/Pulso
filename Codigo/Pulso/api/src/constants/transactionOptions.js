/** Opções de transação — fonte única de labels (filtros e formulários) */

const RECURSOS = [
    { value: 'DINHEIRO', label: 'Dinheiro' },
    { value: 'VA', label: 'VA' },
    { value: 'VR', label: 'VR' },
    { value: 'VT', label: 'VT' },
];

const TIPOS_FILTRO = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'RECEITA', label: 'Receita' },
    { value: 'DESPESA', label: 'Despesa' },
];

const RECURSOS_FILTRO = [{ value: 'TODOS', label: 'Todos' }, ...RECURSOS];

const FREQUENCIAS_RECORRENCIA = [
    { value: 'SEMANAL', label: 'Semanal' },
    { value: 'QUINZENAL', label: 'Quinzenal' },
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'ANUAL', label: 'Anual' },
];

const ATE_QUANDO_RECORRENCIA = [
    { value: 'SEM_FIM', label: 'Sem fim' },
    { value: 'DATA', label: 'Data específica' },
];

module.exports = {
    RECURSOS,
    TIPOS_FILTRO,
    RECURSOS_FILTRO,
    FREQUENCIAS_RECORRENCIA,
    ATE_QUANDO_RECORRENCIA,
};
