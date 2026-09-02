---
card_id: "PULSO-TASK-024"
title: "QA — testes dashboard e importação"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-002"
due_date: null
board_sync_at: "2026-08-26T15:30:50.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] QA — testes dashboard e importação

> **Contexto:** Cobertura de regressão para agregação e fluxo de import.

## 📝 Descrição

Garantir testes unitários para `dashboardService`, utils de import e smoke dos serviços web.

## ✅ Critérios de Aceite

**Quando** `npm test` na API,  
**Então** suites passam para `importService`, `importHashUtils`, `importBeneficioUtils`.

**Quando** `dashboardService.test.js` existir,  
**Então** cobre saldo total, alertas filtrados, score saúde e variação percentual.

## 🛠️ Implementação

### API — criar em `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/dashboardService.test.js` | Agregação, saúde financeira, saldos |
| `unit/services/importService.test.js` | Analyze, confirm, dedupe, saldo |
| `unit/utils/importHashUtils.test.js` | Hash estável |
| `unit/utils/importBeneficioUtils.test.js` | Regras benefício/ajuste |

### Web — criar (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/dashboardService.test.js` | Chamada GET /dashboard |
| `unit/services/importService.test.js` | Upload mock |

## 📋 Resumo

### ✅ Concluído
- Escopo de testes mapeado por camada

### ⏳ Pendente
- Escrever `dashboardService.test.js` (hoje ausente)
- Expandir cobertura web dos widgets (opcional)
