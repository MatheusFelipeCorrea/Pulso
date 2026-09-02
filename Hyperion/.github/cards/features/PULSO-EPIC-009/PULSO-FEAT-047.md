---
card_id: "PULSO-FEAT-047"
title: "Rollover e status por categoria"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-009"
due_date: null
board_sync_at: "2026-08-26T15:30:20.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Rollover e status por categoria

> **Contexto:** Cálculo de gastos no mês, status visual (normal/alerta/estourado) e rollover RN-170.

**Refs:** RF-110 · RF-114 · RF-150 · RN-055 · RN-059 · RN-170

## 📝 Descrição

Implementar agregação de gastos, mapper de status e aplicação de rollover ao criar limites no mês.

## ✅ Critérios de Aceite

- `calcularGastosPorCategoria` — soma transações DESPESA no intervalo do mês
- Status: `normal` (<80%), `alerta` (≥80%), `estourado` (≥100%)
- `calcularValorRollover` — sobra positiva do mês anterior se `rolloverAtivo`; estouro não herda
- Rollover aplica-se na criação (salvar categoria nova no mês ou copiar), não retroage em mês já existente
- `resumo.orcamentoExcedeRenda` quando `rendaMensalPlanejada > 0` e total limites > renda (RN-059)
- Expor `valorRollover` e `rolloverAtivo` no status

## 🔗 Sub-issues

- PULSO-TASK-095
- PULSO-TASK-098

## 📋 Resumo

### ✅ Concluído
- Regras RN-170 e status mapeadas

### ⏳ Pendente
- PULSO-TASK-095 / 098 — mapper e rollover
