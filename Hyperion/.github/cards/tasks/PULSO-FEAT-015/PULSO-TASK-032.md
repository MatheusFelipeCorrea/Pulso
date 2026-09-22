---
card_id: PULSO-TASK-032
title: "ExclusÃ£o recorrente com preservaÃ§Ã£o de histÃ³rico"
status: Done
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-015
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de NegÃ³cio
---

# [TASK] ExclusÃ£o recorrente com preservaÃ§Ã£o de histÃ³rico

> **Contexto:** RF-NOVO-C1 â€” "excluir esta e futuras" sem apagar passado.

## ðŸ“ DescriÃ§Ã£o

Implementar `excluirTransacao` com flag `excluirFuturas` e UI de opÃ§Ãµes no DeleteTransactionModal.

## âœ… CritÃ©rios de Aceite

**Quando** DELETE com `excluirFuturas=true`,  
**EntÃ£o** remove filhas â‰¥ dataCorte; aplica UNTIL na mÃ£e; mantÃ©m filhas anteriores.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### Backend (NOVO â€” CRIAR)

Em `transactionService.excluirTransacao`:
- Detectar mÃ£e vs. filha recorrente
- `transactionRepository.excluirRecorrentesFilhasAPartirDe`
- `encerrarRecorrencia(paiId, novaRegra)`

### Frontend (NOVO â€” CRIAR)

| Arquivo | FunÃ§Ã£o |
|---------|--------|
| `DeleteTransactionModal.jsx` | OpÃ§Ãµes: sÃ³ esta / esta e futuras |
| `transactionService.excluirTransacao` | Query params delete |

## ðŸ‘¤ ResponsÃ¡vel

VinÃ­cius SimÃµes (`ViniSimoesV`)

## ðŸ”— Pull Requests

- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) â€” ExclusÃ£o recorrente (`FEAT-015`) â†’ issue [#155](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/155)
- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” `DeleteTransactionModal` (`FEAT-016`)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Comportamento RF-NOVO-C1 especificado

### â³ Pendente
- Implementar backend + modal de exclusÃ£o
