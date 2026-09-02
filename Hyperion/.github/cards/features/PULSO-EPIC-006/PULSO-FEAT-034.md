---
card_id: "PULSO-FEAT-034"
title: "Frontend — calendário e lembretes"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-006"
due_date: null
board_sync_at: "2026-08-26T15:30:06.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — calendário e lembretes

> **Contexto:** Página `/calendar` com grade mensal, painel diário, Google Agenda e modais de lembrete.

**Refs:** RF-054–058 · RF-058b · RN-100

## 📝 Descrição

Implementar interface completa do calendário financeiro com integração Google e CRUD de lembretes.

## ✅ Critérios de Aceite

- Rota `/calendar` em `App.jsx`
- Navegação mensal; seleção de dia; marcadores visuais
- `UpcomingReminders` — próximos vencimentos
- `CalendarInsightCard` — resumo do mês
- `GoogleCalendarBanner` — connect/disconnect + callback query params
- `GoogleResyncModal` — escopos futuros/todos
- `ReminderFormModal` — 52 categorias agrupadas, antecedência, hora, recorrência, sync toggle
- Marcar pago / excluir com confirmação

## 🔗 Sub-issues

- PULSO-TASK-069
- PULSO-TASK-070
- PULSO-TASK-071

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes e fluxos UI definido

### ⏳ Pendente
- PULSO-TASK-069–071 — página, modais e estilos
