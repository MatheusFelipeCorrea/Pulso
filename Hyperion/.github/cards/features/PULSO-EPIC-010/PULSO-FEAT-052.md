---
card_id: "PULSO-FEAT-052"
title: "Backend — API e painel de planejamento"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-010"
due_date: null
board_sync_at: "2026-08-26T15:30:25.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API e painel de planejamento

> **Contexto:** CRUD de itens desejados e painel agregado com resumo financeiro.

**Refs:** RF-133

## 📝 Descrição

Expor endpoints em `/api/planejamento-compra` para listar painel e gerenciar itens.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/planejamento-compra` | Painel: `resumo`, `itens` (DESEJADO), `comprados` |
| POST | `/planejamento-compra` | Criar item (infere categoria se omitida) |
| PATCH | `/planejamento-compra/:id` | Editar (bloqueia se COMPRADO) |
| DELETE | `/planejamento-compra/:id` | Excluir item |

**Campos item:** nome, valorEstimado, prioridade, categoria, observacoes, linkProduto, imagemUrl, simularParcelas, parcelas

**Resumo:** totalValor, totalItens, mediaImpactoRenda, rendaMensal, sobraMensal, categorias, dicas

## 🔗 Sub-issues

- PULSO-TASK-105
- PULSO-TASK-106
- PULSO-TASK-108

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-105–108 — DB, repository e CRUD
