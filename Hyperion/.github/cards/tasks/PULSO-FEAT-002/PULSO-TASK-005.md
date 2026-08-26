---
card_id: PULSO-TASK-005
title: "Frontend — login e gestão de sessão"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-002
due_date: null
categories:
  - Frontend
  - Web
  - Cibersegurança
  - UX / UI
---

# [TASK] Frontend — login e gestão de sessão

> **Contexto:** Tela de login, restauração de sessão via cookies e refresh transparente.

## 📝 Descrição

Como **usuário**, quero fazer login, manter sessão entre visitas e ser redirecionado corretamente, sem ver tokens no browser.

## ✅ Critérios de Aceite

### Cenário 1 — Login
**Quando** credenciais corretas,  
**Então** Redux `setUser`, toast boas-vindas, redirect `/transactions`.

### Cenário 2 — Lembrar-me
**Quando** checkbox marcado,  
**Então** refresh token com TTL 30 dias (backend).

### Cenário 3 — Refresh transparente
**Quando** API retorna 401 em rota protegida,  
**Então** interceptor deduplica `POST /auth/refresh` e retenta request.

### Cenário 4 — Sessão expirada
**Quando** refresh falha fora de rotas guest,  
**Então** redirect `/login` sem loop F5.

## 🛠️ Implementação

### Páginas e routing (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `Codigo/Pulso/web/src/pages/Login.jsx` | Form login, lembrar-me, reenviar verificação, Google |
| `Codigo/Pulso/web/src/components/routing/AuthBootstrap.jsx` | `getMe()` no mount |
| `Codigo/Pulso/web/src/components/routing/ProtectedRoute.jsx` | Guards autenticado/guest |
| `Codigo/Pulso/web/src/store/slices/authSlice.js` | `user`, `isAuthenticated`, `sessionChecked` |

### HTTP (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `Codigo/Pulso/web/src/services/api.js` | `withCredentials: true`, `refreshPromise` mutex, interceptor 401 |
| `Codigo/Pulso/web/src/services/authService.js` | `login`, `refresh`, `logout`, `getMe` |
| `Codigo/Pulso/web/src/config/defaultAuthenticatedRoute.js` | `/transactions` |

Registrar em `App.jsx` — `/login` com `GuestRoute`; árvore protegida com `ProtectedRoute`

## 📋 Resumo

### ✅ Concluído
- Spec de bootstrap, interceptor e guards definida

### ⏳ Pendente
- Implementar Login.jsx + AuthBootstrap
- Mutex de refresh em `api.js`
- Redux authSlice e ProtectedRoute/GuestRoute
