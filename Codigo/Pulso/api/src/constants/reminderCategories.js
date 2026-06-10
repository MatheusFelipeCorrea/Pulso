/** Categorias de lembrete — fonte única para validação (API) e labels */

const CATEGORIA_GRUPOS = [
    {
        id: 'moradia',
        label: 'Moradia',
        values: ['ALUGUEL', 'CONDOMINIO', 'IPTU', 'SEGURO_RESIDENCIAL'],
    },
    {
        id: 'utilidades',
        label: 'Utilidades',
        values: ['LUZ', 'AGUA', 'GAS', 'INTERNET', 'TELEFONE', 'TV_ASSINATURA'],
    },
    {
        id: 'financeiro',
        label: 'Financeiro',
        values: [
            'FATURA_CARTAO',
            'EMPRESTIMO',
            'FINANCIAMENTO',
            'INVESTIMENTO',
            'IMPOSTO',
            'DECLARACAO_IR',
        ],
    },
    {
        id: 'veiculo',
        label: 'Veículo',
        values: ['IPVA', 'SEGURO_VEICULO', 'LICENCIAMENTO', 'REVISAO_VEICULO', 'MULTA'],
    },
    {
        id: 'saude',
        label: 'Saúde',
        values: ['PLANO_SAUDE', 'CONSULTA', 'EXAME', 'MEDICAMENTO', 'ACADEMIA'],
    },
    {
        id: 'educacao',
        label: 'Educação',
        values: ['MENSALIDADE_ESCOLA', 'MENSALIDADE_FACULDADE', 'CURSO', 'MATERIAL_ESCOLAR'],
    },
    {
        id: 'assinaturas',
        label: 'Assinaturas / Serviços',
        values: ['STREAMING', 'SOFTWARE', 'DOMINIO', 'HOSPEDAGEM', 'NUVEM'],
    },
    {
        id: 'pets',
        label: 'Pets',
        values: ['VACINA_PET', 'CONSULTA_PET', 'RACAO_PET'],
    },
    {
        id: 'trabalho',
        label: 'Trabalho / Negócios',
        values: [
            'NOTA_FISCAL',
            'FOLHA_PAGAMENTO',
            'CONTRATO',
            'RENOVACAO_CONTRATO',
            'CERTIDAO',
            'ALVARA',
        ],
    },
    {
        id: 'pessoal',
        label: 'Pessoal',
        values: ['ANIVERSARIO', 'REUNIAO', 'COMPROMISSO', 'VIAGEM', 'RENOVACAO_DOCUMENTO'],
    },
    {
        id: 'geral',
        label: 'Geral',
        values: ['RECORRENTE', 'PARCELAMENTO', 'OUTRO'],
    },
];

const CATEGORIA_LABELS = {
    ALUGUEL: 'Aluguel',
    CONDOMINIO: 'Condomínio',
    IPTU: 'IPTU',
    SEGURO_RESIDENCIAL: 'Seguro residencial',
    LUZ: 'Conta de luz',
    AGUA: 'Água',
    GAS: 'Gás',
    INTERNET: 'Internet',
    TELEFONE: 'Telefone',
    TV_ASSINATURA: 'TV / Assinatura',
    FATURA_CARTAO: 'Fatura do cartão',
    EMPRESTIMO: 'Empréstimo',
    FINANCIAMENTO: 'Financiamento',
    INVESTIMENTO: 'Investimento',
    IMPOSTO: 'Imposto',
    DECLARACAO_IR: 'Declaração IR',
    IPVA: 'IPVA',
    SEGURO_VEICULO: 'Seguro do veículo',
    LICENCIAMENTO: 'Licenciamento',
    REVISAO_VEICULO: 'Revisão do veículo',
    MULTA: 'Multa',
    PLANO_SAUDE: 'Plano de saúde',
    CONSULTA: 'Consulta',
    EXAME: 'Exame',
    MEDICAMENTO: 'Medicamento',
    ACADEMIA: 'Academia',
    MENSALIDADE_ESCOLA: 'Mensalidade escola',
    MENSALIDADE_FACULDADE: 'Mensalidade faculdade',
    CURSO: 'Curso',
    MATERIAL_ESCOLAR: 'Material escolar',
    STREAMING: 'Streaming',
    SOFTWARE: 'Software',
    DOMINIO: 'Domínio',
    HOSPEDAGEM: 'Hospedagem',
    NUVEM: 'Nuvem / Storage',
    VACINA_PET: 'Vacina pet',
    CONSULTA_PET: 'Consulta pet',
    RACAO_PET: 'Ração pet',
    NOTA_FISCAL: 'Nota fiscal',
    FOLHA_PAGAMENTO: 'Folha de pagamento',
    CONTRATO: 'Contrato',
    RENOVACAO_CONTRATO: 'Renovação de contrato',
    CERTIDAO: 'Certidão',
    ALVARA: 'Alvará',
    ANIVERSARIO: 'Aniversário',
    REUNIAO: 'Reunião',
    COMPROMISSO: 'Compromisso',
    VIAGEM: 'Viagem',
    RENOVACAO_DOCUMENTO: 'Renovação de documento',
    RECORRENTE: 'Recorrente',
    PARCELAMENTO: 'Parcelamento',
    OUTRO: 'Outro',
};

/** Valores legados (enum antigo) → categoria atual */
const LEGACY_CATEGORIA_MAP = {
    FATURA: 'FATURA_CARTAO',
    MENSALIDADE: 'MENSALIDADE_FACULDADE',
};

const CATEGORIAS_LEMBRETE = CATEGORIA_GRUPOS.flatMap((grupo) => grupo.values);

const normalizeCategoria = (value) => {
    if (!value) return 'OUTRO';
    const mapped = LEGACY_CATEGORIA_MAP[value] ?? value;
    return CATEGORIAS_LEMBRETE.includes(mapped) ? mapped : 'OUTRO';
};

module.exports = {
    CATEGORIA_GRUPOS,
    CATEGORIA_LABELS,
    CATEGORIAS_LEMBRETE,
    LEGACY_CATEGORIA_MAP,
    normalizeCategoria,
};
