---
card_id: PULSO-FEAT-014
title: "Transferências entre recursos"
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
  - Frontend
  - Web
  - Regra de Negócio
---

# [FEATURE] Transferências entre recursos

> **Contexto:** Movimentação entre recursos (ex.: DINHEIRO → POUPANCA) sem contabilizar como receita/despesa nos totais (RF-027).

**Refs:** RF-027

## 📝 Descrição

Tipo `TRANSFERENCIA` com `recurso` origem e `recursoDestino` destino; sem `categoriaId`; excluída de agregados receita/despesa; notificação `TRANSFERENCIA_REGISTRADA`.

## ✅ Critérios de Aceite

### Cenário 1 — Criar transferência
**Quando** `tipo=TRANSFERENCIA`, `recurso≠recursoDestino`,  
**Então** grava transação; saldos origem/destino atualizados via lógica de recurso.

### Cenário 2 — Resumo
**Então** transferências **não** entram em totais de receitas/despesas do `/resumo`.

### Cenário 3 — UI
**Então** toggle transferência no form; selects origem/destino; validação client-side.

## 🔗 Sub-issues

- PULSO-TASK-030


## 👤 Responsável

Sofia Vasconcelos (`sofiavasconcelosms`)

## 🔗 Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) — Testes de transferência e QA (`FEAT-014` + `FEAT-017`) → issue [#27](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/27)
- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) — Tipo `TRANSFERENCIA` no service da API (`FEAT-012`)
## 📋 Resumo

### ✅ Concluído
- Spec RF-027 e enum `TipoRecurso` incluindo POUPANCA documentados

### ⏳ Pendente
- PULSO-TASK-030 — backend + frontend transferências
