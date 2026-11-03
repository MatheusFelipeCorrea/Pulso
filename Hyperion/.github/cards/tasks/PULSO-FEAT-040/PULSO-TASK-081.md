---
card_id: PULSO-TASK-081
title: "Banco de dados — Grupo e MembroGrupo"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-040
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
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

## 👤 Responsável

- Alice Shikida (`aliceshikida`) — API core


## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations
