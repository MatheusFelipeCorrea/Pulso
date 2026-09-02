---
card_id: "PULSO-TASK-009"
title: "Frontend — telas de recuperação de senha"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-004"
due_date: null
board_sync_at: "2026-08-26T15:30:59.000Z"
categories:
  - "web"
  - "Frontend"
  - "Regra de Negócio"
  - "UX / UI"
---


# [TASK] Frontend — telas de recuperação de senha

> **Contexto:** Fluxo completo forgot → email sent → reset → success.

## 📝 Descrição

Como **usuário**, quero solicitar recuperação de senha, redefinir via link seguro e voltar ao login.

## ✅ Critérios de Aceite

### Cenário 1 — Solicitar reset
**Quando** email válido em `/forgot-password`,  
**Então** redirect `/forgot-password/email-sent`.

### Cenário 2 — Validar link
**Quando** `/reset-password/:token` carrega,  
**Então** chama `validateResetToken`; exibe form ou erro.

### Cenário 3 — Nova senha
**Quando** senha forte + confirmação iguais,  
**Então** redirect `/reset-password/success` com CTA login.

## 🛠️ Implementação

### Páginas (NOVO — CRIAR)

| Arquivo | Rota |
|---------|------|
| `Codigo/Pulso/web/src/pages/ForgotPassword.jsx` | `/forgot-password` |
| `Codigo/Pulso/web/src/pages/ForgotPasswordEmailSent.jsx` | `/forgot-password/email-sent` |
| `Codigo/Pulso/web/src/pages/ResetPassword.jsx` | `/reset-password/:token` |
| `Codigo/Pulso/web/src/pages/ResetPasswordSuccess.jsx` | `/reset-password/success` |

### Componentes (NOVO — CRIAR)

- `PasswordStrengthHints.jsx` — barra + checklist em reset
- `AuthHeroRecoverIllustration.jsx`, `AuthHeroResetIllustration.jsx`, etc.
- `schemas/authSchemas.js` — `forgotPasswordSchema`, `resetPasswordSchema`

### Serviços (NOVO — CRIAR)

`authService.forgotPassword`, `validateResetToken`, `resetPassword`

Registrar rotas em `App.jsx`

## 📋 Resumo

### ✅ Concluído
- Spec de 4 telas e validação definida

### ⏳ Pendente
- Implementar páginas do fluxo forgot/reset
- Indicador de força de senha no reset
