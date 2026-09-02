---
card_id: "PULSO-TASK-095"
title: "Backend — budgetMapper e status de categoria"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-047"
due_date: null
board_sync_at: "2026-08-26T15:32:25.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — budgetMapper e status de categoria

> **Contexto:** DTO de orçamento e classificação visual por percentual usado.

## 📝 Descrição

Implementar mapper e helper de status.

## 🛠️ Implementação

### `utils/budgetMapper.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `mapOrcamento` | id, categoria*, limiteValor, rolloverAtivo, valorRollover |
| `calcularStatusCategoria` | `normal` / `alerta` (≥80) / `estourado` (≥100) |

Consumido por `obterStatusOrcamento` e listagens.

## 📋 Resumo

### ✅ Concluído
- Faixas de status definidas (RN-056–057)

### ⏳ Pendente
- Implementar budgetMapper
