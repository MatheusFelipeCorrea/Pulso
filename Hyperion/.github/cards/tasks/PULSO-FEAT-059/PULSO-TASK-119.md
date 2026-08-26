---
card_id: PULSO-TASK-119
title: "Backend — expenseSplitUtils (centavos)"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-059
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — expenseSplitUtils (centavos)

> **Contexto:** Rateio determinístico em centavos inteiros (RNF-016).

## 📝 Descrição

Implementar utilitários puros de split.

## 🛠️ Implementação

### `utils/expenseSplitUtils.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `splitEqual(valorTotal, n)` | floor centavos; resto +1 nos primeiros índices |
| `validarSomaPersonalizada(total, valores)` | soma centavos === total centavos |

Usar `roundMoney` de `debtBalanceUtils` na conversão.

## 📋 Resumo

### ✅ Concluído
- Algoritmo RNF-016 documentado

### ⏳ Pendente
- Implementar utils
