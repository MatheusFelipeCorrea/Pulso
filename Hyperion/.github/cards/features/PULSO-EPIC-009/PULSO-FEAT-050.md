---
card_id: PULSO-FEAT-050
title: "Frontend — edição de limites e estilos"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — edição de limites e estilos

> **Contexto:** Modal de edição em lote, toggle de rollover e folha de estilos.

**Refs:** RF-109 · RF-113 · RF-150

## 📝 Descrição

Implementar `BudgetEditModal` e utilitários/CSS do módulo.

## ✅ Critérios de Aceite

- Adicionar/remover categorias de despesa no mês
- Editar `limiteValor` (InputMoney) e toggle `rolloverAtivo`
- Preview de total vs `rendaMensal` com warning se exceder
- Persistência via `POST /orcamentos` (payload `limites[]`)
- `budget.css` responsivo; `BudgetTruncatedLabel` para nomes longos
- Client `services/budgetService.js` + utils de mês/filtro

## 🔗 Sub-issues

- PULSO-TASK-103

## 📋 Resumo

### ✅ Concluído
- UX do modal e rollover definida

### ⏳ Pendente
- PULSO-TASK-103 — modal, CSS e utils
