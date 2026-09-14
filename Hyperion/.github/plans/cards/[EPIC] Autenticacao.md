# [EPIC] Autenticação — rollup Hyperion

> **Formato:** cards individuais em `Hyperion/.github/cards/` (sync GitHub Projects) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` como se o módulo ainda não estivesse entregue, porém alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-001 | Autenticação |
| Feature | PULSO-FEAT-001–005 | Cadastro, sessão, OAuth, reset, segurança (Web) |
| Task | PULSO-TASK-001–012 | DB, backend, frontend, QA |
| Feature | PULSO-FEAT-107 | Auth Flutter (mesma API Node) |
| Task | PULSO-TASK-160–162 | JSON sessão nativa, Flutter e-mail/senha, Google + deep links |

---

---
card_id: PULSO-EPIC-001
title: "Autenticação"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Cibersegurança
  - Regra de Negócio
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
- PULSO-FEAT-107

## 📋 Resumo

### ✅ Concluído
- Escopo do epic refinado com base nos RFs RF-001–006 e RNs RN-131–143
- Hierarquia Epic → Feature → Task definida (6 features: Web 001–005 + Flutter 107)
- Contratos de API, telas e integrações documentados como spec de implementação

### ⏳ Pendente
- Implementar PULSO-FEAT-001 a PULSO-FEAT-005 (Web)
- PULSO-FEAT-107 — Auth Flutter na mesma API Node
- Validar fluxos ponta a ponta (cadastro → verificação → login → sessão → logout)
- Cobertura de testes API e Web para todos os fluxos auth
- Decidir login por nome (`Usuario.nome` sem `@unique`) vs. email-only

---
---
card_id: PULSO-FEAT-001
title: "Cadastro e verificação de email"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Regra de Negócio
  - Integração Externa
---

# [FEATURE] Cadastro e verificação de email

> **Contexto:** Permitir que novos usuários criem conta com email e senha forte, recebam email de confirmação (RF-003) e só acessem o app após verificação (RN-137). Inclui reenvio de verificação e resiliência quando SMTP falha.

**Refs:** RF-001 · RF-003 · RN-131 · RN-132 · RN-137

## 📝 Descrição

Fluxo ponta a ponta de cadastro: formulário web → `POST /auth/register` → hash bcrypt → token verificação 24h → email SMTP → `GET /auth/verify-email/:token` → conta ativa. Deve incluir seed de categorias padrão e criação de `ConfiguracaoUsuario` + `Sequencia`.

## ✅ Critérios de Aceite

### Cenário 1 — Cadastro bem-sucedido
**Dado** dados válidos (nome ≥3, email único, senha forte, confirmação igual),  
**Quando** `POST /api/auth/register`,  
**Então** retorna `201` com mensagem de sucesso e email; conta criada com `verificado=false`.

### Cenário 2 — Email duplicado
**Quando** email já cadastrado,  
**Então** retorna `409` "Este email já está cadastrado." (inclui corrida P2002→409).

### Cenário 3 — SMTP indisponível
**Quando** envio de verificação falha,  
**Então** conta **permanece** com `emailPendente: true` e mensagem orientando reenvio.

### Cenário 4 — Verificação de email
**Quando** `GET /api/auth/verify-email/:token` com token válido e não expirado,  
**Então** `verificado=true`; tokens de verificação limpos.

### Cenário 5 — Reenvio
**Quando** `POST /api/auth/resend-verification` para conta não verificada EMAIL,  
**Então** novo token gerado e email reenviado.

## 🔗 Sub-issues

- PULSO-TASK-001
- PULSO-TASK-002
- PULSO-TASK-003

## 📋 Resumo

### ✅ Concluído
- Critérios de aceite e contratos de API definidos
- Spec de telas `/register`, `/register/email-sent`, `/verify-email/:token`

### ⏳ Pendente
- PULSO-TASK-001 — modelagem Prisma
- PULSO-TASK-002 — endpoints backend
- PULSO-TASK-003 — telas frontend + indicador de força de senha

---
---
card_id: PULSO-FEAT-002
title: "Login, sessão JWT e logout"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Cibersegurança
  - Regra de Negócio
---

# [FEATURE] Login, sessão JWT e logout

> **Contexto:** Autenticação com email/senha (ou nome), emissão de sessão JWT com refresh rotativo (RF-005), cookies httpOnly (RN-135) e logout com invalidação de refresh token (RF-006).

**Refs:** RF-005 · RF-006 · RN-133 · RN-134 · RN-135 · RN-137

## 📝 Descrição

Login deve validar credenciais e exigir email verificado; emitir access JWT (15min) + refresh token (7d ou 30d com "Lembrar-me"). Sessão transportada em cookies `pulso_access` / `pulso_refresh`. Refresh rotativo single-use com proteção anti-replay. Front deve restaurar sessão via `GET /auth/me` e deduplicar refresh no interceptor.

## ✅ Critérios de Aceite

### Cenário 1 — Login bem-sucedido
**Quando** credenciais corretas e conta verificada,  
**Então** cookies httpOnly setados + payload `{ user }`; redirect para `/transactions`.

### Cenário 2 — Email não verificado
**Quando** login com `verificado=false`,  
**Então** retorna `403` com CTA de reenviar verificação na UI.

### Cenário 3 — Refresh rotativo
**Quando** `POST /api/auth/refresh` com refresh válido,  
**Então** novo par de tokens; refresh anterior revogado (single-use).

### Cenário 4 — Replay de refresh
**Quando** refresh já revogado é reapresentado,  
**Então** revoga **toda** sessão do usuário e retorna `401`.

### Cenário 5 — Logout
**Quando** `POST /api/auth/logout`,  
**Então** refresh revogado e cookies limpos.

### Cenário 6 — Bootstrap de sessão
**Quando** app carrega com cookies válidos,  
**Então** `AuthBootstrap` chama `GET /auth/me` e popula Redux sem loop F5.

## 🔗 Sub-issues

- PULSO-TASK-004
- PULSO-TASK-005

## 📋 Resumo

### ✅ Concluído
- Arquitetura de sessão definida (cookies httpOnly + refresh rotativo)
- Critérios de aceite para login, refresh, logout e bootstrap

### ⏳ Pendente
- PULSO-TASK-004 — backend login/refresh/logout/cookies
- PULSO-TASK-005 — frontend login, interceptor e Redux

---
---
card_id: PULSO-FEAT-003
title: "Google OAuth 2.0"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Integração Externa
  - Regra de Negócio
---

# [FEATURE] Google OAuth 2.0

> **Contexto:** Login social via Google (RF-002) com criação de conta nova ou vinculação a conta existente (RN-138/139), sem expor tokens JWT na URL — usar exchange token de curta duração (60s).

**Refs:** RF-002 · RN-138 · RN-139

## 📝 Descrição

Fluxo: botão Google → redirect `GET /auth/google` (Passport) → callback API → redirect front `/auth/callback?exchange=` → `POST /auth/oauth/exchange` → cookies de sessão. Conta Google deve nascer já verificada; conflito email+senha retorna erro claro.

## ✅ Critérios de Aceite

### Cenário 1 — Nova conta Google
**Quando** Google retorna email inexistente,  
**Então** cria `Usuario` com `provedorAuth=GOOGLE`, `verificado=true`, seed categorias.

### Cenário 2 — Conta Google existente
**Quando** `googleId` já cadastrado,  
**Então** autentica usuário existente.

### Cenário 3 — Email já cadastrado com senha
**Quando** email existe com `provedorAuth=EMAIL`,  
**Então** retorna `409` orientando login por senha.

### Cenário 4 — Exchange expirado
**Quando** `exchange` JWT expirado (>60s),  
**Então** retorna `401` e UI redireciona para login.

### Cenário 5 — Erro OAuth
**Quando** callback falha ou usuário cancela,  
**Então** redirect `/auth/callback?error=google_auth_failed&message=...` com UI de recuperação.

## 🔗 Sub-issues

- PULSO-TASK-006
- PULSO-TASK-007

## 📋 Resumo

### ✅ Concluído
- Fluxo OAuth + exchange documentado como spec
- Variáveis de ambiente mapeadas (`GOOGLE_CLIENT_ID`, `GOOGLE_CALLBACK_URL`, etc.)

### ⏳ Pendente
- PULSO-TASK-006 — backend Passport + exchange
- PULSO-TASK-007 — frontend callback e botão Google

---
---
card_id: PULSO-FEAT-004
title: "Recuperação de senha"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Integração Externa
  - Regra de Negócio
  - Cibersegurança
---

# [FEATURE] Recuperação de senha

> **Contexto:** Permitir que usuários com conta email/senha redefinam a senha via link enviado por email (RF-004), com anti-enumeração e invalidação de todas as sessões após reset (RN-136).

**Refs:** RF-004 · RN-136 · RN-141

## 📝 Descrição

Fluxo: `/forgot-password` → `POST /auth/forgot-password` → email com token 1h → `/reset-password/:token` valida token → `POST /auth/reset-password/:token` → nova senha forte → revoga todos refresh tokens. Contas Google devem receber resposta genérica sem revelar provedor.

## ✅ Critérios de Aceite

### Cenário 1 — Solicitar reset
**Quando** email válido de conta EMAIL com senha,  
**Então** token reset gerado (1h) e email enviado; resposta sempre genérica (anti-enumeração).

### Cenário 2 — Conta Google ou inexistente
**Quando** email não existe ou é conta Google-only,  
**Então** mesma mensagem de sucesso sem enviar email.

### Cenário 3 — Validar token
**Quando** `GET /api/auth/reset-password/:token` com token válido,  
**Então** retorna `{ valid: true, email }`.

### Cenário 4 — Redefinir senha
**Quando** `POST /api/auth/reset-password/:token` com senha forte,  
**Então** senha atualizada, tokens reset limpos, **todas** sessões revogadas, cookies limpos.

### Cenário 5 — Token expirado
**Quando** token > 1h,  
**Então** retorna `400` "Token inválido ou expirado."

## 🔗 Sub-issues

- PULSO-TASK-008
- PULSO-TASK-009

## 📋 Resumo

### ✅ Concluído
- Critérios de aceite e rotas de reset definidos
- Spec de anti-enumeração e revogação de sessões documentada

### ⏳ Pendente
- PULSO-TASK-008 — backend forgot/reset + email
- PULSO-TASK-009 — telas frontend do fluxo de reset

---
---
card_id: PULSO-FEAT-005
title: "Proteção de rotas e infraestrutura de segurança"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Cibersegurança
  - QA / Testes
  - Infra / DevOps
---

# [FEATURE] Proteção de rotas e infraestrutura de segurança

> **Contexto:** Camada transversal que deve proteger a API e o SPA: middleware JWT, rate limiting por rota, guardas de rota no front, job de limpeza de contas abandonadas e suíte de testes.

**Refs:** RN-140 · RNF-002 · RNF-004

## 📝 Descrição

`authMiddleware` deve validar JWT do cookie/header em rotas protegidas. `authRateLimit.js` aplica 5 req/min/IP com contadores independentes por rota sensível (9 instâncias). Front usa `ProtectedRoute` / `GuestRoute`. Cron diário remove contas email não verificadas > 30 dias.

## ✅ Critérios de Aceite

### Cenário 1 — Rota protegida sem token
**Quando** request sem JWT válido,  
**Então** retorna `401` "Token não fornecido ou inválido."

### Cenário 2 — Rate limit por rota
**Quando** >5 req/min/IP na mesma rota auth,  
**Então** retorna `429` sem afetar contador de outras rotas auth.

### Cenário 3 — SPA guard
**Quando** usuário não autenticado acessa rota protegida,  
**Então** `ProtectedRoute` redireciona `/login`.

### Cenário 4 — Guest guard
**Quando** usuário autenticado acessa `/login` ou `/register`,  
**Então** `GuestRoute` redireciona `/transactions`.

### Cenário 5 — Cleanup cron
**Quando** job diário executa,  
**Então** remove contas `provedorAuth=EMAIL`, `verificado=false`, `criadoEm` > 30 dias.

## 🔗 Sub-issues

- PULSO-TASK-010
- PULSO-TASK-011
- PULSO-TASK-012

## 📋 Resumo

### ✅ Concluído
- Requisitos de segurança transversal mapeados (middleware, rate limit, guards, cron)
- Escopo de testes definido

### ⏳ Pendente
- PULSO-TASK-010 — middleware + rate limit + job cleanup
- PULSO-TASK-011 — guardas de rota no React Router
- PULSO-TASK-012 — testes unitários API e Web

---
---
card_id: PULSO-TASK-001
title: "Banco de dados — modelos de usuário e verificação"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-001
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — modelos de usuário e verificação

> **Contexto:** Persistir usuários, configurações iniciais e campos temporários de verificação de email.

## 📝 Descrição

Como **sistema**, preciso modelar e migrar tabelas de usuário e configuração para suportar cadastro email/senha e OAuth.

## ✅ Critérios de Aceite

**Dado** migration aplicada,  
**Então** schema Prisma contém `Usuario` com `email` @unique, `senhaHash?`, `provedorAuth`, `verificado`, `tokenVerificacaoEmail`, `tokenVerificacaoExpira`; `ConfiguracaoUsuario` 1:1 com cascade delete.

## 🛠️ Implementação

### `Codigo/api/prisma/schema.prisma` (NOVO — CRIAR)

Adicionar/criar models:

| Model | Campos-chave |
|-------|--------------|
| `Usuario` | `nome`, `email` @unique, `senhaHash?`, `provedorAuth`, `googleId?` @unique, `verificado`, tokens verificação/reset |
| `ConfiguracaoUsuario` | `usuarioId` @unique, `tema`, `gamificacaoAtiva`, defaults financeiros |
| `Sequencia` | Criada no cadastro (gamificação) |

**Enum:** `ProvedorAuth` (EMAIL, GOOGLE)

**Migration:** `prisma/migrations/20260422195021_init/migration.sql` (ou nova migration incremental)

**Índices:** `token_verificacao_email`, `token_reset_senha`, `email`

## 📐 Regras de Negócio

- Email único por usuário
- Conta email inicia `verificado=false`
- Token verificação expira em 24h

## 📋 Resumo

### ✅ Concluído
- Spec de models e relações definida

### ⏳ Pendente
- Criar migration Prisma
- Validar índices de lookup por token de verificação

---
---
card_id: PULSO-TASK-002
title: "Backend — cadastro, verificação e reenvio de email"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-001
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Integração Externa
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

Criar em: `Codigo/api/src/services/authService.js`

```javascript
// registerUser({ nome, email, senha, confirmarSenha })
// verifyEmail(token)
// resendVerificationEmail(email)
```

- bcrypt 12 rounds, token verificação 24h
- Chamar `categoryService.seedCategoriasPadrao` após criar usuário
- Se SMTP falhar: retornar `emailPendente: true` sem deletar conta

### `authController.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/controllers/authController.js`

- `register`, `verifyEmail`, `resendVerification`

### `authRoutes.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/routes/authRoutes.js`

Montar rotas com rate limits: `authRegisterRateLimit`, `authVerifyEmailRateLimit`, `authResendVerificationRateLimit`

### `authSchemas.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/schemas/authSchemas.js`

`registerSchema`, `verifyEmailSchema`, `resendVerificationSchema` + regex senha forte

### `emailProvider.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/providers/emailProvider.js`

- `sendVerificationEmail(email, token)`

### `prismaErrors.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/utils/prismaErrors.js`

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

---
---
card_id: PULSO-TASK-003
title: "Frontend — telas de cadastro e verificação"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
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

## 📋 Resumo

### ✅ Concluído
- Spec de telas, componentes e validação Zod definida

### ⏳ Pendente
- Implementar 3 páginas + AuthLayout
- Indicador de força de senha (`PasswordStrengthBar` + checklist)
- Botão Google no cadastro (`loginWithGoogle`)

---
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

## 📋 Resumo

### ✅ Concluído
- Arquitetura de tokens e cookies especificada

### ⏳ Pendente
- Implementar login, refresh rotativo e logout
- Criar utilitários de cookies e tokens
- Model `TokenRenovacao` + repository

---
---
card_id: PULSO-TASK-005
title: "Frontend — login e gestão de sessão"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-002
due_date: null
categories:
  - Frontend
  - Web
  - Cibersegurança
  - UX / UI
---

# [TASK] Frontend — login e gestão de sessão

> **Contexto:** Tela de login, restauração de sessão via cookies e refresh transparente.

## 📝 Descrição

Como **usuário**, quero fazer login, manter sessão entre visitas e ser redirecionado corretamente, sem ver tokens no browser.

## ✅ Critérios de Aceite

### Cenário 1 — Login
**Quando** credenciais corretas,  
**Então** Redux `setUser`, toast boas-vindas, redirect `/transactions`.

### Cenário 2 — Lembrar-me
**Quando** checkbox marcado,  
**Então** refresh token com TTL 30 dias (backend).

### Cenário 3 — Refresh transparente
**Quando** API retorna 401 em rota protegida,  
**Então** interceptor deduplica `POST /auth/refresh` e retenta request.

### Cenário 4 — Sessão expirada
**Quando** refresh falha fora de rotas guest,  
**Então** redirect `/login` sem loop F5.

## 🛠️ Implementação

### Páginas e routing (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `Codigo/web/src/pages/Login.jsx` | Form login, lembrar-me, reenviar verificação, Google |
| `Codigo/web/src/components/routing/AuthBootstrap.jsx` | `getMe()` no mount |
| `Codigo/web/src/components/routing/ProtectedRoute.jsx` | Guards autenticado/guest |
| `Codigo/web/src/store/slices/authSlice.js` | `user`, `isAuthenticated`, `sessionChecked` |

### HTTP (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `Codigo/web/src/services/api.js` | `withCredentials: true`, `refreshPromise` mutex, interceptor 401 |
| `Codigo/web/src/services/authService.js` | `login`, `refresh`, `logout`, `getMe` |
| `Codigo/web/src/config/defaultAuthenticatedRoute.js` | `/transactions` |

Registrar em `App.jsx` — `/login` com `GuestRoute`; árvore protegida com `ProtectedRoute`

## 📋 Resumo

### ✅ Concluído
- Spec de bootstrap, interceptor e guards definida

### ⏳ Pendente
- Implementar Login.jsx + AuthBootstrap
- Mutex de refresh em `api.js`
- Redux authSlice e ProtectedRoute/GuestRoute

---
---
card_id: PULSO-TASK-006
title: "Backend — Google OAuth e exchange de sessão"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-003
due_date: null
categories:
  - Backend
  - Integração Externa
  - Regra de Negócio
---

# [TASK] Backend — Google OAuth e exchange de sessão

> **Contexto:** Integração Passport Google + troca segura de JWT curto por cookies de sessão.

## 📝 Descrição

Implementar fluxo OAuth server-side e endpoint de exchange para o SPA consumir sessão sem tokens permanentes na query string.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/api/auth/google` | Redirect Google OAuth (scope profile, email) |
| `GET` | `/api/auth/google/callback` | Passport callback → redirect front com `?exchange=` |
| `POST` | `/api/auth/oauth/exchange` | Valida JWT 60s → emite cookies de sessão |

