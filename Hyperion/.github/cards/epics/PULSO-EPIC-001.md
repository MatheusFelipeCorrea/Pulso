---
card_id: PULSO-EPIC-001
title: "Autenticação"
status: "In Revision"
type: Epic
priority: Highest
sprint: "Sprint 2"
story_points: null
reporter: "Matheus Felipe Correa"
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Mobile
  - Banco de Dados
  - Cibersegurança
  - Regra de Negócio
---

# [EPIC] Autenticação

> **Contexto:** Sistema completo de autenticação e autorização do Pulso — base de segurança para todos os módulos financeiros. Deve cobrir cadastro email/senha com verificação, login JWT (access + refresh rotativo), sessão em cookies `httpOnly` na Web e secure storage no Flutter, recuperação de senha, Google OAuth 2.0 (Passport na SPA + ID token no app), middleware de rotas protegidas e 9 telas auth responsivas (claro/escuro).

**Refs:** RF-001–006 · RF-140 · RN-131–143  
**Spec:** `Hyperion/.github/plans/specs/PULSO-EPIC-001-autenticacao/`  
**Spec Flutter:** `Hyperion/.github/plans/specs/PULSO-107-auth-flutter/`

## 🎯 Objetivos

- Cadastro com bcrypt (12 rounds), token de verificação (24h) e seed de categorias padrão
- Login email/senha ou nome + checkbox "Lembrar-me" (refresh 30 dias)
- Google OAuth via Passport + troca de sessão `POST /auth/oauth/exchange`
- Recuperação de senha (token 1h) com invalidação de todos os refresh tokens
- Sessão JWT: access 15min + refresh rotativo 7d (single-use, revoga sessão em replay)
- Cookies `pulso_access` / `pulso_refresh` (`httpOnly`, `Secure` prod, `SameSite`) na Web; Bearer + secure storage no Flutter (mesma API)
- App nativo reutiliza `POST/GET /api/auth/*` (RF-140) — sem segundo backend
- Rate limit 5 req/min **por rota** (9 instâncias independentes)
- Job diário: remove contas email não verificadas > 30 dias

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/register` | Cadastro | Nome, email, senha, termos; Google; força de senha |
| `/register/email-sent` | Email enviado | Reenviar verificação; ir para login |
| `/verify-email/:token` | Verificar email | Valida token; redirect login |
| `/login` | Login | Email/nome + senha; lembrar-me; Google; reenviar verificação |
| `/auth/callback` | Callback OAuth | `?exchange=` → cookies + redirect área logada |
| `/forgot-password` | Recuperar senha | Envia email reset (anti-enumeração) |
| `/forgot-password/email-sent` | Reset enviado | Feedback + voltar login |
| `/reset-password/:token` | Nova senha | Valida token; checklist senha forte |
| `/reset-password/success` | Senha alterada | CTA login |

**Layout:** `AuthLayout` · **Redirect autenticado:** `DEFAULT_AUTHENTICATED_ROUTE` → `/transactions`

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Categorias | `categoryService.seedCategoriasPadrao` no cadastro (email e Google) |
| Configurações | `ConfiguracaoUsuario` criada junto ao usuário (tema CLARO, plano FREE) |
| Cron | `unverifiedAccountCleanupJob` via `cronController.daily` |
| Rotas protegidas | `authMiddleware` em `/auth/me` e demais módulos da API |

## 🔗 Sub-issues

- PULSO-FEAT-001
- PULSO-FEAT-002
- PULSO-FEAT-003
- PULSO-FEAT-004
- PULSO-FEAT-005
- PULSO-FEAT-107

## 🔗 Pull Requests

- [#284](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/284) — Camadas de banco e autenticação
- [#286](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/286) — Login, sessão JWT e logout
- [#287](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/287) — Google OAuth 2.0
- [#288](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/288) — Recuperação de senha
- [#289](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/289) — UX da recuperação de senha

## 👤 Responsáveis

- Alice Shikida (`aliceshikida`) — FEAT-001
- Vinícius Simões (`ViniSimoesV`) — FEAT-002
- Maria Clara (`mariaoliveira27`) — FEAT-003
- Sofia Vasconcelos (`sofiavasconcelosms`) — FEAT-004
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — FEAT-005 + FEAT-107

## 📋 Resumo

### ✅ Concluído
- Escopo do epic refinado com base nos RFs RF-001–006 e RNs RN-131–143
- Hierarquia Epic → Feature → Task definida (6 features: Web 001–005 + Flutter 107)
- Contratos de API, telas e integrações documentados como spec de implementação
- FEAT-001–005 (Web) e FEAT-107 (Flutter) mergeados

### ⏳ Pendente
- Revisão (In Revision)
