---
card_id: "PULSO-FEAT-008"
title: "Gráficos receitas/despesas e categorias"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-002"
due_date: null
board_sync_at: "2026-08-26T15:29:41.000Z"
categories:
  - "web"
  - "Frontend"
  - "Regra de Negócio"
  - "UX / UI"
---


# [FEATURE] Gráficos receitas/despesas e categorias

> **Contexto:** Visualizações principais do dashboard — evolução diária de receitas vs. despesas e distribuição de gastos por categoria (RF-009, RF-010).

**Refs:** RF-009 · RF-010

## 📝 Descrição

Gráfico de área (Recharts) com série diária do mês e donut de categorias. Seletor de mês sincronizado com query `?mes=` do endpoint agregado.

## ✅ Critérios de Aceite

### Cenário 1 — Receitas vs. despesas
**Então** `AreaChart` com duas séries (receitas verde, despesas vermelho), eixo X por dia, tooltip formatado em BRL.

### Cenário 2 — Tema claro/escuro
**Então** cores do gráfico adaptam via `useTheme` (tokens distintos light/dark).

### Cenário 3 — Navegação de mês
**Quando** altero mês no picker ou setas prev/next,  
**Então** recarrega dashboard para o período selecionado.

### Cenário 4 — Donut categorias
**Então** exibe top categorias com cor/ícone, percentual e total; estado vazio amigável.

## 🔗 Sub-issues

- PULSO-TASK-017

## 📋 Resumo

### ✅ Concluído
- Spec Recharts + MonthPicker + empty states definida

### ⏳ Pendente
- PULSO-TASK-017 — IncomeExpenseChart + CategoryDonut
