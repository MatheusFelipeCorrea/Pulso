---
card_id: "PULSO-TASK-055"
title: "Frontend — TripsPage, conversor e favoritas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-027"
due_date: null
board_sync_at: "2026-08-26T15:31:43.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
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
| `TripQuickConverter.jsx` | Conversão interativa RF-034 |
| `TripFavoriteCurrencies.jsx` | Cards favoritas com variação % |
| `TripExchangeChart.jsx` | Gráfico histórico RF-035 |
| `AddFavoriteCurrencyModal.jsx` | Adicionar favorita |
| `services/moedaService.js` | Client HTTP moedas |
| `services/viagemService.js` | Client HTTP viagens |

**UX:** status "Atualizado há X min" (RN-071)

## 📋 Resumo

### ✅ Concluído
- Layout e fetch pattern definidos

### ⏳ Pendente
- Implementar TripsPage e widgets de moeda
