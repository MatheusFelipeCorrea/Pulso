---
card_id: "PULSO-TASK-002"
title: "Backend — cadastro, verificação e reenvio de email"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-001"
due_date: null
board_sync_at: "2026-08-26T15:30:52.000Z"
categories:
  - "Backend"
  - "Integração Externa"
  - "Regra de Negócio"
---


# [TASK] Backend — cadastro, verificação e reenvio de email

> **Contexto:** Endpoints e regras de negócio para RF-001 e RF-003.

## 📝 Descrição

Implementar registro com validação Zod, hash bcrypt(12), envio SMTP, verificação e reenvio de token.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/api/auth/register` | Cria usuário, seed categorias, envia email ou `emailPendente` |
| `GET` | `/api/auth/verify-email/:token` | Ativa conta ou retorna already verified |
| `POST` | `/api/auth/resend-verification` | Novo token + email para conta não verificada |

## 🛠️ Implementação

### `authService.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/services/authService.js`

```javascript
// registerUser({ nome, email, senha, confirmarSenha })
// verifyEmail(token)
// resendVerificationEmail(email)
```

- bcrypt 12 rounds, token verificação 24h
- Chamar `categoryService.seedCategoriasPadrao` após criar usuário
- Se SMTP falhar: retornar `emailPendente: true` sem deletar conta

### `authController.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/controllers/authController.js`

- `register`, `verifyEmail`, `resendVerification`

### `authRoutes.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/routes/authRoutes.js`

Montar rotas com rate limits: `authRegisterRateLimit`, `authVerifyEmailRateLimit`, `authResendVerificationRateLimit`

### `authSchemas.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/schemas/authSchemas.js`

`registerSchema`, `verifyEmailSchema`, `resendVerificationSchema` + regex senha forte

### `emailProvider.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/providers/emailProvider.js`

- `sendVerificationEmail(email, token)`

### `prismaErrors.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/utils/prismaErrors.js`

Mapear P2002 → 409 no cadastro

## 📐 Regras de Negócio

- Senha: min 8, maiúscula, minúscula, número, especial `@$!%*?&#` (RN-131)
- bcrypt salt rounds = 12 (RN-132)
- Login bloqueado até `verificado=true` (RN-137)

## 📋 Resumo

### ✅ Concluído
- Contratos de endpoint e payloads definidos

### ⏳ Pendente
- Implementar service, controller, routes e schemas
- Integrar provider de email (SMTP)
- Testes unitários em `api/tests/unit/authService.test.js`
