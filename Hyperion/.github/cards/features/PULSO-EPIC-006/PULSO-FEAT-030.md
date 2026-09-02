---
card_id: "PULSO-FEAT-030"
title: "Backend — API de lembretes"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-006"
due_date: null
board_sync_at: "2026-08-26T15:30:02.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API de lembretes

> **Contexto:** CRUD de lembretes financeiros com categorias, recorrência e hook de sync Google.

**Refs:** RF-055 · RF-058 · RN-099

## 📝 Descrição

Expor endpoints autenticados em `/api/lembretes` para listar, criar, editar, excluir e marcar como pago.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/lembretes?mes=YYYY-MM` | Lista do mês com `diasAteVencimento` |
| `POST` | `/lembretes` | Cria; sync opcional via `sincronizarGoogle` |
| `PATCH` | `/lembretes/:id` | Edita parcialmente; re-sync se campos afetam evento |
| `POST` | `/lembretes/:id/pagar` | Marca pago; remove evento Google |
| `DELETE` | `/lembretes/:id` | Exclui; remove evento Google se existir |

**Categorias:** 52 valores em 11 grupos (`reminderCategories.js`)

**Recorrência:** `repetirMensal` + `diaRecorrencia` (1–28); `repetirCadaDias` opcional

## 🔗 Sub-issues

- PULSO-TASK-061
- PULSO-TASK-062
- PULSO-TASK-063
- PULSO-TASK-064

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e regras RN-099 definidos

### ⏳ Pendente
- PULSO-TASK-061–064 — DB, repository, service e rotas
