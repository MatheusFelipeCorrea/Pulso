---
card_id: "PULSO-TASK-031"
title: "Job recurringTransactions e recurrenceUtils"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-015"
due_date: null
board_sync_at: "2026-08-26T15:31:19.000Z"
categories:
  - "Backend"
  - "Infra / DevOps"
  - "Regra de Negócio"
---


# [TASK] Job recurringTransactions e recurrenceUtils

> **Contexto:** RF-021 — geração automática de ocorrências recorrentes.

## 📝 Descrição

Job cron que avalia mães recorrentes e cria filhas no dia correto, respeitando UNTIL e deduplicação diária.

## 🛠️ Implementação

### `recurringTransactions.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/jobs/recurringTransactions.js`

- `runRecurringTransactions()` — lista mães, `isOccurrenceToday`, cria filha
- Frequências: WEEKLY (INTERVAL), MONTHLY, YEARLY
- Registro cron: `server.js` 00:05 + `cronController.daily`

### `recurrenceUtils.js` (NOVO — CRIAR)

- `buildRecurrenceRule` (front espelha via `transactionRecurrence.js`)
- `calcularUntilAPartirDoCorte`, `aplicarUntilNaRegra`
- `startOfDay`

### Form (NOVO — CRIAR)

`TransactionFormModal`: checkbox recorrente, frequência, até quando, `buildRecurrenceRule`

## 📋 Resumo

### ✅ Concluído
- Lógica de ocorrência e RRULE básica especificada

### ⏳ Pendente
- Implementar job + utils + wire cron
