---
card_id: PULSO-FEAT-012
title: "Backend — API de transações"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de transações

> **Contexto:** Camada REST para CRUD, listagem paginada, resumo agregado e opções de filtro (RF-016–023, RF-024).

**Refs:** RF-016 · RF-017 · RF-023 · RF-024

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
