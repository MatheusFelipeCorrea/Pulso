---
card_id: PULSO-TASK-057
title: "Frontend — TripDetailPage e sidebar"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-028
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
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
| `detail/TripDetailGoalCard.jsx` | Progresso meta RF-047 |
| `detail/TripDetailCategoryBadge.jsx` | Badge categoria despesa |
| `utils/tripDetailUtils.js` | `buildCategoryBreakdown`, `calcTripTotalInCurrency` |
| `utils/tripOriginStorage.js` | Origem persistida para passagens |

**Rota:** `App.jsx` → `path="trips/:id"`

Conversão BRL: fetch cotação moeda destino (RN-070)

## 📋 Resumo

### ✅ Concluído
- Layout detalhe e utils definidos

### ⏳ Pendente
- Nenhum
