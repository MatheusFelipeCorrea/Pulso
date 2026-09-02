---
card_id: "PULSO-TASK-131"
title: "Backend — debtBalanceUtils"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-065"
due_date: null
board_sync_at: "2026-08-26T15:23:55.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — debtBalanceUtils

> **Contexto:** Cálculo de saldo, quitação efetiva e arredondamento monetário.

## 📝 Descrição

Implementar utilitários de saldo compartilhados (também usados por divisão de despesas).

## 🛠️ Implementação

### `utils/debtBalanceUtils.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `roundMoney` | 2 casas |
| `calcSaldoFromPagamentos` | total, pago, restante |
| `calcSaldoDivida` | Se quitada efetiva → restante 0 |
| `estaTotalmentePaga` | restante ≤ 0 |
| `isDividaQuitada` | restante ≤ 0 OU (flag quitada sem pagamentos) |

## 📋 Resumo

### ✅ Concluído
- Fórmulas de saldo documentadas

### ⏳ Pendente
- Implementar debtBalanceUtils
