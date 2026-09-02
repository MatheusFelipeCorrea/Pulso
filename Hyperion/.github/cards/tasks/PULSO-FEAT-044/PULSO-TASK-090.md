---
card_id: "PULSO-TASK-090"
title: "Frontend — GroupDetailPage e cards"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-044"
due_date: null
board_sync_at: "2026-08-26T15:32:18.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — GroupDetailPage e cards

> **Contexto:** Painel RF-101 com 4 cards e modais integrados.

## 📝 Descrição

Implementar detalhe do grupo com viagem, metas, membros e chat.

## 🛠️ Implementação

### Página e cards (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/GroupDetailPage.jsx` | Orquestração; polling 30s |
| `detail/GroupDetailHeader.jsx` | Imagem, editar, convite |
| `detail/GroupDetailTripCard.jsx` | Viagem, RF-095 toggle, saldos |
| `detail/GroupDetailGoalCard.jsx` | Metas, aportes |
| `detail/GroupDetailMembersCard.jsx` | Lista membros |
| `detail/GroupDetailChatCard.jsx` | Chat polling 3s, load more |
| `GroupTripTransportChips.jsx` | Insights passagem |

### Modais reutilizados

`EditGroupModal`, `ManageGroupMembersModal`, `CreateGroupGoalsModal`, `GroupContributionModal`, `TripFormModal`, `TripExpenseFormModal`, `ChangeGroupImageModal`

**Utils:** `groupDetailUtils.js` → `calcularSaldosViagem`, `mesclarMensagensChat`

## 📋 Resumo

### ✅ Concluído
- Mapa RF-101 definido

### ⏳ Pendente
- Implementar GroupDetailPage e cards
