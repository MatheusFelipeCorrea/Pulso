---
card_id: PULSO-TASK-023
title: "Estilos — dashboard.css responsivo"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Estilos — dashboard.css responsivo

> **Contexto:** Layout responsivo unificado para todas as seções do dashboard.

## 📝 Descrição

Criar folha de estilos do dashboard com grid adaptativo, safe-area mobile e tokens do design system (claro/escuro).

## ✅ Critérios de Aceite

### Cenário 1 — Desktop
**Então** grid 2 colunas para charts; bottom row transações + saúde lado a lado.

### Cenário 2 — Mobile
**Então** header em coluna; charts empilhados; carousel saldos sem overflow horizontal da página.

### Cenário 3 — Import modal
**Então** classes `dashboard-import-*` para mapping/preview legíveis em telas pequenas.

## 🛠️ Implementação

### Estilos (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `Codigo/Pulso/web/src/styles/dashboard.css` | Page layout, charts grid, balance, import modal |
| `Codigo/Pulso/web/src/styles/pulso-components.css` | ResourceCard, NotificationPanel (parcial) |

Importar em `DashboardPage.jsx` ou entry global de estilos.

## 📋 Resumo

### ✅ Concluído
- Breakpoints e seções a estilizar mapeados

### ⏳ Pendente
- Implementar CSS responsivo completo
- Validar tema claro/escuro em todos os widgets
