---
card_id: PULSO-TASK-034
title: "Frontend â€” TransactionFormModal"
status: Done
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de NegÃ³cio
---

# [TASK] Frontend â€” TransactionFormModal

> **Contexto:** FormulÃ¡rio criar/editar receita, despesa, transferÃªncia e recorrÃªncia.

## ðŸ“ DescriÃ§Ã£o

Modal completo com validaÃ§Ã£o client, sugestÃ£o de categoria, tags inline e toggles de tipo.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### `TransactionFormModal.jsx` (NOVO â€” CRIAR)

Campos:
- Toggle RECEITA / DESPESA / TRANSFERENCIA
- `InputMoney`, `DatePicker`, `Select` categoria/recurso
- `TagsInput` com criaÃ§Ã£o inline
- RecorrÃªncia: checkbox, frequÃªncia, atÃ© quando
- IntegraÃ§Ã£o `sugerirCategoria` debounced

**Design system:** Modal, FormFieldLabel, Button, Checkbox, IconButton

**Modos:** `create` | `edit` â€” hidrata form a partir de `transacao`

## ðŸ‘¤ ResponsÃ¡vel

Maria Clara (`mariaoliveira27`)

## ðŸ”— Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” `TransactionFormModal` (`FEAT-016`) â†’ issue [#122](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/122)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec de campos e validaÃ§Ãµes definida

### â³ Pendente
- Implementar modal create/edit
