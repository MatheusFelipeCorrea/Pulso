---
card_id: "PULSO-FEAT-068"
title: "Frontend — página e componentes"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-012"
due_date: null
board_sync_at: "2026-08-26T15:30:40.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/debts` com tabs, filtros, cards e modais.

**Refs:** RF-126–132 · RN-078

## 📝 Descrição

Implementar página de dívidas com fluxo completo de CRUD e pagamentos.

## ✅ Critérios de Aceite

- Rota autenticada `/debts`
- Tabs: Me devem / Eu devo / Quitadas
- Summary cards + filtros (busca, valor, datas)
- Badges: vencida, parcial, sem prazo, quitada (`debtStatusUtils`)
- Modais: form, pagamento, quitar, reabrir, detalhes, delete
- Client `debtService.js` + `debts.css`

## 🔗 Sub-issues

- PULSO-TASK-138
- PULSO-TASK-139

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-138–139 — página e componentes
