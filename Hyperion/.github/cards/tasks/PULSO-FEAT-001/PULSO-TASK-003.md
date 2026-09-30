---
card_id: PULSO-TASK-003
title: "Frontend — telas de cadastro e verificação"
status: "In Revision"
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-001
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — telas de cadastro e verificação

> **Contexto:** UI responsiva para cadastro, confirmação de email enviado e verificação via link.

## 📝 Descrição

Como **visitante**, quero me cadastrar, saber que o email foi enviado e confirmar minha conta pelo link, para acessar o Pulso com segurança.

## ✅ Critérios de Aceite

### Cenário 1 — Cadastro
**Quando** formulário válido em `/register`,  
**Então** redirect `/register/email-sent?email=...` com checklist de senha visível durante digitação.

### Cenário 2 — Email enviado
**Quando** em `/register/email-sent`,  
**Então** pode reenviar verificação e ir para login.

### Cenário 3 — Verificar email
**Quando** abre `/verify-email/:token`,  
**Então** exibe loading → sucesso/erro com link para login (`?verified=true` no login).

## 🛠️ Implementação

### Páginas (NOVO — CRIAR)

| Arquivo | Rota |
|---------|------|
| `Codigo/web/src/pages/Register.jsx` | `/register` |
| `Codigo/web/src/pages/RegisterEmailSent.jsx` | `/register/email-sent` |
| `Codigo/web/src/pages/VerifyEmail.jsx` | `/verify-email/:token` |

### Componentes (NOVO — CRIAR)

- `components/layouts/AuthLayout/AuthLayout.jsx` — layout split com hero ilustrado
- `components/auth/PasswordStrengthHints.jsx` — barra + checklist regras
- `components/features/auth/AuthHero*.jsx` — ilustrações por fluxo
- `styles/auth.css` — tema claro/escuro

### Serviços e validação (NOVO — CRIAR)

- `services/authService.js` — `register`, `verifyEmail`, `resendVerification`
- `schemas/authSchemas.js` — `registerSchema` (+ `aceitarTermos`)

Registrar rotas em `App.jsx` — `/register` com `GuestRoute`

## 🔗 Pull Requests

- [#284](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/284) — Camadas de banco e autenticação (`feat/14`)

## 👤 Responsável

- Alice Shikida (`aliceshikida`)

## 📋 Resumo

### ✅ Concluído
- Spec de telas, componentes e validação Zod definida

### ⏳ Pendente
- Nenhum
