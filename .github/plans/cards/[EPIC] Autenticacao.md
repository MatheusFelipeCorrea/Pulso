# [EPIC] Autenticação

> **Status (ago/2026):** ✅ Entregue · revisado auditoria PO M01  
> **Correções PO:** cookies httpOnly, mutex de refresh token, rate limit por rota, cadastro resiliente SMTP, indicador força de senha, job limpeza contas não verificadas  
> **Refs:** RF-001–006, RN-131–143 · [PO M01](../../Documentacao/03-Auditorias/Product%20Owner/01-Autenticacao.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Autenticação, Segurança, Backend, Frontend, Banco de Dados  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Sistema completo de **autenticação e autorização** do Pulso: cadastro email/senha com verificação, login JWT (access + refresh rotativo), sessão em cookies `httpOnly`, recuperação de senha, Google OAuth 2.0, middleware de rotas protegidas e 8 telas auth responsivas (claro/escuro). Base de segurança para todos os módulos financeiros.

### 🎯 Objetivos do Epic

- ✅ Cadastro com hash bcrypt (12 rounds), token de verificação (24h) e seed de categorias padrão
- ✅ Login email/senha ou nome + checkbox "Lembrar-me" (refresh 30 dias)
- ✅ Google OAuth via Passport + troca de sessão `POST /auth/oauth/exchange`
- ✅ Recuperação de senha (token 1h) com invalidação de todos os refresh tokens
- ✅ Sessão JWT: access 15min + refresh rotativo 7d (single-use, revoga sessão em replay)
- ✅ Cookies `pulso_access` / `pulso_refresh` (`httpOnly`, `Secure` prod, `SameSite`)
- ✅ Rate limit 5 req/min **por rota** (9 instâncias independentes)
- ✅ Job diário: remove contas email não verificadas > 30 dias

### 🎭 Telas e Fluxos

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

---

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Categorias | `categoryService.seedCategoriasPadrao` no cadastro (email e Google) |
| Gamificação | Cria `Sequencia` no cadastro email |
| Configurações | `ConfiguracaoUsuario` criada junto ao usuário (tema CLARO default) |
| Google Calendar | `googleTokenCrypto.js` criptografa `tokensGoogle` em `ConfiguracaoUsuario` (AES-256-GCM) |
| Cron | `unverifiedAccountCleanupJob` via `cronController.daily` / `server.js` |
| Rotas protegidas | `authMiddleware` em `/auth/me` e demais módulos da API |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (`Usuario`, `ConfiguracaoUsuario`, `TokenRenovacao`, `ProvedorAuth`); migration base `20260422195021_init` |
| Backend | ✅ | `authRoutes.js`, `authController.js`, `authService.js`, `authRepository.js`, `authSchemas.js`, `authMiddleware.js`, `authRateLimit.js`, `authCookies.js`, `tokenUtils.js`, `passport.js`, `emailProvider.js` |
| Frontend | ✅ | 8 páginas em `pages/`, `authService.js`, `api.js`, `authSlice.js`, `AuthBootstrap.jsx`, `ProtectedRoute.jsx`, `AuthLayout`, `PasswordStrengthHints.jsx`, `styles/auth.css` |
| Testes API | ✅ | `authService.test.js`, `authController.test.js`, `authMiddleware.test.js`, `authRateLimit.test.js`, `tokenUtils.test.js`, `googleOAuth.test.js`, `unverifiedAccountCleanupJob.test.js` |
| Testes Web | ✅ | `authService.test.js`, `authSchemas.test.js`, `authSlice.test.js` |
| Scripts | ✅ | `api/scripts/validate-auth-flow.js` |

**Registro rotas:** `Codigo/Pulso/api/src/routes/index.js` → `router.use('/auth', authRoutes)`

---

## 🔧 Correções pós-auditoria PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RNF-NOVO-A1 | Sessão em cookies `httpOnly` (RN-135) | `authCookies.js`, `authController.js`, `authMiddleware.js`; front: `api.js` (`withCredentials`), remoção `localStorage` |
| RNF-NOVO-A2 | Mutex deduplica `POST /auth/refresh` | `web/src/services/api.js` — `refreshPromise` |
| RF-NOVO-A3 | Cadastro não deleta conta se SMTP falhar | `authService.registerUser` → `emailPendente: true` |
| Gap #2 | P2002 → 409 no cadastro | `prismaErrors.js`, `authService.registerUser`, `errorMiddleware.js` |
| RNF-NOVO-A3 | Rate limit separado por rota (9 instâncias) | `authRateLimit.js` + `authRoutes.js` |
| RF-NOVO-A3 | Job limpeza contas não verificadas (30 dias) | `unverifiedAccountCleanupJob.js`, `cronController.js` |
| — | Loop F5 em sessão expirada | `api.js`: `/auth/me` não dispara refresh agressivo |
| RF-NOVO-A4 | Indicador força de senha | `PasswordStrengthHints.jsx`, `passwordStrength.js`, `Register.jsx`, `ResetPassword.jsx` |
| RNF-NOVO-A4 | Testes `authController` | `api/tests/unit/controllers/authController.test.js` |
| RN-140 | Bloqueio por conta removido do escopo | Doc alinhada ao rate-limit de IP |

---

## ⏳ Pendências

- [ ] **Encerrar todas as sessões** — depende epic Perfil (M10); backend `revokeAllRefreshTokensForUser` já existe
- [ ] **Rate-limit Redis/Upstash** (T5) — adiado; best effort in-memory por instância serverless
- [ ] **Login por nome ambíguo** — `Usuario.nome` não é `@unique`; `findByEmailOrNome` pode retornar conta errada
- [ ] **RN-131 vs regex real** — regra doc não menciona caractere especial exigido pelo regex
- [ ] **RNF-NOVO-A5** — logs de tentativas de login falhas / rate-limit (observabilidade)
- [ ] **RNF-NOVO-A6** — validar `GOOGLE_TOKENS_ENCRYPTION_KEY` no startup (hoje só em uso)
- [ ] **Logout parcial** — revoga só refresh token atual, não todas as sessões do usuário

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Usuário cadastra com email/senha forte e recebe email de verificação (ou `emailPendente` se SMTP falhar)  
→ Usuário só loga após `verificado = true`  
→ Login emite cookies httpOnly; refresh rotativo com proteção anti-replay  
→ Usuário recupera senha via link 1h; troca invalida todas as sessões  
→ Usuário entra com Google; callback redireciona para `/auth/callback?exchange=`  
→ Rotas autenticadas exigem JWT válido via `authMiddleware`  
→ Rate limit 5/min por rota sensível sem bloqueio cruzado entre rotas  
→ Contas email não verificadas > 30 dias removidas pelo cron diário  

---

# [STORY DATABASE] Autenticação — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Autenticação

---

## 📝 Descrição

**Como sistema**, quero persistir usuários, configurações iniciais, tokens de renovação e campos temporários de verificação/reset, para suportar cadastro, sessão JWT e OAuth.

---

## 🗄️ SQL / Migrations

**Migration base:** `Codigo/Pulso/api/prisma/migrations/20260422195021_init/migration.sql`  
*(tabelas iniciais `users`, `refresh_tokens`, `user_settings` — schema atual espelhado em português via `schema.prisma`)*

**Estado atual (Prisma):**

```sql
-- Enums: ProvedorAuth (EMAIL, GOOGLE), Tema, ModoUso, NivelGamificacao

CREATE TABLE "usuarios" (
  "id" TEXT PRIMARY KEY,
  "nome" VARCHAR(120) NOT NULL,
  "email" VARCHAR(180) NOT NULL UNIQUE,
  "senha_hash" TEXT,
  "url_avatar" TEXT,
  "provedor_auth" "ProvedorAuth" NOT NULL DEFAULT 'EMAIL',
  "google_id" TEXT UNIQUE,
  "verificado" BOOLEAN NOT NULL DEFAULT false,
  "token_verificacao_email" VARCHAR(64),
  "token_verificacao_expira" TIMESTAMP(3),
  "token_reset_senha" VARCHAR(64),
  "token_reset_expira" TIMESTAMP(3),
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "configuracoes_usuario" (
  "id" TEXT PRIMARY KEY,
  "usuario_id" TEXT NOT NULL UNIQUE,
  "tema" "Tema" NOT NULL DEFAULT 'CLARO',
  "gamificacao_ativa" BOOLEAN NOT NULL DEFAULT true,
  "tokens_google" JSONB,
  -- demais campos financeiros (salário, VA, VR, VT, etc.)
  CONSTRAINT "configuracoes_usuario_usuario_id_fkey"
    FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
);

CREATE TABLE "tokens_renovacao" (
  "id" TEXT PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expira_em" TIMESTAMP(3) NOT NULL,
  "revogado" BOOLEAN NOT NULL DEFAULT false,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revogado_em" TIMESTAMP(3),
  CONSTRAINT "tokens_renovacao_usuario_id_fkey"
    FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
);

CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");
CREATE INDEX "usuarios_token_verificacao_email_idx" ON "usuarios"("token_verificacao_email");
CREATE INDEX "usuarios_token_reset_senha_idx" ON "usuarios"("token_reset_senha");
CREATE INDEX "tokens_renovacao_usuario_id_idx" ON "tokens_renovacao"("usuario_id");
CREATE INDEX "tokens_renovacao_expira_em_idx" ON "tokens_renovacao"("expira_em");
```

---

## 📊 Modelo Prisma (resumo)

| Model | Campos-chave |
|-------|--------------|
| `Usuario` | `nome`, `email` @unique, `senhaHash?`, `provedorAuth`, `googleId?` @unique, `verificado`, tokens verificação/reset |
| `ConfiguracaoUsuario` | `usuarioId` @unique, `tema`, `gamificacaoAtiva`, `tokensGoogle?` (criptografado) |
| `TokenRenovacao` | `usuarioId`, `token` @unique, `expiraEm`, `revogado`, `revogadoEm?` |

**Enum:** `ProvedorAuth` (EMAIL, GOOGLE)

**Relações auth:** `Usuario` 1:1 `ConfiguracaoUsuario` · `Usuario` 1:N `TokenRenovacao` · `Usuario` 1:1 `Sequencia` (criada no cadastro)

**Repositório:** `Codigo/Pulso/api/src/repositories/authRepository.js`

→ `createUser`, `findByEmail`, `findById`, `findByEmailOrNome`, `findByGoogleId`  
→ `findByVerificationToken`, `findByResetToken`, `updateUser`, `deleteUser`  
→ `createRefreshToken`, `findRefreshToken`, `revokeRefreshToken`, `revokeAllRefreshTokensForUser`  
→ `deleteExpiredRefreshTokens`, `clearExpiredVerificationTokens`, `clearExpiredResetTokens`  
→ `deleteUnverifiedEmailAccountsOlderThan` (job cleanup)

---

## ✅ Critérios de Aceite (Database)

→ Tabela `usuarios` com email único e índices de tokens  
→ Tabela `tokens_renovacao` com token único e cascade delete  
→ Campos `token_verificacao_*` e `token_reset_*` nullable em `usuarios`  
→ `google_id` único opcional para OAuth  
→ `ConfiguracaoUsuario` criada em cascade no cadastro  

---

# [STORY BACKEND] Autenticação — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Autenticação

---

## 📝 Descrição

**Como sistema backend**, quero API REST completa para registro, login, sessão, verificação de email, reset de senha e Google OAuth, com validação Zod, rate limiting e cookies seguros.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Cadastro
**Dado** payload válido `{ nome, email, senha, confirmarSenha }`,  
**Quando** `POST /api/auth/register`,  
**Então** retorna `201` com mensagem de verificação; cria `Usuario` + `ConfiguracaoUsuario` + categorias padrão.  
* Email duplicado → `409` "Este email já está cadastrado" (P2002 mapeado)  
* SMTP falha → conta permanece, `emailPendente: true`

### Cenário 2 — Verificar email
**Dado** token válido não expirado (24h),  
**Quando** `GET /api/auth/verify-email/:token`,  
**Então** `verificado = true`, limpa tokens de verificação.  
* Já verificado → `200` `alreadyVerified: true`  
* Expirado → `400`

### Cenário 3 — Reenviar verificação
**Quando** `POST /api/auth/resend-verification` `{ email }`,  
**Então** gera novo token e envia email.  
* Já verificado → `400` · Email inexistente → `404`

### Cenário 4 — Login
**Dado** usuário verificado com senha hash,  
**Quando** `POST /api/auth/login` `{ email, senha, lembrarMe? }`,  
**Então** `200` + cookies httpOnly + `{ user }`.  
* Não verificado → `403` · Credenciais inválidas → `401` genérico  
* Conta Google-only sem senha → `401` genérico  
* `lembrarMe: true` → refresh expira em 30 dias (`tokenUtils.js`)

### Cenário 5 — Refresh rotativo
**Dado** cookie `pulso_refresh` válido,  
**Quando** `POST /api/auth/refresh`,  
**Então** novo access + novo refresh (rotação single-use).  
* Token revogado reapresentado → revoga **todas** sessões do usuário  
* Expirado → `401`

### Cenário 6 — Logout
**Quando** `POST /api/auth/logout`,  
**Então** revoga refresh apresentado + limpa cookies.

### Cenário 7 — Sessão atual
**Dado** access token válido (cookie ou Bearer),  
**Quando** `GET /api/auth/me`,  
**Então** retorna `{ user }` formatado.

### Cenário 8 — Recuperar senha
**Quando** `POST /api/auth/forgot-password` `{ email }`,  
**Então** sempre `200` genérico (anti-enumeração); envia email se conta EMAIL com senha.  
* Conta Google → mesma resposta, sem envio

### Cenário 9 — Reset senha
**Dado** token reset válido (< 1h),  
**Quando** `POST /api/auth/reset-password/:token` `{ senha, confirmarSenha }`,  
**Então** atualiza hash, limpa token, revoga todos refresh tokens, limpa cookies.

### Cenário 10 — Google OAuth
**Quando** `GET /api/auth/google` → callback Passport,  
**Então** redirect frontend `/auth/callback?exchange=<jwt 60s>`.  
**Quando** `POST /api/auth/oauth/exchange` `{ exchange }`,  
**Então** emite cookies + `{ user }`.  
* Email já cadastrado com senha → `409` no authenticateGoogle  
* Cria conta nova verificada + seed categorias

### Cenário 11 — Rate limit
**Dado** > 5 req/min no mesmo IP **na mesma rota**,  
**Então** `429` "Muitas tentativas. Aguarde um minuto."

---

## 🛠️ Implementação (o que foi feito)

### authRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/authRoutes.js`  
**Base URL:** `/api/auth`

| Method | Path | Rate limit | Handler |
|--------|------|------------|---------|
| POST | `/register` | `authRegisterRateLimit` | `register` |
| POST | `/login` | `authLoginRateLimit` | `login` |
| POST | `/oauth/exchange` | `authOAuthExchangeRateLimit` | `exchangeOAuth` |
| POST | `/refresh` | `authRefreshRateLimit` | `refresh` |
| POST | `/logout` | `authLogoutRateLimit` | `logout` |
| GET | `/me` | — (+ `authMiddleware`) | `me` |
| POST | `/forgot-password` | `authForgotPasswordRateLimit` | `forgotPassword` |
| GET | `/reset-password/:token` | `authResetPasswordRateLimit` | `validateResetToken` |
| POST | `/reset-password/:token` | `authResetPasswordRateLimit` | `resetPassword` |
| GET | `/verify-email/:token` | `authVerifyEmailRateLimit` | `verifyEmail` |
| POST | `/resend-verification` | `authResendVerificationRateLimit` | `resendVerification` |
| GET | `/google` | — | Passport Google |
| GET | `/google/callback` | — | `googleCallback` |

---

### authController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/authController.js`

→ `register` — `201` JSON (sem cookies; verificação pendente)  
→ `login`, `exchangeOAuth` — `respondWithAuthSession` + `setAuthCookies`  
→ `refresh` — rotaciona cookies  
→ `logout` — `clearAuthCookies`  
→ `me` — usuário autenticado  
→ `verifyEmail`, `resendVerification`, `forgotPassword`, `validateResetToken`, `resetPassword`  
→ `googleCallback` — redirect frontend com `exchange` JWT

---

### authService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/authService.js`

**Constantes:** `SALT_ROUNDS = 12` · verificação 24h · reset 1h · OAuth exchange 60s

**Funções exportadas:**

→ `registerUser` — hash, token verificação, seed categorias, SMTP resiliente  
→ `verifyEmail` · `resendVerificationEmail`  
→ `loginUser` — exige `verificado`, bcrypt compare, `issueAuthTokens`  
→ `refreshAccessToken` — rotação + anti-replay  
→ `logoutUser` · `getAuthenticatedUser`  
→ `requestPasswordReset` · `validateResetToken` · `resetPassword`  
→ `authenticateGoogle` · `buildGoogleCallbackRedirect` · `exchangeOAuthSession` · `buildGoogleErrorRedirect`

**Helpers internos:** `validateSenhaForte`, `issueAuthTokens`, `formatUserResponse`, `maskEmail`

---

### authMiddleware.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/middlewares/authMiddleware.js`

→ Lê access de cookie `pulso_access` ou header `Bearer`  
→ `jwt.verify` → popula `req.user` `{ id, email, nome }` (sem query DB)

---

### authCookies.js + tokenUtils.js (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `api/src/utils/authCookies.js` | `setAuthCookies`, `clearAuthCookies`, `getAccessTokenFromRequest`, `getRefreshTokenFromRequest` |
| `api/src/utils/tokenUtils.js` | `signAccessToken` (15m), `createRefreshTokenValue`, `getRefreshTokenExpiry` (7d / 30d lembrar-me) |

---

### authSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/authSchemas.js`

**Schemas Zod:** `registerSchema`, `verifyEmailSchema`, `resendVerificationSchema`, `loginSchema`, `refreshSchema`, `logoutSchema`, `oauthExchangeSchema`, `forgotPasswordSchema`, `resetPasswordTokenSchema`, `resetPasswordSchema`

**Regex senha forte:** min 8, maiúscula, minúscula, número, especial `@$!%*?&#`

---

### authRateLimit.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/middlewares/authRateLimit.js`

9 instâncias `express-rate-limit`: 5 req/min/IP, contadores independentes por rota.

---

### passport.js + googleOAuth.js (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `api/src/config/passport.js` | `GoogleStrategy` lazy via `ensureGoogleStrategy()` |
| `api/src/utils/googleOAuth.js` | `createOAuthClient` (google-auth-library, usado em Calendar) |

**Env OAuth:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`

---

### emailProvider.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/providers/emailProvider.js`

→ `sendVerificationEmail(email, token)`  
→ `sendPasswordResetEmail(email, token)`

---

### Jobs e cron (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `api/src/jobs/unverifiedAccountCleanupJob.js` | Remove contas EMAIL `verificado=false` > 30 dias |
| `api/src/controllers/cronController.js` | `daily` chama cleanup |
| `api/src/routes/cronRoutes.js` | `GET /api/cron/daily` (+ `cronAuthMiddleware`) |
| `api/src/server.js` | Cron local `5 0 * * *` (Vercel usa `/api/cron/*`) |

---

### Utilitários relacionados

| Arquivo | Função |
|---------|--------|
| `api/src/utils/prismaErrors.js` | `isPrismaUniqueViolation`, `mapPrismaUniqueViolation` → 409 |
| `api/src/utils/googleTokenCrypto.js` | AES-256-GCM para `tokensGoogle` (Calendar, não login) |
| `api/tests/helpers/authMocks.js` | Mocks compartilhados nos testes |

---

## 🚫 Regras de Negócio (Backend)

* Senha forte: 8+ chars, maiúscula, minúscula, número, especial (RN-131+)
* bcrypt salt rounds = 12 (RN-132)
* Access JWT 15min (RN-133); refresh 7d rotativo, 30d com lembrar-me (RN-134)
* Cookies httpOnly para tokens (RN-135)
* Reset senha revoga todos refresh tokens (RN-136)
* Login exige email verificado (RN-137)
* Google cria ou vincula conta (RN-138/139)
* Rate limit IP 5/min por rota (RN-140)
* Token reset expira 1h (RN-141)
* Refresh replay → revoga sessão inteira (segurança documentada no service)

---

# [STORY FRONTEND] Autenticação — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Autenticação

---

## 📝 Descrição

**Como usuário**, quero cadastrar, verificar email, logar, recuperar senha e usar Google OAuth em telas responsivas com tema claro/escuro, sessão transparente via cookies e proteção de rotas.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Bootstrap de sessão
**Dado** cookies válidos de sessão anterior,  
**Quando** app carrega (`AuthBootstrap`),  
**Então** `GET /auth/me` popula Redux `auth.user`; rotas protegidas liberadas.

### Cenário 2 — Cadastro
**Dado** formulário válido em `/register`,  
**Quando** submete,  
**Então** redirect `/register/email-sent`; exibe checklist senha (`PasswordRulesChecklist`).

### Cenário 3 — Login
**Quando** credenciais corretas em `/login`,  
**Então** `setUser` no Redux + redirect `DEFAULT_AUTHENTICATED_ROUTE` (`/transactions`).  
* Email não verificado → CTA reenviar verificação inline  
* `?verified=true` → toast sucesso

### Cenário 4 — Google OAuth
**Quando** clica "Entrar com Google",  
**Então** redirect API `/auth/google` → retorno `/auth/callback?exchange=` → `exchangeOAuth` → área logada.

### Cenário 5 — Recuperar senha
**Quando** envia email em `/forgot-password`,  
**Então** redirect `/forgot-password/email-sent`.

### Cenário 6 — Nova senha
**Dado** link válido `/reset-password/:token`,  
**Quando** página carrega,  
**Então** valida token via API; formulário com barra de força; sucesso → `/reset-password/success`.

### Cenário 7 — Verificar email
**Quando** abre `/verify-email/:token`,  
**Então** chama API; exibe sucesso/erro; link para login.

### Cenário 8 — Rotas protegidas
**Dado** usuário não autenticado,  
**Quando** acessa rota protegida,  
**Então** `ProtectedRoute` redirect `/login`.  
**Dado** autenticado em rota guest (`GuestRoute`),  
**Então** redirect `/transactions`.

### Cenário 9 — Refresh transparente
**Dado** access expirado,  
**Quando** request API retorna 401,  
**Então** interceptor deduplica refresh e retenta; falha → redirect login (exceto rotas guest).

---

## 🛠️ Implementação (o que foi feito)

### authService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/authService.js`

→ `register` · `login` · `forgotPassword` · `validateResetToken` · `resetPassword`  
→ `refresh` · `logout` · `getMe` · `verifyEmail` · `resendVerification`  
→ `exchangeOAuth` · `loginWithGoogle` (redirect window)  
→ `storeAuthTokens` / `clearAuthTokens` — **deprecated** (cookies httpOnly)

---

### api.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/api.js`

→ `withCredentials: true`  
→ `refreshPromise` mutex para `POST /auth/refresh`  
→ Interceptor 401: retenta após refresh; `/auth/me` não entra em loop  
→ `GUEST_PATH_PREFIXES` evita redirect agressivo em telas auth

---

### Redux authSlice + AuthBootstrap (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/store/slices/authSlice.js` | `user`, `isAuthenticated`, `sessionChecked`; actions `setUser`, `clearUser` |
| `web/src/components/routing/AuthBootstrap.jsx` | Restaura sessão via `getMe` no mount |
| `web/src/components/routing/ProtectedRoute.jsx` | `ProtectedRoute` + `GuestRoute` |

---

### Páginas (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/pages/`

| Página | Rota | Destaques |
|--------|------|-----------|
| `Register.jsx` | `/register` | react-hook-form + Zod; Google; `PasswordStrengthBar` + checklist |
| `RegisterEmailSent.jsx` | `/register/email-sent` | Reenviar verificação |
| `VerifyEmail.jsx` | `/verify-email/:token` | Estados loading/sucesso/erro |
| `Login.jsx` | `/login` | Lembrar-me; reenviar verificação; Google inline SVG |
| `AuthCallback.jsx` | `/auth/callback` | Parse `exchange` / `error`; `exchangeOAuth` |
| `ForgotPassword.jsx` | `/forgot-password` | Form email |
| `ForgotPasswordEmailSent.jsx` | `/forgot-password/email-sent` | Feedback |
| `ResetPassword.jsx` | `/reset-password/:token` | Valida token; força senha |
| `ResetPasswordSuccess.jsx` | `/reset-password/success` | CTA login |

**Rotas registradas em:** `Codigo/Pulso/web/src/App.jsx`

---

### Componentes e layout (EXISTENTE — IMPLEMENTADO)

**Layout:** `Codigo/Pulso/web/src/components/layouts/AuthLayout/AuthLayout.jsx`

**Features auth:** `Codigo/Pulso/web/src/components/features/auth/`

| Componente | Responsabilidade |
|------------|------------------|
| `AuthHero.jsx` | Coluna ilustrativa (split layout) |
| `AuthHeroEmailIllustration.jsx` | Ilustração email enviado |
| `AuthHeroRecoverIllustration.jsx` | Recuperar senha |
| `AuthHeroResetIllustration.jsx` | Nova senha |
| `AuthHeroPasswordSentIllustration.jsx` | Reset enviado |
| `AuthHeroPasswordSuccessIllustration.jsx` | Senha alterada |
| `AuthHeroIllustration.jsx` | Ilustração genérica login/cadastro |
| `PulsoBrand.jsx` | Logo/marca |
| `AuthInfoAlert.jsx` | Alertas informativos |

**Senha forte:** `Codigo/Pulso/web/src/components/auth/PasswordStrengthHints.jsx`  
**Utils:** `Codigo/Pulso/web/src/utils/passwordStrength.js` — `PASSWORD_RULES`, `getPasswordStrength`

**Estilos:** `Codigo/Pulso/web/src/styles/auth.css`  
**Ilustrações estáticas:** `Codigo/Pulso/web/public/illustrations/auth/*.png`

---

### Schemas frontend (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/schemas/authSchemas.js`

→ `registerSchema` (+ `aceitarTermos`) · `loginSchema` · `forgotPasswordSchema` · `resetPasswordSchema`

**Testes:** `Codigo/Pulso/web/tests/unit/schemas/authSchemas.test.js`

---

### Configuração (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/config/defaultAuthenticatedRoute.js` | `DEFAULT_AUTHENTICATED_ROUTE = '/transactions'` |
| `web/src/utils/apiBaseUrl.js` | Base URL API (OAuth redirect) |

---

### Endpoints consumidos

* `POST /api/auth/register` · `GET /api/auth/verify-email/:token` · `POST /api/auth/resend-verification`
* `POST /api/auth/login` · `POST /api/auth/refresh` · `POST /api/auth/logout` · `GET /api/auth/me`
* `POST /api/auth/forgot-password` · `GET/POST /api/auth/reset-password/:token`
* `GET /api/auth/google` (redirect) · `POST /api/auth/oauth/exchange`

---

## 📚 Documentação

- [PO M01 — Autenticação](../../Documentacao/03-Auditorias/Product%20Owner/01-Autenticacao.md)
- [Requisitos RF-001–006](../../Documentacao/01-Produto/Requisitos/Readme.md)
- [Regras RN-131–143](../../Documentacao/01-Produto/Regras-de-Negocio/RegrasDeNegocio.md)
- [API Readme](../../Documentacao/02-Engenharia/API/Readme.md)
- [Web Readme](../../Documentacao/02-Engenharia/Web/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| abr/2026 | Migration init + modelos usuário/sessão |
| mai–jun/2026 | Backend auth completo + Google OAuth |
| jun/2026 | Correções PO: cookies httpOnly, mutex refresh, SMTP resiliente, rate limit por rota |
| jul/2026 | Frontend 8 telas auth + AuthLayout |
| ago/2026 | Auditoria PO M01 + força de senha, job cleanup, testes controller |
