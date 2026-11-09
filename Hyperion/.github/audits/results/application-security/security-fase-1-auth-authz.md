# Auditoria de segurança — Fase 1: autenticação e autorização

**Produto:** Pulso  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Overlay:** nenhum (`audits.overlay: null`)  
**Escopo:** `Codigo/Pulso/api`, `Codigo/Pulso/web`, `Codigo/Pulso/mobile`  
**Método:** revisão estática de código e configuração. Sem exploração ativa, sem PoC ofensivo, sem valores secretos neste relatório.

---

## 1. Resumo executivo

A autenticação está **acima da média de um MVP acadêmico**: cookies `httpOnly` na web, Bearer no Flutter com `flutter_secure_storage`, rotação de refresh com revogação em reuso, hashing bcrypt (12 rounds), política de senha forte, state OAuth assinado e allowlist de origem. **Não há IDOR confirmado** em transações, metas ou viagens — os repositórios filtram por `usuarioId`.

Os riscos desta fase concentram-se em **confiança no cliente** e em **controles que não sobrevivem ao deploy serverless**:

1. o cabeçalho `X-Pulso-Client: mobile` é o único gate para devolver access/refresh no JSON;
2. qualquer usuário autenticado pode promover-se a PREMIUM (`PATCH /auth/me/plano`);
3. o token de troca OAuth viaja na query string e pode ser reutilizado até expirar (~60s);
4. o rate limit de auth usa MemoryStore e perde eficácia na Vercel.

Urgência: corrigir os quatro itens **Alta** antes de exposição pública da API.

---

## 2. Escopo e contexto detectado

### Ativos e atores

| Ator | Trust boundary |
|------|----------------|
| Usuário web (React + cookies) | Navegador → origem do frontend → API |
| Usuário mobile (Flutter) | App → `Authorization: Bearer` + `X-Pulso-Client: mobile` |
| Google (OAuth web redirect + ID token nativo) | Provedor de identidade |
| Cron Vercel | `Authorization: Bearer` com `CRON_SECRET` |
| Anônimo | `/api/health`, `/api/auth/*` públicos com rate limit parcial |

**Dados sensíveis:** credenciais, tokens de sessão, email, nome, dados financeiros (transações, metas, viagens).

**Stack auth:** Express 5, `jsonwebtoken` (HS256 implícito), cookies `pulso_access` / `pulso_refresh`, Passport Google OAuth 2.0, `google-auth-library` para ID token, Prisma `TokenRenovacao`.

### Superfície HTTP de autenticação

Rotas em `Codigo/Pulso/api/src/routes/authRoutes.js`. Middleware JWT em `authMiddleware.js`. Dualidade cookie/Bearer em `authCookies.js`.

### Itens N/A nesta fase

- MFA / WebAuthn (não implementados).
- CSRF token explícito (avaliado como risco residual; ver SEC-1-08).
- Socket.IO / grupos / calendário / importação (rotas comentadas em `routes/index.js`).
- Swagger (`/api/docs` citado em `server.js:98`, não montado em `app.js`).

### Limitações

Análise somente de código. Não houve teste de login real nem fuzzing. Overlay de domínio ausente.

---

## 3. Achados priorizados

### SEC-1-01 — Cabeçalho `X-Pulso-Client` promove sessão cookie a tokens no JSON

