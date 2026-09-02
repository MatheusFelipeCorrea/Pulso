---
card_id: "PULSO-TASK-149"
title: "Backend — job mensal e wire no cron"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-074"
due_date: null
board_sync_at: "2026-08-26T15:29:13.000Z"
categories:
  - "Backend"
  - "Notificações"
---


# [TASK] Backend — job mensal e wire no cron

> **Contexto:** RN-125 — geração automática sem depender de lançar transação.

## 📝 Descrição

Job que gera insights do mês para usuários ativos e opcionalmente recalcula score.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `jobs/insightGenerationJob.js` | Para cada usuário com atividade recente: gerar se sem snapshot do mês |
| Cron | Incluir em `cronController` daily (ou schedule mensal dedicado) |
| Score | Opcional: `financialHealthJob` diário (RN-127) |

Política: pular se `GEMINI_API_KEY_INSIGHTS` ausente (log warn); não falhar o batch inteiro se 1 usuário falhar.

Desacoplar `tentarGerarInsightAposTransacao` (manter no máximo notificação leve ou remover).

## 📋 Resumo

### ✅ Concluído
- Política de job definida

### ⏳ Pendente
- Implementar job + cron
