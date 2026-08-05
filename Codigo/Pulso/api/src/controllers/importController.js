const AppError = require('../utils/appError');
const importService = require('../services/importService');

const analisarArquivo = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError('Arquivo é obrigatório', 400);
        }

        let mapeamento = {};
        if (req.body.mapeamento) {
            mapeamento = JSON.parse(req.body.mapeamento);
        }

        const resultado = await importService.analisarArquivo(req.user.id, {
            buffer: req.file.buffer,
            filename: req.file.originalname,
            origem: req.body.origem,
            mapeamento,
        });

        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

const confirmarImportacao = async (req, res, next) => {
    try {
        const resultado = await importService.confirmarImportacao(req.user.id, req.body);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    analisarArquivo,
    confirmarImportacao,
};
