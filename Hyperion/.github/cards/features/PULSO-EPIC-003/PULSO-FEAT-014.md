---
card_id: PULSO-FEAT-014
title: "Transferências entre recursos"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [FEATURE] Transferências entre recursos

> **Contexto:** Movimentação entre recursos (ex.: DINHEIRO → POUPANCA) sem contabilizar como receita/despesa nos relatórios (RF-140).

**Refs:** RF-140

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

## 📋 Resumo

### ✅ Concluído
- Spec RF-140 e enum `TipoRecurso` incluindo POUPANCA documentados

### ⏳ Pendente
- PULSO-TASK-030 — backend + frontend transferências