- **Severidade:** Alta  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/controllers/authController.js:10`, `Codigo/Pulso/api/src/controllers/authController.js:27`, `Codigo/Pulso/api/src/controllers/authController.js:94`, `Codigo/Pulso/api/src/controllers/authController.js:115`, `Codigo/Pulso/api/src/utils/authCookies.js:44`  
- **Cenário:** A web autentica com cookies `httpOnly` (`withCredentials: true` em `Codigo/Pulso/web/src/services/api.js:9`). Qualquer cliente (navegador com XSS, extensão, `curl`) que envie `X-Pulso-Client: mobile` em login, refresh ou exchange OAuth recebe `accessToken` e `refreshToken` no corpo. O middleware aceita o access tanto do cookie quanto de `Authorization: Bearer` (`authCookies.js:44-51`). Não há atestação do app (chave de app, mTLS, App Attest).  
- **Impacto:** XSS ou CSRF+CORS mal configurado na origem web transforma a sessão httpOnly em tokens copiáveis; o modelo “web = cookie, mobile = Bearer” fica sob controle do atacante.  
- **Recomendação:** Tratar o header só como *hint*. Não devolver tokens no JSON a partir de uma sessão estabelecida por cookie. Separar rotas (`/auth/login` web vs `/auth/mobile/login`) ou exigir que o Bearer de refresh no body seja o *único* canal mobile, recusando cookie+JSON na mesma resposta. Considerar audience distinta no JWT (`aud: mobile`).  
- **Validação:** Login web sem o header não deve incluir tokens no JSON; com cookie válido, `POST /auth/refresh` com o header não deve ecoar tokens.

### SEC-1-02 — Auto-upgrade para PREMIUM sem billing (`PATCH /auth/me/plano`)

- **Severidade:** Alta  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/routes/authRoutes.js:78`, `Codigo/Pulso/api/src/controllers/authController.js:148`, `Codigo/Pulso/api/src/services/authService.js:540`, `Codigo/Pulso/api/src/middlewares/requirePremium.js:7`  
- **Cenário:** Usuário autenticado envia `{ "plano": "PREMIUM" }`. O serviço faz upsert em `configuracaoUsuario.plano`. Viagens exigem PREMIUM (`viagemRoutes.js:22-23`), mas o gate é contornado pelo próprio PATCH. Comentário no código: “TI5 demo — alterna FREE/PREMIUM sem billing”.  
- **Impacto:** Bypass de BFLA / monetização; qualquer conta FREE acessa `/api/viagens` e integrações Duffel/GeoNames/Wikipedia associadas.  
- **Recomendação:** Remover o endpoint público ou restringi-lo a role admin / secret de demo. Em produção, plano só muda via webhook de pagamento verificado.  
- **Validação:** Com usuário FREE, `PATCH /api/auth/me/plano` deve retornar 403; `GET /api/viagens` permanece 403.

### SEC-1-03 — Token de exchange OAuth na query string e reutilizável

- **Severidade:** Alta  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/services/authService.js:29`, `Codigo/Pulso/api/src/services/authService.js:459`, `Codigo/Pulso/api/src/services/authService.js:470`, `Codigo/Pulso/api/src/utils/googleReturnTo.js:54`, `Codigo/Pulso/web/src/pages/AuthCallback.jsx:20`  
- **Cenário:** Após o callback Google, a API redireciona para `{FRONTEND_URL}/auth/callback?exchange=<JWT>`. O JWT (`type: oauth_exchange`, TTL 60s) é verificado com o mesmo `JWT_SECRET` do access token e **não é de uso único** (sem `jti` nem denylist). Leak via Referer, histórico, logs de CDN/proxy ou extensão. Para origens alternativas o redirect usa hash (`/#/auth/callback?…`), o que é melhor, mas o caminho padrão do frontend (mesmo origin de `FRONTEND_URL`) usa query.  
- **Impacto:** Quem interceptar o `exchange` em até ~60s obtém sessão completa (`issueAuthTokens`).  
- **Recomendação:** Código de um uso (opaque, hash no banco, TTL curto) ou fragmento de URL (`#exchange=`) no caminho web também. Invalidar o JWT após o primeiro `POST /oauth/exchange`. Não reutilizar `JWT_SECRET` de access tokens para este propósito.  
- **Validação:** Segundo `POST /auth/oauth/exchange` com o mesmo código deve falhar; o redirect web não deve colocar o segredo na query.

