---
card_id: PULSO-TASK-161
title: "Flutter — init, e-mail/senha e sessão Bearer"
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
  - Frontend
  - Cibersegurança
  - UX / UI
---

# [TASK] Flutter — init, e-mail/senha e sessão Bearer

> **Contexto:** `Codigo/Pulso/mobile` já tem o app Flutter (Dio, go_router, secure storage). RF-140: o app consome a **mesma** API REST. Telas de referência: protótipo `PULSO-FEAT-086`.

## 📝 Descrição

Mantém o cliente HTTP (Dio), JWT no secure storage e as telas de cadastro/login/logout alinhadas às rotas `/api/auth/*`.

## ✅ Critérios de Aceite

**Dado** o app iniciado,  
**Quando** há tokens válidos no secure storage,  
**Então** chama `GET /api/auth/me` com Bearer e entra na área autenticada.

**Dado** cadastro válido,  
**Quando** `POST /api/auth/register`,  
**Então** mostra o fluxo de e-mail enviado; login só após verificação (`verificado=true`).

**Dado** login com e-mail/senha,  
**Quando** `POST /api/auth/login` com `X-Pulso-Client: mobile`,  
**Então** persiste `accessToken` e `refreshToken` em `flutter_secure_storage` (nunca SharedPreferences em texto).

**Dado** access expirado,  
**Quando** o interceptor recebe `401`,  
**Então** tenta `POST /api/auth/refresh` com `{ refreshToken }`, grava o novo par e repete a request.

**Dado** logout,  
**Quando** `POST /api/auth/logout` com `{ refreshToken }`,  
**Então** revoga no servidor e apaga o storage local.

**Dado** forgot/reset,  
**Então** usa `POST /api/auth/forgot-password` e, se o token chegar no app, `POST /api/auth/reset-password/:token` (deep link fica na TASK-162).

## 🛠️ Implementação

### `Codigo/Pulso/mobile/` (EXISTENTE)

App Flutter com Dio, `flutter_secure_storage` e go_router. Base URL aponta para a API Node (`Codigo/Pulso/api`).

### Cliente HTTP (EXISTENTE)

Em: `Codigo/Pulso/mobile/lib/core/api/`

- Interceptor: `Authorization: Bearer` + `X-Pulso-Client: mobile`
- Refresh único (fila) para evitar replay paralelo do refresh token
- 401 após refresh falho → limpa storage e rota de login

### Auth feature (EXISTENTE)

Em: `Codigo/Pulso/mobile/lib/features/auth/`

- `token_storage.dart` — secure storage
- `auth_repository.dart` — register, login, refresh, logout, me, forgot, reset, resend
- Telas alinhadas ao protótipo: cadastro, e-mail enviado, login, forgot, reset

## 📐 Regras de Negócio

- Mesmas validações da Web (nome ≥3, senha forte, anti-enumeração no forgot)
- JWT no device só em storage seguro (apostila 3.4)

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 📋 Resumo

### ✅ Concluído
- Scaffold Flutter + Dio + `flutter_secure_storage` + go_router
- Telas e-mail/senha, termos/privacidade, interceptor de refresh e logout local no 401

### ⏳ Pendente
- Nenhum
