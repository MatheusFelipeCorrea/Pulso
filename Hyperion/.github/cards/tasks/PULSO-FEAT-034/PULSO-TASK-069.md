---
card_id: PULSO-TASK-069
title: "Frontend — CalendarPage e grade mensal"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-034
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — CalendarPage e grade mensal

> **Contexto:** Shell `/calendar` com visão mês, dia selecionado e próximos vencimentos.

## 📝 Descrição

Implementar página principal do calendário financeiro com fetch mês/dia e import Google ao trocar mês.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/CalendarPage.jsx` | Estado período, selectedDate, modais |
| `CalendarMonthNav.jsx` | Navegação mês anterior/próximo |
| `CalendarMonthGrid.jsx` | Grade com marcadores |
| `CalendarDayPanel.jsx` | Detalhe do dia selecionado |
| `CalendarInsightCard.jsx` | Resumo receitas/despesas/saldo |
| `UpcomingReminders.jsx` | Lista próximos vencimentos |
| `services/calendarService.js` | `obterVisaoMes`, `obterDetalheDia`, Google API |

**Rota:** `App.jsx` → `path="calendar"`

**Callback OAuth:** tratar query `google=connected` na URL

## 📋 Resumo

### ✅ Concluído
- Layout e fetch pattern definidos

### ⏳ Pendente
- Implementar CalendarPage e componentes de grade
