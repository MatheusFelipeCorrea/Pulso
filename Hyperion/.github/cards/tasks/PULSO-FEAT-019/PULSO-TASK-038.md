---
card_id: "PULSO-TASK-038"
title: "Backend — metaBalanceUtils e metaMapper"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-019"
due_date: null
board_sync_at: "2026-08-26T15:31:28.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — metaBalanceUtils e metaMapper

> **Contexto:** Funções puras de cálculo e DTO de resposta da API.

## 📝 Descrição

Implementar utilitários de progresso, sugestão mensal, inferência de tipo, vencimento e mapper para JSON.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Funções |
|---------|---------|
| `api/src/utils/metaBalanceUtils.js` | `roundMoney`, `diffMesesAte`, `inferirTipoMeta`, `calcProgressoMeta`, `calcValorMensalSugerido`, `calcSugestaoReservaEmergencia`, `metaEstaVencida`, `podeReceberAporte` |
| `api/src/utils/metaMapper.js` | `mapMeta`, `mapAporte` — inclui `vencida`, `valorMensalSugerido`, `mesesRestantes` |

**Constante:** `MESES_RESERVA_EMERGENCIA_PADRAO = 6`

## 📋 Resumo

### ✅ Concluído
- Fórmulas RN-067 e RN-068 especificadas

### ⏳ Pendente
- Implementar utils e mapper
