---
card_id: "PULSO-FEAT-056"
title: "Frontend — página e componentes"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-010"
due_date: null
board_sync_at: "2026-08-26T15:30:29.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/purchase-planning` com cards, sidebar, alertas e modais.

**Refs:** RF-133–138

## 📝 Descrição

Implementar página, componentes visuais e fluxos de CRUD/comprar/vincular.

## ✅ Critérios de Aceite

- Rota autenticada `/purchase-planning`
- Cards de itens desejados com meses, parcelas e gauge de comprometimento
- Alerta global se impacto médio > 30% (`PurchasePlanningAlert`)
- Sidebar: resumo, donut categorias, dicas
- Modais: formulário item, vincular meta, histórico, confirmar compra/exclusão
- Client `purchasePlanningService.js` + `purchase-planning.css`

## 🔗 Sub-issues

- PULSO-TASK-113
- PULSO-TASK-114
- PULSO-TASK-115

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-113–115 — página, componentes e CSS
