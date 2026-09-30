---
card_id: PULSO-TASK-009
title: "Frontend — telas de recuperação de senha"
status: "In Revision"
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-004
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
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
| `Codigo/web/src/pages/ForgotPassword.jsx` | `/forgot-password` |
| `Codigo/web/src/pages/ForgotPasswordEmailSent.jsx` | `/forgot-password/email-sent` |
| `Codigo/web/src/pages/ResetPassword.jsx` | `/reset-password/:token` |
| `Codigo/web/src/pages/ResetPasswordSuccess.jsx` | `/reset-password/success` |

### Componentes (NOVO — CRIAR)

- `PasswordStrengthHints.jsx` — barra + checklist em reset
- `AuthHeroRecoverIllustration.jsx`, `AuthHeroResetIllustration.jsx`, etc.
- `schemas/authSchemas.js` — `forgotPasswordSchema`, `resetPasswordSchema`

### Serviços (NOVO — CRIAR)

`authService.forgotPassword`, `validateResetToken`, `resetPassword`

Registrar rotas em `App.jsx`

## 🔗 Pull Requests

- [#288](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/288) — Recuperação de senha (`feat/17`)
- [#289](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/289) — UX da recuperação de senha (`feat/18`)

## 👤 Responsável

- Sofia Vasconcelos (`sofiavasconcelosms`)

## 📋 Resumo

### ✅ Concluído
- Spec de 4 telas e validação definida

### ⏳ Pendente
- Nenhum
