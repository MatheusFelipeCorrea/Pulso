---
card_id: PULSO-TASK-025
title: "Banco de dados â€” transaÃ§Ãµes, tags e vÃ­nculos"
status: Done
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-012
due_date: null
categories:
  - Banco de Dados
  - Regra de NegÃ³cio
---

# [TASK] Banco de dados â€” transaÃ§Ãµes, tags e vÃ­nculos

> **Contexto:** Modelagem persistente para transaÃ§Ãµes financeiras e tags.

## ðŸ“ DescriÃ§Ã£o

Criar models Prisma e migrations para `Transacao`, `Tag`, `TransacaoTag` e campo `grupoBeneficio` em `Categoria`.

## âœ… CritÃ©rios de Aceite

**EntÃ£o** schema contÃ©m:
- `Transacao`: tipo, recurso, recursoDestino?, valor, data, recorrente, regraRecorrencia, paiId
- `Tag`: nome Ãºnico por usuÃ¡rio, icone, cor
- `TransacaoTag`: M:N
- Ãndices: `[usuarioId, data]`, tipo, recurso, categoria, recorrente

## ðŸ› ï¸ ImplementaÃ§Ã£o

### `schema.prisma` (NOVO â€” CRIAR)

**Enums:** `TipoTransacao` (RECEITA, DESPESA, TRANSFERENCIA), `TipoRecurso` (DINHEIRO, VA, VR, POUPANCA), `GrupoBeneficioCategoria`

**Migrations relevantes:**
- `20260422195021_init`
- `20260708100000_add_transferencia_poupanca`
- `20260804120000_categoria_grupo_beneficio`

## ðŸ‘¤ ResponsÃ¡vel

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## ðŸ”— Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) â€” Camada API de transaÃ§Ãµes (`FEAT-012`) â†’ issue [#113](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/113)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec de models e Ã­ndices definida

### â³ Pendente
- Criar/aplicar migrations Prisma
