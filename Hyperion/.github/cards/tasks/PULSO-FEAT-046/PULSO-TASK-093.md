---
card_id: "PULSO-TASK-093"
title: "Banco de dados — model Orcamento"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-046"
due_date: null
board_sync_at: "2026-08-26T15:32:21.000Z"
categories:
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [TASK] Banco de dados — model Orcamento

> **Contexto:** Persistência de limites mensais por categoria com suporte a rollover.

## 📝 Descrição

Criar model Prisma `Orcamento` e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Campo | Tipo | Notas |
|-------|------|-------|
| usuarioId | String | FK Usuario |
| categoriaId | String | FK Categoria |
| mesReferencia | DateTime @db.Date | 1º dia do mês |
| limiteValor | Decimal(12,2) | Limite efetivo do mês |
| rolloverAtivo | Boolean | default false |
| valorRollover | Decimal(12,2) | default 0 — sobra herdada |

**Constraints:** `@@unique([usuarioId, categoriaId, mesReferencia])`

**Migrations:** tabela `orcamentos` + `20260714150000_add_orcamento_rollover`

## 📋 Resumo

### ✅ Concluído
- Spec do model definida

### ⏳ Pendente
- Criar/aplicar migrations
