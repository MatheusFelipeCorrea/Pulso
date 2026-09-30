---
card_id: PULSO-TASK-162
title: "Flutter — Google nativo e deep links de e-mail"
status: "In Revision"
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-107
due_date: null
categories:
  - Mobile
  - Backend
  - Integração Externa
  - Cibersegurança
---

# [TASK] Flutter — Google nativo e deep links de e-mail

> **Contexto:** O Google da Web usa Passport (`GET /api/auth/google` → redirect `FRONTEND_URL/auth/callback?exchange=`). Isso não serve no app. E-mails de verify/reset apontam para `FRONTEND_URL/verify-email/` e `/reset-password/`.

## 📝 Descrição

Expor `POST /api/auth/google/mobile` que valida o ID token do SDK nativo (mesmo `findOrCreateGoogleUser` / seed de categorias da Web) e emitir sessão JSON. No Flutter, `google_sign_in` + deep links para os tokens de e-mail.

## ✅ Critérios de Aceite

**Dado** ID token válido do `google_sign_in`,  
**Quando** `POST /api/auth/google/mobile` com `{ idToken }`,  
**Então** a API valida audiência (client IDs Web/Android/iOS), localiza ou cria o usuário e devolve `accessToken`/`refreshToken`/`user` no JSON.

**Dado** ID token inválido ou audiência errada,  
**Então** `401`/`400` sem criar sessão.

**Quando** o fluxo nativo sucede,  
**Então** **não** redireciona para `FRONTEND_URL/auth/callback`.

**Dado** e-mail de verificação ou reset,  
**Quando** o usuário abre o link no celular com o app instalado,  
**Então** o deep link entrega o token à tela Flutter **ou** o fluxo Web existente continua funcionando se o app não estiver instalado.

**Dado** rate limit,  
**Então** `POST /api/auth/google/mobile` tem instância própria (5 req/min/IP), como as outras rotas auth.

## 🛠️ Implementação

### API — Google mobile (NOVO — CRIAR / EXISTENTE — MODIFICAR)

- Schema Zod `{ idToken }` em `Codigo/Pulso/api/src/schemas/authSchemas.js`
- `authService.verifyGoogleIdToken(idToken)` via `google-auth-library` (`OAuth2Client.verifyIdToken`) já usada em `Codigo/Pulso/api/src/utils/googleOAuth.js`
- Reusar `findOrCreate` Google + `issueAuthTokens` do `authService.js` (EXISTENTE)
- Rota `POST /google/mobile` em `Codigo/Pulso/api/src/routes/authRoutes.js`
- Novo limiter em `Codigo/Pulso/api/src/middlewares/authRateLimit.js`
- Env: audiências extras se Android/iOS tiverem OAuth client IDs distintos (`GOOGLE_ANDROID_CLIENT_ID` / `GOOGLE_IOS_CLIENT_ID`) — não inventar valores; documentar no `.env.example`

### Flutter (NOVO — CRIAR)

- Pacote `google_sign_in` + POST do ID token
- Deep links (`app_links` / associated domains) para `/verify-email/:token` e `/reset-password/:token` **ou** abrir a Web se o app não tratar o host

### Testes (NOVO — CRIAR)

- Unit: ID token inválido; usuário existente por `googleId`; e-mail já EMAIL (mesmo comportamento da Web)

## 📐 Regras de Negócio

- Mesmo seed de categorias e `ConfiguracaoUsuario` do cadastro Google web (RF-002)
- Conta Google nasce verificada
- E-mails continuam anti-enumeração; links não quebram a SPA

## 📋 Resumo

### ✅ Concluído
- `POST /api/auth/google/mobile` + validação de ID token (audiências Web/Android/iOS)
- SDK Flutter nativo + redirect Web no preview; deep links `pulso://` nos e-mails (CTA web em `FRONTEND_URL`)
- Clients Cloud Android/iOS no bundle `pulso.pulso`; `GIDClientID` e URL scheme reversed no iOS

### ⏳ Pendente
- Nenhum
