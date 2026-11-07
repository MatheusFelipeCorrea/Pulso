jest.mock('../../../src/providers/chatbotGeminiProvider', () => ({
    ensureConfigured: jest.fn(),
    generateChatReply: jest.fn(),
}));

jest.mock('../../../src/services/chatbotContextService', () => ({
    buildUserFinanceContext: jest.fn(),
}));

jest.mock('../../../src/services/transactionService', () => ({
    criarTransacao: jest.fn(),
}));

jest.mock('../../../src/config/database', () => ({
    conversaChat: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    mensagemChat: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
    categoria: {
        findFirst: jest.fn(),
    },
    $transaction: jest.fn(async (ops) => Promise.all(ops)),
}));

const prisma = require('../../../src/config/database');
const chatbotGeminiProvider = require('../../../src/providers/chatbotGeminiProvider');
const chatbotContextService = require('../../../src/services/chatbotContextService');
const chatbotService = require('../../../src/services/chatbotService');

describe('chatbotService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        chatbotContextService.buildUserFinanceContext.mockResolvedValue({
            texto: 'contexto teste',
            categorias: [{ id: 'c1', nome: 'Alimentação', tipo: 'DESPESA' }],
            resumo: {},
        });
        prisma.conversaChat.create.mockResolvedValue({
            id: 'conv1',
            titulo: 'Nova conversa',
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        });
        prisma.conversaChat.findFirst.mockResolvedValue({
            id: 'conv1',
            titulo: 'Nova conversa',
            usuarioId: 'u1',
        });
        prisma.mensagemChat.findMany.mockResolvedValue([]);
        prisma.mensagemChat.create.mockResolvedValue({});
        prisma.conversaChat.update.mockResolvedValue({});
        prisma.$transaction.mockImplementation(async (ops) => Promise.all(ops));
    });

    it('recusa pergunta fora de escopo sem chamar Gemini', async () => {
        const result = await chatbotService.enviarMensagem('u1', {
            mensagem: 'me conta uma receita de bolo',
        });
        expect(result.recusada).toBe(true);
        expect(result.resposta).toContain('Só posso ajudar');
        expect(result.conversaId).toBe('conv1');
        expect(chatbotGeminiProvider.generateChatReply).not.toHaveBeenCalled();
        expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('responde pergunta financeira com contexto e persiste', async () => {
        chatbotGeminiProvider.generateChatReply.mockResolvedValue(
            'Você gastou R$ 120,00 em alimentação este mês.'
        );
        const result = await chatbotService.enviarMensagem('u1', {
            mensagem: 'quanto gastei com alimentação?',
        });
        expect(result.recusada).toBe(false);
        expect(result.resposta).toContain('R$ 120,00');
        expect(result.conversaId).toBe('conv1');
        expect(chatbotGeminiProvider.generateChatReply).toHaveBeenCalled();
        expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('extrai proposta de transação do retorno', async () => {
        chatbotGeminiProvider.generateChatReply.mockResolvedValue(
            'Posso lançar essa despesa.\n<!--PROPOSTA_TX:{"tipo":"DESPESA","valor":45,"descricao":"almoço","recurso":"DINHEIRO","categoriaNome":"Alimentação"}-->'
        );
        const result = await chatbotService.enviarMensagem('u1', {
            mensagem: 'gastei 45 no almoço',
            modo: 'quick_add',
        });
        expect(result.propostaTransacao).toMatchObject({
            tipo: 'DESPESA',
            valor: 45,
            categoriaId: 'c1',
        });
        expect(result.resposta).not.toContain('PROPOSTA_TX');
    });

    it('lista sugestões rápidas', () => {
        const sugestoes = chatbotService.listarSugestoes();
        expect(sugestoes.length).toBeGreaterThan(3);
        expect(sugestoes[0]).toHaveProperty('label');
    });

    it('lista conversas do usuário', async () => {
        prisma.conversaChat.findMany.mockResolvedValue([
            {
                id: 'conv1',
                titulo: 'Gastos de agosto',
                criadoEm: new Date(),
                atualizadoEm: new Date(),
                mensagens: [{ conteudo: 'Você gastou…', papel: 'assistant' }],
            },
        ]);
        const list = await chatbotService.listarConversas('u1');
        expect(list).toHaveLength(1);
        expect(list[0].titulo).toBe('Gastos de agosto');
        expect(list[0].preview).toContain('Você gastou');
    });

    it('obtém conversa com mensagens mapeadas', async () => {
        prisma.conversaChat.findFirst.mockResolvedValue({
            id: 'conv1',
            titulo: 'Teste',
            criadoEm: new Date(),
            atualizadoEm: new Date(),
            mensagens: [
                {
                    id: 'm1',
                    papel: 'user',
                    conteudo: 'oi',
                    criadoEm: new Date('2026-11-07T10:00:00Z'),
                },
                {
                    id: 'm2',
                    papel: 'assistant',
                    conteudo: 'olá',
                    criadoEm: new Date('2026-11-07T10:01:00Z'),
                },
            ],
        });
        const conv = await chatbotService.obterConversa('u1', 'conv1');
        expect(conv.mensagens).toHaveLength(2);
        expect(conv.mensagens[0].role).toBe('user');
        expect(conv.mensagens[1].role).toBe('assistant');
    });
});
