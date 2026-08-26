---
card_id: PULSO-TASK-017
title: "Frontend — gráficos Recharts e seletor de mês"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-008
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — gráficos Recharts e seletor de mês

> **Contexto:** RF-009 e RF-010 — visualizações com Recharts e navegação de período.

## 📝 Descrição

Implementar gráfico de área receitas/despesas e donut de categorias, sincronizados com `periodo` do DashboardPage.

## ✅ Critérios de Aceite

### Cenário 1 — Area chart
**Então** `DashboardIncomeExpenseChart` com `receitasDespesas.serie`, totais no header, link "Ver transações".

### Cenário 2 — Month picker
**Então** `MonthPicker` + setas prev/next; emite `onChangePeriodo(YYYY-MM)`.

### Cenário 3 — Donut
**Então** `DashboardCategoryDonut` com `gastosPorCategoria[]`; legenda com cor da categoria.

### Cenário 4 — Tema
**Então** paleta `CHART_THEME` light/dark via `useTheme`.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DashboardIncomeExpenseChart.jsx` | AreaChart Recharts + MonthPicker |
| `DashboardCategoryDonut.jsx` | Pie/Donut chart categorias |
| `utils/transactionRecurrence.js` | `monthPickerParaPeriodo`, `periodoParaMonthPicker` |

**Helper exportado:** `currentDashboardPeriodo()` → `YYYY-MM` atual

**Dependência:** `recharts`, `date-fns`, `@/design-system/components/pickers/MonthPicker`

## 📋 Resumo

### ✅ Concluído
- Spec de charts e navegação de mês definida

### ⏳ Pendente
- Implementar ambos os gráficos com empty/loading states
