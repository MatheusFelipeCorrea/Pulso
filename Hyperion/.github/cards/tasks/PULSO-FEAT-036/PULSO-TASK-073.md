---
card_id: "PULSO-TASK-073"
title: "Frontend — LandingPage e rotas públicas"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-036"
due_date: null
board_sync_at: "2026-08-26T15:32:02.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — LandingPage e rotas públicas

> **Contexto:** Shell da landing em `/` com redirect autenticado e integração ao router.

## 📝 Descrição

Implementar página raiz e registrar rotas públicas no `App.jsx`.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/LandingPage.jsx` | Composição seções; redirect auth; hash scroll |
| `config/defaultAuthenticatedRoute.js` | Constante central de redirect pós-login |
| `App.jsx` | `Route path="/"` → LandingPage; `/termos`, `/privacidade` |
| `components/routing/ProtectedRoute.jsx` | `GuestRoute` redirect autenticado |

**Hash scroll:** `useEffect` em `#funcionalidades`, `#para-quem`, etc.

**Sem backend:** módulo 100% estático/SPA

## 📋 Resumo

### ✅ Concluído
- Fluxo de rotas especificado

### ⏳ Pendente
- Implementar LandingPage e wiring de rotas
