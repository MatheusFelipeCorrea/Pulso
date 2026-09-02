---
card_id: "PULSO-TASK-114"
title: "Frontend — cards, sidebar e alertas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-056"
due_date: null
board_sync_at: "2026-08-26T15:23:36.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — cards, sidebar e alertas

> **Contexto:** Componentes visuais do painel de desejos e resumo.

## 📝 Descrição

Implementar lista de itens, sidebar e alerta de comprometimento.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `PurchaseItemCard.jsx` | Prioridade, meses, parcelas, ações |
| `PurchaseInstallmentGauge.jsx` | Nível saudavel/atencao/arriscado |
| `PurchasePlanningAlert.jsx` | Alerta se impacto > 30% |
| `PurchasePlanningSidebar.jsx` | Resumo + dicas |
| `PurchaseCategoryDonut.jsx` | Distribuição por categoria |
| `PurchaseRecentTable.jsx` | Comprados recentes |

Utils web: `shouldShowImpactAlert` em `purchasePlanningUtils.js`

## 📋 Resumo

### ✅ Concluído
- Componentes RF-134–136 mapeados

### ⏳ Pendente
- Implementar cards e sidebar
