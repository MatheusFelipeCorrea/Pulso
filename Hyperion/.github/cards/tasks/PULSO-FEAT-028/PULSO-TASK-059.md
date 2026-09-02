---
card_id: "PULSO-TASK-059"
title: "Frontend — trips.css e utilitários visuais"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-028"
due_date: null
board_sync_at: "2026-08-26T15:31:47.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [TASK] Frontend — trips.css e utilitários visuais

> **Contexto:** Estilos responsivos, bandeiras de moeda e imagens de destino.

## 📝 Descrição

Implementar folha de estilos da página de viagens e helpers visuais compartilhados.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `styles/trips.css` | Layout page, cards, detalhe, modais, mobile |
| `CurrencyFlag.jsx` | Bandeira por código ISO |
| `utils/tripFlagImages.js` | URLs bandeiras |
| `utils/tripDestinationDisplay.js` | Label destino formatado |
| `utils/tripDestinationImages.js` | Fallback capa destino |
| `utils/tripCountryImages.js` | Imagens país |
| `utils/tripWikipediaImage.js` | Helper capa Wikipedia |

Importar CSS em TripsPage/TripDetailPage ou bundle global.

## 📋 Resumo

### ✅ Concluído
- Mapa de assets visuais definido

### ⏳ Pendente
- Implementar trips.css e utilitários visuais
