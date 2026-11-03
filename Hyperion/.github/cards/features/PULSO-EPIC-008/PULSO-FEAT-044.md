---
card_id: PULSO-FEAT-044
title: "Frontend — grupos lista e detalhe"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-008
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — grupos lista e detalhe

> **Contexto:** UI completa `/groups` e `/groups/:id` com modais e cards RF-097.

**Refs:** RF-084–098 · RF-091 · RF-097

## 📝 Descrição

Implementar páginas de lista e detalhe com todos os modais e cards integrados.

## ✅ Critérios de Aceite

**Lista (`/groups`):**
- `GroupList`, `GroupCard`, `CreateGroupModal`, `JoinGroupModal`
- `InviteGroupModal` (link, WhatsApp, QR), `GroupsJoinBanner`
- Admin: excluir; membro: sair

**Detalhe (`/groups/:id`):**
- `GroupDetailHeader` — imagem, editar, convite
- `GroupDetailTripCard` — viagem, pretensões, toggle RF-091, saldos
- `GroupDetailGoalCard` — metas, aportes
- `GroupDetailMembersCard` — gerenciar membros
- `GroupDetailChatCard` — chat + load more
- Chat em tempo real via Socket.IO; detalhe recarrega sob demanda

**Redirect:** `/groups/join/:codigo`

## 🔗 Sub-issues

- PULSO-TASK-089
- PULSO-TASK-090
- PULSO-TASK-091

## 👤 Responsáveis

- Maria Clara (`mariaoliveira27`) — web
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — Flutter visual


## 📋 Resumo

### ✅ Concluído
- Mapa de componentes RF-097 definido

### ⏳ Pendente
- PULSO-TASK-089–091 — páginas, modais e estilos
