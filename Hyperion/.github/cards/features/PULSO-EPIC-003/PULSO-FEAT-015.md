---
card_id: PULSO-FEAT-015
title: "RecorrÃªncia e geraÃ§Ã£o automÃ¡tica"
status: Done
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Infra / DevOps
  - Regra de NegÃ³cio
---

# [FEATURE] RecorrÃªncia e geraÃ§Ã£o automÃ¡tica

> **Contexto:** TransaÃ§Ãµes recorrentes com RRULE e job cron que gera ocorrÃªncias filhas (RF-021, RF-022); exclusÃ£o inteligente preservando passado.

**Refs:** RF-021 Â· RF-022

## ðŸ“ DescriÃ§Ã£o

MÃ£e recorrente com `regraRecorrencia` (RFC 5545); filhas com `paiId`; job `recurringTransactions` Ã s 00:05; exclusÃ£o "esta e futuras" aplica `UNTIL` na regra e remove filhas futuras.

## âœ… CritÃ©rios de Aceite

### CenÃ¡rio 1 â€” Criar recorrente
**Quando** `recorrente=true` + `regraRecorrencia`,  
**EntÃ£o** transaÃ§Ã£o mÃ£e criada; data futura permitida.

### CenÃ¡rio 2 â€” Job diÃ¡rio
**EntÃ£o** gera filha se hoje Ã© dia de ocorrÃªncia e ainda nÃ£o existe filha do dia.

### CenÃ¡rio 3 â€” Excluir sÃ³ esta
**EntÃ£o** remove apenas transaÃ§Ã£o selecionada.

### CenÃ¡rio 4 â€” Excluir esta e futuras
**EntÃ£o** remove filhas â‰¥ data corte; encerra mÃ£e com `UNTIL`; **preserva** filhas passadas.

## ðŸ”— Sub-issues

- PULSO-TASK-031
- PULSO-TASK-032

## ðŸ‘¤ ResponsÃ¡vel

VinÃ­cius SimÃµes (`ViniSimoesV`)

## ðŸ”— Pull Requests

- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) â€” RecorrÃªncia e job diÃ¡rio (`FEAT-015`) â†’ issue [#28](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/28)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Fluxos de recorrÃªncia e exclusÃ£o especificados (RF-NOVO-C1)

### â³ Pendente
- PULSO-TASK-031 â€” job + recurrenceUtils
- PULSO-TASK-032 â€” excluirTransacao recorrente + UI DeleteTransactionModal
