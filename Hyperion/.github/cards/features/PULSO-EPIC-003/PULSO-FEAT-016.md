---
card_id: PULSO-FEAT-016
title: "Frontend â€” pÃ¡gina de transaÃ§Ãµes"
status: Done
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend â€” pÃ¡gina de transaÃ§Ãµes

> **Contexto:** Tela principal `/transactions` com resumo, filtros, lista, paginaÃ§Ã£o e modais (RF-016â€“025).

**Refs:** RF-016 Â· RF-017 Â· RF-023 Â· RF-024 Â· RF-025

## ðŸ“ DescriÃ§Ã£o

PÃ¡gina orquestra listagem + resumo paralelos; filtros pendentes vs. ativos; modais criar/editar/excluir; gestÃ£o inline de categorias e tags.

## âœ… CritÃ©rios de Aceite

### CenÃ¡rio 1 â€” Listagem
**EntÃ£o** transaÃ§Ãµes agrupadas por data; paginaÃ§Ã£o 10/pÃ¡gina; loading/error states.

### CenÃ¡rio 2 â€” Filtros
**EntÃ£o** perÃ­odo, categoria, tipo, recurso, busca texto/tag; botÃµes Filtrar/Limpar.

### CenÃ¡rio 3 â€” Resumo
**EntÃ£o** cards receitas/despesas/saldo refletem filtros ativos.

### CenÃ¡rio 4 â€” CRUD
**EntÃ£o** modais criar/editar com validaÃ§Ã£o; toast sucesso/erro.

## ðŸ”— Sub-issues

- PULSO-TASK-033
- PULSO-TASK-034
- PULSO-TASK-035

## ðŸ‘¤ ResponsÃ¡vel

Maria Clara (`mariaoliveira27`)

## ðŸ”— Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” PÃ¡gina de transaÃ§Ãµes (`FEAT-016`) â†’ issue [#29](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/29)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec de UX e componentes mapeada

### â³ Pendente
- PULSO-TASK-033 â€” TransactionsPage + listagem/filtros/resumo
- PULSO-TASK-034 â€” TransactionFormModal
- PULSO-TASK-035 â€” DeleteTransactionModal + estilos
