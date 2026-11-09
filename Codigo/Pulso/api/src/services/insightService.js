const prisma = require('../config/database');
const AppError = require('../utils/appError');
const notificationService = require('./notificationService');
const { todayInTimezone } = require('../utils/dateTimezone');
const insightContextService = require('./insightContextService');
const insightEngines = require('./insightEngines');
const geminiInsightsProvider = require('../providers/geminiInsightsProvider');

const REGEN_LIMIT = 3;

const SYSTEM_PROMPT = `Você é o motor de Insights Inteligentes do app Pulso (Brasil).
Responda APENAS com JSON válido (sem markdown) no schema:
{
  "resumoMensal": "texto PT-BR curto (2-4 frases)",
  "variacaoCategorias": [{ "categoria": "", "percentual": 0, "comentario": "" }],
  "sugestoes": [{ "id": "s1", "titulo": "", "descricao": "", "impactoEstimado": "", "acaoPath": "/budget" }],
  "educacao": [{ "tipo": "artigo"|"youtube"|"instagram"|"perfil", "titulo": "", "url": "https://...", "motivo": "", "verificarUrl": false }]
}
Regras:
- Use SOMENTE os números do CONTEXTO; não invente saldos ou gastos.
- Sugestões concretas e rastreáveis (categoria/descrição quando existir).
- educacao: 2 a 4 itens alinhados ao perfil; URLs preferencialmente conhecidas (BCB, Serasa Educa, YouTube finanças).
- Se faltar dado, diga no resumo sem inventar.`;

const mesAtual = () => todayInTimezone().slice(0, 7);

const normalizarMes = (mes) => {
    if (!mes) return mesAtual();
    if (!/^\d{4}-\d{2}$/.test(mes)) {
        throw new AppError('Mês inválido. Use YYYY-MM.', 400);
    }
    return mes;
};

const montarPayloadBase = (ctx) => {
    const score = insightEngines.calcularScore(ctx);
    const { projecoes, diasAteNegativo } = insightEngines.calcularProjecoes(ctx);
    const alertas = insightEngines.calcularAlertas(ctx);
    return {
        mesReferencia: ctx.mesReferencia,
        resumoMensal: insightEngines.resumoFallback(ctx),
        variacaoCategorias: (ctx.variacaoCategorias || []).map((c) => ({
            categoria: c.categoria,
            percentual: c.percentual,
            atual: c.atual,
            anterior: c.anterior,
            comentario: null,
        })),
        score,
        projecoes,
        diasAteNegativo,
        sugestoes: [],
        alertas,
        educacao: [],
        fluxo: ctx.fluxoMes,
        geradoEm: new Date().toISOString(),
    };
};

const mergeGemini = (base, llm) => {
    if (!llm || typeof llm !== 'object') return base;

    if (typeof llm.resumoMensal === 'string' && llm.resumoMensal.trim()) {
        base.resumoMensal = llm.resumoMensal.trim();
    }

    if (Array.isArray(llm.variacaoCategorias) && llm.variacaoCategorias.length) {
        const byName = new Map(
            llm.variacaoCategorias.map((c) => [String(c.categoria || '').toLowerCase(), c])
        );
        base.variacaoCategorias = base.variacaoCategorias.map((c) => {
            const hit = byName.get(c.categoria.toLowerCase());
            return {
                ...c,
                comentario: hit?.comentario || c.comentario,
                percentual:
                    typeof hit?.percentual === 'number' ? hit.percentual : c.percentual,
            };
        });
    }

    if (Array.isArray(llm.sugestoes)) {
        base.sugestoes = llm.sugestoes
            .filter((s) => s && (s.titulo || s.descricao))
            .slice(0, 5)
            .map((s, i) => ({
                id: s.id || `s${i + 1}`,
                titulo: String(s.titulo || 'Sugestão').slice(0, 120),
                descricao: String(s.descricao || '').slice(0, 400),
                impactoEstimado: s.impactoEstimado ? String(s.impactoEstimado).slice(0, 80) : null,
                acaoPath: typeof s.acaoPath === 'string' ? s.acaoPath : '/budget',
            }));
    }

    if (Array.isArray(llm.educacao)) {
        base.educacao = llm.educacao
            .filter((e) => e && e.titulo && e.url)
            .slice(0, 4)
            .map((e) => ({
                tipo: ['artigo', 'youtube', 'instagram', 'perfil'].includes(e.tipo)
                    ? e.tipo
                    : 'artigo',
                titulo: String(e.titulo).slice(0, 140),
                url: String(e.url).slice(0, 500),
                motivo: e.motivo ? String(e.motivo).slice(0, 240) : null,
                verificarUrl: Boolean(e.verificarUrl),
            }));
    }

    return base;
};

const persistirScore = async (usuarioId, score) => {
    await prisma.historicoScore.create({
        data: {
            usuarioId,
            score: score.valor,
            detalhes: {
                label: score.label,
                checklist: score.checklist,
                fatores: score.fatores,
            },
        },
    });
};

const notificarInsight = async (usuarioId, mesReferencia, geradoPor) => {
    try {
        await notificationService.criarNotificacao(usuarioId, {
            tipo: 'INSIGHT_IA',
            titulo: 'Insights Inteligentes',
            mensagem: `Seu painel de ${mesReferencia} está pronto para revisão.`,
            linkAcao: '/insights',
            metadados: { mesReferencia, geradoPor },
        });
    } catch {
        /* não bloqueia geração */
    }
};

