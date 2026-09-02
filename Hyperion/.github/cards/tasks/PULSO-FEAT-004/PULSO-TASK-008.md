---
card_id: "PULSO-TASK-008"
title: "Backend — recuperação e reset de senha"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-004"
due_date: null
board_sync_at: "2026-08-26T15:30:58.000Z"
categories:
  - "Backend"
  - "Cibersegurança"
  - "Integração Externa"
  - "Regra de Negócio"
---


# [TASK] Backend — recuperação e reset de senha

> **Contexto:** Endpoints RF-004 com anti-enumeração e revogação de sessões pós-reset.

## 📝 Descrição

Implementar solicitação de reset por email, validação de token e definição de nova senha forte invalidando todas as sessões ativas.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/api/auth/forgot-password` | Gera token 1h; resposta genérica sempre |
| `GET` | `/api/auth/reset-password/:token` | Valida token; retorna email mascarado |
| `POST` | `/api/auth/reset-password/:token` | Nova senha + revoga todos refresh tokens |

## 🛠️ Implementação

### `authService.js` (NOVO — CRIAR)

Adicionar em: `Codigo/Pulso/api/src/services/authService.js`

```javascript
// requestPasswordReset(email) — anti-enumeração; ignora contas Google-only
// validateResetToken(token)
// resetPassword(token, { senha, confirmarSenha })
// maskEmail(email)
```

### `authController.js` (NOVO — CRIAR)

- `forgotPassword`, `validateResetToken`, `resetPassword` (+ `clearAuthCookies` no reset)

### `emailProvider.js` (NOVO — CRIAR)

- `sendPasswordResetEmail(email, token)`

### Rate limits (NOVO — CRIAR)

`authForgotPasswordRateLimit`, `authResetPasswordRateLimit` em `authRateLimit.js`

## 📐 Regras de Negócio

- Token reset expira 1h (RN-141)
- Reset revoga todas sessões (RN-136)
- Conta Google: resposta genérica sem email (segurança)

## 📋 Resumo

### ✅ Concluído
- Contratos e regras de anti-enumeração definidos

### ⏳ Pendente
- Implementar endpoints forgot/reset
- Integrar email de reset
- Testes unitários do fluxo
