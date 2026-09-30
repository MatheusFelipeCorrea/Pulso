---
card_id: PULSO-TASK-004
title: "Backend — login, refresh, logout e cookies httpOnly"
status: "In Revision"
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-002
due_date: null
categories:
  - Backend
  - Cibersegurança
  - Regra de Negócio
---

# [TASK] Backend — login, refresh, logout e cookies httpOnly

> **Contexto:** Núcleo da sessão JWT com refresh rotativo e transporte seguro em cookies.

## 📝 Descrição

Implementar endpoints de sessão: login emite tokens, refresh rotaciona, logout revoga, `/me` retorna usuário autenticado.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/api/auth/login` | Valida credenciais + verificado; seta cookies |
| `POST` | `/api/auth/refresh` | Rotaciona refresh; seta cookies; `{ ok: true }` |
| `POST` | `/api/auth/logout` | Revoga refresh; limpa cookies |
| `GET` | `/api/auth/me` | Requer `authMiddleware`; retorna `{ user }` |

## 🛠️ Implementação

### `authService.js` (NOVO — CRIAR)

Adicionar em: `Codigo/api/src/services/authService.js`

```javascript
// loginUser({ email, senha, lembrarMe })
// refreshAccessToken(refreshToken) — rotação single-use + anti-replay
// logoutUser(refreshToken)
// getAuthenticatedUser(userId)
// issueAuthTokens(usuario, lembrarMe)
// formatUserResponse(usuario)
```

### `authController.js` (NOVO — CRIAR)

- `respondWithAuthSession` — `setAuthCookies` + JSON sem expor tokens no body
- `login`, `refresh`, `logout`, `me`

### `authCookies.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/utils/authCookies.js`

Cookies `pulso_access` (15min) e `pulso_refresh` (`httpOnly`, `Secure` prod, `SameSite=none` prod / `lax` dev, `path=/api`)

### `tokenUtils.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/utils/tokenUtils.js`

- Access JWT 15min · Refresh 7d (30d lembrar-me)
- `createRefreshTokenValue()` — 48 bytes hex

### `authRepository.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/repositories/authRepository.js`

- `createRefreshToken`, `findRefreshToken`, `revokeRefreshToken`, `revokeAllRefreshTokensForUser`

### `schema.prisma` — `TokenRenovacao` (NOVO — CRIAR)

`token` @unique, `expiraEm`, `revogado`, índices `usuarioId` e `expiraEm`

## 📐 Regras de Negócio

- Access 15min (RN-133) · Refresh 7d/30d rotativo (RN-134)
- Cookies httpOnly (RN-135)
- Mensagens genéricas em falha de login (anti-enumeração)

## 🔗 Pull Requests

- [#286](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/286) — Login, sessão JWT e logout (`feat/15`)

## 👤 Responsável

- Vinícius Simões (`ViniSimoesV`)

## 📋 Resumo

### ✅ Concluído
- Arquitetura de tokens e cookies especificada

### ⏳ Pendente
- Nenhum
