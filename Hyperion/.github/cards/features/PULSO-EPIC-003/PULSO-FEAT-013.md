---
card_id: PULSO-FEAT-013
title: "Categorias, tags e sugestÃ£o automÃ¡tica"
status: Done
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de NegÃ³cio
---

# [FEATURE] Categorias, tags e sugestÃ£o automÃ¡tica

> **Contexto:** Categorias padrÃ£o/personalizadas, tags livres e inteligÃªncia de sugestÃ£o + validaÃ§Ã£o recursoÃ—categoria (RF-019â€“020, RF-026, RF-028).

**Refs:** RF-018 Â· RF-019 Â· RF-020 Â· RF-026 Â· RF-028

## ðŸ“ DescriÃ§Ã£o

Seed de categorias no cadastro; CRUD de categorias custom com `grupoBeneficio`; tags M:N; endpoint de sugestÃ£o por similaridade de descriÃ§Ã£o; validaÃ§Ã£o VA/VR Ã— categoria e rejeiÃ§Ã£o de recurso VT.

## âœ… CritÃ©rios de Aceite

### CenÃ¡rio 1 â€” Categorias padrÃ£o
**EntÃ£o** novo usuÃ¡rio recebe seed (`categoryService.seedCategoriasPadrao`).

### CenÃ¡rio 2 â€” Categoria custom
**Quando** cria categoria DESPESA com `grupoBeneficio=VA`,  
**EntÃ£o** sÃ³ aceita despesas com recurso VA.

### CenÃ¡rio 3 â€” Tags
**EntÃ£o** transaÃ§Ã£o pode ter N tags; nome Ãºnico por usuÃ¡rio.

### CenÃ¡rio 4 â€” SugestÃ£o RF-028
**Quando** `GET /transacoes/sugestao-categoria?tipo=&descricao=`,  
**EntÃ£o** retorna `categoriaId` sugerida por histÃ³rico (Dice/bigramas).

### CenÃ¡rio 5 â€” RF-026
**Quando** despesa com recurso VT ou VA/VR incompatÃ­vel com `grupoBeneficio`,  
**EntÃ£o** retorna `400` com mensagem explicativa (`recursoCategoriaRules`).

## ðŸ”— Sub-issues

- PULSO-TASK-028
- PULSO-TASK-029

## ðŸ‘¤ ResponsÃ¡vel

Alice Shikida (`aliceshikida`)

## ðŸ”— Pull Requests

- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) â€” Categorias, tags e sugestÃ£o (`FEAT-013`) â†’ issue [#26](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/26)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Regras de domÃ­nio e modais de gestÃ£o especificados

### â³ Pendente
- PULSO-TASK-028 â€” validaÃ§Ã£o recursoÃ—categoria + modals categorias/tags
- PULSO-TASK-029 â€” sugestÃ£o automÃ¡tica backend + debounce no form
