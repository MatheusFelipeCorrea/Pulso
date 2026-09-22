---
card_id: PULSO-TASK-035
title: "Frontend â€” exclusÃ£o e estilos transactions.css"
status: Done
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend â€” exclusÃ£o e estilos transactions.css

> **Contexto:** Modal de exclusÃ£o recorrente + layout responsivo da pÃ¡gina.

## ðŸ“ DescriÃ§Ã£o

Implementar confirmaÃ§Ã£o de delete com opÃ§Ãµes recorrentes e folha de estilos da pÃ¡gina de transaÃ§Ãµes.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### Componentes (NOVO â€” CRIAR)

| Arquivo | FunÃ§Ã£o |
|---------|--------|
| `DeleteTransactionModal.jsx` | Confirmar; opÃ§Ãµes recorrentes |
| `styles/transactions.css` | Layout page, filtros, lista, modais, mobile |

**Responsivo:** filtros empilham; lista legÃ­vel em mobile; CTAs full-width onde necessÃ¡rio

Importar CSS na TransactionsPage ou bundle global.

## ðŸ‘¤ ResponsÃ¡vel

Maria Clara (`mariaoliveira27`)

## ðŸ”— Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” exclusÃ£o e `transactions.css` (`FEAT-016`) â†’ issue [#123](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/123)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec delete recorrente + breakpoints definidos

### â³ Pendente
- Implementar DeleteTransactionModal + transactions.css
