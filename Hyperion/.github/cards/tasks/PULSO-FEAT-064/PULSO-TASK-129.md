---
card_id: PULSO-TASK-129
title: "Banco de dados — Divida e PagamentoDivida"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-064
due_date: null
categories:
  - Banco de Dados
---

# [TASK] Banco de dados — Divida e PagamentoDivida

> **Contexto:** Persistência de empréstimos e pagamentos parciais.

## 📝 Descrição

Criar models Prisma, enum e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Divida` | direcao, nomePessoa, valor, dataEmprestimo, prazoDevolucao, observacao, quitada, dataQuitacao |
| `PagamentoDivida` | dividaId, valor, dataPagamento, observacao |

**Enum:** `DirecaoDivida` (ME_DEVEM, EU_DEVO)

**Migrations:** `20260612120000_dividas`, `20260614120000_pagamentos_divida`

## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations
