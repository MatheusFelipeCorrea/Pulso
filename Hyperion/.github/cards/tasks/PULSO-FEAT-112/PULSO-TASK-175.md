---
card_id: PULSO-TASK-175
title: "Flutter — camada de dados de orçamento"
status: "In Progress"
type: Task
priority: High
sprint: "Sprint 4"
story_points: null
reporter: "Sofia Vasconcelos Moreira e Silva"
parent: PULSO-FEAT-112
due_date: null
categories:
  - Mobile
---

# [TASK] Flutter — camada de dados de orçamento

> **Contexto:** Mesma API Node `/api/orcamentos`.

## 📝 Descrição

Criar `features/budget/data`: models do status/resumo/categoria, `BudgetRepository` (status, salvar limites, copiar mês). Testes em `test/budget_test.dart`.

## ✅ Critérios de Aceite

**Então** `GET /orcamentos/status` parseia `resumo`, `categorias` (`status` normal/alerta/estourado) e `categoriasSemOrcamento`.

**Então** `POST /orcamentos` e `/copiar` usam `mesReferencia` no formato `YYYY-MM-01`.

## 👤 Responsável

Sofia Vasconcelos (`sofiavasconcelosms`)

## 📋 Resumo

### ⏳ Pendente
- Repository, models e testes
