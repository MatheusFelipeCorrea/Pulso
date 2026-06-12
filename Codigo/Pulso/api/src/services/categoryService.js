const AppError = require('../utils/appError');
const categoryRepository = require('../repositories/categoryRepository');
const { mapCategoria } = require('../utils/transactionMapper');

const listarCategorias = async (usuarioId, tipo) => {
    await categoryRepository.criarPadrao(usuarioId);
    const categorias = await categoryRepository.listarPorUsuario(usuarioId, tipo);
    return categorias.map((c) => ({ ...mapCategoria(c), padrao: c.padrao }));
};

const seedCategoriasPadrao = async (usuarioId) => {
    await categoryRepository.criarPadrao(usuarioId);
};

const criarCategoria = async (usuarioId, body) => {
    await categoryRepository.criarPadrao(usuarioId);

    const nome = body.nome.trim();
    const existente = await categoryRepository.buscarPorNome(usuarioId, nome, body.tipo);
    if (existente) {
        throw new AppError('Já existe uma categoria com este nome para este tipo', 409);
    }

    const categoria = await categoryRepository.criar({
        nome,
        tipo: body.tipo,
        icone: body.icone,
        cor: body.cor,
        padrao: false,
        usuarioId,
    });

    return { ...mapCategoria(categoria), padrao: false };
};

const atualizarCategoria = async (usuarioId, id, body) => {
    const existente = await categoryRepository.buscarPorId(id, usuarioId);
    if (!existente) throw new AppError('Categoria não encontrada', 404);
    if (existente.padrao) {
        throw new AppError('Categorias padrão do sistema não podem ser editadas', 400);
    }

    const data = {};
    if (body.nome != null) {
        const nome = body.nome.trim();
        if (nome !== existente.nome) {
            const duplicada = await categoryRepository.buscarPorNome(usuarioId, nome, existente.tipo);
            if (duplicada && duplicada.id !== id) {
                throw new AppError('Já existe uma categoria com este nome para este tipo', 409);
            }
        }
        data.nome = nome;
    }
    if (body.icone != null) data.icone = body.icone;
    if (body.cor != null) data.cor = body.cor;

    const atualizada = await categoryRepository.atualizar(id, data);
    return { ...mapCategoria(atualizada), padrao: false };
};

const removerCategoria = async (usuarioId, id) => {
    const existente = await categoryRepository.buscarPorId(id, usuarioId);
    if (!existente) throw new AppError('Categoria não encontrada', 404);
    if (existente.padrao) {
        throw new AppError('Categorias padrão do sistema não podem ser excluídas', 400);
    }

    const uso = await categoryRepository.contarUso(id);
    if (uso > 0) {
        throw new AppError(
            'Esta categoria está em uso em transações ou orçamentos e não pode ser excluída',
            400
        );
    }

    await categoryRepository.deletar(id);
};

const listarIconesDisponiveis = () => {
    const { CATEGORY_ICONS, CATEGORY_COLORS } = require('../constants/categoryIcons');
    return { icones: CATEGORY_ICONS, cores: CATEGORY_COLORS };
};

module.exports = {
    listarCategorias,
    seedCategoriasPadrao,
    criarCategoria,
    atualizarCategoria,
    removerCategoria,
    listarIconesDisponiveis,
};
