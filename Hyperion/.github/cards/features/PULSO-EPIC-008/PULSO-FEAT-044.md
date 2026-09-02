---
card_id: "PULSO-FEAT-044"
title: "Frontend — grupos lista e detalhe"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-008"
due_date: null
board_sync_at: "2026-08-26T15:30:16.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — grupos lista e detalhe

> **Contexto:** UI completa `/groups` e `/groups/:id` com modais e cards RF-101.

**Refs:** RF-088–102 · RF-095 · RF-101

## 📝 Descrição

Implementar páginas de lista e detalhe com todos os modais e cards integrados.

## ✅ Critérios de Aceite

**Lista (`/groups`):**
- `GroupList`, `GroupCard`, `CreateGroupModal`, `JoinGroupModal`
- `InviteGroupModal` (link, WhatsApp, QR), `GroupsJoinBanner`
- Admin: excluir; membro: sair

**Detalhe (`/groups/:id`):**
- `GroupDetailHeader` — imagem, editar, convite
- `GroupDetailTripCard` — viagem, pretensões, toggle RF-095, saldos
- `GroupDetailGoalCard` — metas, aportes
- `GroupDetailMembersCard` — gerenciar membros
- `GroupDetailChatCard` — chat + load more
- Polling detalhe ~30s; chat ~3s

**Redirect:** `/groups/join/:codigo`

## 🔗 Sub-issues

- PULSO-TASK-089
- PULSO-TASK-090
- PULSO-TASK-091

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes RF-101 definido

### ⏳ Pendente
- PULSO-TASK-089–091 — páginas, modais e estilos
