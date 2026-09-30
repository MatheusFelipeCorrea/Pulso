---
card_id: PULSO-FEAT-027
title: "Frontend — página viagens e moedas"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-005
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend — página viagens e moedas

> **Contexto:** Hub `/trips` com conversor, favoritas, gráfico de câmbio e lista de viagens.

**Refs:** RF-037–040 · RF-041 · RF-046

## 📝 Descrição

Implementar página principal integrando widgets de moeda e gestão de viagens com modais de CRUD.

## ✅ Critérios de Aceite

- Rota `/trips` em `App.jsx`
- `TripQuickConverter` — conversão BRL ↔ moeda selecionada
- `TripFavoriteCurrencies` + `AddFavoriteCurrencyModal` (até 8)
- `TripExchangeChart` — histórico RF-039
- `TripList` + `TripCard` com navegação para detalhe
- `TripFormModal` + `DeleteTripModal`
- Criar meta inline via `GoalFormModal` quando necessário
- Timestamp "Atualizado há X min" (RN-071)

## 🔗 Sub-issues

- PULSO-TASK-055
- PULSO-TASK-056

## 👤 Responsável

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 🔗 Issues

- [#40](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/40) — PULSO-FEAT-027

## 🔗 Pull Requests

- [#312](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/312) — módulo de viagens no web
- [#313](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/313) — conversor/moedas na página

## 📋 Resumo

### ✅ Concluído
- Página, conversor e lista mergeados na Sprint-3 (In Revision)
