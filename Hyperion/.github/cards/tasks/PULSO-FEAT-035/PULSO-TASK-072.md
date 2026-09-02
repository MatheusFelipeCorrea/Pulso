---
card_id: "PULSO-TASK-072"
title: "QA — testes unitários de lembretes"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-035"
due_date: null
board_sync_at: "2026-08-26T15:32:00.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] QA — testes unitários de lembretes

> **Contexto:** Regressão para CRUD, sync, alertas, recorrência e calendário.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/reminderService.test.js` | CRUD, sync failure RN-097, marcar pago |
| `unit/services/reminderAlertService.test.js` | Alertas por antecedência |
| `unit/services/googleCalendarSyncService.test.js` | Sync, import RF-058b |
| `unit/services/googleCalendarService.test.js` | OAuth status |
| `unit/services/calendarService.test.js` | Visão mês/dia |
| `unit/jobs/reminderAlertJob.test.js` | Job alerta |
| `unit/jobs/reminderRecurrenceJob.test.js` | Recorrência mensal e por dias |
| `unit/utils/reminderMapper.test.js` | DTO |
| `unit/utils/reminderAntecedencia.test.js` | Mapas antecedência |
| `unit/utils/googleTokenCrypto.test.js` | Criptografia tokens |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/reminderService.test.js` | Chamadas HTTP |
| `unit/services/calendarService.test.js` | Visão mês/dia |
| `unit/utils/reminderUtils.test.js` | Helpers UI |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas
