---
card_id: "PULSO-TASK-086"
title: "Backend — viagem grupo, pretensões e RF-095"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-041"
due_date: null
board_sync_at: "2026-08-26T15:32:14.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — viagem grupo, pretensões e RF-095

> **Contexto:** Viagem compartilhada 1:1, despesas por membro e modo divisão.

## 📝 Descrição

Implementar CRUD viagem do grupo, pretensões e `atualizarModoDivisao`.

## 🛠️ Implementação

### Models (NOVO — CRIAR)

`ViagemGrupo`, `DespesaViagemGrupo` — reutilizar resolver destino de `viagemService`

### Endpoints

- POST/PATCH/DELETE `/grupos/:id/viagem`
- CRUD `/grupos/:id/viagem/despesas`
- PATCH `/grupos/:id/modo-divisao`
- GET media-passagem via `tripFlightPriceService`

**Constraint:** `@@unique([grupoId])` em ViagemGrupo

Pretensões vinculadas a `adicionadoPorId`; permanecem ao sair (RN-115–117)

## 📋 Resumo

### ✅ Concluído
- Spec RF-092–095 definida

### ⏳ Pendente
- Implementar viagem grupo backend
