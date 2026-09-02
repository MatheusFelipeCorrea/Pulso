---
card_id: "PULSO-FEAT-041"
title: "Viagem compartilhada e divisão RF-095"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-008"
due_date: null
board_sync_at: "2026-08-26T15:30:13.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Viagem compartilhada e divisão RF-095

> **Contexto:** Uma viagem por grupo, pretensões por membro e toggle de divisão.

**Refs:** RF-092–095 · RN-115–117

## 📝 Descrição

Implementar CRUD de viagem do grupo, pretensões compartilhadas e persistência de `modoDivisao`.

## ✅ Critérios de Aceite

| Rota | Comportamento |
|------|---------------|
| POST/PATCH/DELETE | `/grupos/:id/viagem` — vincular/editar/desvincular |
| POST/PATCH/DELETE | `/grupos/:id/viagem/despesas[/:despesaId]` — pretensões por autor |
| PATCH | `/grupos/:id/modo-divisao` — `PRETENSAO` \| `DIVISAO_IGUAL` |
| GET | `/grupos/:id/viagem/media-passagem` — estimativas transporte |

**RF-095:** `calcularSaldosViagem` — pretensão vs parte igual

**Constraint:** `@unique` em `ViagemGrupo.grupoId` (1 viagem/grupo)

Pretensões permanecem ao membro sair (RN-115–117)

## 🔗 Sub-issues

- PULSO-TASK-086

## 📋 Resumo

### ✅ Concluído
- Regras viagem e RF-095 especificadas

### ⏳ Pendente
- PULSO-TASK-086 — viagem grupo backend
