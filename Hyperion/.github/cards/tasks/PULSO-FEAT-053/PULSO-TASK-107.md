---
card_id: "PULSO-TASK-107"
title: "Backend — purchasePlanningUtils"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-053"
due_date: null
board_sync_at: "2026-08-26T15:32:36.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — purchasePlanningUtils

> **Contexto:** Fórmulas de parcela, comprometimento, tempo e inferência de categoria.

## 📝 Descrição

Implementar utilitários puros do domínio.

## 🛠️ Implementação

### `utils/purchasePlanningUtils.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `calcParcela` | valor ÷ parcelas (RN-089) |
| `calcComprometimento` | % renda + nível saudavel/atencao/arriscado (RN-090–091) |
| `calcMesesParaComprar` | ceil(restante ÷ sobra) (RN-087) |
| `inferirCategoria` | keywords → enum |
| `selecionarDicasDoDia` | rotação por dia do ano |
| `CATEGORIA_LABELS` / `DICAS` | Constantes UI |

## 📋 Resumo

### ✅ Concluído
- Fórmulas documentadas

### ⏳ Pendente
- Implementar utils
