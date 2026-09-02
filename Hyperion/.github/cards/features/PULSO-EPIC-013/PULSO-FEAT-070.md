---
card_id: "PULSO-FEAT-070"
title: "Provider Gemini Insights e configuração"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-013"
due_date: null
board_sync_at: "2026-08-26T15:30:42.000Z"
categories:
  - "Backend"
  - "Integração Externa"
  - "Inteligência Artificial"
---


# [FEATURE] Provider Gemini Insights e configuração

> **Contexto:** Isolar a chave/modelo de Insights do fluxo de PDF (RF-NOVO-I2).

## 📝 Descrição

Criar provider HTTP Gemini dedicado a insights, espelhando o padrão de `pdfParser` (`generativelanguage.googleapis.com/v1beta/...:generateContent`).

## ✅ Critérios de Aceite

| Variável | Papel |
|----------|-------|
| `GEMINI_API_KEY_INSIGHTS` | API key exclusiva de Insights (obrigatória para gerar) |
| `GEMINI_INSIGHTS_MODEL` | Default alinhado ao PDF (ex.: `gemini-3.1-flash-lite`) |

- `env.js` + `.env.example` documentados (seção separada da de PDF)
- Sem chave → `503` com mensagem clara (igual PDF)
- `responseMimeType: application/json` + temperature baixa/moderada
- Erros de cota/modelo com mensagens orientadas (reaproveitar padrão `parseGeminiError` do PDF)
- **Não** reutilizar `GEMINI_API_KEY_PDF` neste fluxo

## 🔗 Sub-issues

- PULSO-TASK-141

## 📋 Resumo

### ✅ Concluído
- Contrato de env e provider definido

### ⏳ Pendente
- PULSO-TASK-141 — provider + env
