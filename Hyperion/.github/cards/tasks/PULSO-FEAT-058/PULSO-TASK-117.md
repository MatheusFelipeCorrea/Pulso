---
card_id: "PULSO-TASK-117"
title: "Banco de dados — Divisao e participantes"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-058"
due_date: null
board_sync_at: "2026-08-26T15:23:39.000Z"
categories:
  - "Banco de Dados"
---


# [TASK] Banco de dados — Divisao e participantes

> **Contexto:** Persistência de divisões, participantes e vínculo N:N com lembretes.

## 📝 Descrição

Criar models Prisma, enums e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Divisao` | titulo, valorTotal, tipo, status, data, icone, cor, observacao, quitadaEm |
| `DivisaoParticipante` | nome, valor, ehOrganizador, pagouAConta, status, dataPagamento |

**Enums:** `TipoRateioDivisao` (IGUAL, PERSONALIZADA), `StatusDivisao`, `StatusParticipanteDivisao`

**M2M:** `Lembrete.divisaoParticipantes` ↔ tabela `_DivisaoParticipanteToLembrete`

**Migrations:** `20260714163000_add_expense_split_module`, `20260715130000_lembrete_divisao_m2m`

## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations
