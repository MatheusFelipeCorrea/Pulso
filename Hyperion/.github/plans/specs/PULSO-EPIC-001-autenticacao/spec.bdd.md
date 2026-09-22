# Spec BDD — Autenticação

## Feature: cadastro e verificação

Contrato: `Codigo/Pulso/api/src/routes/authRoutes.js`. Rate limits independentes por rota.

### Scenario 1: Cadastro válido
Given nome ≥ 3, e-mail único, senha forte (`@$!%*?&#`) e termos aceitos
When `POST /api/auth/register`
Then `201`; conta `verificado=false`; seed de categorias; `ConfiguracaoUsuario` FREE
And e-mail de verificação aponta para `FRONTEND_URL/verify-email/:token` (CTA secundário `pulso://`)

### Scenario 2: E-mail duplicado
When o e-mail já existe
Then `409` "Este email já está cadastrado."

### Scenario 3: SMTP fora
When o envio falha
Then a conta permanece pendente e a UI orienta reenvio

### Scenario 4: Verificar e-mail
When `GET /api/auth/verify-email/:token` com token válido (< 24h)
Then `verificado=true` e tokens de verificação são limpos

### Scenario 5: Reenvio
When `POST /api/auth/resend-verification` para conta EMAIL não verificada
Then novo token e novo e-mail

## Feature: login, sessão e logout

### Scenario 6: Login Web
Given conta EMAIL verificada
When `POST /api/auth/login` sem `X-Pulso-Client: mobile`
Then cookies `pulso_access` / `pulso_refresh` httpOnly
And JSON `{ user }` **sem** tokens no body
And o SPA vai para a rota autenticada (`/dashboard` na Sprint-3)

### Scenario 7: Login Flutter
Given o mesmo usuário
When `POST /api/auth/login` com `X-Pulso-Client: mobile`
Then JSON inclui `accessToken`, `refreshToken` e `user`
And o app grava no secure storage e manda `Authorization: Bearer`

### Scenario 8: E-mail não verificado
When login com `verificado=false`
Then `403` e CTA de reenviar verificação

### Scenario 9: Refresh rotativo
Given refresh válido
When `POST /api/auth/refresh`
Then o refresh anterior é revogado e um novo par é emitido
And replay do refresh antigo revoga **todos** os refresh do usuário (`401`)

### Scenario 10: Logout
When `POST /api/auth/logout`
Then o refresh é revogado
And a Web limpa cookies; o Flutter limpa o storage

### Scenario 11: /me sem token
When `GET /api/auth/me` sem cookie e sem Bearer
Then `401` "Token não fornecido ou inválido."

## Feature: Google

### Scenario 12: OAuth Web
When `GET /api/auth/google` → callback Passport
Then `POST /api/auth/oauth/exchange` seta cookies e redireciona `FRONTEND_URL/auth/callback`

### Scenario 13: Google Flutter
Given ID token do `google_sign_in` (bundle `pulso.pulso`)
When `POST /api/auth/google/mobile` com `{ idToken }`
Then valida no Google, localiza ou cria o usuário (mesmo seed)
And devolve tokens no JSON **sem** redirect da SPA

## Feature: recuperação de senha

### Scenario 14: Forgot
When `POST /api/auth/forgot-password`
Then resposta genérica (anti-enumeração)
And se a conta existe, e-mail com token 1h (`FRONTEND_URL/reset-password/:token` + `pulso://`)

### Scenario 15: Reset
When `POST /api/auth/reset-password/:token` com senha forte
Then senha atualiza e **todos** os refresh são revogados

## Feature: segurança transversal

### Scenario 16: Rate limit
When mais de 5 req/min na mesma rota de auth
Then `429` (instâncias independentes por endpoint)

### Scenario 17: Guards Web
Given sessão ausente
When acessa `/dashboard` ou `/transactions`
Then `ProtectedRoute` manda para `/login`
And visitante autenticado em `/login` / `/register` cai no `GuestRoute`
