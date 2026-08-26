---
card_id: PULSO-TASK-058
title: "Frontend — pretensões, observações e transporte"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-028
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — pretensões, observações e transporte

> **Contexto:** Seções editáveis de gastos estimados, notas e insights de passagem.

## 📝 Descrição

Implementar modais e seções de pretensões/observações plus widget de preços de transporte.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `detail/TripDetailExpensesSection.jsx` | Tabela pretensões por categoria |
| `TripExpenseFormModal.jsx` | Create/edit despesa |
| `DeleteTripExpenseModal.jsx` | Confirmar exclusão |
| `detail/TripDetailObservationsSection.jsx` | Lista observações/checklists |
| `TripObservationFormModal.jsx` | Create/edit observação |
| `DeleteTripObservationModal.jsx` | Confirmar exclusão |
| `detail/TripTransportPriceInsights.jsx` | Avião/ônibus/trem |
| `detail/TripOriginPicker.jsx` | Seleção origem BR |
| `utils/tripExpenseCategories.js` | Labels 10 categorias RN-074 |

## 📋 Resumo

### ✅ Concluído
- Modais e seções especificados

### ⏳ Pendente
- Implementar seções de detalhe e modais
