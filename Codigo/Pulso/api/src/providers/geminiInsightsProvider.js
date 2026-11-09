const env = require('../config/env');
const AppError = require('../utils/appError');

const buildGeminiUrl = (model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const ensureConfigured = () => {
    if (!env.GEMINI_API_KEY_INSIGHTS) {
        throw new AppError(
            'Insights indisponíveis: configure GEMINI_API_KEY_INSIGHTS (ou GEMINI_API_KEY_PDF) no servidor.',
            503
        );
    }
};

const parseGeminiError = (status, detail) => {
    let payload;
    try {
        payload = JSON.parse(detail);
    } catch {
        payload = null;
    }

    const code = payload?.error?.code ?? status;
    const message = payload?.error?.message ?? detail;

    if (code === 429) {
        throw new AppError(
            'Cota do Gemini de Insights esgotada. Tente novamente mais tarde.',
            429
        );
    }

    if (/no longer available|not found|does not exist/i.test(message)) {
        throw new AppError(
            `Modelo Gemini de Insights indisponível (${env.GEMINI_INSIGHTS_MODEL}). Ajuste GEMINI_INSIGHTS_MODEL (ou GEMINI_PDF_MODEL) no .env.`,
            502
        );
    }

    throw new AppError(`Falha nos Insights: ${String(message).slice(0, 200)}`, 502);
};

/**
 * @param {{ system: string, userPrompt: string }} payload
 * @returns {Promise<object>}
 */
const generateInsightsJson = async ({ system, userPrompt }) => {
    ensureConfigured();

    const model = env.GEMINI_INSIGHTS_MODEL;
    const response = await fetch(`${buildGeminiUrl(model)}?key=${env.GEMINI_API_KEY_INSIGHTS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 4096,
                responseMimeType: 'application/json',
            },
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        parseGeminiError(response.status, detail);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')?.trim();
    if (!text) {
        throw new AppError('O Gemini não retornou Insights úteis. Tente regenerar.', 502);
    }

    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch {
                /* fallthrough */
            }
        }
        throw new AppError('Resposta de Insights em formato inválido.', 502);
    }
};

module.exports = {
    ensureConfigured,
    generateInsightsJson,
};
