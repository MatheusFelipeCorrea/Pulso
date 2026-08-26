---
card_id: PULSO-TASK-070
title: "Frontend — ReminderFormModal e Google Agenda"
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
  - Integração Externa
---

# [TASK] Frontend — ReminderFormModal e Google Agenda

> **Contexto:** CRUD de lembretes e banner/modal de integração Google.

## 📝 Descrição

Implementar modal de lembrete completo e UI de conexão/resync Google Calendar.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `ReminderFormModal.jsx` | Create/edit; categorias agrupadas; antecedência; hora; recorrência; sync toggle |
| `ReminderDayCard.jsx` | Card lembrete no painel do dia |
| `GoogleCalendarBanner.jsx` | Status conexão; connect/disconnect |
| `GoogleResyncModal.jsx` | Escopos sync pendentes |
| `services/reminderService.js` | CRUD lembretes HTTP |

**Sync toggle:** desabilitado se Google desconectado com mensagem orientativa

**Ações:** marcar pago, excluir (`ConfirmModal`)

## 📋 Resumo

### ✅ Concluído
- Campos e fluxos Google especificados

### ⏳ Pendente
- Implementar modals e banner Google
