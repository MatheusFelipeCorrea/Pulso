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
  - Regra de Negócio
---

# [TASK] Job recurringTransactions e recurrenceUtils

> **Contexto:** RF-022 — geração automática de ocorrências recorrentes.

## 📝 Descrição

Job cron que avalia mães recorrentes e cria filhas no dia correto, respeitando UNTIL e deduplicação diária.

## 🛠️ Implementação

### `recurringTransactions.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/jobs/recurringTransactions.js`

- `runRecurringTransactions()` — lista mães, `isOccurrenceToday`, cria filha
- Frequências: WEEKLY (INTERVAL), MONTHLY, YEARLY
- Registro cron: `server.js` 00:05 + `cronController.daily`

### `recurrenceUtils.js` (NOVO — CRIAR)

- `buildRecurrenceRule` (front espelha via `transactionRecurrence.js`)
- `calcularUntilAPartirDoCorte`, `aplicarUntilNaRegra`
- `startOfDay`

### Form (NOVO — CRIAR)

`TransactionFormModal`: checkbox recorrente, frequência, até quando, `buildRecurrenceRule`


## 👤 Responsável

Vinícius Simões (`ViniSimoesV`)

## 🔗 Pull Requests

- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) — Job + `recurrenceUtils` (`FEAT-015`) → issue [#119](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/119)
## 📋 Resumo

### ✅ Concluído
- Lógica de ocorrência e RRULE básica especificada

### ⏳ Pendente
- Implementar job + utils + wire cron
