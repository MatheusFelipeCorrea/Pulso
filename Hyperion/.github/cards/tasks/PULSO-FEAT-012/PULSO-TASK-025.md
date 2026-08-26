---
card_id: PULSO-TASK-025
title: "Banco de dados — transações, tags e vínculos"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-012
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — transações, tags e vínculos

> **Contexto:** Modelagem persistente para transações financeiras e tags.

## 📝 Descrição

Criar models Prisma e migrations para `Transacao`, `Tag`, `TransacaoTag` e campo `grupoBeneficio` em `Categoria`.

## ✅ Critérios de Aceite

**Então** schema contém:
- `Transacao`: tipo, recurso, recursoDestino?, valor, data, recorrente, regraRecorrencia, paiId
- `Tag`: nome único por usuário, icone, cor
- `TransacaoTag`: M:N
- Índices: `[usuarioId, data]`, tipo, recurso, categoria, recorrente

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Enums:** `TipoTransacao` (RECEITA, DESPESA, TRANSFERENCIA), `TipoRecurso` (DINHEIRO, VA, VR, VT, POUPANCA), `GrupoBeneficioCategoria`

**Migrations relevantes:**
- `20260422195021_init`
- `20260708100000_add_transferencia_poupanca`
- `20260804120000_categoria_grupo_beneficio`

## 📋 Resumo

### ✅ Concluído
- Spec de models e índices definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma
