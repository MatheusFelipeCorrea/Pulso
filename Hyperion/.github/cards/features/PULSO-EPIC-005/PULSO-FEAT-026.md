---
card_id: PULSO-FEAT-026
title: "Destinos, capas e estimativa de passagem"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
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

## 🔗 Pull Requests

- [#316](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/316) — destinos, capas e passagem na API

## 📋 Resumo

### ✅ Concluído
- Resolver, capas e flight price mergeados na Sprint-3 (In Revision)
