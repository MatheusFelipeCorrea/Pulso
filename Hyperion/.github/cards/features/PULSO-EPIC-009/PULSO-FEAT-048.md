---
card_id: PULSO-FEAT-048
title: "Alertas 80%/100% e jobs"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Backend
  - Notificações
  - Regra de Negócio
---

# [FEATURE] Alertas 80%/100% e jobs

> **Contexto:** Notificações de orçamento com deduplicação, job periódico e sync pós-transação.

**Refs:** RF-111 · RF-112 · RN-056–058 · RN-060

## 📝 Descrição

Criar alertas `ALERTA_ORCAMENTO` (80%) e `ORCAMENTO_ESTOURADO` (100%+), sem bloquear transações.

## ✅ Critérios de Aceite

| Tipo | Gatilho | Dedup |
|------|---------|-------|
| `ALERTA_ORCAMENTO` | percentual ≥ 80 e < 100 | metadados `{ categoriaId, mesReferencia, percentual }` |
| `ORCAMENTO_ESTOURADO` | percentual ≥ 100 | idem |

- Categorias sem orçamento no mês: skip (RN-060)
- `linkAcao`: `/budget`
- Job `budgetAlertJob` via cron e startup
- `userSyncService` chama `verificarLimitesUsuarioENotificar` após mutações relevantes

## 🔗 Sub-issues

- PULSO-TASK-099
- PULSO-TASK-100

## 📋 Resumo

### ✅ Concluído
- Matriz de alertas e pontos de disparo definidos

### ⏳ Pendente
- PULSO-TASK-099–100 — notificações e job
