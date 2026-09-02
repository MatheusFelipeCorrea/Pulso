---
card_id: "PULSO-TASK-110"
title: "Backend — vincular e desvincular meta"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-054"
due_date: null
board_sync_at: "2026-08-26T15:32:38.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — vincular e desvincular meta

> **Contexto:** RF-137 — associação item ↔ meta financeira.

## 📝 Descrição

Implementar vínculo com meta existente ou criação inline.

## 🛠️ Implementação

### Endpoints / funções (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `resolverMeta` | `metaId` (ATIVA/PAUSADA) ou `criarMeta` com prazo |
| `vincularMeta` | POST `/:id/vincular-meta`; opcional `ajustarMetaValor` |
| `desvincularMeta` | DELETE `/:id/vincular-meta` |
| Criar item | Flag `vincularMeta` no POST |

Nome default da meta criada: `Comprar: {nomeItem}`

## 📋 Resumo

### ✅ Concluído
- Contratos vínculo definidos

### ⏳ Pendente
- Implementar fluxos de meta
