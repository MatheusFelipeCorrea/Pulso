---
card_id: "PULSO-TASK-122"
title: "Backend — saldo consolidado (resumo)"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-060"
due_date: null
board_sync_at: "2026-08-26T15:23:45.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — saldo consolidado (resumo)

> **Contexto:** RF-119 — quanto me devem vs quanto eu devo nas ativas.

## 📝 Descrição

Implementar `GET /divisoes/resumo` via `calcularResumo`.

## 🛠️ Implementação

### Lógica

Para cada divisão ATIVA:

| Situação do organizador | Efeito |
|-------------------------|--------|
| `pagouAConta` | Soma valores dos outros PENDENTE → `meDevem` |
| status PENDENTE | Soma valor do organizador → `euDevo` |

Retorno: `{ meDevem, euDevo, saldo: meDevem − euDevo, possuiDivisoes }`

## 📋 Resumo

### ✅ Concluído
- Fórmula RF-119 definida

### ⏳ Pendente
- Implementar calcularResumo
