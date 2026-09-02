---
card_id: "PULSO-TASK-054"
title: "Backend — destinos, capas e media-passagem"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-026"
due_date: null
board_sync_at: "2026-08-26T15:31:42.000Z"
categories:
  - "Backend"
  - "Integração Externa"
---


# [TASK] Backend — destinos, capas e media-passagem

> **Contexto:** Pipeline GeoNames/catálogo, imagem de capa e estimativas de transporte.

## 📝 Descrição

Implementar resolvers de destino, serviço de capa e preços de passagem com fallbacks.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/tripDestinationResolver.js` | GeoNames place → destino normalizado |
| `constants/tripDestinationsCatalog.js` | Catálogo BR + internacional |
| `constants/tripDestinationAirports.js` | IATA, ônibus, trem |
| `providers/geonamesProvider.js` | searchPlaces, getPlace |
| `services/tripDestinationImageService.js` | `attachCoverImage` Wikipedia/Commons |
| `services/tripFlightPriceService.js` | Duffel/Amadeus + fallback + sazonal |
| `constants/tripSeasonalPricing.js` | Ajuste por mês |

**Endpoint:** `GET /viagens/:id/media-passagem?origemId=`

## 📋 Resumo

### ✅ Concluído
- Pipeline e providers documentados

### ⏳ Pendente
- Implementar resolver, capas e flight price
