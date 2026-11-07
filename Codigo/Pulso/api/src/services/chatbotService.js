const prisma = require('../config/database');
const chatbotGeminiProvider = require('../providers/chatbotGeminiProvider');
const chatbotContextService = require('./chatbotContextService');
const transactionService = require('./transactionService');
const AppError = require('../utils/appError');

const RECUSA_PADRAO =
    'Só posso ajudar com suas finanças no Pulso (gastos, saldos, metas, categorias e lançamentos). Reformule a pergunta nesse sentido 🙂';

const OFF_TOPIC_HINTS = [
    /\b(receita de bolo|política|eleição|futebol|filme|série|namoro|sexo)\b/i,
    /\b(código|javascript|python|programar)\b/i,
    /\b(piada|horóscopo|chatgpt genérico)\b/i,
];

const looksOffTopic = (mensagem) => OFF_TOPIC_HINTS.some((re) => re.test(mensagem));

const SYSTEM_PROMPT = `Você é o Pulso Assistente, chatbot financeiro do app Pulso (Brasil).
Regras obrigatórias:
1) Responda SOMENTE sobre finanças pessoais do usuário autenticado (transações, saldos, VA/VR/VT, metas, categorias, orçamento, dívidas, divisão).
2) Use APENAS os números do bloco CONTEXTO. Nunca invente lançamentos.
3) Se faltar dado, diga claramente que não há histórico suficiente.
4) Se a pergunta for fora de finanças, responda exatamente: ${RECUSA_PADRAO}
5) Seja objetivo, em português do Brasil. Formate com Markdown leve: **negrito** nos rótulos (Receitas, Despesas, Saldo), listas com "- " ou "* ", e valores em R$.
6) Quando o usuário quiser LANÇAR uma transação (ex.: "gastei 45 no almoço"), proponha em JSON no final da resposta, em uma linha isolada:
<!--PROPOSTA_TX:{ "tipo":"DESPESA"|"RECEITA", "valor":45.0, "descricao":"...", "recurso":"DINHEIRO"|"VA"|"VR"|"VT"|"POUPANCA", "categoriaNome":"..." }-->
Só inclua a proposta se tiver valor e tipo claros. Não confirme o lançamento sozinho.
7) Não fale de outros usuários, nem peça senha/token.
8) Para perguntas de meses passados, use a seção "Resumos mensais" do CONTEXTO.`;

const TITULO_MAX = 60;
const HISTORICO_MAX = 12;

const extractProposta = (texto) => {
    const match = texto.match(/<!--PROPOSTA_TX:(\{[\s\S]*?\})-->/);
    if (!match) return { limpa: texto.trim(), proposta: null };
    let proposta = null;
    try {
        proposta = JSON.parse(match[1]);
        if (!proposta?.tipo || !proposta?.valor) proposta = null;
        else {
            proposta.valor = Number(proposta.valor);
            if (!(proposta.valor > 0)) proposta = null;
        }
    } catch {
        proposta = null;
    }
    const limpa = texto.replace(/<!--PROPOSTA_TX:\{[\s\S]*?\}-->/, '').trim();
    return { limpa, proposta };
};

const toGeminiContents = (historico, mensagem) => {
    const contents = [];
    for (const item of historico.slice(-HISTORICO_MAX)) {
        contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }],
        });
    }
    contents.push({ role: 'user', parts: [{ text: mensagem }] });
    return contents;
};

const tituloFromMensagem = (mensagem) => {
    const limpo = String(mensagem || '')
        .replace(/\s+/g, ' ')
        .trim();
    if (!limpo) return 'Nova conversa';
    return limpo.length > TITULO_MAX ? `${limpo.slice(0, TITULO_MAX - 1)}…` : limpo;
};

const assertConversaDoUsuario = async (usuarioId, conversaId) => {
    const conversa = await prisma.conversaChat.findFirst({
        where: { id: conversaId, usuarioId },
    });
    if (!conversa) {
        throw new AppError('Conversa não encontrada.', 404);
    }
    return conversa;
};

const listarSugestoes = () => [
    { id: 'hoje', label: 'Quanto gastei hoje?', icon: 'calendar' },
    { id: 'metas', label: 'Como estão minhas metas?', icon: 'target' },
    { id: 'semana', label: 'Resumo da semana', icon: 'chart' },
    { id: 'va', label: 'Meu VA vai durar?', icon: 'wallet' },
    { id: 'analise', label: 'Análise de gastos', icon: 'trend' },
    { id: 'dicas', label: 'Dicas para economizar', icon: 'bulb' },
];

const listarConversas = async (usuarioId) => {
    const conversas = await prisma.conversaChat.findMany({
        where: { usuarioId },
        orderBy: { atualizadoEm: 'desc' },
        take: 50,
        select: {
            id: true,
            titulo: true,
            criadoEm: true,
            atualizadoEm: true,
            mensagens: {
                orderBy: { criadoEm: 'desc' },
                take: 1,
                select: { conteudo: true, papel: true, criadoEm: true },
            },
        },
    });

    return conversas.map((c) => ({
        id: c.id,
        titulo: c.titulo,
        criadoEm: c.criadoEm,
        atualizadoEm: c.atualizadoEm,
        preview: c.mensagens[0]?.conteudo?.slice(0, 120) || null,
    }));
};

const criarConversa = async (usuarioId, { titulo } = {}) => {
    return prisma.conversaChat.create({
        data: {
            usuarioId,
            titulo: titulo ? tituloFromMensagem(titulo) : 'Nova conversa',
        },
        select: {
            id: true,
            titulo: true,
            criadoEm: true,
            atualizadoEm: true,
        },
    });
};

const obterConversa = async (usuarioId, conversaId) => {
    const conversa = await prisma.conversaChat.findFirst({
        where: { id: conversaId, usuarioId },
        select: {
            id: true,
            titulo: true,
            criadoEm: true,
            atualizadoEm: true,
            mensagens: {
                orderBy: { criadoEm: 'asc' },
                select: {
                    id: true,
                    papel: true,
                    conteudo: true,
                    criadoEm: true,
                },
            },
        },
    });
    if (!conversa) {
        throw new AppError('Conversa não encontrada.', 404);
    }
    return {
        id: conversa.id,
        titulo: conversa.titulo,
        criadoEm: conversa.criadoEm,
        atualizadoEm: conversa.atualizadoEm,
        mensagens: conversa.mensagens.map((m) => ({
            id: m.id,
            role: m.papel === 'assistant' ? 'assistant' : 'user',
            content: m.conteudo,
            at: m.criadoEm,
        })),
    };
};

const excluirConversa = async (usuarioId, conversaId) => {
    await assertConversaDoUsuario(usuarioId, conversaId);
    await prisma.conversaChat.delete({ where: { id: conversaId } });
    return { ok: true };
};

const carregarHistoricoDb = async (conversaId) => {
    const msgs = await prisma.mensagemChat.findMany({
        where: { conversaId },
        orderBy: { criadoEm: 'asc' },
        take: 40,
        select: { papel: true, conteudo: true },
    });
    return msgs.map((m) => ({
        role: m.papel === 'assistant' ? 'assistant' : 'user',
        content: m.conteudo,
    }));
};

