---
card_id: PULSO-TASK-067
title: "Backend — calendarService e rotas calendário"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-032
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — calendarService e rotas calendário

> **Contexto:** Visão agregada mês/dia para calendário financeiro (RN-100).

## 📝 Descrição

Implementar agregação de transações, lembretes e recebimentos fixos por período.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/calendarService.js` | `obterVisaoMes`, `obterDetalheDia` |
| `routes/calendarRoutes.js` | `/calendario/mes`, `/calendario/dia`, rotas Google |
| `controllers/calendarController.js` | Handlers incl. Google OAuth |

**Visão mês:** resumo, variação vs mês anterior, marcadores `dias`, proximosVencimentos

**Detalhe dia:** transações mapeadas, lembretes, totais, recebimentosFixos

**Utils:** `monthUtils`, `fixedIncomeUtils`

## 📋 Resumo

### ✅ Concluído
- Contratos RN-100 especificados

### ⏳ Pendente
- Implementar calendarService e rotas
