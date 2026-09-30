---
card_id: PULSO-TASK-027
title: "Backend — routes, controller e schemas"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-012
due_date: null
categories:
  - Backend
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


## 👤 Responsável

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 🔗 Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) — routes, controller e schemas (`FEAT-012`) → issue [#115](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/115)
## 📋 Resumo

### ✅ Concluído
- Mapa de rotas definido

### ⏳ Pendente
- Nenhum
