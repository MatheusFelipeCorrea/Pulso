---
card_id: PULSO-TASK-029
title: "SugestÃ£o automÃ¡tica de categoria (RF-028)"
status: Done
type: Task
priority: Medium
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

# [TASK] SugestÃ£o automÃ¡tica de categoria (RF-028)

> **Contexto:** Sugerir categoria com base em descriÃ§Ãµes similares do histÃ³rico do usuÃ¡rio.

## ðŸ“ DescriÃ§Ã£o

Endpoint backend + debounce no formulÃ¡rio para preencher categoria automaticamente ao digitar descriÃ§Ã£o.

## âœ… CritÃ©rios de Aceite

**Quando** descriÃ§Ã£o â‰¥3 chars no form,  
**EntÃ£o** apÃ³s 400ms chama `GET /transacoes/sugestao-categoria`; preenche select se confianÃ§a suficiente.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### Backend (NOVO â€” CRIAR)

| Arquivo | FunÃ§Ã£o |
|---------|--------|
| `categorySuggestionService.js` | Orquestra histÃ³rico + utils |
| `categorySuggestionUtils.js` | `similaridade`, `sugerirCategoriaId` (Dice bigramas) |
| `transactionRepository.js` | `listarDescricoesPorTipo` |

### Frontend (NOVO â€” CRIAR)

Em `TransactionFormModal.jsx`:
- Debounce 400ms (`SUGESTAO_DEBOUNCE_MS`)
- Flag `categoriaAutoSugerida` para UX
- `transactionService.sugerirCategoria({ tipo, descricao })`

## ðŸ‘¤ ResponsÃ¡vel

Alice Shikida (`aliceshikida`)

## ðŸ”— Pull Requests

- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) â€” `categorySuggestionService` / utils (`FEAT-013`) â†’ issue [#117](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/117)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Algoritmo e contrato API especificados

### â³ Pendente
- Implementar service + integraÃ§Ã£o no form
