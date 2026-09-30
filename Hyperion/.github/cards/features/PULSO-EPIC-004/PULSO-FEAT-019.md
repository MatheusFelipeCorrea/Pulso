---
card_id: PULSO-FEAT-019
title: "Cálculos, progresso e reserva de emergência"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Cálculos, progresso e reserva de emergência

> **Contexto:** Utilitários de domínio para progresso, sugestão mensal, tipo curto/longo prazo e meta especial RF-036.

**Refs:** RF-032 · RF-033 · RF-036 · RN-067 · RN-068

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

## 🔗 Pull Requests

- [#314](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/314) — API de metas (cálculos e sugestão)

## 📋 Resumo

### ✅ Concluído
- Utils, mapper e endpoint de sugestão mergeados na Sprint-3 (In Revision)