### SEC-1-04 — Rate limit de autenticação ineficaz em serverless

- **Severidade:** Alta  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/middlewares/authRateLimit.js:8`, `Codigo/Pulso/api/src/app.js:13`, `Codigo/Pulso/api/src/routes/authRoutes.js:41`  
- **Cenário:** `express-rate-limit` com store padrão em memória, 5 req/min/IP **por rota**. Em Vercel cada isolate tem memória própria; `trust proxy` está correto, mas o contador não é compartilhado. Rotas Google GET `/auth/google` e `/auth/google/callback` **não** têm limiter. `PATCH /auth/me/plano` também não.  
- **Impacto:** Credential stuffing / brute force e abuso de OAuth redirect em produção.  
- **Recomendação:** Store distribuído (Upstash Redis, Vercel KV) ou WAF. Limitar também `/google` e `/google/mobile`. Após N falhas, backoff por email (sem enumerar).  
- **Validação:** Em duas instâncias, 5+5 tentativas de login no mesmo IP devem ser bloqueadas globalmente.

### SEC-1-05 — ID token Google sem `email_verified`

- **Severidade:** Média  
- **Confiança:** Média  
- **Evidência:** `Codigo/Pulso/api/src/utils/googleOAuth.js:10`, `Codigo/Pulso/api/src/services/authService.js:513`, `Codigo/Pulso/api/src/services/authService.js:403`  
- **Cenário:** `verifyIdToken` valida audiência (web/Android/iOS). `loginWithGoogleIdToken` e `authenticateGoogle` exigem email, mas **não** `payload.email_verified === true`. Conta Google com email não verificado (casos residuais do provedor) pode vincular-se ao endereço.  
- **Impacto:** Account takeover se o email ainda não estiver confirmado no Google e coincidir com uma conta Pulso futura; risco menor, mas clássico em OAuth.  
- **Recomendação:** Rejeitar payload sem `email_verified`. Não vincular por email a conta `EMAIL` existente sem fluxo explícito (já há 409 para esse caso — manter).  
- **Validação:** Fixture de ID token com `email_verified: false` → 401.

### SEC-1-06 — Refresh tokens em texto claro no banco

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/repositories/authRepository.js:11`, `Codigo/Pulso/api/src/services/authService.js:191`, `Codigo/Pulso/api/prisma/schema.prisma:291`  
- **Cenário:** `createRefreshTokenValue()` gera 48 bytes hex e persiste em `tokens_renovacao.token` com `@@unique`. Dump de DB ou backup = sessões hijackable. Rotação e detecção de reuso (`refreshAccessToken` linhas 273-277) são compensatórios **depois** do furto. `JWT_REFRESH_SECRET` é obrigatório em `env.js:11` mas **não é usado** na assinatura (ver SEC-1-10).  
- **Impacto:** Comprometimento de persistência vira compromisso de sessão (7 ou 30 dias).  
- **Recomendação:** Armazenar apenas hash (SHA-256) do refresh; comparar hash no lookup.  
- **Validação:** Coluna não contém o valor enviado ao cliente.

