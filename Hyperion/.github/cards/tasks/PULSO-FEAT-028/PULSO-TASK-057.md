---
card_id: "PULSO-TASK-057"
title: "Frontend — TripDetailPage e sidebar"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-028"
due_date: null
board_sync_at: "2026-08-26T15:31:45.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — TripDetailPage e sidebar

> **Contexto:** Página de detalhe com resumo financeiro e meta vinculada.

## 📝 Descrição

Implementar rota `/trips/:id` com layout principal, sidebar e card de meta.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TripDetailPage.jsx` | Fetch viagem + cotação; estado modais |
| `detail/TripDetailSummarySidebar.jsx` | Totais moeda/BRL, breakdown categorias |
| `detail/TripDetailGoalCard.jsx` | Progresso meta RF-043 |
| `detail/TripDetailCategoryBadge.jsx` | Badge categoria despesa |
| `utils/tripDetailUtils.js` | `buildCategoryBreakdown`, `calcTripTotalInCurrency` |
| `utils/tripOriginStorage.js` | Origem persistida para passagens |

**Rota:** `App.jsx` → `path="trips/:id"`

Conversão BRL: fetch cotação moeda destino (RN-070)

## 📋 Resumo

### ✅ Concluído
- Layout detalhe e utils definidos

### ⏳ Pendente
- Implementar TripDetailPage e sidebar
