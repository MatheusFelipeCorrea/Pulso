---
card_id: PULSO-TASK-116
title: "QA — testes de planejamento de compra"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-057
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de planejamento de compra

> **Contexto:** Regressão para utils, service e fluxo comprar/meta.

## 📝 Descrição

Implementar suites unitárias API e Web.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/purchasePlanningUtils.test.js` | parcela, comprometimento, meses, inferirCategoria |
| `unit/services/purchasePlanningService.test.js` | painel, CRUD, comprar, RN-093, sobra 3 meses |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/purchasePlanningUtils.test.js` | `shouldShowImpactAlert` e helpers |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
