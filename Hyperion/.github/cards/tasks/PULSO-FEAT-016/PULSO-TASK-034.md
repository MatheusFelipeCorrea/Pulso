---
card_id: PULSO-TASK-034
title: "Frontend — TransactionFormModal"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
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


## 👤 Responsável

Maria Clara (`mariaoliveira27`)

## 🔗 Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) — `TransactionFormModal` (`FEAT-016`) → issue [#122](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/122)
## 📋 Resumo

### ✅ Concluído
- Spec de campos e validações definida

### ⏳ Pendente
- Implementar modal create/edit