const gerarInsights = async (usuarioId, { mesReferencia, forcar = false } = {}) => {
    const mes = normalizarMes(mesReferencia);
    const existente = await prisma.insightSnapshot.findUnique({
        where: {
            usuarioId_mesReferencia: { usuarioId, mesReferencia: mes },
        },
    });

    if (existente && !forcar) {
        return {
            ...existente.payload,
            regeneracoes: existente.regeneracoes,
            geradoPor: existente.geradoPor,
            atualizadoEm: existente.atualizadoEm,
            fromCache: true,
        };
    }

    if (forcar && existente && existente.regeneracoes >= REGEN_LIMIT) {
        throw new AppError(
            `Limite de ${REGEN_LIMIT} regenerações neste mês atingido. Tente no próximo mês.`,
            429
        );
    }

    const ctx = await insightContextService.buildInsightContext(usuarioId, mes);
    let payload = montarPayloadBase(ctx);
    let geradoPor = 'regras';

    try {
        geminiInsightsProvider.ensureConfigured();
        const llm = await geminiInsightsProvider.generateInsightsJson({
            system: SYSTEM_PROMPT,
            userPrompt: `CONTEXTO DO USUÁRIO:\n${ctx.texto}\n\nScore já calculado: ${payload.score.valor} (${payload.score.label}).\nGere o JSON de Insights.`,
        });
        payload = mergeGemini(payload, llm);
        geradoPor = 'gemini';
    } catch (err) {
        if (err instanceof AppError && (err.statusCode === 503 || err.statusCode === 429)) {
            if (!existente) {
                /* fallback regras ok */
            } else if (forcar) {
                throw err;
            }
        } else if (forcar && !(err instanceof AppError && err.statusCode === 502)) {
            throw err;
        }
        /* mantém payload regras */
    }

    payload.geradoPor = geradoPor;
    payload.geradoEm = new Date().toISOString();

    await persistirScore(usuarioId, payload.score);

    const regeneracoes = forcar ? (existente?.regeneracoes || 0) + 1 : existente?.regeneracoes || 0;

    const saved = await prisma.insightSnapshot.upsert({
        where: {
            usuarioId_mesReferencia: { usuarioId, mesReferencia: mes },
        },
        create: {
            usuarioId,
            mesReferencia: mes,
            payload,
            geradoPor,
            regeneracoes,
        },
        update: {
            payload,
            geradoPor,
            regeneracoes,
        },
    });

    if (!existente || forcar) {
        await notificarInsight(usuarioId, mes, geradoPor);
    }

    return {
        ...saved.payload,
        regeneracoes: saved.regeneracoes,
        geradoPor: saved.geradoPor,
        atualizadoEm: saved.atualizadoEm,
        fromCache: false,
        cotaRegeneracao: { usadas: saved.regeneracoes, limite: REGEN_LIMIT },
    };
};

const obterInsights = async (usuarioId, mesReferencia) => {
    const mes = normalizarMes(mesReferencia);
    const existente = await prisma.insightSnapshot.findUnique({
        where: {
            usuarioId_mesReferencia: { usuarioId, mesReferencia: mes },
        },
    });

    if (existente) {
        return {
            ...existente.payload,
            regeneracoes: existente.regeneracoes,
            geradoPor: existente.geradoPor,
            atualizadoEm: existente.atualizadoEm,
            fromCache: true,
            cotaRegeneracao: { usadas: existente.regeneracoes, limite: REGEN_LIMIT },
        };
    }

    return gerarInsights(usuarioId, { mesReferencia: mes, forcar: false });
};

const regenerarInsights = async (usuarioId, mesReferencia) =>
    gerarInsights(usuarioId, { mesReferencia, forcar: true });

const obterScore = async (usuarioId) => {
    const historico = await prisma.historicoScore.findMany({
        where: { usuarioId },
        orderBy: { criadoEm: 'desc' },
        take: 14,
        select: { score: true, detalhes: true, criadoEm: true },
    });

    if (!historico.length) {
        const insights = await obterInsights(usuarioId);
        return {
            atual: insights.score,
            historico: [],
        };
    }

    const atual = historico[0];
    return {
        atual: {
            valor: atual.score,
            label: atual.detalhes?.label || insightEngines.labelScore(atual.score),
            checklist: atual.detalhes?.checklist || [],
            fatores: atual.detalhes?.fatores || {},
        },
        historico: historico.map((h) => ({
            score: h.score,
            criadoEm: h.criadoEm,
            label: h.detalhes?.label || null,
        })),
    };
};

/** Mantém compatibilidade com transactionService (não bloqueia mais após 1 insight). */
const tentarGerarInsightAposTransacao = async (usuarioId) => {
    try {
        const mes = mesAtual();
        const existente = await prisma.insightSnapshot.findUnique({
            where: {
                usuarioId_mesReferencia: { usuarioId, mesReferencia: mes },
            },
        });
        if (existente) return null;
        return await gerarInsights(usuarioId, { mesReferencia: mes, forcar: false });
    } catch {
        return null;
    }
};

const gerarInsightParaUsuario = async (usuarioId) =>
    gerarInsights(usuarioId, { forcar: false });

const gerarInsightsMensaisParaTodos = async () => {
    const usuarios = await prisma.usuario.findMany({
        select: { id: true },
        take: 500,
    });
    let ok = 0;
    let fail = 0;
    for (const u of usuarios) {
        try {
            await gerarInsights(u.id, { forcar: false });
            ok += 1;
        } catch {
            fail += 1;
        }
    }
    return { ok, fail, total: usuarios.length };
};

module.exports = {
    obterInsights,
    regenerarInsights,
    obterScore,
    gerarInsights,
    gerarInsightParaUsuario,
    tentarGerarInsightAposTransacao,
    gerarInsightsMensaisParaTodos,
    REGEN_LIMIT,
};
