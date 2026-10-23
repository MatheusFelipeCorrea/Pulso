const AppError = require('../utils/appError');
const env = require('../config/env');
const { extractPdfText } = require('./extractPdfText');
const { normalizeDescricao, inferTipoFromDescricaoBeneficio } = require('./importParseUtils');
const { parseMultibeneficiosText, extractSaldoExtratoFromText } = require('./multibeneficiosPdfParser');
const { parseContaText, extractSaldoExtratoFromContaText } = require('./contaPdfParser');

const parsePdfLocal = (text) => {
    const beneficio = parseMultibeneficiosText(text);
    if (beneficio?.linhas?.length) return beneficio;

    const conta = parseContaText(text);
    if (conta?.linhas?.length) return conta;

    if (beneficio?.saldoExtrato) return beneficio;
    if (conta?.saldoExtrato) return conta;

    return null;
};

const extractSaldoFromText = (text) =>
    extractSaldoExtratoFromText(text) ?? extractSaldoExtratoFromContaText(text);

const parsePdfWithGeminiText = async (text) => {
    if (!env.GEMINI_API_KEY_PDF) {
        throw new AppError(
            'Importação de PDF requer GEMINI_API_KEY_PDF configurada no servidor',
            503
        );
    }

    const model = env.GEMINI_PDF_MODEL;
    const response = await fetch(`${buildGeminiUrl(model)}?key=${env.GEMINI_API_KEY_PDF}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: `${buildPrompt()}\n\nTexto extraído do PDF:\n${text.slice(0, 120000)}` },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json',
            },
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        parseGeminiError(response.status, detail);
    }

    const payload = await response.json();
    const responseText =
        payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') ?? '';
    const parsed = extractJson(responseText);
    const transacoes = Array.isArray(parsed.transacoes) ? parsed.transacoes : [];

    const linhas = transacoes
        .map((item) => {
            const data = item?.data ? new Date(`${item.data}T12:00:00`) : null;
            const valor = Number(item?.valor);
            if (!data || Number.isNaN(data.getTime()) || !Number.isFinite(valor) || valor === 0) {
                return null;
            }
            const descricao = normalizeDescricao(item.descricao);
            const tipoInferido = inferTipoFromDescricaoBeneficio(descricao, item.tipo ?? '');
            const tipo =
                tipoInferido === 'RECEITA' || item.tipo === 'RECEITA' ? 'RECEITA' : 'DESPESA';
            return {
                data: data.toISOString(),
                valor: Math.abs(valor).toFixed(2),
                descricao,
                tipo,
            };
        })
        .filter(Boolean);

    return { linhas, parser: 'pdf-gemini-text' };
};

const buildGeminiUrl = (model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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
            'Cota do Gemini esgotada ou modelo indisponível no plano gratuito. Tente mais tarde, use CSV/OFX, ou ajuste GEMINI_PDF_MODEL no .env (ex.: gemini-3.5-flash-lite).',
            429
        );
    }

    if (/no longer available|not found|does not exist/i.test(message)) {
        throw new AppError(
            `Modelo Gemini indisponível (${env.GEMINI_PDF_MODEL}). Atualize GEMINI_PDF_MODEL no .env — sugestão: gemini-3.1-flash-lite.`,
            502
        );
    }

    throw new AppError(`Falha ao ler PDF com IA: ${message.slice(0, 200)}`, 502);
};

const buildPrompt = () =>
    `Você extrai transações financeiras de extratos brasileiros em PDF (bancos e benefícios VA/VR/VT).
Retorne APENAS JSON válido (sem markdown) no formato:
{"transacoes":[{"data":"YYYY-MM-DD","valor":123.45,"descricao":"texto","tipo":"DESPESA"|"RECEITA"}]}
Regras:
- valor sempre positivo; tipo indica se é receita ou despesa
- ignore saldos totais e cabeçalhos (ex.: "Saldo total das carteiras")
- em extratos Multibenefícios/Alelo/Sodexo:
  - "Compra no Refeição/Alimentação" = DESPESA
  - "Saldo liberado", "DISPONIBILIZACAO DE VALOR", recargas e créditos = RECEITA (não omitir)
- se não encontrar transações, retorne {"transacoes":[]}`;

const extractJson = (text) => {
    const trimmed = text.trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1].trim() : trimmed;
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start < 0 || end < 0) {
        throw new AppError('Não foi possível interpretar a resposta da IA para o PDF', 422);
    }
    return JSON.parse(candidate.slice(start, end + 1));
};

const parsePdfWithGemini = async (buffer) => {
    if (!env.GEMINI_API_KEY_PDF) {
        throw new AppError(
            'Importação de PDF requer GEMINI_API_KEY_PDF configurada no servidor',
            503
        );
    }

    const base64 = buffer.toString('base64');
    const model = env.GEMINI_PDF_MODEL;
    const response = await fetch(`${buildGeminiUrl(model)}?key=${env.GEMINI_API_KEY_PDF}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: buildPrompt() },
                        { inline_data: { mime_type: 'application/pdf', data: base64 } },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json',
            },
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        parseGeminiError(response.status, detail);
    }

    const payload = await response.json();
    const text =
        payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') ?? '';
    const parsed = extractJson(text);
    const transacoes = Array.isArray(parsed.transacoes) ? parsed.transacoes : [];

    const linhas = transacoes
        .map((item) => {
            const data = item?.data ? new Date(`${item.data}T12:00:00`) : null;
            const valor = Number(item?.valor);
            if (!data || Number.isNaN(data.getTime()) || !Number.isFinite(valor) || valor === 0) {
                return null;
            }
            const descricao = normalizeDescricao(item.descricao);
            const tipoInferido = inferTipoFromDescricaoBeneficio(descricao, item.tipo ?? '');
            const tipo =
                tipoInferido === 'RECEITA' || item.tipo === 'RECEITA' ? 'RECEITA' : 'DESPESA';
            return {
                data: data.toISOString(),
                valor: Math.abs(valor).toFixed(2),
                descricao,
                tipo,
            };
        })
        .filter(Boolean);

    return { linhas, parser: 'pdf-gemini' };
};

