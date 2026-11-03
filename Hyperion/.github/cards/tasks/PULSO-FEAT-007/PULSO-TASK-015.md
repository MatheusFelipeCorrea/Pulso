---
card_id: PULSO-TASK-015
title: "Frontend — DashboardPage e routing"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — DashboardPage e routing

> **Contexto:** Página principal do app autenticado e destino pós-login.

## 📝 Descrição

Como **usuário**, quero acessar `/dashboard` após login e ver meu resumo financeiro carregado via API agregada.

## ✅ Critérios de Aceite

### Cenário 1 — Rota protegida
**Então** `/dashboard` sob `ProtectedRoute` + `MainLayout`.

### Cenário 2 — Fetch com abort
**Quando** mudo período ou desmonto componente,  
**Então** request anterior é cancelada (`AbortController`).

### Cenário 3 — Header
**Então** saudação "Olá, {nome}!" + subtítulo do mês + botão "Importar extrato".

### Cenário 4 — Pós-login
**Então** `DEFAULT_AUTHENTICATED_ROUTE = '/dashboard'`.

## 🛠️ Implementação

### Páginas e config (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `Codigo/web/src/pages/DashboardPage.jsx` | Orquestra widgets + estado `periodo` |
| `Codigo/web/src/services/dashboardService.js` | `obterDashboard({ mes }, { signal })` |
| `Codigo/web/src/config/defaultAuthenticatedRoute.js` | Export `/dashboard` |
| `Codigo/web/src/config/sidebarNavigation.js` | Item menu dashboard |
| `Codigo/web/src/App.jsx` | Route `path="dashboard"` |

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`) — web


## 📋 Resumo

### ✅ Concluído
- Spec de layout e fluxo de dados definida

### ⏳ Pendente
- Implementar DashboardPage com loading/error states
- Wire routing e redirect pós-auth
