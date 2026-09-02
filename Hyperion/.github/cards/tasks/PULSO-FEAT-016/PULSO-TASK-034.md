---
card_id: "PULSO-TASK-034"
title: "Frontend — TransactionFormModal"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-016"
due_date: null
board_sync_at: "2026-08-26T15:31:22.000Z"
categories:
  - "web"
  - "Frontend"
  - "Regra de Negócio"
  - "UX / UI"
---


# [TASK] Frontend — TransactionFormModal

> **Contexto:** Formulário criar/editar receita, despesa, transferência e recorrência.

## 📝 Descrição

Modal completo com validação client, sugestão de categoria, tags inline e toggles de tipo.

## 🛠️ Implementação

### `TransactionFormModal.jsx` (NOVO — CRIAR)

Campos:
- Toggle RECEITA / DESPESA / TRANSFERENCIA
- `InputMoney`, `DatePicker`, `Select` categoria/recurso
- `TagsInput` com criação inline
- Recorrência: checkbox, frequência, até quando
- Integração `sugerirCategoria` debounced

**Design system:** Modal, FormFieldLabel, Button, Checkbox, IconButton

**Modos:** `create` | `edit` — hidrata form a partir de `transacao`

## 📋 Resumo

### ✅ Concluído
- Spec de campos e validações definida

### ⏳ Pendente
- Implementar modal create/edit
