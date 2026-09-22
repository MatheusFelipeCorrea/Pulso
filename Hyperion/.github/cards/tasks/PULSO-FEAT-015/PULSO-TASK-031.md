---
card_id: PULSO-TASK-031
title: "Job recurringTransactions e recurrenceUtils"
status: Done
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-015
due_date: null
categories:
  - Backend
  - Infra / DevOps
  - Regra de NegÃ³cio
---

# [TASK] Job recurringTransactions e recurrenceUtils

> **Contexto:** RF-022 â€” geraÃ§Ã£o automÃ¡tica de ocorrÃªncias recorrentes.

## ðŸ“ DescriÃ§Ã£o

Job cron que avalia mÃ£es recorrentes e cria filhas no dia correto, respeitando UNTIL e deduplicaÃ§Ã£o diÃ¡ria.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### `recurringTransactions.js` (NOVO â€” CRIAR)

Criar em: `Codigo/api/src/jobs/recurringTransactions.js`

- `runRecurringTransactions()` â€” lista mÃ£es, `isOccurrenceToday`, cria filha
- FrequÃªncias: WEEKLY (INTERVAL), MONTHLY, YEARLY
- Registro cron: `server.js` 00:05 + `cronController.daily`

### `recurrenceUtils.js` (NOVO â€” CRIAR)

- `buildRecurrenceRule` (front espelha via `transactionRecurrence.js`)
- `calcularUntilAPartirDoCorte`, `aplicarUntilNaRegra`
- `startOfDay`

### Form (NOVO â€” CRIAR)

`TransactionFormModal`: checkbox recorrente, frequÃªncia, atÃ© quando, `buildRecurrenceRule`

## ðŸ‘¤ ResponsÃ¡vel

VinÃ­cius SimÃµes (`ViniSimoesV`)

## ðŸ”— Pull Requests

- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) â€” Job + `recurrenceUtils` (`FEAT-015`) â†’ issue [#119](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/119)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- LÃ³gica de ocorrÃªncia e RRULE bÃ¡sica especificada

### â³ Pendente
- Implementar job + utils + wire cron
