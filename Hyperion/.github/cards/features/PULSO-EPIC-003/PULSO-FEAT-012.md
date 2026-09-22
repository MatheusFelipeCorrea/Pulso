---
card_id: PULSO-FEAT-012
title: "Backend â€” API de transaÃ§Ãµes"
status: Done
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de NegÃ³cio
---

# [FEATURE] Backend â€” API de transaÃ§Ãµes

> **Contexto:** Camada REST para CRUD, listagem paginada, resumo agregado e opÃ§Ãµes de filtro (RF-016â€“023, RF-024).

**Refs:** RF-016 Â· RF-017 Â· RF-023 Â· RF-024

## ðŸ“ DescriÃ§Ã£o

Expor endpoints autenticados em `/api/transacoes` para criar, editar, excluir, listar com filtros e obter resumo financeiro do perÃ­odo.

## âœ… CritÃ©rios de Aceite

| MÃ©todo | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/transacoes` | Lista paginada com filtros |
| `GET` | `/transacoes/resumo` | Totais receita/despesa/saldo + modos benefÃ­cio/carteira/fluxo |
| `GET` | `/transacoes/filtros` | OpÃ§Ãµes para selects (categorias, tags, recursos) |
| `POST` | `/transacoes` | Cria transaÃ§Ã£o |
| `PATCH` | `/transacoes/:id` | Edita parcialmente |
| `DELETE` | `/transacoes/:id` | Exclui (query `excluirFuturas`, `dataCorte`) |

## ðŸ”— Sub-issues

- PULSO-TASK-025
- PULSO-TASK-026
- PULSO-TASK-027

## ðŸ‘¤ ResponsÃ¡vel

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## ðŸ”— Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) â€” Camada API de transaÃ§Ãµes (`FEAT-012`) â†’ issue [#25](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/25)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Contratos HTTP e payloads definidos

### â³ Pendente
- PULSO-TASK-025â€“027 â€” persistÃªncia, service e rotas
