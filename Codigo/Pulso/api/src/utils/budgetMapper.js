const mapOrcamento = (orcamento) => ({
    id: orcamento.id,
    categoriaId: orcamento.categoriaId,
    categoriaNome: orcamento.categoria?.nome,
    categoriaIcone: orcamento.categoria?.icone,
    categoriaCor: orcamento.categoria?.cor,
    mesReferencia: orcamento.mesReferencia,
    limiteValor: Number(orcamento.limiteValor),
    criadoEm: orcamento.criadoEm,
    atualizadoEm: orcamento.atualizadoEm,
});

const calcularStatusCategoria = (percentualUsado) => {
    if (percentualUsado >= 100) return 'estourado';
    if (percentualUsado >= 80) return 'alerta';
    return 'normal';
};

module.exports = {
    mapOrcamento,
    calcularStatusCategoria,
};
