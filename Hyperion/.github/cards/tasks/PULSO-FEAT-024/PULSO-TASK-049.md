---
card_id: PULSO-TASK-049
title: "Banco de dados — viagens, despesas, observações e favoritas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-024
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — viagens, despesas, observações e favoritas

> **Contexto:** Modelagem persistente para viagens pessoais e moedas favoritas.

## 📝 Descrição

Criar models Prisma e migrations para viagens, pretensões, observações e favoritas.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Viagem` | destino, destinoMeta (Json), moeda, dataPrevista, metaId? `@unique` |
| `DespesaViagem` | categoria (enum 10 valores), valorEstimado, descricao? |
| `ObservacaoViagem` | titulo, conteudo?, tipo?, linkUrl?, checklist (Json) |
| `MoedaFavorita` | codigo; `@@unique([usuarioId, codigo])` |

**Enums:** `CategoriaDespesaViagem`, `TipoObservacaoViagem`

**Migrations:** `20260609180000_trip_expense_categories`, `20260609190000_viagem_observacoes`, `20260617130000_viagem_destino_meta`, `20260804130000_viagem_meta_id_unique`

## 📋 Resumo

### ✅ Concluído
- Spec de models e constraints definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma
