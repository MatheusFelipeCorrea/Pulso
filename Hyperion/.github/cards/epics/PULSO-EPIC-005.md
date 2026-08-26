---
card_id: PULSO-EPIC-005
title: "Viagens e Moedas"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Integração Externa
  - Regra de Negócio
---

# [EPIC] Viagens e Moedas

> **Contexto:** Planejamento de viagens com pretensões de gasto por categoria, conversor e cotações de moedas, histórico de câmbio, favoritas, busca de destinos (GeoNames + catálogo), capas de destino e estimativas de passagem; vínculo 1:1 com meta financeira.

**Refs:** RF-033–043 · RN-069–074

## 🎯 Objetivos

- Cotações atualizadas via AwesomeAPI/Frankfurter com cache 5 min (RF-033, RN-071)
- Conversor BRL ↔ moedas suportadas, inclusive par cruzado (RF-034)
- Gráfico de histórico de cotação com ponto ao vivo de hoje (RF-035)
- Moedas favoritas (até 8) com seed padrão USD/EUR/GBP (RF-036)
- CRUD de viagens pessoais: destino, moeda, data prevista, múltiplas simultâneas (RF-037, RF-042)
- Pretensões por 10 categorias (RN-074); total somado (RN-069); conversão BRL na UI (RF-039–040, RN-070)
- Observações com checklist, links e tipos (GERAL, CHECKLIST, LINK, DICA, DOCUMENTOS)
- Resolução de destino: GeoNames, catálogo BR/internacional, aeroportos IATA
- Capa de destino via Wikipedia/Commons no criar/editar (não no GET list)
- Estimativa de passagem avião/ônibus/trem com ajuste sazonal (Duffel/Amadeus opcionais + fallback)
- Vínculo viagem ↔ meta 1:1 com `@unique` em `metaId` (RF-043, RN-072, RN-073)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/trips` | Viagens e Moedas | Conversor rápido, favoritas, gráfico câmbio, lista viagens |
| `/trips/:id` | Detalhe viagem | Pretensões, observações, meta vinculada, insights transporte |
| Modal | Nova/Editar viagem | DestinationSearchPicker, moeda, data, meta opcional |
| Modal | Pretensão / Observação | CRUD por categoria ou checklist/link |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Metas | `metaId` 1:1; `TripDetailGoalCard`; criar meta inline na página |
| Grupos | `ViagemGrupo` — epic Grupos (viagem compartilhada) |
| AwesomeAPI | Cotações, conversão, histórico |
| GeoNames | Busca de destinos (`GEONAMES_USERNAME`) |
| Duffel / Amadeus | Preços reais de passagem (opcional, env) |
| Wikipedia/Commons | Capa do destino (`tripDestinationImageService`) |

## 🔗 Sub-issues

- PULSO-FEAT-023
- PULSO-FEAT-024
- PULSO-FEAT-025
- PULSO-FEAT-026
- PULSO-FEAT-027
- PULSO-FEAT-028
- PULSO-FEAT-029

## 📋 Resumo

### ✅ Concluído
- Escopo RF-033–043 e RN-069–074 mapeado
- Hierarquia Epic → 7 Features → 12 Tasks definida
- Contratos API, providers e fluxos UI documentados como spec

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Cache compartilhado de cotações (Redis) — evolução futura T5
- Capa assíncrona na criação — melhoria de performance
