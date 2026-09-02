---
card_id: "PULSO-TASK-103"
title: "Frontend — BudgetEditModal, CSS e utils"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-050"
due_date: null
board_sync_at: "2026-08-26T15:32:31.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [TASK] Frontend — BudgetEditModal, CSS e utils

> **Contexto:** Edição em lote de limites, toggle rollover e estilos responsivos.

## 📝 Descrição

Implementar modal de edição e utilitários/CSS.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `BudgetEditModal.jsx` | Limites[], add/remove categoria, InputMoney, Toggle rollover |
| `BudgetTruncatedLabel.jsx` | Truncar nomes longos |
| `styles/budget.css` | Layout página, barras, modal, mobile |
| `utils/budgetUtils.js` | `mesReferenciaAnterior`, `periodoToMesReferencia` |
| `utils/budgetFilterUtils.js` | Filtro de categorias na UI |

Warning no modal se soma dos limites > `rendaMensal`.

Payload salvar: `{ mesReferencia, limites: [{ categoriaId, limiteValor, rolloverAtivo }] }`

## 📋 Resumo

### ✅ Concluído
- UX edição e rollover definida

### ⏳ Pendente
- Implementar modal, CSS e utils
