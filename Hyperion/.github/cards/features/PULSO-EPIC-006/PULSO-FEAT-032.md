---
card_id: "PULSO-FEAT-032"
title: "Calendário financeiro — visão mês e dia"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-006"
due_date: null
board_sync_at: "2026-08-26T15:30:04.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Calendário financeiro — visão mês e dia

> **Contexto:** Agregação de transações, lembretes e recebimentos fixos para a UI do calendário.

**Refs:** RN-100

## 📝 Descrição

Expor endpoints `/api/calendario/mes` e `/api/calendario/dia` com resumo financeiro e marcadores por dia.

## ✅ Critérios de Aceite

| Endpoint | Retorno |
|----------|---------|
| `GET /calendario/mes?mes=YYYY-MM` | Resumo receitas/despesas/saldo, variação vs mês anterior, `dias` com marcadores, `proximosVencimentos`, `recebimentosFixos` |
| `GET /calendario/dia?data=YYYY-MM-DD` | Transações do dia, lembretes, totais, recebimentos fixos |

**Marcadores por dia:** `temReceita`, `temDespesa`, `temLembrete`, `temRecebimentoFixo`

**Import Google:** disparar `importarAlteracoesDoGoogle` ao carregar mês (frontend)

## 🔗 Sub-issues

- PULSO-TASK-067

## 📋 Resumo

### ✅ Concluído
- Contratos de visão mês/dia definidos

### ⏳ Pendente
- PULSO-TASK-067 — calendarService e rotas
