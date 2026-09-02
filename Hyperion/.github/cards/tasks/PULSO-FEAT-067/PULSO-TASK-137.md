---
card_id: "PULSO-TASK-137"
title: "Backend — debtCleanupJob 180 dias"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-067"
due_date: null
board_sync_at: "2026-08-26T15:29:02.000Z"
categories:
  - "Backend"
---


# [TASK] Backend — debtCleanupJob 180 dias

> **Contexto:** Remoção automática de dívidas quitadas antigas.

## 📝 Descrição

Implementar job de retenção e wire no cron.

## 🛠️ Implementação

### `jobs/debtCleanupJob.js` (NOVO — CRIAR)

- `debtRepository.excluirQuitadasAntigas(180)`
- Registrar em `cronController` / `server.js`
- Logar quantidade removida

## 📋 Resumo

### ✅ Concluído
- Política 180 dias definida

### ⏳ Pendente
- Implementar cleanup job
