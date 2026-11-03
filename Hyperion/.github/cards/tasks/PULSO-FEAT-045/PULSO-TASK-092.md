---
card_id: PULSO-TASK-092
title: "QA — testes unitários e E2E de grupos"
status: "In Revision"
type: Task
priority: Medium
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-045
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários e E2E de grupos

> **Contexto:** Regressão para convites, membros, viagem, metas e RF-091.

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
| `unit/utils/groupDetailUtils.test.js` | `calcularSaldosViagem` RF-091 |
| `unit/utils/groupInvite.test.js` | Link convite |

### E2E — `web/e2e/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `groups.spec.js` | Login demo + modal criar grupo |

## 👤 Responsáveis

- Alice Shikida (`aliceshikida`)
- Maria Clara (`mariaoliveira27`)
- Matheus Felipe Correa (`MatheusFelipeCorrea`)


## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
