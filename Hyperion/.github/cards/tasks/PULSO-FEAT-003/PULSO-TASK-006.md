---
card_id: PULSO-TASK-006
title: "Backend — Google OAuth e exchange de sessão"
status: "In Revision"
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-003
due_date: null
categories:
  - Backend
  - Integração Externa
  - Regra de Negócio
---

# [TASK] Backend — Google OAuth e exchange de sessão

> **Contexto:** Integração Passport Google + troca segura de JWT curto por cookies de sessão.

## 📝 Descrição

Implementar fluxo OAuth server-side e endpoint de exchange para o SPA consumir sessão sem tokens permanentes na query string.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/api/auth/google` | Redirect Google OAuth (scope profile, email) |
| `GET` | `/api/auth/google/callback` | Passport callback → redirect front com `?exchange=` |
| `POST` | `/api/auth/oauth/exchange` | Valida JWT 60s → emite cookies de sessão |

## 🛠️ Implementação

### `authService.js` (NOVO — CRIAR)

Adicionar em: `Codigo/api/src/services/authService.js`

```javascript
// authenticateGoogle(profile) — cria/vincula conta, seed categorias
// buildGoogleCallbackRedirect(usuario) — JWT exchange TTL 60s
// buildGoogleErrorRedirect(error)
// exchangeOAuthSession(exchangeToken)
```

### `authRoutes.js` (NOVO — CRIAR)

- `GET /google` com `ensureGoogleStrategy()` + `passport.authenticate`
- `GET /google/callback` com handler customizado de erro
- `POST /oauth/exchange` + `authOAuthExchangeRateLimit`

### `passport.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/config/passport.js`

GoogleStrategy lazy via `ensureGoogleStrategy()` — evita crash sem env vars

**Env:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`, `JWT_SECRET`

## 📐 Regras de Negócio

- Conta Google nasce `verificado=true` (RN-138)
- Email existente com senha → 409, não merge automático (RN-139)
- Exchange token TTL 60s

## 🔗 Pull Requests

- [#287](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/287) — Google OAuth 2.0 (`feat/16`)

## 👤 Responsável

- Maria Clara (`mariaoliveira27`)

## 📋 Resumo

### ✅ Concluído
- Fluxo OAuth + exchange especificado

### ⏳ Pendente
- Nenhum
