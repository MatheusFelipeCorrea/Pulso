---
card_id: PULSO-TASK-124
title: "Backend — exclusão e cleanup 180 dias"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-061
due_date: null
categories:
  - Backend
---

# [TASK] Backend — exclusão e cleanup 180 dias

> **Contexto:** Remover lembretes órfãos e limpar quitadas antigas.

## 📝 Descrição

Implementar exclusão segura e job de retenção.

## 🛠️ Implementação

### Arquivos / funções (NOVO — CRIAR)

| Item | Comportamento |
|------|---------------|
| `excluirDivisao` | Bloqueia QUITADA; remove lembretes via `reminderService.removerLembrete` |
| `jobs/expenseSplitCleanupJob.js` | `excluirQuitadasAntigas(180)` |
| Cron / server | Registrar job diário |

Constante: `DIAS_RETENCAO_QUITADAS = 180`

## 📋 Resumo

### ✅ Concluído
- Política de retenção definida

### ⏳ Pendente
- Implementar exclusão e job
