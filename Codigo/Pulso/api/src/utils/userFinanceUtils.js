const prisma = require('../config/database');

/**
 * Renda mensal configurada para comparações de orçamento e simulações.
 * Usa `rendaMensalPlanejada` quando definida; senão `valorSalario`.
 */
const obterRendaMensalPlanejada = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({
        where: { usuarioId },
        select: { rendaMensalPlanejada: true, valorSalario: true },
    });

    if (!config) return 0;
    const renda = config.rendaMensalPlanejada ?? config.valorSalario;
    return Number(renda ?? 0);
};

module.exports = {
    obterRendaMensalPlanejada,
};
