---
card_id: "PULSO-FEAT-012"
title: "Backend — API de transações"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-003"
due_date: null
board_sync_at: "2026-08-26T15:29:45.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API de transações

> **Contexto:** Camada REST para CRUD, listagem paginada, resumo agregado e opções de filtro (RF-015–022, RF-023).

**Refs:** RF-015 · RF-016 · RF-022 · RF-023

## 📝 Descrição

Expor endpoints autenticados em `/api/transacoes` para criar, editar, excluir, listar com filtros e obter resumo financeiro do período.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/transacoes` | Lista paginada com filtros |
| `GET` | `/transacoes/resumo` | Totais receita/despesa/saldo + modos benefício/carteira/fluxo |
| `GET` | `/transacoes/filtros` | Opções para selects (categorias, tags, recursos) |
| `POST` | `/transacoes` | Cria transação |
| `PATCH` | `/transacoes/:id` | Edita parcialmente |
| `DELETE` | `/transacoes/:id` | Exclui (query `excluirFuturas`, `dataCorte`) |

## 🔗 Sub-issues

- PULSO-TASK-025
- PULSO-TASK-026
- PULSO-TASK-027

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e payloads definidos

### ⏳ Pendente
- PULSO-TASK-025–027 — persistência, service e rotas
