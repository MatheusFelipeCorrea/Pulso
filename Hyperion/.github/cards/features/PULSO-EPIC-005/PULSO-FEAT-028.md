---
card_id: "PULSO-FEAT-028"
title: "Frontend — detalhe da viagem"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-005"
due_date: null
board_sync_at: "2026-08-26T15:30:00.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — detalhe da viagem

> **Contexto:** Página `/trips/:id` com pretensões, observações, meta, totais em moeda/BRL e insights de transporte.

**Refs:** RF-038–041 · RF-040 · RF-043 · RN-070

## 📝 Descrição

Implementar detalhe completo com sidebar de resumo, breakdown por categoria, seções de pretensões/observações e estimativas de passagem.

## ✅ Critérios de Aceite

- Rota `/trips/:id` com fetch viagem + cotação moeda destino
- `TripDetailSummarySidebar` — total moeda + equivalente BRL (RN-070)
- `TripDetailExpensesSection` + `TripExpenseFormModal` + delete
- `TripDetailObservationsSection` + checklist/links
- `TripDetailGoalCard` — vínculo meta RF-043
- `TripTransportPriceInsights` + `TripOriginPicker` (origem persistida local)
- `DestinationSearchPicker`, `CurrencySearchPicker`, `CurrencyFlag`

## 🔗 Sub-issues

- PULSO-TASK-057
- PULSO-TASK-058
- PULSO-TASK-059

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes de detalhe definido

### ⏳ Pendente
- PULSO-TASK-057–059 — detalhe, modais e estilos
