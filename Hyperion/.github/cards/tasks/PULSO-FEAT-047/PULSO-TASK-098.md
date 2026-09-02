---
card_id: "PULSO-TASK-098"
title: "Backend — budgetRolloverUtils (RN-170)"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-047"
due_date: null
board_sync_at: "2026-08-26T15:32:26.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — budgetRolloverUtils (RN-170)

> **Contexto:** Herança de sobra positiva ao criar orçamento no mês seguinte.

## 📝 Descrição

Implementar cálculo de rollover e integrar em salvar/copiar.

## 🛠️ Implementação

### `utils/budgetRolloverUtils.js` (NOVO — CRIAR)

```js
// sobra = limiteAnterior − gastoAnterior; retorna sobra > 0 se rolloverAtivo
calcularValorRollover(orcamentoAnterior, gastoAnterior)
```

### Integração

| Ponto | Comportamento |
|-------|---------------|
| `salvarOrcamentos` | Se categoria **nova** no mês e `rolloverAtivo` → soma sobra ao `limiteValor`; grava `valorRollover` |
| `copiarParaMes` | Aplica mesma lógica por categoria |
| Toggle em mês existente | Não recalcula limite já criado |

Estouro (sobra negativa) **não** é herdado.

## 📋 Resumo

### ✅ Concluído
- RN-170 documentada

### ⏳ Pendente
- Implementar utils e integração
