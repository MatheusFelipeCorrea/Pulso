---
card_id: PULSO-TASK-037
title: "Banco de dados — Meta e AporteMeta"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-018
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — Meta e AporteMeta

> **Contexto:** Modelagem persistente para metas pessoais e histórico de aportes.

## 📝 Descrição

Criar models Prisma e migrations para `Meta` e `AporteMeta` com enums de tipo e status.

## ✅ Critérios de Aceite

**Então** schema contém:
- `Meta`: nome, valorAlvo, valorAtual, prazo, tipo, status, prioridade?, descricao?, concluidaEm?
- `AporteMeta`: metaId, valor, data
- Enums: `TipoMeta` (CURTO_PRAZO, LONGO_PRAZO), `StatusMeta` (ATIVA, PAUSADA, CONCLUIDA, CANCELADA)
- Índices: `[usuarioId, status]`, `[usuarioId, prazo]`, `[metaId, data DESC]`
- Relação `Viagem.metaId` com `onDelete: SetNull`

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Migration relevante:** `20260615120000_metas`

## 📋 Resumo

### ✅ Concluído
- Spec de models e índices definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma
