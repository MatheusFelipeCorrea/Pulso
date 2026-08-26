---
card_id: PULSO-TASK-004
title: "Backend — login, refresh, logout e cookies httpOnly"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
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

Adicionar em: `Codigo/Pulso/api/src/services/authService.js`

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

Criar em: `Codigo/Pulso/api/src/utils/authCookies.js`

Cookies `pulso_access` (15min) e `pulso_refresh` (`httpOnly`, `Secure` prod, `SameSite=none` prod / `lax` dev, `path=/api`)

### `tokenUtils.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/utils/tokenUtils.js`

- Access JWT 15min · Refresh 7d (30d lembrar-me)
- `createRefreshTokenValue()` — 48 bytes hex

### `authRepository.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/repositories/authRepository.js`

- `createRefreshToken`, `findRefreshToken`, `revokeRefreshToken`, `revokeAllRefreshTokensForUser`

### `schema.prisma` — `TokenRenovacao` (NOVO — CRIAR)

`token` @unique, `expiraEm`, `revogado`, índices `usuarioId` e `expiraEm`

## 📐 Regras de Negócio

- Access 15min (RN-133) · Refresh 7d/30d rotativo (RN-134)
- Cookies httpOnly (RN-135)
- Mensagens genéricas em falha de login (anti-enumeração)

## 📋 Resumo

### ✅ Concluído
- Arquitetura de tokens e cookies especificada

### ⏳ Pendente
- Implementar login, refresh rotativo e logout
- Criar utilitários de cookies e tokens
- Model `TokenRenovacao` + repository
