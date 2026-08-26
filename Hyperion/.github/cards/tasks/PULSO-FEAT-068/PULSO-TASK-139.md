---
card_id: PULSO-TASK-139
title: "Frontend — cards, modais, badges e CSS"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-068
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — cards, modais, badges e CSS

> **Contexto:** Componentes visuais e badges de status (RN-078).

## 📝 Descrição

Implementar UI de lista, badges e modais.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DebtSummaryCards.jsx` | Totais me devem / eu devo |
| `DebtTabs.jsx` / `DebtFilters.jsx` / `DebtList.jsx` / `DebtCard.jsx` | Navegação e lista |
| `DebtFormModal.jsx` | Criar/editar |
| `DebtPaymentModal.jsx` / `SettleDebtModal.jsx` | Pagar / quitar |
| `ReopenDebtModal.jsx` / `DeleteDebtModal.jsx` / `DebtDetailsModal.jsx` | Reabrir, excluir, detalhes |
| `utils/debtStatusUtils.js` | Badge vencida / parcial / quitada |
| `utils/debtBalanceUtils.js` | Saldo no client |
| `styles/debts.css` | Layout responsivo |

## 📋 Resumo

### ✅ Concluído
- Componentes e badges mapeados

### ⏳ Pendente
- Implementar UI completa
