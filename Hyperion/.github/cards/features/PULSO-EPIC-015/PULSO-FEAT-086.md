---
card_id: PULSO-FEAT-086
title: "Protótipo — autenticação"
status: Done
type: Feature
priority: High
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-015
due_date: null
categories:
  - Protótipo
  - UX / UI
  - Web
  - Mobile
---

# [FEATURE] Protótipo — autenticação

> **Contexto:** Fluxo público de conta no `AuthLayout` (split com hero). Claro e escuro na mesma feature. Não prototipar `/auth/callback` (redirect técnico).

**Produto:** `PULSO-EPIC-001` · **Refs:** RF-001–006

## 📖 Histórias

- Como **visitante**, quero telas de cadastro e login (email/Google, força de senha, lembrar-me), para entender o caminho até o app.
- Como **usuário**, quero recuperação de senha e feedback de e-mail enviado, para o fluxo de conta parecer completo no Figma.
- Como **designer**, quero cada tela em claro e escuro, desktop e mobile, para o `AuthLayout` não ser definido só num tema.

## 🎭 Telas

| Rota | Tela |
|------|------|
| `/register` | Cadastro |
| `/register/email-sent` | E-mail de verificação enviado |
| `/verify-email/:token` | Verificar e-mail (sucesso / token inválido) |
| `/login` | Login |
| `/forgot-password` | Recuperar senha |
| `/forgot-password/email-sent` | Reset enviado |
| `/reset-password/:token` | Nova senha |
| `/reset-password/success` | Senha alterada |

## ✅ Critérios de Aceite

### Cenário 1 — Cadastro e login
**Então** formulários com termos, Google, validação visível; login com lembrar-me e atalho “esqueci senha”.

### Cenário 2 — E-mail e reset
**Então** estados de enviado, token inválido/expirado e sucesso têm UI própria (não só um alert).

### Cenário 3 — Temas e viewport
**Então** **cada** tela acima existe em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** callback OAuth e rate-limit de API não ganham frame dedicado.

## 🔗 Pull Requests

- [#290](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/290) — Exports de Auth na apostila
- [#291](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/291) — Protótipos de Auth (claro e escuro)

## 📋 Resumo

### ✅ Concluído
- Lista de telas auth (exceto callback)

### ⏳ Pendente
- Frames Figma claro/escuro
