---
card_id: "PULSO-EPIC-001"
title: "Autenticação"
status: "Backlog"
type: "Epic"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
board_sync_at: "2026-08-26T15:29:21.000Z"
categories:
  - "web"
  - "Backend"
  - "Banco de Dados"
  - "Cibersegurança"
  - "Frontend"
  - "Regra de Negócio"
---


# [EPIC] Autenticação

> **Contexto:** Sistema completo de autenticação e autorização do Pulso — base de segurança para todos os módulos financeiros. Deve cobrir cadastro email/senha com verificação, login JWT (access + refresh rotativo), sessão em cookies `httpOnly`, recuperação de senha, Google OAuth 2.0, middleware de rotas protegidas e 9 telas auth responsivas (claro/escuro).

**Refs:** RF-001–006 · RN-131–143

## 🎯 Objetivos

- Cadastro com bcrypt (12 rounds), token de verificação (24h) e seed de categorias padrão
- Login email/senha ou nome + checkbox "Lembrar-me" (refresh 30 dias)
- Google OAuth via Passport + troca de sessão `POST /auth/oauth/exchange`
- Recuperação de senha (token 1h) com invalidação de todos os refresh tokens
- Sessão JWT: access 15min + refresh rotativo 7d (single-use, revoga sessão em replay)
- Cookies `pulso_access` / `pulso_refresh` (`httpOnly`, `Secure` prod, `SameSite`)
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
| Gamificação | Criar `Sequencia` no cadastro |
| Configurações | `ConfiguracaoUsuario` criada junto ao usuário (tema CLARO default) |
| Cron | `unverifiedAccountCleanupJob` via `cronController.daily` |
| Rotas protegidas | `authMiddleware` em `/auth/me` e demais módulos da API |

## 🔗 Sub-issues

- PULSO-FEAT-001
- PULSO-FEAT-002
- PULSO-FEAT-003
- PULSO-FEAT-004
- PULSO-FEAT-005

## 📋 Resumo

### ✅ Concluído
- Escopo do epic refinado com base nos RFs RF-001–006 e RNs RN-131–143
- Hierarquia Epic → Feature → Task definida (5 features, 12 tasks)
- Contratos de API, telas e integrações documentados como spec de implementação

### ⏳ Pendente
- Implementar PULSO-FEAT-001 a PULSO-FEAT-005
- Validar fluxos ponta a ponta (cadastro → verificação → login → sessão → logout)
- Cobertura de testes API e Web para todos os fluxos auth
- Decidir login por nome (`Usuario.nome` sem `@unique`) vs. email-only
