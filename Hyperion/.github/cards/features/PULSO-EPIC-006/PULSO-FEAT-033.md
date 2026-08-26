---
card_id: PULSO-FEAT-033
title: "Jobs — alertas e recorrência"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Backend
  - Cron
  - Notificações
---

# [FEATURE] Jobs — alertas e recorrência

> **Contexto:** Cron diário para notificações de vencimento e geração de instâncias recorrentes.

**Refs:** RN-094 · RN-095 · RN-098

## 📝 Descrição

Implementar jobs `reminderAlertJob` e `reminderRecurrenceJob` integrados ao cron da API.

## ✅ Critérios de Aceite

**`reminderAlertJob`:**
- Varre lembretes não pagos
- Calcula data alerta = vencimento − antecedência
- Cria `LEMBRETE_VENCIMENTO` sem duplicata no mesmo dia

**`reminderRecurrenceJob`:**
- `gerarInstanciasMensais` — templates `repetirMensal` sem duplicar mês
- `avancarRepeticaoPorDias` — avança `dataVencimento` com teto 10k iterações
- Guard para `repetirCadaDias <= 0`

## 🔗 Sub-issues

- PULSO-TASK-068

## 📋 Resumo

### ✅ Concluído
- Regras de recorrência e alerta especificadas

### ⏳ Pendente
- PULSO-TASK-068 — jobs e reminderAlertService
