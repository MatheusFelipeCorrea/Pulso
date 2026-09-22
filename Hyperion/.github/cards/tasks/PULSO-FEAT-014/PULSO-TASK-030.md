---
card_id: PULSO-TASK-030
title: "TransferÃªncias â€” backend e formulÃ¡rio"
status: Done
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-014
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de NegÃ³cio
---

# [TASK] TransferÃªncias â€” backend e formulÃ¡rio

> **Contexto:** RF-027 â€” tipo TRANSFERENCIA ponta a ponta.

## ðŸ“ DescriÃ§Ã£o

Implementar fluxo completo de transferÃªncia entre recursos no service e no TransactionFormModal.

## âœ… CritÃ©rios de Aceite

**EntÃ£o** criar/editar transferÃªncia valida origemâ‰ destino; UI oculta categoria; notificaÃ§Ã£o especÃ­fica.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### Backend (NOVO â€” CRIAR)

Em `transactionService.criarTransacao` / `editarTransacao`:
- Branch `tipo === 'TRANSFERENCIA'`
- `notificarTransferenciaRegistrada`

Agregados em `calcularAgregados`: filtrar apenas RECEITA/DESPESA

### Frontend (NOVO â€” CRIAR)

Em `TransactionFormModal.jsx`:
- Toggle tipo inclui `TRANSFERENCIA`
- Campos `recurso` + `recursoDestino`
- `validarTransferencia()` em `transactionValidation.js`

## ðŸ‘¤ ResponsÃ¡vel

Sofia Vasconcelos (`sofiavasconcelosms`)

## ðŸ”— Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) â€” Testes de transferÃªncia (`FEAT-014` + `FEAT-017`) â†’ issue [#152](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/152)
- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) â€” `TRANSFERENCIA` no service (`FEAT-012`)
- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” Toggle no formulÃ¡rio (`FEAT-016`)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec RF-027 documentada

### â³ Pendente
- Implementar branch transferÃªncia API + UI
