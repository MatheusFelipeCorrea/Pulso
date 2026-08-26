---
card_id: PULSO-TASK-047
title: "Frontend — GoalCard, goalStatusUtils e goals.css"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — GoalCard, goalStatusUtils e goals.css

> **Contexto:** Cards de progresso, alertas de vencimento e layout responsivo (RF-028, RN-068).

## 📝 Descrição

Implementar card visual de meta, utilitários de status/insight e folha de estilos da página.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `GoalCard.jsx` | Barra progresso, percentual, ações rápidas |
| `goalIcons.jsx` | Ícones por nome/status |
| `goalIconRules.js` | Regras de ícone |
| `goalStatusUtils.js` | `formatGoalDeadlineLabel`, `getGoalInsight`, variantes progress |
| `styles/goals.css` | Layout page, cards, sidebar, modais, mobile |

**RN-068:** label "Venceu em …" quando `meta.vencida === true`

**Responsivo:** sidebar abaixo da lista em mobile; CTAs touch-friendly

## 📋 Resumo

### ✅ Concluído
- Spec visual e utilitários definidos

### ⏳ Pendente
- Implementar GoalCard, utils e goals.css
