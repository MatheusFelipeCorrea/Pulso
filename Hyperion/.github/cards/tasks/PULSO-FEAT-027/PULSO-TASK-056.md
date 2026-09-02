---
card_id: "PULSO-TASK-056"
title: "Frontend — TripFormModal, TripList e TripCard"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-027"
due_date: null
board_sync_at: "2026-08-26T15:31:44.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — TripFormModal, TripList e TripCard

> **Contexto:** CRUD de viagens na página principal com busca de destino e seleção de moeda.

## 📝 Descrição

Implementar lista de viagens, cards resumidos e modal criar/editar com pickers integrados.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `TripList.jsx` | Grid/lista de viagens |
| `TripCard.jsx` | Capa, destino, data, total, moeda |
| `TripFormModal.jsx` | Create/edit; meta opcional; link grupo |
| `DeleteTripModal.jsx` | Confirmação exclusão |
| `DestinationSearchPicker.jsx` | Autocomplete destinos API |
| `CurrencySearchPicker.jsx` | Seleção moeda catálogo |
| `TripDestinationTitle.jsx` | Título formatado destino |

Integração: seleção de meta ativa; criar meta via `GoalFormModal`

## 📋 Resumo

### ✅ Concluído
- Campos e pickers especificados

### ⏳ Pendente
- Implementar lista, cards e modal de viagem
