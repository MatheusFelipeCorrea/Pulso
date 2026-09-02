---
card_id: "PULSO-TASK-140"
title: "QA — testes de dívidas"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-069"
due_date: null
board_sync_at: "2026-08-26T15:29:04.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] QA — testes de dívidas

> **Contexto:** Regressão para saldo, pagamentos, alertas e badges.

## 📝 Descrição

Implementar suites unitárias API e Web.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/debtService.test.js` | CRUD, pagar, quitar, reabrir, excluir pagamento |
| `unit/services/debtAlertService.test.js` | dias 7/2/0, dedup |
| `unit/utils/debtMapper.test.js` | mapDivida saldo |
| `unit/jobs/debtCleanupJob.test.js` | retenção 180d |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/debtBalanceUtils.test.js` | saldo client |
| `unit/utils/debtStatusUtils.test.js` | badge vencida |
| `unit/utils/debtFilters.test.js` | tabs/filtros |
| `unit/services/debtService.test.js` | HTTP client |
| `unit/components/debtDetailsModal.test.js` | modal detalhes |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
