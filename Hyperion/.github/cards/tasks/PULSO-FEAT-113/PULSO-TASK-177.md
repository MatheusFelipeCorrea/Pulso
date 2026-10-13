---
card_id: PULSO-TASK-177
title: "Flutter — camada de dados de planejamento de compra"
status: "In Progress"
type: Task
priority: High
sprint: "Sprint 4"
story_points: null
reporter: "Vinícius Simões"
parent: PULSO-FEAT-113
due_date: null
categories:
  - Mobile
---

# [TASK] Flutter — camada de dados de planejamento de compra

> **Contexto:** Mesma API Node `/api/planejamento-compra`.

## 📝 Descrição

Criar `features/purchase/data`: models do painel/item/resumo, `PurchasePlanningRepository` (listar, CRUD, vincular meta, comprar). Testes em `test/purchase_planning_test.dart`.

## ✅ Critérios de Aceite

**Então** o painel parseia `resumo` (sobra/renda como string), `itens` e `comprados`.

**Então** `vincular-meta` e `comprar` batem nas rotas da API.

## 👤 Responsável

Vinícius Simões (`ViniSimoesV`)

## 📋 Resumo

### ⏳ Pendente
- Repository, models e testes
