---
card_id: PULSO-FEAT-107
title: "Auth Flutter (mesma API Node)"
status: "In Revision"
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-001
due_date: null
categories:
  - Mobile
  - Backend
  - Frontend
  - Cibersegurança
  - Integração Externa
  - Regra de Negócio
---

# [FEATURE] Auth Flutter (mesma API Node)

> **Contexto:** O app nativo em `Codigo/Pulso/mobile` ainda é placeholder. A API Node em `Codigo/Pulso/api` já cobre RF-001–006 (cadastro, Google web, login JWT, refresh, logout, recuperação). O Flutter deve **reutilizar essa API** — sem segundo backend. Apostila 3.4: cookie `httpOnly` na Web; **secure storage** no mobile. RF-140: o Flutter consome o mesmo REST.

**Refs:** RF-001–006 · RF-140 · RN-131–143  
**Spec:** `Hyperion/.github/plans/specs/PULSO-107-auth-flutter/`  
**Protótipo:** `PULSO-FEAT-086` (telas auth Done)

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **cadastrar, entrar, recuperar senha e autenticar com Google na mesma API Node da Web**, para que **a regra de negócio não seja duplicada e a sessão no telefone use secure storage**.

Hoje `respondWithAuthSession` só seta cookies e o JSON de login é `{ user }` — o app nativo não consegue persistir JWT. `authCookies.js` **já lê** `Authorization: Bearer` e `body.refreshToken`. O gap é devolver os tokens no JSON para o cliente mobile, inicializar o Flutter e tratar Google nativo (Passport hoje redireciona para `FRONTEND_URL/auth/callback`).

## ✅ Critérios de Aceite

### Cenário 1 — Login e-mail/senha no Flutter
**Dado** conta EMAIL verificada,  
**Quando** o app envia `POST /api/auth/login` com header `X-Pulso-Client: mobile`,  
**Então** o JSON inclui `accessToken`, `refreshToken` e `user`; o app persiste os tokens em secure storage e as próximas requests usam `Authorization: Bearer`.

### Cenário 2 — Refresh rotativo
**Dado** `refreshToken` válido no device,  
**Quando** o interceptor chama `POST /api/auth/refresh` com `{ refreshToken }`,  
**Então** a API devolve novo par no JSON; o app substitui os dois tokens; `GET /api/auth/me` com o novo Bearer retorna `200`.

### Cenário 3 — Replay de refresh
**Quando** um refresh já revogado é reenviado,  
**Então** `401` e o app limpa o storage e volta ao login.

### Cenário 4 — Cadastro, verificação e reset
**Então** `POST /api/auth/register`, `GET /api/auth/verify-email/:token`, `POST /api/auth/forgot-password` e `POST /api/auth/reset-password/:token` usam o **mesmo contrato da Web**; links de e-mail continuam em `FRONTEND_URL` (deep link ou abrir Web).

### Cenário 5 — Google nativo
**Dado** ID token do SDK `google_sign_in`,  
**Quando** `POST /api/auth/google/mobile` com `{ idToken }`,  
**Então** a API valida no Google, localiza/cria o usuário (mesmo seed de categorias) e devolve sessão no JSON **sem** redirect para a SPA.

### Cenário 6 — Web inalterada
**Quando** o SPA chama login/refresh **sem** `X-Pulso-Client: mobile`,  
**Então** o JSON **não** precisa expor os tokens; cookies `httpOnly` continuam bastando.

## 🔗 Sub-issues

- PULSO-TASK-160
- PULSO-TASK-161
- PULSO-TASK-162

## 📋 Resumo

### ✅ Concluído
- Spec BDD e critérios alinhados à API existente (`authCookies` já aceita Bearer)
- Decisão: **não** criar segundo backend; só JSON de sessão + Flutter + Google nativo
- PULSO-TASK-160 — JSON `accessToken`/`refreshToken` para cliente nativo (`X-Pulso-Client: mobile`)
- PULSO-TASK-161 — Flutter Dio + secure storage + cadastro/login/logout/`/me`/refresh + termos
- PULSO-TASK-162 — Google nativo (`pulso.pulso` + clients Cloud) + deep links `pulso://` e fallback Web

### ⏳ Pendente
- Nenhum
