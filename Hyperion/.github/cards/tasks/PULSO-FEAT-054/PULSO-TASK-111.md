---
card_id: PULSO-TASK-111
title: "Backend — marcar comprado e transação"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-054
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — marcar comprado e transação

> **Contexto:** RF-138 / RN-092–093 — “Comprei!” com despesa e conclusão de meta.

## 📝 Descrição

Implementar `POST /:id/comprar` com efeitos colaterais.

## 🛠️ Implementação

### `marcarComprado` (NOVO — CRIAR)

1. Validar item DESEJADO
2. Resolver categoria DESPESA (`categoriaId` ou nome “Compras”)
3. Criar transação DESPESA (`descricao: Compra: {nome}`)
4. Atualizar item: status COMPRADO, `compradoEm`, `transacaoId`
5. Se `metaId` e meta não CONCLUIDA/CANCELADA → `status: CONCLUIDA` (RN-093)

Body opcional: `{ categoriaId, recurso }` — recurso default `DINHEIRO`

## 📋 Resumo

### ✅ Concluído
- Fluxo RN-092–093 documentado

### ⏳ Pendente
- Implementar marcarComprado
