---
card_id: "PULSO-FEAT-015"
title: "Recorrência e geração automática"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-003"
due_date: null
board_sync_at: "2026-08-26T15:29:48.000Z"
categories:
  - "Backend"
  - "Infra / DevOps"
  - "Regra de Negócio"
---


# [FEATURE] Recorrência e geração automática

> **Contexto:** Transações recorrentes com RRULE e job cron que gera ocorrências filhas (RF-020, RF-021); exclusão inteligente preservando passado.

**Refs:** RF-020 · RF-021

## 📝 Descrição

Mãe recorrente com `regraRecorrencia` (RFC 5545); filhas com `paiId`; job `recurringTransactions` às 00:05; exclusão "esta e futuras" aplica `UNTIL` na regra e remove filhas futuras.

## ✅ Critérios de Aceite

### Cenário 1 — Criar recorrente
**Quando** `recorrente=true` + `regraRecorrencia`,  
**Então** transação mãe criada; data futura permitida.

### Cenário 2 — Job diário
**Então** gera filha se hoje é dia de ocorrência e ainda não existe filha do dia.

### Cenário 3 — Excluir só esta
**Então** remove apenas transação selecionada.

### Cenário 4 — Excluir esta e futuras
**Então** remove filhas ≥ data corte; encerra mãe com `UNTIL`; **preserva** filhas passadas.

## 🔗 Sub-issues

- PULSO-TASK-031
- PULSO-TASK-032

## 📋 Resumo

### ✅ Concluído
- Fluxos de recorrência e exclusão especificados (RF-NOVO-C1)

### ⏳ Pendente
- PULSO-TASK-031 — job + recurrenceUtils
- PULSO-TASK-032 — excluirTransacao recorrente + UI DeleteTransactionModal
