---
card_id: PULSO-TASK-027
title: "Backend â€” routes, controller e schemas"
status: Done
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-012
due_date: null
categories:
  - Backend
---

# [TASK] Backend â€” routes, controller e schemas

> **Contexto:** Camada HTTP para `/api/transacoes`.

## ðŸ“ DescriÃ§Ã£o

Expor endpoints com validaÃ§Ã£o Zod e auth middleware.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### `transactionRoutes.js` (NOVO â€” CRIAR)

Rotas: `GET /`, `GET /resumo`, `GET /filtros`, `GET /sugestao-categoria`, `POST /`, `PATCH /:id`, `DELETE /:id`

### `transactionController.js` (NOVO â€” CRIAR)

Handlers delegando ao service + `transactionFilterService.obterOpcoes`

### `transactionSchemas.js` (NOVO â€” CRIAR)

`criarTransacaoSchema`, `editarTransacaoSchema`, `listarTransacoesQuerySchema`, `excluirTransacaoSchema`, `sugerirCategoriaQuerySchema`

### `routes/index.js` (EXISTENTE â€” MODIFICAR)

`router.use('/transacoes', transactionRoutes)`

### `transactionOptions.js` (NOVO â€” CRIAR)

Constantes de recursos/frequÃªncias para `/filtros`

## ðŸ‘¤ ResponsÃ¡vel

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## ðŸ”— Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) â€” routes, controller e schemas (`FEAT-012`) â†’ issue [#115](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/115)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Mapa de rotas definido

### â³ Pendente
- Implementar controller, routes e schemas Zod
