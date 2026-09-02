---
card_id: "PULSO-TASK-027"
title: "Backend — routes, controller e schemas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-012"
due_date: null
board_sync_at: "2026-08-26T15:31:15.000Z"
categories:
  - "Backend"
---


# [TASK] Backend — routes, controller e schemas

> **Contexto:** Camada HTTP para `/api/transacoes`.

## 📝 Descrição

Expor endpoints com validação Zod e auth middleware.

## 🛠️ Implementação

### `transactionRoutes.js` (NOVO — CRIAR)

Rotas: `GET /`, `GET /resumo`, `GET /filtros`, `GET /sugestao-categoria`, `POST /`, `PATCH /:id`, `DELETE /:id`

### `transactionController.js` (NOVO — CRIAR)

Handlers delegando ao service + `transactionFilterService.obterOpcoes`

### `transactionSchemas.js` (NOVO — CRIAR)

`criarTransacaoSchema`, `editarTransacaoSchema`, `listarTransacoesQuerySchema`, `excluirTransacaoSchema`, `sugerirCategoriaQuerySchema`

### `routes/index.js` (EXISTENTE — MODIFICAR)

`router.use('/transacoes', transactionRoutes)`

### `transactionOptions.js` (NOVO — CRIAR)

Constantes de recursos/frequências para `/filtros`

## 📋 Resumo

### ✅ Concluído
- Mapa de rotas definido

### ⏳ Pendente
- Implementar controller, routes e schemas Zod