## 🛠️ Implementação

### `authService.js` (NOVO — CRIAR)

Adicionar em: `Codigo/api/src/services/authService.js`

```javascript
// authenticateGoogle(profile) — cria/vincula conta, seed categorias
// buildGoogleCallbackRedirect(usuario) — JWT exchange TTL 60s
// buildGoogleErrorRedirect(error)
// exchangeOAuthSession(exchangeToken)
```

### `authRoutes.js` (NOVO — CRIAR)

- `GET /google` com `ensureGoogleStrategy()` + `passport.authenticate`
- `GET /google/callback` com handler customizado de erro
- `POST /oauth/exchange` + `authOAuthExchangeRateLimit`

### `passport.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/config/passport.js`

GoogleStrategy lazy via `ensureGoogleStrategy()` — evita crash sem env vars

**Env:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`, `JWT_SECRET`

## 📐 Regras de Negócio

- Conta Google nasce `verificado=true` (RN-138)
- Email existente com senha → 409, não merge automático (RN-139)
- Exchange token TTL 60s

## 📋 Resumo

### ✅ Concluído
- Fluxo OAuth + exchange especificado

### ⏳ Pendente
- Configurar Passport GoogleStrategy
- Implementar callback redirect e exchange endpoint
- Testes em `api/tests/unit/authService.test.js`

---
---
card_id: PULSO-TASK-007
title: "Frontend — callback OAuth e botão Google"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-003
due_date: null
categories:
  - Frontend
  - Web
  - Integração Externa
  - UX / UI
---

# [TASK] Frontend — callback OAuth e botão Google

> **Contexto:** Consumir retorno OAuth no SPA e completar login.

## 📝 Descrição

Como **usuário**, quero entrar com Google em um clique e ser autenticado automaticamente ao retornar do provedor.

## ✅ Critérios de Aceite

### Cenário 1 — Botão Google
**Quando** clica "Entrar com Google" em login ou cadastro,  
**Então** `window.location` → `${API_BASE}/auth/google`.

### Cenário 2 — Callback sucesso
**Quando** `/auth/callback?exchange=...`,  
**Então** `exchangeOAuth` → `getMe` → Redux `setUser` → redirect `/transactions`.

### Cenário 3 — Callback erro
**Quando** `?error=google_auth_failed`,  
**Então** card de erro com CTA voltar ao login.

## 🛠️ Implementação

### Páginas (NOVO — CRIAR)

| Arquivo | Rota |
|---------|------|
| `Codigo/web/src/pages/AuthCallback.jsx` | `/auth/callback` |
| `Codigo/web/src/pages/Login.jsx` | Botão Google inline SVG |
| `Codigo/web/src/pages/Register.jsx` | Botão Google inline SVG |

### Serviços (NOVO — CRIAR)

- `authService.loginWithGoogle()` — redirect full page
- `authService.exchangeOAuth(exchange)` — `POST /auth/oauth/exchange`
- `utils/apiBaseUrl.js` — base URL para redirect OAuth

Registrar em `App.jsx` — `/auth/callback` (pública, sem GuestRoute)

## 📋 Resumo

### ✅ Concluído
- Spec de estados loading/erro/sucesso na callback definida

### ⏳ Pendente
- Implementar AuthCallback.jsx
- Adicionar botão Google em Login e Register

---
---
card_id: PULSO-TASK-008
title: "Backend — recuperação e reset de senha"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-004
due_date: null
categories:
  - Backend
  - Integração Externa
  - Cibersegurança
  - Regra de Negócio
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

Adicionar em: `Codigo/api/src/services/authService.js`

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

---
---
card_id: PULSO-TASK-009
title: "Frontend — telas de recuperação de senha"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
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

## 📋 Resumo

### ✅ Concluído
- Spec de 4 telas e validação definida

### ⏳ Pendente
- Implementar páginas do fluxo forgot/reset
- Indicador de força de senha no reset

---
---
card_id: PULSO-TASK-010
title: "Backend — middleware, rate limit e job de limpeza"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-005
due_date: null
categories:
  - Backend
  - Cibersegurança
  - Infra / DevOps
---

# [TASK] Backend — middleware, rate limit e job de limpeza

> **Contexto:** Proteções transversais da API de autenticação.

## 📝 Descrição

Implementar validação JWT em rotas protegidas, limitar abuso por IP e limpar contas/sessões obsoletas.

## ✅ Critérios de Aceite

**Dado** request autenticada,  
**Quando** access token válido em cookie ou `Authorization: Bearer`,  
**Então** `req.user = { id, email, nome }` sem query extra ao banco.

**Dado** >5 req/min/IP em rota auth,  
**Então** `429` com mensagem padronizada.

**Dado** cron diário,  
**Então** remove contas email não verificadas > 30 dias.

## 🛠️ Implementação

### `authMiddleware.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/middlewares/authMiddleware.js`

- `getAccessTokenFromRequest` — cookie ou Bearer
- `jwt.verify` → claims em `req.user`

### `authRateLimit.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/middlewares/authRateLimit.js`

9 instâncias independentes (`express-rate-limit`, 5/min/IP):
`register`, `login`, `oauth/exchange`, `refresh`, `logout`, `forgot-password`, `reset-password`, `verify-email`, `resend-verification`

### `unverifiedAccountCleanupJob.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/jobs/unverifiedAccountCleanupJob.js`

- `authRepository.deleteUnverifiedEmailAccountsOlderThan`
- Invocar via `cronController.daily` e `server.js` (cron local)

### Registro (NOVO — CRIAR)

`routes/index.js` → `router.use('/auth', authRoutes)`

## 📐 Regras de Negócio

- Rate limit IP 5/min por rota (RN-140)

## 📋 Resumo

### ✅ Concluído
- Spec de middleware, rate limits e cron definida

### ⏳ Pendente
- Implementar authMiddleware e authRateLimit
- Criar job de cleanup de contas não verificadas
- Montar rotas em `routes/index.js`

---
---
card_id: PULSO-TASK-011
title: "Frontend — guardas de rota autenticada"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-005
due_date: null
categories:
  - Frontend
  - Web
  - Cibersegurança
  - UX / UI
---

# [TASK] Frontend — guardas de rota autenticada

> **Contexto:** Separar área pública, auth e app logado no React Router.

## 📝 Descrição

Garantir que rotas financeiras exijam sessão válida e rotas de login/cadastro redirecionem usuários já autenticados.

## ✅ Critérios de Aceite

### Cenário 1 — Protegida
**Dado** `sessionChecked=true` e `isAuthenticated=false`,  
**Quando** acessa rota sob `ProtectedRoute`,  
**Então** `<Navigate to="/login" state={{ from }} />`.

### Cenário 2 — Guest
**Dado** usuário autenticado,  
**Quando** acessa `/login` ou `/register`,  
**Então** redirect `/transactions`.

### Cenário 3 — Loading
**Dado** `sessionChecked=false`,  
**Então** render `null` (aguarda `AuthBootstrap`).

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Export |
|---------|--------|
| `Codigo/web/src/components/routing/ProtectedRoute.jsx` | `ProtectedRoute`, `GuestRoute` |
| `Codigo/web/src/components/routing/AuthBootstrap.jsx` | Wrapper de sessão |
| `Codigo/web/src/config/appRoutes.js` | Paths centralizados do app |
| `Codigo/web/src/App.jsx` | Árvore de rotas pública vs `MainLayout` protegido |

### Prefixos guest em `api.js` (NOVO — CRIAR)

`GUEST_PATH_PREFIXES` — evitar redirect agressivo em telas auth durante refresh falho

## 📋 Resumo

### ✅ Concluído
- Spec de guards e árvore de rotas definida

### ⏳ Pendente
- Implementar ProtectedRoute e GuestRoute
- Integrar AuthBootstrap no App.jsx
- Configurar GUEST_PATH_PREFIXES no interceptor

---
---
card_id: PULSO-TASK-012
title: "QA — testes unitários de autenticação"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-005
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de autenticação

> **Contexto:** Cobertura de testes para fluxos críticos de auth (RNF-015).

## 📝 Descrição

Garantir regressão segura nos services, controllers, middlewares e camada web de autenticação.

## ✅ Critérios de Aceite

**Quando** `npm test` na API,  
**Então** suites auth passam incluindo register, login, refresh replay, OAuth, reset senha.

**Quando** `npm test` no Web,  
**Então** schemas e authService/authSlice validados.

## 🛠️ Implementação

### API — criar em `Codigo/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/authService.test.js` | register, login, refresh, OAuth, reset |
| `unit/controllers/authController.test.js` | Controller + cookies |
| `unit/middlewares/authMiddleware.test.js` | JWT middleware |
| `unit/middlewares/authRateLimit.test.js` | Rate limit config |
| `unit/utils/googleOAuth.test.js` | OAuth client |
| `helpers/authMocks.js` | Mocks compartilhados |

### Web — criar em `Codigo/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/authService.test.js` | Chamadas API auth |
| `unit/schemas/authSchemas.test.js` | Validação Zod front |
| `unit/store/authSlice.test.js` | Redux auth |

### Script manual (NOVO — CRIAR)

`Codigo/api/scripts/validate-auth-flow.js` — smoke de fluxo auth

## 📋 Resumo

### ✅ Concluído
- Escopo de testes mapeado por camada

### ⏳ Pendente
- Escrever testes unitários API (service, controller, middlewares)
- Escrever testes unitários Web (schemas, service, slice)
- Opcional: suite E2E Playwright dedicada auth

---

---

---
card_id: PULSO-FEAT-107
title: "Auth Flutter (mesma API Node)"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-001
due_date: null
categories:
  - Mobile
  - Backend
  - Frontend
  - Cibersegurança
  - Integração Externa
  - Regra de Negócio
---

# [FEATURE] Auth Flutter (mesma API Node)

> **Contexto:** O app nativo em `Codigo/Pulso/mobile` ainda é placeholder. A API Node em `Codigo/Pulso/api` já cobre RF-001–006 (cadastro, Google web, login JWT, refresh, logout, recuperação). O Flutter deve **reutilizar essa API** — sem segundo backend. Apostila 3.4: cookie `httpOnly` na Web; **secure storage** no mobile. RF-140: o Flutter consome o mesmo REST.

**Refs:** RF-001–006 · RF-140 · RN-131–143  
**Spec:** `Hyperion/.github/plans/specs/PULSO-107-auth-flutter/`  
**Protótipo:** `PULSO-FEAT-086` (telas auth Done)

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **cadastrar, entrar, recuperar senha e autenticar com Google na mesma API Node da Web**, para que **a regra de negócio não seja duplicada e a sessão no telefone use secure storage**.

Hoje `respondWithAuthSession` só seta cookies e o JSON de login é `{ user }` — o app nativo não consegue persistir JWT. `authCookies.js` **já lê** `Authorization: Bearer` e `body.refreshToken`. O gap é devolver os tokens no JSON para o cliente mobile, inicializar o Flutter e tratar Google nativo (Passport hoje redireciona para `FRONTEND_URL/auth/callback`).

## ✅ Critérios de Aceite

### Cenário 1 — Login e-mail/senha no Flutter
**Dado** conta EMAIL verificada,  
**Quando** o app envia `POST /api/auth/login` com header `X-Pulso-Client: mobile`,  
**Então** o JSON inclui `accessToken`, `refreshToken` e `user`; o app persiste os tokens em secure storage e as próximas requests usam `Authorization: Bearer`.

### Cenário 2 — Refresh rotativo
**Dado** `refreshToken` válido no device,  
**Quando** o interceptor chama `POST /api/auth/refresh` com `{ refreshToken }`,  
**Então** a API devolve novo par no JSON; o app substitui os dois tokens; `GET /api/auth/me` com o novo Bearer retorna `200`.

### Cenário 3 — Replay de refresh
**Quando** um refresh já revogado é reenviado,  
**Então** `401` e o app limpa o storage e volta ao login.

### Cenário 4 — Cadastro, verificação e reset
**Então** `POST /api/auth/register`, `GET /api/auth/verify-email/:token`, `POST /api/auth/forgot-password` e `POST /api/auth/reset-password/:token` usam o **mesmo contrato da Web**; links de e-mail continuam em `FRONTEND_URL` (deep link ou abrir Web).

### Cenário 5 — Google nativo
**Dado** ID token do SDK `google_sign_in`,  
**Quando** `POST /api/auth/google/mobile` com `{ idToken }`,  
**Então** a API valida no Google, localiza/cria o usuário (mesmo seed de categorias) e devolve sessão no JSON **sem** redirect para a SPA.

### Cenário 6 — Web inalterada
**Quando** o SPA chama login/refresh **sem** `X-Pulso-Client: mobile`,  
**Então** o JSON **não** precisa expor os tokens; cookies `httpOnly` continuam bastando.

## 🔗 Sub-issues

- PULSO-TASK-160
- PULSO-TASK-161
- PULSO-TASK-162

## 📋 Resumo

### ✅ Concluído
- Spec BDD e critérios alinhados à API existente (`authCookies` já aceita Bearer)
- Decisão: **não** criar segundo backend; só JSON de sessão + Flutter + Google nativo

### ⏳ Pendente
- PULSO-TASK-160 — JSON `accessToken`/`refreshToken` para cliente nativo
- PULSO-TASK-161 — init Flutter + cadastro/login/logout/`/me`/refresh
- PULSO-TASK-162 — Google nativo + deep links verify/reset


---

---
card_id: PULSO-TASK-160
title: "API — JSON de sessão para cliente nativo"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-107
due_date: null
categories:
  - Backend
  - Cibersegurança
  - Mobile
---

# [TASK] API — JSON de sessão para cliente nativo

> **Contexto:** O Flutter não consegue persistir JWT porque login/refresh só setam cookies e o JSON omite os tokens. A leitura Bearer/`body.refreshToken` **já existe**.

## 📝 Descrição

Estender `respondWithAuthSession` e `refresh` para devolver `accessToken` e `refreshToken` no JSON quando o cliente se identifica como mobile. Cookies continuam sendo setados (compat Web / testes).

## ✅ Critérios de Aceite

**Dado** header `X-Pulso-Client: mobile`,  
**Quando** `POST /api/auth/login` ou `POST /api/auth/oauth/exchange` sucedem,  
**Então** o JSON inclui `accessToken`, `refreshToken` e `user` (além dos cookies).

**Dado** o mesmo header (ou body com `refreshToken` de app),  
**Quando** `POST /api/auth/refresh` sucede,  
**Então** o JSON inclui o novo par — não só `{ ok: true }`.

**Dado** request **sem** o header (SPA),  
**Quando** login/refresh,  
**Então** o contrato atual se mantém (`{ user }` / `{ ok: true }` + cookies).

**Dado** testes unitários,  
**Então** cobrir os dois clientes (mobile vs web) sem regressão de cookie.

## 🛠️ Implementação

### `authController.js` (EXISTENTE — MODIFICAR)

Modificar em: `Codigo/Pulso/api/src/controllers/authController.js`

- Helper `isMobileClient(req)` → `req.headers['x-pulso-client'] === 'mobile'`
- `respondWithAuthSession(res, result, statusCode, { includeTokens })` — se `includeTokens`, acrescentar `accessToken` e `refreshToken` no JSON
- `login` / `exchangeOAuth`: passar `includeTokens` quando mobile
- `refresh`: se mobile, `res.json({ ok: true, accessToken, refreshToken })` em vez de só `{ ok: true }`

### Testes (EXISTENTE — MODIFICAR / NOVO — CRIAR)

- Extender testes do controller/service de auth em `Codigo/Pulso/api/tests/`
- Garantir que o SPA sem o header **não** recebe tokens no body

## 📐 Regras de Negócio

- Access 15 min + refresh rotativo single-use (RN-138 / RN-139) — sem mudar TTL
- Tokens no JSON **somente** para cliente nativo identificado; Web permanece cookie `httpOnly`

## 📋 Resumo

### ✅ Concluído
- Gap mapeado: `respondWithAuthSession` omite tokens; `authCookies.js` já lê Bearer

### ⏳ Pendente
- Flag `X-Pulso-Client: mobile` em login, oauth/exchange e refresh
- Testes dos dois contratos JSON


---

---
card_id: PULSO-TASK-161
title: "Flutter — init, e-mail/senha e sessão Bearer"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-107
due_date: null
categories:
  - Mobile
  - Frontend
  - Cibersegurança
  - UX / UI
---

# [TASK] Flutter — init, e-mail/senha e sessão Bearer

> **Contexto:** `Codigo/Pulso/mobile` é README placeholder (sem `pubspec`). RF-140: o app consome a **mesma** API REST. Telas de referência: protótipo `PULSO-FEAT-086`.

## 📝 Descrição

Criar o projeto Flutter, cliente HTTP com Dio, persistência segura dos JWT e telas de cadastro/login/logout alinhadas às rotas `/api/auth/*` já existentes.

## ✅ Critérios de Aceite

**Dado** o app iniciado,  
**Quando** há tokens válidos no secure storage,  
**Então** chama `GET /api/auth/me` com Bearer e entra na área autenticada.

**Dado** cadastro válido,  
**Quando** `POST /api/auth/register`,  
**Então** mostra o fluxo de e-mail enviado; login só após verificação (`verificado=true`).

**Dado** login com e-mail/senha,  
**Quando** `POST /api/auth/login` com `X-Pulso-Client: mobile`,  
**Então** persiste `accessToken` e `refreshToken` em `flutter_secure_storage` (nunca SharedPreferences em texto).

**Dado** access expirado,  
**Quando** o interceptor recebe `401`,  
**Então** tenta `POST /api/auth/refresh` com `{ refreshToken }`, grava o novo par e repete a request.

**Dado** logout,  
**Quando** `POST /api/auth/logout` com `{ refreshToken }`,  
**Então** revoga no servidor e apaga o storage local.

**Dado** forgot/reset,  
**Então** usa `POST /api/auth/forgot-password` e, se o token chegar no app, `POST /api/auth/reset-password/:token` (deep link fica na TASK-162).

## 🛠️ Implementação

### `Codigo/Pulso/mobile/` (NOVO — CRIAR)

- `flutter create` no placeholder; stack: Dio, `flutter_secure_storage`, go_router (ou Navigator 2)
- Base URL apontando para a API Node (`Codigo/Pulso/api`)

### Cliente HTTP (NOVO — CRIAR)

Criar em: `Codigo/Pulso/mobile/lib/core/api/`

- Interceptor: `Authorization: Bearer` + `X-Pulso-Client: mobile`
- Refresh único (fila) para evitar replay paralelo do refresh token
- 401 após refresh falho → limpa storage e rota de login

### Auth feature (NOVO — CRIAR)

Criar em: `Codigo/Pulso/mobile/lib/features/auth/`

- `token_storage.dart` — secure storage
- `auth_repository.dart` — register, login, refresh, logout, me, forgot, reset, resend
- Telas alinhadas ao protótipo: cadastro, e-mail enviado, login, forgot, reset (claro/escuro se o tema do app já existir)

## 📐 Regras de Negócio

- Mesmas validações da Web (nome ≥3, senha forte, anti-enumeração no forgot)
- JWT no device só em storage seguro (apostila 3.4)

## 📋 Resumo

### ✅ Concluído
- Contrato REST mapeado; mobile ainda sem código

### ⏳ Pendente
- Scaffold Flutter + Dio + secure storage
- Telas e-mail/senha + interceptor de refresh


---

---
card_id: PULSO-TASK-162
title: "Flutter — Google nativo e deep links de e-mail"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-107
due_date: null
categories:
  - Mobile
  - Backend
  - Integração Externa
  - Cibersegurança
---

# [TASK] Flutter — Google nativo e deep links de e-mail

> **Contexto:** O Google da Web usa Passport (`GET /api/auth/google` → redirect `FRONTEND_URL/auth/callback?exchange=`). Isso não serve no app. E-mails de verify/reset apontam para `FRONTEND_URL/verify-email/` e `/reset-password/`.

## 📝 Descrição

Expor `POST /api/auth/google/mobile` que valida o ID token do SDK nativo (mesmo `findOrCreateGoogleUser` / seed de categorias da Web) e emitir sessão JSON. No Flutter, `google_sign_in` + deep links para os tokens de e-mail.

## ✅ Critérios de Aceite

**Dado** ID token válido do `google_sign_in`,  
**Quando** `POST /api/auth/google/mobile` com `{ idToken }`,  
**Então** a API valida audiência (client IDs Web/Android/iOS), localiza ou cria o usuário e devolve `accessToken`/`refreshToken`/`user` no JSON.

**Dado** ID token inválido ou audiência errada,  
**Então** `401`/`400` sem criar sessão.

**Quando** o fluxo nativo sucede,  
**Então** **não** redireciona para `FRONTEND_URL/auth/callback`.

**Dado** e-mail de verificação ou reset,  
**Quando** o usuário abre o link no celular com o app instalado,  
**Então** o deep link entrega o token à tela Flutter **ou** o fluxo Web existente continua funcionando se o app não estiver instalado.

**Dado** rate limit,  
**Então** `POST /api/auth/google/mobile` tem instância própria (5 req/min/IP), como as outras rotas auth.

## 🛠️ Implementação

### API — Google mobile (NOVO — CRIAR / EXISTENTE — MODIFICAR)

- Schema Zod `{ idToken }` em `Codigo/Pulso/api/src/schemas/authSchemas.js`
- `authService.verifyGoogleIdToken(idToken)` via `google-auth-library` (`OAuth2Client.verifyIdToken`) já usada em `Codigo/Pulso/api/src/utils/googleOAuth.js`
- Reusar `findOrCreate` Google + `issueAuthTokens` do `authService.js` (EXISTENTE)
- Rota `POST /google/mobile` em `Codigo/Pulso/api/src/routes/authRoutes.js`
- Novo limiter em `Codigo/Pulso/api/src/middlewares/authRateLimit.js`
- Env: audiências extras se Android/iOS tiverem OAuth client IDs distintos (`GOOGLE_ANDROID_CLIENT_ID` / `GOOGLE_IOS_CLIENT_ID`) — não inventar valores; documentar no `.env.example`

### Flutter (NOVO — CRIAR)

- Pacote `google_sign_in` + POST do ID token
- Deep links (`app_links` / associated domains) para `/verify-email/:token` e `/reset-password/:token` **ou** abrir a Web se o app não tratar o host

### Testes (NOVO — CRIAR)

- Unit: ID token inválido; usuário existente por `googleId`; e-mail já EMAIL (mesmo comportamento da Web)

## 📐 Regras de Negócio

- Mesmo seed de categorias e `ConfiguracaoUsuario` do cadastro Google web (RF-002)
- Conta Google nasce verificada
- E-mails continuam anti-enumeração; links não quebram a SPA

## 📋 Resumo

### ✅ Concluído
- Fluxo Passport da SPA mapeado; endpoint nativo ainda não existe

### ⏳ Pendente
- `POST /api/auth/google/mobile` + validação de ID token
- SDK Flutter + deep links verify/reset


