---
card_id: "PULSO-TASK-100"
title: "Backend — budgetAlertJob, cron e userSync"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-048"
due_date: null
board_sync_at: "2026-08-26T15:32:28.000Z"
categories:
  - "Backend"
  - "Notificações"
---


# [TASK] Backend — budgetAlertJob, cron e userSync

> **Contexto:** Disparo periódico e sob demanda dos alertas de orçamento.

## 📝 Descrição

Registrar job de alertas no cron e no sync pós-mutação do usuário.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `jobs/budgetAlertJob.js` | `runBudgetAlertJob` → `verificarLimitesENotificar` |
| `controllers/cronController.js` | Incluir job no endpoint de cron |
| `server.js` | Opcional: run no startup |
| `services/userSyncService.js` | Chamar `verificarLimitesUsuarioENotificar` |

Logar quantidade de notificações criadas e usuários verificados.

## 📋 Resumo

### ✅ Concluído
- Pontos de disparo mapeados

### ⏳ Pendente
- Wire job + sync
