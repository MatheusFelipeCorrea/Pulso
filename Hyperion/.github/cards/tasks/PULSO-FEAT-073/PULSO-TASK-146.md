---
card_id: PULSO-TASK-146
title: "Backend — prompt e orquestração generateInsights"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-073
due_date: null
categories:
  - Backend
  - Inteligência Artificial
---

# [TASK] Backend — prompt e orquestração generateInsights

> **Contexto:** Montar prompt, chamar provider e validar JSON (RF-044+).

## 📝 Descrição

Implementar orquestrador principal de geração.

## 🛠️ Implementação

### `services/insightGenerationService.js` (NOVO — CRIAR)

1. `buildContext` + score + projeções + alertas
2. Montar system prompt (PT-BR, só finanças do usuário, schema JSON fixo)
3. `geminiInsightsProvider.generateInsightsJson`
4. Validar/normalizar campos (Zod schema)
5. Merge: preferir números determinísticos de score/projeção; LLM narra e sugere
6. Salvar `InsightSnapshot`; notificar `INSIGHT_IA`

Fallback se Gemini falhar: painel parcial só com regras (score + projeções + alerta simples), `geradoPor: 'regras'|'hibrido'`.

Substituir conteúdo de `insightService.js` legado (maior gasto) ou delegar a este fluxo.

## 📋 Resumo

### ✅ Concluído
- Pipeline de geração definido

### ⏳ Pendente
- Implementar orquestração + validação
