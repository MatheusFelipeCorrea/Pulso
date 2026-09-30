---
card_id: PULSO-FEAT-021
title: "Frontend — página de metas"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-004
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página de metas

> **Contexto:** Interface completa em `/goals` — listagem, resumo lateral, modais de CRUD/aporte/exclusão e reserva de emergência.

**Refs:** RF-029–031 · RF-031 · RF-036 · RN-068

## 📝 Descrição

Implementar página de metas com tabs por status, filtros, cards de progresso, sidebar com donut e atividade recente, e modais integrados ao design system.

## ✅ Critérios de Aceite

- Rota `/goals` registrada em `App.jsx` sob `MainLayout`
- Tabs: Todas, Ativas, Pausadas, Concluídas
- Busca por nome + filtro de intervalo de prazo
- Paginação server-side (`limite: 10`)
- Barra de progresso e percentual em cada meta (RF-031)
- Alerta "Meta vencida" via `goalStatusUtils` (RN-068)
- Atalho "Reserva de Emergência" no modal de criação (RF-036)
- Histórico de aportes editável no modal de edição

## 🔗 Sub-issues

- PULSO-TASK-044
- PULSO-TASK-045
- PULSO-TASK-046
- PULSO-TASK-047

## 👤 Responsável

Maria Clara (`mariaoliveira27`)

## 🔗 Issues

- [#34](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/34) — PULSO-FEAT-021

## 🔗 Pull Requests

- [#315](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/315) — módulo de metas no web

## 📋 Resumo

### ✅ Concluído
- Página, modais e estilos mergeados na Sprint-3 (In Revision)
