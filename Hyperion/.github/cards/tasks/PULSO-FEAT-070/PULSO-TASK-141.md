---
card_id: "PULSO-TASK-141"
title: "Backend — geminiInsightsProvider e env"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-070"
due_date: null
board_sync_at: "2026-08-26T15:29:05.000Z"
categories:
  - "Backend"
  - "Integração Externa"
  - "Inteligência Artificial"
---


# [TASK] Backend — geminiInsightsProvider e env

> **Contexto:** Chave/modelo Insights separados do PDF (RF-NOVO-I2).

## 📝 Descrição

Configurar env e provider HTTP Gemini para insights.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `config/env.js` | `GEMINI_API_KEY_INSIGHTS`, `GEMINI_INSIGHTS_MODEL` (default flash-lite) |
| `.env.example` | Seção `# 🤖 GOOGLE GEMINI — insights` |
| `providers/geminiInsightsProvider.js` | `generateInsightsJson({ systemPrompt, userPayload })` |

Espelhar `pdfParser`: URL `.../v1beta/models/{model}:generateContent`, `responseMimeType: application/json`, tratamento 429/404 de modelo.

**Não** usar `GEMINI_API_KEY_PDF` neste provider.

## 📋 Resumo

### ✅ Concluído
- Padrão PDF → Insights documentado

### ⏳ Pendente
- Implementar provider e env