### SEC-1-07 — Enumeração de contas (cadastro, reenvio, email não verificado)

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/services/authService.js:57`, `Codigo/Pulso/api/src/services/authService.js:144`, `Codigo/Pulso/api/src/services/authService.js:243`  
- **Cenário:** `register` → 409 “email já cadastrado”; `resend-verification` → 404 se email inexistente; login de conta não verificada → 403 distinto de 401. Em contraste, `requestPasswordReset` (linhas 329-336) é genérico — controle compensatório só nesse fluxo.  
- **Impacto:** Mapeamento de emails válidos para phishing/stuffing.  
- **Recomendação:** Mesma mensagem e status em register/resend/forgot; não revelar “não verificado” de forma distinta do 401.  
- **Validação:** Respostas indistinguíveis para email existente vs. inexistente (timing aproximado).

### SEC-1-08 — Cookies `SameSite=None` em produção (CSRF residual)

- **Severidade:** Média  
- **Confiança:** Média  
- **Evidência:** `Codigo/Pulso/api/src/utils/authCookies.js:8`, `Codigo/Pulso/api/src/app.js:29`  
- **Cenário:** Produção/`VERCEL` usa `secure` + `sameSite: 'none'` + `credentials: true`, necessário para SPA em outra origem. CORS é allowlist (`CORS_ORIGIN`). Não há parser `urlencoded` (só `express.json()`), o que reduz CSRF via form clássico. JSON cross-site depende de preflight. Risco sobe se `CORS_ORIGIN` incluir previews Vercel ou `*`.  
- **Impacto:** CSRF de logout/refresh (incômodo) ou, combinado com SEC-1-01, roubo de tokens se a origem maliciosa estiver na allowlist.  
- **Recomendação:** Em mesmo site (`VITE_API_URL=/api`), usar `SameSite=Lax`. Senão, CSRF token em cookie não-httpOnly de dupla submissão ou header custom obrigatório além de CORS. Não incluir `*.vercel.app` aberto.  
- **Validação:** Origem não listada não recebe `Access-Control-Allow-Origin` com credentials; cookies Lax no deploy same-origin.

### SEC-1-09 — Tokens de verificação e reset na URL (GET)

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/routes/authRoutes.js:87`, `Codigo/Pulso/api/src/routes/authRoutes.js:101`, `Codigo/Pulso/api/src/services/authService.js:362`  
- **Cenário:** `GET /auth/verify-email/:token` e `GET /auth/reset-password/:token`. Tokens de 32 bytes hex no path. Leak em logs de servidor, Referer, histórico. `validateResetToken` devolve o **email em claro** (linha 371).  
- **Impacto:** Quem vir o link de reset valida a conta e o email; o token GET de reset não consome o segredo até o POST, janela de replay.  
- **Recomendação:** Página frontend com token no fragmento; API só via POST. Não devolver email no GET de validação.  
- **Validação:** GET de validação não inclui PII; token some da query do servidor de email links.

### SEC-1-10 — `JWT_REFRESH_SECRET` obrigatório e não utilizado

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/config/env.js:11`, `Codigo/Pulso/api/src/config/env.js:40`, `Codigo/Pulso/api/src/utils/tokenUtils.js:9`  
- **Cenário:** Access, state OAuth e exchange usam só `JWT_SECRET`. O refresh é opaco (não JWT). Segredo extra aumenta superfície operacional sem benefício.  
- **Impacto:** Confusão operacional; um único `JWT_SECRET` comprometido afeta access + OAuth state + exchange.  
- **Recomendação:** Assinar access com `JWT_SECRET`, codes OAuth com segredo distinto, ou documentar e remover a variável morta.  
- **Validação:** Grep sem usos além de `env.js`.

### SEC-1-11 — `jwt.verify` sem `algorithms: ['HS256']`

- **Severidade:** Baixa  
- **Confiança:** Média  
- **Evidência:** `Codigo/Pulso/api/src/middlewares/authMiddleware.js:14`, `Codigo/Pulso/api/src/services/authService.js:477`, `Codigo/Pulso/api/src/utils/googleReturnTo.js:46`  
- **Cenário:** Segredo simétrico (string). Bibliotecas modernas mitigam `alg=none`, mas a allowlist explícita é defesa em profundidade.  
- **Impacto:** Baixo com `jsonwebtoken` 9.x e secret HMAC.  
- **Recomendação:** `{ algorithms: ['HS256'] }` e claims `iss`/`aud`.  
- **Validação:** Token com `alg` diferente é rejeitado.

### SEC-1-12 — Login por nome sem unicidade de `nome`

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/repositories/authRepository.js:35`, `Codigo/Pulso/api/prisma/schema.prisma:205`  
- **Cenário:** Identificador sem `@` usa `findFirst` por `nome` case-insensitive. `nome` não é `@@unique`. Dois usuários “Maria” → login pode autenticar o registro “errado” se a senha bater, ou falhar para um deles.  
- **Impacto:** Confusão de conta; baixo se nomes forem distintos na prática.  
- **Recomendação:** Login apenas por email, ou unicidade de username.  
- **Validação:** Dois usuários com o mesmo nome não autenticam um ao outro.

