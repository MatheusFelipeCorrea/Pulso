---
card_id: PULSO-TASK-018
title: "Frontend — transações, alertas e metas"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-009
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — transações, alertas e metas

> **Contexto:** Widgets RF-011, RF-012, RF-013.

## 📝 Descrição

Exibir últimas transações do mês, banner de alertas de orçamento e cards de metas ativas.

## ✅ Critérios de Aceite

### Cenário 1 — Transações
**Então** `DashboardRecentTransactions` lista até 25 itens com valor colorido por tipo.

### Cenário 2 — Alertas
**Então** `DashboardBudgetAlerts` no topo quando `alertasOrcamento.length > 0`; link para `/budget?mes=`.

### Cenário 3 — Metas
**Então** `DashboardActiveGoals` com barra de progresso e CTA `/goals`.

### Cenário 4 — Empty states
**Então** mensagens amigáveis quando listas vazias.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DashboardRecentTransactions.jsx` | Lista compacta |
| `DashboardBudgetAlerts.jsx` | Banner/cards alerta orçamento |
| `DashboardActiveGoals.jsx` | Grid de metas ativas |

**Dados:** props vindos de `DashboardPage` (`data.ultimasTransacoes`, `data.alertasOrcamento`, `data.metasAtivas`)

## 📋 Resumo

### ✅ Concluído
- Spec de widgets e links de navegação definida

### ⏳ Pendente
- Implementar 3 componentes + estilos em `dashboard.css`
