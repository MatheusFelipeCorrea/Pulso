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
    if (/(\bcarro\b|moto(cicleta)?|bicicleta|\bbike\b|patinete|scooter|capacete|\bpneu\b)/.test(texto)) {
        return 'VEICULO';
    }
    if (/(roupa|camisa|camiseta|blusa|cal[çc]a|vestido|t[êe]nis|sapato|sapatilha|jaqueta|casaco|bolsa|mochila)/.test(texto)) {
        return 'VESTUARIO';
    }
    if (/(geladeira|fog[ãa]o|micro-?ondas|lavadora|m[áa]quina de lavar|aspirador|ar[- ]condicionado|ventilador|sof[áa]|colch[ãa]o|guarda-?roupa|estante|panela|liquidificador|cafeteira)/.test(texto)) {
        return 'CASA_ELETRODOMESTICOS';
    }
    if (/(notebook|laptop|macbook|pc gamer|computador|tablet|monitor|iphone|celular|smartphone|\btv\b|console|playstation|xbox|c[âa]mera|drone)/.test(texto)) {
        return 'ELETRONICOS';
    }
    if (/(fone|headphone|mouse|teclado|\bcapa\b|carregador|acess)/.test(texto)) {
        return 'ACESSORIOS';
    }
    return 'OUTROS';
};

const CATEGORIA_LABELS = {
    ELETRONICOS: 'Eletrônicos',
    CASA_ELETRODOMESTICOS: 'Casa & Eletrodomésticos',
    VESTUARIO: 'Vestuário',
    VEICULO: 'Veículo',
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
  {
    id: 'espera',
    texto: 'Espere alguns dias antes de decidir uma compra por impulso.',
  },
  {
    id: 'comparar',
    texto: 'Compare preços em diferentes lojas antes de finalizar a compra.',
  },
  {
    id: 'guardar',
    texto: 'Guarde parte do valor todo mês até atingir o total da compra.',
  },
  {
    id: 'necessidade',
    texto: 'Avalie se o item é realmente necessário ou apenas um desejo passageiro.',
  },
  {
    id: 'promocao',
    texto: 'Itens de baixa prioridade podem esperar por uma promoção.',
  },
  {
    id: 'revisar',
    texto: 'Revise sua lista de desejos periodicamente e remova o que não faz mais sentido.',
  },
  {
    id: 'parcelamento-longo',
    texto: 'Parcelamentos longos aumentam o risco de comprometer meses futuros.',
  },
  {
    id: 'prazo',
    texto: 'Defina um prazo realista para evitar compras precipitadas.',
  },
];

const diaDoAno = (dataReferencia) => {
    const [ano, mes, dia] = String(dataReferencia).split('-').map(Number);
    const inicioAno = Date.UTC(ano, 0, 1);
    const dataAtual = Date.UTC(ano, (mes || 1) - 1, dia || 1);
    return Math.floor((dataAtual - inicioAno) / 86400000);
};

const selecionarDicasDoDia = (dicas, quantidade, dataReferencia) => {
    if (!dicas.length) return [];
    const qtd = Math.min(quantidade, dicas.length);
    const inicio = diaDoAno(dataReferencia) % dicas.length;
    return Array.from({ length: qtd }, (_, i) => dicas[(inicio + i) % dicas.length]);
};

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
    selecionarDicasDoDia,
};
