---
card_id: PULSO-TASK-105
title: "Banco de dados — ItemPlanejamentoCompra"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-052
due_date: null
categories:
  - Banco de Dados
---

# [TASK] Banco de dados — ItemPlanejamentoCompra

> **Contexto:** Persistência de itens desejados/comprados com vínculo a meta e transação.

## 📝 Descrição

Criar model Prisma, enums e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Campo | Notas |
|-------|-------|
| nome, valorEstimado, prioridade | Core RF-133 |
| categoria | Enum CategoriaItemCompra |
| simularParcelas, parcelas | 1–48; default 12 |
| metaId, status, compradoEm, transacaoId | Ciclo de vida |
| imagemUrl, linkProduto, observacoes | Opcionais |

**Enums:** `StatusItemCompra` (DESEJADO, COMPRADO), `CategoriaItemCompra`

**Migrations:** `20260620140000_planejamento_compra`, imagem, reorganiza categorias

## 📋 Resumo

### ✅ Concluído
- Spec do model definida

### ⏳ Pendente
- Criar/aplicar migrations
