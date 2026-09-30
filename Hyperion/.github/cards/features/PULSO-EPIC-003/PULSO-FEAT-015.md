---
card_id: PULSO-FEAT-015
title: "Recorrência e geração automática"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Infra / DevOps
  - Regra de Negócio
---

# [FEATURE] Recorrência e geração automática

> **Contexto:** Transações recorrentes com RRULE e job cron que gera ocorrências filhas (RF-021, RF-022); exclusão inteligente preservando passado.

**Refs:** RF-021 · RF-022

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


## 👤 Responsável

Vinícius Simões (`ViniSimoesV`)

## 🔗 Pull Requests

- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) — Recorrência e job diário (`FEAT-015`) → issue [#28](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/28)
## 📋 Resumo

### ✅ Concluído
- Fluxos de recorrência e exclusão especificados (RF-NOVO-C1)

### ⏳ Pendente
- PULSO-TASK-031 — job + recurrenceUtils
- PULSO-TASK-032 — excluirTransacao recorrente + UI DeleteTransactionModal