const parsePdf = async (buffer) => {
    let text = null;
    try {
        text = await extractPdfText(buffer);
        const local = parsePdfLocal(text);
        if (local?.linhas?.length) {
            return local;
        }
        if (local?.saldoExtrato) {
            try {
                const gemini = await parsePdfWithGemini(buffer);
                if (gemini?.linhas?.length) {
                    return { ...gemini, saldoExtrato: local.saldoExtrato, parser: 'pdf-gemini+saldo-local' };
                }
            } catch {
                const geminiText = await parsePdfWithGeminiText(text);
                if (geminiText?.linhas?.length) {
                    return {
                        ...geminiText,
                        saldoExtrato: local.saldoExtrato,
                        parser: 'pdf-gemini-text+saldo-local',
                    };
                }
            }
            return local;
        }
    } catch {
        // fallback para Gemini quando extração local falhar
    }

    if (text) {
        try {
            const geminiText = await parsePdfWithGeminiText(text);
            const saldoExtrato = extractSaldoFromText(text);
            if (saldoExtrato) {
                return { ...geminiText, saldoExtrato, parser: 'pdf-gemini-text+saldo-local' };
            }
            if (geminiText?.linhas?.length) return geminiText;
        } catch {
            // tenta PDF binário abaixo
        }
    }

    try {
        const gemini = await parsePdfWithGemini(buffer);
        if (text) {
            const saldoExtrato = extractSaldoFromText(text);
            if (saldoExtrato) {
                return { ...gemini, saldoExtrato, parser: 'pdf-gemini+saldo-local' };
            }
        }
        return gemini;
    } catch (error) {
        if (text) {
            const local = parsePdfLocal(text);
            if (local?.linhas?.length || local?.saldoExtrato) {
                return local;
            }
            throw new AppError(
                'Não foi possível interpretar o PDF. O texto foi extraído, mas nenhuma transação foi reconhecida.',
                422
            );
        }
        throw error;
    }
};

module.exports = { parsePdf };
