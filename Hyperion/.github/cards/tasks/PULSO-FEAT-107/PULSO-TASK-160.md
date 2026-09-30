---
card_id: PULSO-TASK-160
title: "API — JSON de sessão para cliente nativo"
status: "In Revision"
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-107
due_date: null
categories:
  - Backend
  - Cibersegurança
  - Mobile
---

# [TASK] API — JSON de sessão para cliente nativo

> **Contexto:** A leitura Bearer/`body.refreshToken` já existia. O gap era devolver os tokens no JSON para o cliente nativo, sem mudar o contrato de cookies da Web.

## 📝 Descrição

`respondWithAuthSession` e `refresh` devolvem `accessToken` e `refreshToken` no JSON quando o cliente se identifica como mobile. Cookies continuam sendo setados (compat Web / testes).

## ✅ Critérios de Aceite

**Dado** header `X-Pulso-Client: mobile`,  
**Quando** `POST /api/auth/login` ou `POST /api/auth/oauth/exchange` sucedem,  
**Então** o JSON inclui `accessToken`, `refreshToken` e `user` (além dos cookies).

**Dado** o mesmo header (ou body com `refreshToken` de app),  
**Quando** `POST /api/auth/refresh` sucede,  
**Então** o JSON inclui o novo par — não só `{ ok: true }`.

**Dado** request **sem** o header (SPA),  
**Quando** login/refresh,  
**Então** o contrato atual se mantém (`{ user }` / `{ ok: true }` + cookies).

**Dado** testes unitários,  
**Então** cobrir os dois clientes (mobile vs web) sem regressão de cookie.

## 🛠️ Implementação

### `authController.js` (EXISTENTE — MODIFICAR)

Modificar em: `Codigo/Pulso/api/src/controllers/authController.js`

- Helper `isMobileClient(req)` → `req.headers['x-pulso-client'] === 'mobile'`
- `respondWithAuthSession(res, result, statusCode, { includeTokens })` — se `includeTokens`, acrescentar `accessToken` e `refreshToken` no JSON
- `login` / `exchangeOAuth`: passar `includeTokens` quando mobile
- `refresh`: se mobile, `res.json({ ok: true, accessToken, refreshToken })` em vez de só `{ ok: true }`

### Testes (EXISTENTE — MODIFICAR / NOVO — CRIAR)

- Extender testes do controller/service de auth em `Codigo/Pulso/api/tests/`
- Garantir que o SPA sem o header **não** recebe tokens no body

## 📐 Regras de Negócio

- Access 15 min + refresh rotativo single-use (RN-138 / RN-139) — sem mudar TTL
- Tokens no JSON **somente** para cliente nativo identificado; Web permanece cookie `httpOnly`

## 📋 Resumo

### ✅ Concluído
- `isMobileClient` + tokens no JSON de login/oauth/refresh para `X-Pulso-Client: mobile`
- SPA sem o header permanece em cookies `httpOnly` (`{ user }` / `{ ok: true }`)
- Testes unitários dos dois contratos JSON

### ⏳ Pendente
- Nenhum
