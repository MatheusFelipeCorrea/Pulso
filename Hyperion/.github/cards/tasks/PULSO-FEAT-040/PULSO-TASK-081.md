---
card_id: "PULSO-TASK-081"
title: "Banco de dados — Grupo e MembroGrupo"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-040"
due_date: null
board_sync_at: "2026-08-26T15:32:09.000Z"
categories:
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [TASK] Banco de dados — Grupo e MembroGrupo

> **Contexto:** Modelagem persistente para grupos, membros e enums de papel/divisão.

## 📝 Descrição

Criar models Prisma e migrations para núcleo de grupos.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Grupo` | nome, descricao, codigoConvite `@unique`, urlImagem, modoDivisao, criadorId |
| `MembroGrupo` | grupoId, usuarioId, papel; `@@unique([grupoId, usuarioId])` |

**Enums:** `PapelGrupo` (ADMIN, MEMBRO), `ModoDivisaoGrupo` (PRETENSAO, DIVISAO_IGUAL)

**Migration:** `20260617140000_grupos`, `20260714134549_add_modo_divisao_grupo`

## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations
