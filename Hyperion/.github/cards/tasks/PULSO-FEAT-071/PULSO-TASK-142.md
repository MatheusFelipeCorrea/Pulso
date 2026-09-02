---
card_id: "PULSO-TASK-142"
title: "Banco de dados — snapshot de insights"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-071"
due_date: null
board_sync_at: "2026-08-26T15:29:06.000Z"
categories:
  - "Banco de Dados"
---


# [TASK] Banco de dados — snapshot de insights

> **Contexto:** Persistir painel gerado por mês (cache + histórico).

## 📝 Descrição

Criar model de snapshot e reutilizar `HistoricoScore`.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Model sugerido `InsightSnapshot`:**

| Campo | Notas |
|-------|-------|
| usuarioId | FK |
| mesReferencia | Date (@db.Date) 1º dia do mês |
| payload | Json — resposta validada do painel |
| geradoPor | `gemini` \| `regras` \| `hibrido` |
| regeneracoesNoMes | Int default 0 |
| contextoHash | String? — invalidação opcional |
| criadoEm / atualizadoEm | timestamps |

`@@unique([usuarioId, mesReferencia])`

Reusar `HistoricoScore` para série temporal do score (já existe no schema).

**Migration:** `add_insight_snapshots`

## 📋 Resumo

### ✅ Concluído
- Spec de persistência definida

### ⏳ Pendente
- Criar model + migration
