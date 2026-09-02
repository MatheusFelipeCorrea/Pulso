---
card_id: "PULSO-TASK-064"
title: "Backend — reminderRoutes, controller e schemas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-030"
due_date: null
board_sync_at: "2026-08-26T15:31:52.000Z"
categories:
  - "api"
  - "Backend"
---


# [TASK] Backend — reminderRoutes, controller e schemas

> **Contexto:** Exposição HTTP `/api/lembretes` com validação Zod.

## 📝 Descrição

Registrar rotas de lembretes com auth middleware e schemas de entrada.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Rotas |
|---------|-------|
| `routes/reminderRoutes.js` | GET/POST/PATCH/DELETE + POST `/:id/pagar` |
| `controllers/reminderController.js` | Handlers |
| `schemas/reminderSchemas.js` | criar, atualizar, query mes, marcar pago |

Montagem: `app.use('/api/lembretes', reminderRoutes)`

## 📋 Resumo

### ✅ Concluído
- Mapa de rotas definido

### ⏳ Pendente
- Implementar routes, controller e schemas
