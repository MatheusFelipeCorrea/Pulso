---
card_id: PULSO-TASK-007
title: "Frontend — callback OAuth e botão Google"
status: "In Progress"
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-003
due_date: null
categories:
  - Frontend
  - Web
  - Integração Externa
  - UX / UI
---

# [TASK] Frontend — callback OAuth e botão Google

> **Contexto:** Consumir retorno OAuth no SPA e completar login.

## 📝 Descrição

Como **usuário**, quero entrar com Google em um clique e ser autenticado automaticamente ao retornar do provedor.

## ✅ Critérios de Aceite

### Cenário 1 — Botão Google
**Quando** clica "Entrar com Google" em login ou cadastro,  
**Então** `window.location` → `${API_BASE}/auth/google`.

### Cenário 2 — Callback sucesso
**Quando** `/auth/callback?exchange=...`,  
**Então** `exchangeOAuth` → `getMe` → Redux `setUser` → redirect `/transactions`.

### Cenário 3 — Callback erro
**Quando** `?error=google_auth_failed`,  
**Então** card de erro com CTA voltar ao login.

## 🛠️ Implementação

### Páginas (NOVO — CRIAR)

| Arquivo | Rota |
|---------|------|
| `Codigo/web/src/pages/AuthCallback.jsx` | `/auth/callback` |
| `Codigo/web/src/pages/Login.jsx` | Botão Google inline SVG |
| `Codigo/web/src/pages/Register.jsx` | Botão Google inline SVG |

### Serviços (NOVO — CRIAR)

- `authService.loginWithGoogle()` — redirect full page
- `authService.exchangeOAuth(exchange)` — `POST /auth/oauth/exchange`
- `utils/apiBaseUrl.js` — base URL para redirect OAuth

Registrar em `App.jsx` — `/auth/callback` (pública, sem GuestRoute)

## 🔗 Pull Requests

- [#287](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/287) — Google OAuth 2.0 (`feat/16`)

## 📋 Resumo

### ✅ Concluído
- Spec de estados loading/erro/sucesso na callback definida

### ⏳ Pendente
- Implementar AuthCallback.jsx
- Adicionar botão Google em Login e Register
