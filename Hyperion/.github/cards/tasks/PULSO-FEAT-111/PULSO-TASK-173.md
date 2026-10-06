---
card_id: PULSO-TASK-173
title: "Flutter — camada de dados de calendário e lembretes"
status: "In Progress"
type: Task
priority: High
sprint: "Sprint 4"
story_points: null
reporter: "Alice Shikida"
parent: PULSO-FEAT-111
due_date: null
categories:
  - Mobile
---

# [TASK] Flutter — camada de dados de calendário e lembretes

> **Contexto:** Mesma API Node `/api/calendario` e `/api/lembretes`. Sessão Bearer + `X-Pulso-Client: mobile`.

## 📝 Descrição

Criar `features/calendar/data`: models do mês/dia/lembrete, `CalendarRepository` (mês, dia, Google status) e `ReminderRepository` (CRUD, pagar). Testes em `test/calendar_test.dart`.

## ✅ Critérios de Aceite

**Então** `GET /calendario/mes` e `/dia` parseiam `resumo`, `dias` e DTO de lembrete (`valor` string ou null, `diasAteVencimento`).

**Então** criar/atualizar/excluir/pagar batem nas rotas de `/lembretes`.

## 👤 Responsável

Alice Shikida (`aliceshikida`)

## 📋 Resumo

### ⏳ Pendente
- Repository, models e testes
