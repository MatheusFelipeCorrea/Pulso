---
card_id: PULSO-TASK-122
title: "Backend — saldo consolidado (resumo)"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-060
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — saldo consolidado (resumo)

> **Contexto:** RF-110 — quanto me devem vs quanto eu devo nas ativas.

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

## 👤 Responsável

- Vinícius Simões (`ViniSimoesV`) — pagamentos


## 📋 Resumo

### ✅ Concluído
- Fórmula RF-110 definida

### ⏳ Pendente
- Implementar calcularResumo
