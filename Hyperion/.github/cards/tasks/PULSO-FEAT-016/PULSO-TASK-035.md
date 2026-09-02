---
card_id: "PULSO-TASK-035"
title: "Frontend — exclusão e estilos transactions.css"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-016"
due_date: null
board_sync_at: "2026-08-26T15:31:23.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [TASK] Frontend — exclusão e estilos transactions.css

> **Contexto:** Modal de exclusão recorrente + layout responsivo da página.

## 📝 Descrição

Implementar confirmação de delete com opções recorrentes e folha de estilos da página de transações.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DeleteTransactionModal.jsx` | Confirmar; opções recorrentes |
| `styles/transactions.css` | Layout page, filtros, lista, modais, mobile |

**Responsivo:** filtros empilham; lista legível em mobile; CTAs full-width onde necessário

Importar CSS na TransactionsPage ou bundle global.

## 📋 Resumo

### ✅ Concluído
- Spec delete recorrente + breakpoints definidos

### ⏳ Pendente
- Implementar DeleteTransactionModal + transactions.css
