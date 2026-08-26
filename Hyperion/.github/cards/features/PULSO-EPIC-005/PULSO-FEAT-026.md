---
card_id: PULSO-FEAT-026
title: "Destinos, capas e estimativa de passagem"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [FEATURE] Destinos, capas e estimativa de passagem

> **Contexto:** Resolução inteligente de destino, imagem de capa e insights de preço de transporte.

## 📝 Descrição

Implementar pipeline de destino (GeoNames + catálogo + aeroportos), capa Wikipedia/Commons e endpoint de média de passagem.

## ✅ Critérios de Aceite

| Componente | Comportamento |
|------------|---------------|
| `tripDestinationResolver` | Normaliza place GeoNames → `destino` + `destinoMeta` |
| `tripDestinationsCatalog` | Fallback BR/internacional quando GeoNames indisponível |
| `attachCoverImage` | Resolve `coverImageUrl` no criar/editar |
| `GET /viagens/:id/media-passagem?origemId=` | Avião (Duffel/Amadeus/fallback), ônibus, trem + ajuste sazonal |

**Nota:** Listagem GET não hidrata capa (evitar timeout serverless)

## 🔗 Sub-issues

- PULSO-TASK-054

## 📋 Resumo

### ✅ Concluído
- Pipeline de destino e providers documentados

### ⏳ Pendente
- PULSO-TASK-054 — resolver, capas e flight price service
