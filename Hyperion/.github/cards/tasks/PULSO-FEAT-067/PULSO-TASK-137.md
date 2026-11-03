---
card_id: PULSO-TASK-137
title: "Backend — debtCleanupJob 180 dias"
status: "In Revision"
type: Task
priority: Medium
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-067
due_date: null
categories:
  - Backend
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

## 👤 Responsável

- Sofia Vasconcelos (`sofiavasconcelosms`) — alertas


## 📋 Resumo

### ✅ Concluído
- Política 180 dias definida

### ⏳ Pendente
- Implementar cleanup job
