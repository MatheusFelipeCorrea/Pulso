const env = require('../config/env');
const AppError = require('../utils/appError');

const buildGeminiUrl = (model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const ensureConfigured = () => {
    if (!env.GEMINI_API_KEY_CHATBOT) {
        throw new AppError(
            'Chatbot indisponível: configure GEMINI_API_KEY_CHATBOT (ou GEMINI_API_KEY_PDF) no servidor.',
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
            'Cota do Gemini do chatbot esgotada. Tente novamente em alguns minutos.',
            429
        );
    }

    if (/no longer available|not found|does not exist/i.test(message)) {
        throw new AppError(
            `Modelo Gemini do chatbot indisponível (${env.GEMINI_CHATBOT_MODEL}). Ajuste GEMINI_CHATBOT_MODEL no .env.`,
            502
        );
    }

    throw new AppError(`Falha no chatbot: ${String(message).slice(0, 200)}`, 502);
};

/**
 * @param {{ system: string, contents: Array<{ role: 'user'|'model', parts: Array<{ text: string }> }> }} payload
 * @returns {Promise<string>}
 */
const generateChatReply = async ({ system, contents }) => {
    ensureConfigured();

    const model = env.GEMINI_CHATBOT_MODEL;
    const response = await fetch(`${buildGeminiUrl(model)}?key=${env.GEMINI_API_KEY_CHATBOT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1024,
            },
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        parseGeminiError(response.status, detail);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join('')
        ?.trim();
    if (!text) {
        throw new AppError('O chatbot não retornou uma resposta útil. Tente de novo.', 502);
    }
    return text;
};

module.exports = {
    generateChatReply,
    ensureConfigured,
};
