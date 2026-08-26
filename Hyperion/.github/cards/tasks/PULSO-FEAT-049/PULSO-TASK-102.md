---
card_id: PULSO-TASK-102
title: "Frontend — cards de resumo e listas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-049
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — cards de resumo e listas

> **Contexto:** Visualização de totais, progresso por categoria e categorias sem limite.

## 📝 Descrição

Implementar componentes de resumo e listas do orçamento.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `BudgetSummaryCards.jsx` | Totais, %, aviso RN-059 se `orcamentoExcedeRenda` |
| `BudgetCategoryList.jsx` | Ordenar por %; item com barra |
| `BudgetCategoryItem.jsx` | Progresso + status visual |
| `BudgetCategoriesWithoutLimit.jsx` | Lista + CTA adicionar limite |
| `DashboardBudgetAlerts.jsx` | Widget opcional no dashboard |

Filtro client: `budgetFilterUtils.filtrarCategoriasOrcamento`

## 📋 Resumo

### ✅ Concluído
- Componentes RF-110/114 mapeados

### ⏳ Pendente
- Implementar cards e listas
