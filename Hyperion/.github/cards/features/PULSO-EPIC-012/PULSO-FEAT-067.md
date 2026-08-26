---
card_id: PULSO-FEAT-067
title: "Alertas de vencimento e limpeza"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Notificações
---

# [FEATURE] Alertas de vencimento e limpeza

> **Contexto:** Notificações `DIVIDA_COBRANCA` e retenção de quitadas.

**Refs:** RF-132 · RN-077

## 📝 Descrição

Job de alertas (7 / 2 / 0 dias) com dedup e cleanup de 180 dias.

## ✅ Critérios de Aceite

- Alertar dívidas abertas com prazo nos dias 7, 2 e 0
- Skip se `valorRestante ≤ 0`
- Dedup via `verificarNotificacaoDuplicadaDivida`
- `linkAcao: /debts`
- Job cleanup remove quitadas com `dataQuitacao` > 180 dias
- Excluir quitada manualmente → 400

## 🔗 Sub-issues

- PULSO-TASK-136
- PULSO-TASK-137

## 📋 Resumo

### ✅ Concluído
- Matriz de alertas e retenção definida

### ⏳ Pendente
- PULSO-TASK-136–137 — alertas e job cleanup
