---
card_id: PULSO-FEAT-027
title: "Frontend — página viagens e moedas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend — página viagens e moedas

> **Contexto:** Hub `/trips` com conversor, favoritas, gráfico de câmbio e lista de viagens.

**Refs:** RF-033–036 · RF-037 · RF-042

## 📝 Descrição

Implementar página principal integrando widgets de moeda e gestão de viagens com modais de CRUD.

## ✅ Critérios de Aceite

- Rota `/trips` em `App.jsx`
- `TripQuickConverter` — conversão BRL ↔ moeda selecionada
- `TripFavoriteCurrencies` + `AddFavoriteCurrencyModal` (até 8)
- `TripExchangeChart` — histórico RF-035
- `TripList` + `TripCard` com navegação para detalhe
- `TripFormModal` + `DeleteTripModal`
- Criar meta inline via `GoalFormModal` quando necessário
- Timestamp "Atualizado há X min" (RN-071)

## 🔗 Sub-issues

- PULSO-TASK-055
- PULSO-TASK-056

## 📋 Resumo

### ✅ Concluído
- Layout e componentes da página definidos

### ⏳ Pendente
- PULSO-TASK-055–056 — página, conversor e modais de viagem
