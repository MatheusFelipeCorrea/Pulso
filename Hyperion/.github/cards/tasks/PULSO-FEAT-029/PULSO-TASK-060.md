---
card_id: PULSO-TASK-060
title: "QA — testes unitários viagens e moedas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-029
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários viagens e moedas

> **Contexto:** Regressão para cotações, destinos, resolver, flight price e UI.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/moedaService.test.js` | Cotações, conversão, favoritas |
| `unit/services/tripDestinationResolver.test.js` | GeoNames → destino |
| `unit/services/tripDestinationImageService.test.js` | Capa destino |
| `unit/services/tripFlightPriceService.test.js` | Media passagem, fallbacks |
| `unit/constants/tripDestinationsCatalog.test.js` | Catálogo destinos |
| `unit/constants/tripSeasonalPricing.test.js` | Ajuste sazonal |
| `unit/constants/tripTransportRoutes.test.js` | Rotas transporte |
| `unit/providers/geonamesProvider.test.js` | Provider GeoNames |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/pages/tripsPage.test.jsx` | Render página principal |
| `unit/utils/tripDestinationDisplay.test.js` | Labels destino |
| `unit/utils/tripDestinationImages.test.js` | Fallback imagens |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas
