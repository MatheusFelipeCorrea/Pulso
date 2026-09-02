---
card_id: "PULSO-TASK-050"
title: "Backend — moedaService, provider e rotas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-023"
due_date: null
board_sync_at: "2026-08-26T15:31:37.000Z"
categories:
  - "Backend"
  - "Integração Externa"
---


# [TASK] Backend — moedaService, provider e rotas

> **Contexto:** Cotações AwesomeAPI, conversão, histórico e favoritas.

## 📝 Descrição

Implementar camada de moedas com catálogo, cache e CRUD de favoritas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Responsabilidade |
|---------|------------------|
| `constants/currencyCatalog.js` | Moedas suportadas, `DEFAULT_FAVORITES` |
| `providers/awesomeApiProvider.js` | Cache 5 min, rates, histórico Frankfurter |
| `repositories/moedaFavoritaRepository.js` | CRUD favoritas |
| `services/moedaService.js` | listarCotacoes, converter, obterHistorico, favoritas |
| `routes/moedaRoutes.js` | Rotas `/moedas/*` |
| `controllers/moedaController.js` | Handlers |
| `schemas/moedaSchemas.js` | Zod query/body |

**Limite:** `MAX_FAVORITES = 8`; seed padrão na primeira listagem

## 📋 Resumo

### ✅ Concluído
- Contratos RF-033–036 especificados

### ⏳ Pendente
- Implementar provider, service e rotas
