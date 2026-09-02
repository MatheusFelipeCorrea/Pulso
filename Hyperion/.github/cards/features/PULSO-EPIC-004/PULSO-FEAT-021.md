---
card_id: "PULSO-FEAT-021"
title: "Frontend — página de metas"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-004"
due_date: null
board_sync_at: "2026-08-26T15:29:54.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — página de metas

> **Contexto:** Interface completa em `/goals` — listagem, resumo lateral, modais de CRUD/aporte/exclusão e reserva de emergência.

**Refs:** RF-026–031 · RF-028 · RF-142 · RN-068

## 📝 Descrição

Implementar página de metas com tabs por status, filtros, cards de progresso, sidebar com donut e atividade recente, e modais integrados ao design system.

## ✅ Critérios de Aceite

- Rota `/goals` registrada em `App.jsx` sob `MainLayout`
- Tabs: Todas, Ativas, Pausadas, Concluídas
- Busca por nome + filtro de intervalo de prazo
- Paginação server-side (`limite: 10`)
- Barra de progresso e percentual em cada meta (RF-028)
- Alerta "Meta vencida" via `goalStatusUtils` (RN-068)
- Atalho "Reserva de Emergência" no modal de criação (RF-142)
- Histórico de aportes editável no modal de edição

## 🔗 Sub-issues

- PULSO-TASK-044
- PULSO-TASK-045
- PULSO-TASK-046
- PULSO-TASK-047

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes e fluxos de UI definido

### ⏳ Pendente
- PULSO-TASK-044–047 — página, modais e estilos
