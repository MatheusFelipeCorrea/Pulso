---
card_id: PULSO-TASK-128
title: "QA — testes de divisão de despesas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-063
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de divisão de despesas

> **Contexto:** Regressão para rateio, pagamentos, lembrete e cleanup.

## 📝 Descrição

Implementar suites unitárias API e Web.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/expenseSplitUtils.test.js` | splitEqual resto centavos; soma personalizada |
| `unit/utils/expenseSplitMapper.test.js` | mapDivisao / pagador |
| `unit/services/expenseSplitService.test.js` | CRUD, pagar, resumo, lembrete, excluir |
| `unit/jobs/expenseSplitCleanupJob.test.js` | retenção 180 dias |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/expenseSplitUtils.test.js` | helpers UI |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
