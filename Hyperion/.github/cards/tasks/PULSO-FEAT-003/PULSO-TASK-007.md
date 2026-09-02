---
card_id: "PULSO-TASK-007"
title: "Frontend — callback OAuth e botão Google"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-003"
due_date: null
board_sync_at: "2026-08-26T15:30:57.000Z"
categories:
  - "web"
  - "Frontend"
  - "Integração Externa"
  - "UX / UI"
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
| `Codigo/Pulso/web/src/pages/AuthCallback.jsx` | `/auth/callback` |
| `Codigo/Pulso/web/src/pages/Login.jsx` | Botão Google inline SVG |
| `Codigo/Pulso/web/src/pages/Register.jsx` | Botão Google inline SVG |

### Serviços (NOVO — CRIAR)

- `authService.loginWithGoogle()` — redirect full page
- `authService.exchangeOAuth(exchange)` — `POST /auth/oauth/exchange`
- `utils/apiBaseUrl.js` — base URL para redirect OAuth

Registrar em `App.jsx` — `/auth/callback` (pública, sem GuestRoute)

## 📋 Resumo

### ✅ Concluído
- Spec de estados loading/erro/sucesso na callback definida

### ⏳ Pendente
- Implementar AuthCallback.jsx
- Adicionar botão Google em Login e Register
