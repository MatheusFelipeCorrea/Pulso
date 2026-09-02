---
card_id: "PULSO-FEAT-062"
title: "Frontend — página e componentes"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-011"
due_date: null
board_sync_at: "2026-08-26T15:30:35.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/expense-split` com resumo, ativas, histórico e modais.

**Refs:** RF-115–120

## 📝 Descrição

Implementar página, cards, histórico e fluxos de criar/pagar/lembrar/excluir.

## ✅ Critérios de Aceite

- Rota autenticada `/expense-split`
- `ExpenseSplitSummaryCards` — meDevem / euDevo / saldo
- Lista de ativas + histórico paginado
- Modais: form (igual/personalizado), detalhes (pagar/despagar), lembrete, delete
- Client `expenseSplitService.js` + `expense-split.css`

## 🔗 Sub-issues

- PULSO-TASK-125
- PULSO-TASK-126
- PULSO-TASK-127

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-125–127 — página, listas e modais
