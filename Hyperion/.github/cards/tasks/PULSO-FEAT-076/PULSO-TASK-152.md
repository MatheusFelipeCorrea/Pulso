---
card_id: PULSO-TASK-152
title: "QA — testes de insights inteligentes"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-076
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de insights inteligentes

> **Contexto:** Regressão com Gemini mockado.

## 📝 Descrição

Suites unitárias API/Web sem chamada real à Google.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/providers/geminiInsightsProvider.test.js` | 503 sem chave; parse JSON |
| `unit/services/insightContextBuilder.test.js` | Isolamento usuarioId; agregados |
| `unit/utils/insightProjectionUtils.test.js` | 3 cenários; diasAteNegativo |
| `unit/services/insightGenerationService.test.js` | Validação schema; cota regenerar; fallback |
| `unit/services/financialHealthService.test.js` | Score faixas |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/insightsService.test.js` | HTTP client |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
