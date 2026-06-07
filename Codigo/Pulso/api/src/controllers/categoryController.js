const categoryService = require('../services/categoryService');

const listarCategorias = async (req, res, next) => {
    try {
        const tipo = req.query.tipo || undefined;
        const categorias = await categoryService.listarCategorias(req.user.id, tipo);
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};

module.exports = { listarCategorias };
