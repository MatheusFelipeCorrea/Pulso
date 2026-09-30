---
card_id: PULSO-TASK-055
title: "Frontend — TripsPage, conversor e favoritas"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-027
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — TripsPage, conversor e favoritas

> **Contexto:** Página hub `/trips` com widgets de câmbio e carga paralela de dados.

## 📝 Descrição

Implementar shell da página com conversor rápido, favoritas, gráfico histórico e lista de viagens.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TripsPage.jsx` | Orquestração; fetch paralelo moedas + viagens + metas |
| `TripQuickConverter.jsx` | Conversão interativa RF-038 |
| `TripFavoriteCurrencies.jsx` | Cards favoritas com variação % |
| `TripExchangeChart.jsx` | Gráfico histórico RF-039 |
| `AddFavoriteCurrencyModal.jsx` | Adicionar favorita |
| `services/moedaService.js` | Client HTTP moedas |
| `services/viagemService.js` | Client HTTP viagens |

**UX:** status "Atualizado há X min" (RN-071)

## 📋 Resumo

### ✅ Concluído
- Layout e fetch pattern definidos

### ⏳ Pendente
- Implementar TripsPage e widgets de moeda
