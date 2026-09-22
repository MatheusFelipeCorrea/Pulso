---
card_id: PULSO-TASK-028
title: "Categorias, tags e validaÃ§Ã£o recursoÃ—categoria"
status: Done
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-013
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de NegÃ³cio
---

# [TASK] Categorias, tags e validaÃ§Ã£o recursoÃ—categoria

> **Contexto:** RF-019â€“020, RF-026 â€” gestÃ£o de taxonomia e compatibilidade recurso/categoria.

## ðŸ“ DescriÃ§Ã£o

Implementar seed de categorias, CRUD via modais na pÃ¡gina de transaÃ§Ãµes e validaÃ§Ã£o `grupoBeneficio` no backend e frontend.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### Backend (NOVO â€” CRIAR)

| Arquivo | FunÃ§Ã£o |
|---------|--------|
| `categoryService.js` | `seedCategoriasPadrao`, CRUD |
| `tagService.js` / `tagRepository.js` | CRUD tags |
| `recursoCategoriaRules.js` | `validarRecursoCategoria`, `buildMensagemIncompativel` |
| `categoryRoutes.js`, `tagRoutes.js` | REST categorias/tags |

**Campo:** `Categoria.grupoBeneficio` enum (VA, VR, ALIMENTACAO, etc.; VT legado rejeitado na API)

### Frontend (NOVO â€” CRIAR)

| Arquivo | FunÃ§Ã£o |
|---------|--------|
| `CategoryManageModal.jsx` | CRUD categorias + preset grupoBeneficio |
| `TagManageModal.jsx` | CRUD tags |
| `transactionValidation.js` | `validarRecursoCategoria` espelho client |
| `useTransactionFilterOptions.js` | Hook cache opÃ§Ãµes `/filtros` |

## ðŸ“ Regras de NegÃ³cio

- RF-026: recurso VT rejeitado; VA/VR incompatÃ­vel com `grupoBeneficio` da categoria
- Categoria.tipo deve bater com transaÃ§Ã£o.tipo
- Tag nome Ãºnico case-insensitive por usuÃ¡rio

## ðŸ‘¤ ResponsÃ¡vel

Alice Shikida (`aliceshikida`)

## ðŸ”— Pull Requests

- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) â€” Categorias, tags e `recursoCategoriaRules` (`FEAT-013`) â†’ issue [#116](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/116)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec de validaÃ§Ã£o desacoplada do nome literal (RF-NOVO-C2/C3)

### â³ Pendente
- Implementar rules + modais de gestÃ£o
