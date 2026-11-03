---
card_id: PULSO-TASK-131
title: "Backend — debtBalanceUtils"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-065
due_date: null
categories:
  - Backend
  - Regra de Negócio
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

## 👤 Responsável

- Sofia Vasconcelos (`sofiavasconcelosms`) — pagamentos


## 📋 Resumo

### ✅ Concluído
- Fórmulas de saldo documentadas

### ⏳ Pendente
- Implementar debtBalanceUtils
