const roundMoney = (value) => Math.round(Number(value ?? 0) * 100) / 100;

const NIVEL_COMPROMETIMENTO = {
    SAUDAVEL: 'saudavel',
    ATENCAO: 'atencao',
    ARRISCADO: 'arriscado',
};

const nivelComprometimento = (percentual) => {
    if (percentual > 30) return NIVEL_COMPROMETIMENTO.ARRISCADO;
    if (percentual > 20) return NIVEL_COMPROMETIMENTO.ATENCAO;
    return NIVEL_COMPROMETIMENTO.SAUDAVEL;
};

const calcParcela = (valorTotal, parcelas) => {
    const parcelasNum = Math.max(Number(parcelas) || 1, 1);
    return roundMoney(Number(valorTotal) / parcelasNum);
};

const calcComprometimento = (valorTotal, parcelas, rendaMensal) => {
    const renda = Number(rendaMensal ?? 0);
    const parcela = calcParcela(valorTotal, parcelas);
    if (renda <= 0) {
        return { parcela, percentual: 0, nivel: NIVEL_COMPROMETIMENTO.SAUDAVEL };
    }
    const percentual = Math.round((parcela / renda) * 1000) / 10;
    return { parcela, percentual, nivel: nivelComprometimento(percentual) };
};

const calcMesesParaComprar = (valorRestante, sobraMensal) => {
    const restante = roundMoney(valorRestante);
    const sobra = roundMoney(sobraMensal);
    if (restante <= 0) return 0;
    if (sobra <= 0) return null;
    return Math.ceil(restante / sobra);
};

const inferirCategoria = (nome) => {
    const texto = String(nome ?? '').toLowerCase();
    if (/(notebook|laptop|macbook|pc gamer|computador|tablet|monitor)/.test(texto)) {
        return 'TECNOLOGIA';
    }
    if (/(iphone|celular|smartphone|tv|console|playstation|xbox)/.test(texto)) {
        return 'ELETRONICOS';
    }
    if (/(fone|headphone|mouse|teclado|capa|carregador|acess)/.test(texto)) {
        return 'ACESSORIOS';
    }
    return 'OUTROS';
};

const CATEGORIA_LABELS = {
    TECNOLOGIA: 'Tecnologia',
    ELETRONICOS: 'Eletrônicos',
    ACESSORIOS: 'Acessórios',
    OUTROS: 'Outros',
};

const DICAS = [
  {
    id: 'prioridade',
    texto: 'Priorize itens de alta necessidade antes dos desejos.',
  },
  {
    id: 'parcelas',
    texto: 'Parcelas acima de 30% da renda podem comprometer seu orçamento.',
  },
  {
    id: 'meta',
    texto: 'Vincule uma meta para acompanhar o progresso da compra.',
  },
  {
    id: 'avista',
    texto: 'Comprar à vista costuma sair mais barato que parcelar com juros.',
  },
];

module.exports = {
    roundMoney,
    NIVEL_COMPROMETIMENTO,
    nivelComprometimento,
    calcParcela,
    calcComprometimento,
    calcMesesParaComprar,
    inferirCategoria,
    CATEGORIA_LABELS,
    DICAS,
};