const enviarMensagem = async (
    usuarioId,
    { mensagem, historico = [], modo = 'chat', conversaId = null }
) => {
    chatbotGeminiProvider.ensureConfigured();

    let conversa = null;
    if (conversaId) {
        conversa = await assertConversaDoUsuario(usuarioId, conversaId);
    } else {
        conversa = await criarConversa(usuarioId, { titulo: mensagem });
    }

    if (looksOffTopic(mensagem)) {
        await prisma.$transaction([
            prisma.mensagemChat.create({
                data: {
                    conversaId: conversa.id,
                    usuarioId,
                    papel: 'user',
                    conteudo: mensagem,
                },
            }),
            prisma.mensagemChat.create({
                data: {
                    conversaId: conversa.id,
                    usuarioId,
                    papel: 'assistant',
                    conteudo: RECUSA_PADRAO,
                },
            }),
            prisma.conversaChat.update({
                where: { id: conversa.id },
                data: {
                    titulo:
                        conversa.titulo === 'Nova conversa'
                            ? tituloFromMensagem(mensagem)
                            : conversa.titulo,
                    atualizadoEm: new Date(),
                },
            }),
        ]);
        return {
            conversaId: conversa.id,
            resposta: RECUSA_PADRAO,
            recusada: true,
            propostaTransacao: null,
        };
    }

    const historicoDb = await carregarHistoricoDb(conversa.id);
    const historicoEfetivo = historicoDb.length ? historicoDb : historico;

    const contexto = await chatbotContextService.buildUserFinanceContext(usuarioId);
    const modoHint =
        modo === 'quick_add'
            ? '\nModo atual: quick-add — priorize interpretar um lançamento e devolver PROPOSTA_TX se possível.'
            : '';

    const system = `${SYSTEM_PROMPT}${modoHint}\n\nCONTEXTO DO USUÁRIO:\n${contexto.texto}`;

    const raw = await chatbotGeminiProvider.generateChatReply({
        system,
        contents: toGeminiContents(historicoEfetivo, mensagem),
    });

    const { limpa, proposta } = extractProposta(raw);
    const resposta = limpa || RECUSA_PADRAO;
    const recusada = resposta.includes('Só posso ajudar com suas finanças');

    let propostaTransacao = null;
    if (proposta && !recusada) {
        const cat = contexto.categorias.find(
            (c) =>
                c.tipo === proposta.tipo &&
                (proposta.categoriaId
                    ? c.id === proposta.categoriaId
                    : proposta.categoriaNome &&
                      c.nome.toLowerCase() === String(proposta.categoriaNome).toLowerCase())
        );
        propostaTransacao = {
            tipo: proposta.tipo,
            valor: proposta.valor,
            descricao: proposta.descricao || mensagem.slice(0, 120),
            recurso: ['DINHEIRO', 'VA', 'VR', 'VT', 'POUPANCA'].includes(proposta.recurso)
                ? proposta.recurso
                : 'DINHEIRO',
            data: new Date().toISOString(),
            categoriaId: cat?.id || null,
            categoriaNome: cat?.nome || proposta.categoriaNome || null,
        };
    }

    await prisma.$transaction([
        prisma.mensagemChat.create({
            data: {
                conversaId: conversa.id,
                usuarioId,
                papel: 'user',
                conteudo: mensagem,
            },
        }),
        prisma.mensagemChat.create({
            data: {
                conversaId: conversa.id,
                usuarioId,
                papel: 'assistant',
                conteudo: resposta,
            },
        }),
        prisma.conversaChat.update({
            where: { id: conversa.id },
            data: {
                titulo:
                    conversa.titulo === 'Nova conversa'
                        ? tituloFromMensagem(mensagem)
                        : conversa.titulo,
                atualizadoEm: new Date(),
            },
        }),
    ]);

    return {
        conversaId: conversa.id,
        resposta,
        recusada,
        propostaTransacao,
    };
};

const confirmarTransacao = async (usuarioId, dados) => {
    let categoriaId = dados.categoriaId;
    if (!categoriaId && dados.categoriaNome) {
        const cat = await prisma.categoria.findFirst({
            where: {
                OR: [{ usuarioId }, { usuarioId: null }],
                nome: { equals: dados.categoriaNome, mode: 'insensitive' },
                tipo: dados.tipo,
            },
            select: { id: true },
        });
        categoriaId = cat?.id;
    }
    if (!categoriaId) {
        const fallback = await prisma.categoria.findFirst({
            where: {
                OR: [{ usuarioId }, { usuarioId: null }],
                tipo: dados.tipo,
            },
            orderBy: { nome: 'asc' },
            select: { id: true },
        });
        categoriaId = fallback?.id;
    }
    if (!categoriaId) {
        throw new AppError('Não há categoria compatível para confirmar o lançamento.', 400);
    }

    const transacao = await transactionService.criarTransacao(usuarioId, {
        tipo: dados.tipo,
        valor: dados.valor,
        descricao: dados.descricao,
        recurso: dados.recurso || 'DINHEIRO',
        data: dados.data || new Date(),
        categoriaId,
        tags: [],
        recorrente: false,
    });

    return transacao;
};

module.exports = {
    enviarMensagem,
    confirmarTransacao,
    listarSugestoes,
    listarConversas,
    criarConversa,
    obterConversa,
    excluirConversa,
    RECUSA_PADRAO,
    looksOffTopic,
};
