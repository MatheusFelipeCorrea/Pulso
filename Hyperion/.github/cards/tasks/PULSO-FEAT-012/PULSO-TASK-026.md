---
card_id: PULSO-TASK-026
title: "Backend â€” transactionService e repository"
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
  - Regra de NegÃ³cio
---

# [TASK] Backend â€” transactionService e repository

> **Contexto:** Regras de negÃ³cio centrais para CRUD, resumo e side-effects.

## ðŸ“ DescriÃ§Ã£o

Implementar service e repository com listagem filtrada, agregados, validaÃ§Ãµes e integraÃ§Ãµes pÃ³s-criaÃ§Ã£o.

## âœ… CritÃ©rios de Aceite

**EntÃ£o** mÃ©todos:
- `listarTransacoes`, `calcularResumo` (modos fluxo/benefÃ­cio/carteira)
- `criarTransacao`, `editarTransacao`, `excluirTransacao`

**Side-effects em criar:**
- `notificationService`, `insightService` (hooks pÃ³s-transaÃ§Ã£o)

## ðŸ› ï¸ ImplementaÃ§Ã£o

### `transactionService.js` (NOVO â€” CRIAR)

Criar em: `Codigo/api/src/services/transactionService.js`

### `transactionRepository.js` (NOVO â€” CRIAR)

- `listarPorUsuario`, `calcularAgregados`, `criar`, `atualizar`, `excluir`
- `vincularTags`, `desvincularTags`, `listarRecorrentesMae`
- `excluirRecorrentesFilhasAPartirDe`, `encerrarRecorrencia`

### `transactionFilterService.js` (NOVO â€” CRIAR)

Montagem de `where` Prisma a partir de query (perÃ­odo, categoria, tipo, recurso, busca)

### Utils (NOVO â€” CRIAR)

- `transactionMapper.js` â€” DTO API
- `resourceBalanceUtils.js` â€” saldos por recurso

## ðŸ“ Regras de NegÃ³cio

- Data futura bloqueada exceto recorrentes
- TRANSFERENCIA: origem â‰  destino, sem categoria
- Resumo exclui TRANSFERENCIA dos totais receita/despesa

## ðŸ‘¤ ResponsÃ¡vel

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## ðŸ”— Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) â€” `transactionService` / repository / filtros (`FEAT-012`) â†’ issue [#114](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/114)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Assinaturas e side-effects documentados

### â³ Pendente
- Implementar service + repository + filter service
