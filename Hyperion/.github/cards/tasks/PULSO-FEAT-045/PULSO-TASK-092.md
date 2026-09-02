---
card_id: "PULSO-TASK-092"
title: "QA — testes unitários e E2E de grupos"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-045"
due_date: null
board_sync_at: "2026-08-26T15:32:20.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] QA — testes unitários e E2E de grupos

> **Contexto:** Regressão para convites, membros, viagem, metas e RF-095.

## 📝 Descrição

Implementar suites API, Web e Playwright.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/grupoService.test.js` | CRUD, entrar, membros, metas |
| `unit/services/grupoImageStorageService.test.js` | Upload |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/grupoService.test.js` | HTTP client |
| `unit/utils/groupDetailUtils.test.js` | `calcularSaldosViagem` RF-095 |
| `unit/utils/groupInvite.test.js` | Link convite |

### E2E — `web/e2e/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `groups.spec.js` | Login demo + modal criar grupo |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
