---
card_id: "PULSO-TASK-068"
title: "Backend — jobs alerta e recorrência"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-033"
due_date: null
board_sync_at: "2026-08-26T15:31:56.000Z"
categories:
  - "Backend"
  - "Notificações"
  - "Cron"
---


# [TASK] Backend — jobs alerta e recorrência

> **Contexto:** Cron diário para notificações e instâncias mensais.

## 📝 Descrição

Implementar jobs e service de alerta integrados ao scheduler da API.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/reminderAlertService.js` | `verificarLembretesENotificar`, dedupe notificação |
| `jobs/reminderAlertJob.js` | Wrapper cron |
| `jobs/reminderRecurrenceJob.js` | `gerarInstanciasMensais`, `avancarRepeticaoPorDias` |

**Alerta:** tipo `LEMBRETE_VENCIMENTO`, link `/calendar`

**Recorrência:** teto `MAX_ITERACOES_AVANCO = 10000`; guard `repetirCadaDias > 0`

Registrar no cron router existente da API

## 📋 Resumo

### ✅ Concluído
- Regras RN-094–095 e RN-098 definidas

### ⏳ Pendente
- Implementar jobs e alert service