### SEC-1-13 — Comparação de `CRON_SECRET` sem tempo constante

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/middlewares/cronAuthMiddleware.js:17`  
- **Cenário:** `header !== \`Bearer ${secret}\``. Timing leak teórico em Bearer longo. Jobs só disparam se o secret vazar.  
- **Impacto:** Brute force do secret é irrealista se o valor for 32 bytes hex; hardening.  
- **Recomendação:** `crypto.timingSafeEqual` em buffers de tamanho fixo.  
- **Validação:** Teste unitário com secret correto/incorreto inalterado.

---

## 4. Pontos positivos

- **Cookies httpOnly, path `/api`:** `authCookies.js:10-14`, `22-35`. Web não persiste tokens em `localStorage` (`authService.js` web: `storeAuthTokens` vazio, linha 73).  
- **Rotação de refresh e revogação global em reuso:** `authService.js:266-304`.  
- **Logout revoga token; reset de senha revoga todos:** `authService.js:307`, `396`.  
- **bcrypt 12 + política de senha:** `authService.js:23-26`, `41-47`.  
- **OAuth state JWT + allowlist de origem:** `googleReturnTo.js:12-36`, `39-51`. Passport `session: false` (`passport.js:24`, `authRoutes.js:132`).  
- **Audiências Google mobile:** `googleOAuth.js:7-8`. Flutter envia ID token (`google_auth_client.dart:50`) e guarda tokens no secure storage (`token_storage.dart:1-17`).  
- **IDOR transações/metas/viagens:** `req.user.id` nos controllers; `buscarPorId(..., usuarioId)` em `transactionRepository.js:133`, `metaRepository.js:111`, `viagemRepository.js:29`. Categorias/tags checam dono no service antes do update.  
- **JWT access curto (15m):** `tokenUtils.js:5-17`. Claims sem query ao DB em cada request (`authMiddleware.js:20-25`) — trade-off consciente (revogação de access só por expiração).  
- **Forgot-password anti-enumeração:** `authService.js:329-336`.  
- **Zod nos schemas de auth:** `authSchemas.js` + `validateMiddleware.js`.

---

## 5. Quick wins

1. Remover ou proteger `PATCH /auth/me/plano`.  
2. Não incluir tokens no JSON quando o access veio de cookie.  
3. Exchange OAuth de uso único + fragmento na URL.  
4. `algorithms: ['HS256']` em todos os `jwt.verify`.  
5. Exigir `email_verified` no ID token.  
6. Unificar mensagens de register/resend.

---

## 6. Roadmap e riscos

| Prazo | Itens |
|-------|--------|
| Imediato | SEC-1-01, SEC-1-02, SEC-1-03, SEC-1-04 |
| Curto | SEC-1-05, SEC-1-06, SEC-1-07, SEC-1-08, SEC-1-09 |
| Hardening | SEC-1-10 a SEC-1-13; `aud`/`iss` JWT; store Redis para rate limit |

**Riscos residuais:** access JWT não é revogável em menos de 15 min (aceitável); modelo cookie cross-site exige CORS disciplinado; Flutter depende de `X-Pulso-Client` até haver canal dedicado.

**Pergunta que alteraria classificação:** o `PATCH /auth/me/plano` será desligado antes do go-live público? Se sim, SEC-1-02 cai para residual de demo. Se o deploy for same-origin (web+API), SEC-1-08 cai de severidade.
