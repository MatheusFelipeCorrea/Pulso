---
card_id: "PULSO-FEAT-019"
title: "Cálculos, progresso e reserva de emergência"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-004"
due_date: null
board_sync_at: "2026-08-26T15:29:52.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Cálculos, progresso e reserva de emergência

> **Contexto:** Utilitários de domínio para progresso, sugestão mensal, tipo curto/longo prazo e meta especial RF-142.

**Refs:** RF-029 · RF-030 · RF-142 · RN-067 · RN-068

## 📝 Descrição

Implementar cálculos compartilhados API/Web e endpoint de sugestão de reserva de emergência baseado em despesas dos últimos 3 meses.

## ✅ Critérios de Aceite

| Endpoint / util | Comportamento |
|-----------------|---------------|
| `GET /metas/sugestao-reserva-emergencia?meses=N` | Retorna `mediaGastoMensal`, `valorSugerido`, `mesesHistoricoAnalisado` |
| `calcProgressoMeta` | `valorRestante`, `percentual` cap 100% |
| `calcValorMensalSugerido` | `valorRestante / diffMesesAte(prazo)` (RN-067) |
| `inferirTipoMeta` | ≤ 6 meses → `CURTO_PRAZO`; senão `LONGO_PRAZO` |
| `metaEstaVencida` | Prazo passou e status não CONCLUIDA/CANCELADA (RN-068) |
| `mapMeta` | DTO com `vencida`, `valorMensalSugerido`, `mesesRestantes`, aportes |

## 🔗 Sub-issues

- PULSO-TASK-038
- PULSO-TASK-041

## 📋 Resumo

### ✅ Concluído
- Fórmulas e contrato de sugestão RF-142 definidos

### ⏳ Pendente
- PULSO-TASK-038–041 — utils, mapper e endpoint de sugestão
