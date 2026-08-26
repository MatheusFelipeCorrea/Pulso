---
card_id: PULSO-FEAT-028
title: "Frontend — detalhe da viagem"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-005
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — detalhe da viagem

> **Contexto:** Página `/trips/:id` com pretensões, observações, meta, totais em moeda/BRL e insights de transporte.

**Refs:** RF-042–045 · RF-044 · RF-047 · RN-070

## 📝 Descrição

Implementar detalhe completo com sidebar de resumo, breakdown por categoria, seções de pretensões/observações e estimativas de passagem.

## ✅ Critérios de Aceite

- Rota `/trips/:id` com fetch viagem + cotação moeda destino
- `TripDetailSummarySidebar` — total moeda + equivalente BRL (RN-070)
- `TripDetailExpensesSection` + `TripExpenseFormModal` + delete
- `TripDetailObservationsSection` + checklist/links
- `TripDetailGoalCard` — vínculo meta RF-047
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
