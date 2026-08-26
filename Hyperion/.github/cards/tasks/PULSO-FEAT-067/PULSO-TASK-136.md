---
card_id: PULSO-TASK-136
title: "Backend — debtAlertService e job"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-067
due_date: null
categories:
  - Backend
  - Notificações
---

# [TASK] Backend — debtAlertService e job

> **Contexto:** RF-132 / RN-077 — alertas 7, 2 e 0 dias antes do prazo.

## 📝 Descrição

Implementar verificação diária e criação de `DIVIDA_COBRANCA`.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/debtAlertService.js` | `verificarDividasENotificar`; `DIAS_ALERTA = [7, 2, 0]` |
| `jobs/debtAlertJob.js` | `runDebtAlertJob` |
| Cron | Registrar no daily |

Dedup por metadados (`dividaId`, `dataAlerta`, `diasRestantes`); skip saldo zero.

## 📋 Resumo

### ✅ Concluído
- Matriz de alertas definida

### ⏳ Pendente
- Implementar alertas e job
