---
card_id: "PULSO-TASK-097"
title: "Backend — copiar orçamento entre meses"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-046"
due_date: null
board_sync_at: "2026-08-26T15:32:24.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — copiar orçamento entre meses

> **Contexto:** Replicar limites de um mês para outro vazio, aplicando rollover quando ativo.

## 📝 Descrição

Implementar `POST /orcamentos/copiar` e `copiarOrcamento` no service.

## 🛠️ Implementação

### Regras

| Cenário | Resposta |
|---------|----------|
| Destino já tem orçamentos | 409 |
| Origem sem orçamentos | 404 |
| Sucesso | `{ mesDestino, orcamentos, quantidadeCopiada }` |

Body: `{ mesOrigem, mesDestino }` (YYYY-MM-01 ou equivalente validado)

Schema: `copiarOrcamentoSchema` em `budgetSchemas.js`

## 📋 Resumo

### ✅ Concluído
- Contratos de cópia definidos

### ⏳ Pendente
- Implementar fluxo de cópia
