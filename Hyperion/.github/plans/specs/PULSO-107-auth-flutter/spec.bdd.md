# Spec BDD — Auth Flutter na mesma API Node

## Feature: sessão nativa na API Pulso

Contrato: `Codigo/Pulso/api` — rotas em `src/routes/authRoutes.js`.
Leitura de token: `getAccessTokenFromRequest` / `getRefreshTokenFromRequest` em `src/utils/authCookies.js`.

### Scenario 1: Login e-mail/senha no Flutter
Given uma conta EMAIL verificada
When o app envia `POST /api/auth/login` com `{ email, senha, lembrarMe }` e header `X-Pulso-Client: mobile`
Then a API seta cookies (compat Web) **e** o JSON inclui `accessToken`, `refreshToken` e `user`
And o app persiste os tokens em secure storage
And as próximas requests autenticadas enviam `Authorization: Bearer <accessToken>`

### Scenario 2: Refresh rotativo no app
Given um `refreshToken` válido guardado no device
When o access JWT expira e o interceptor chama `POST /api/auth/refresh` com `{ refreshToken }`
Then a API revoga o refresh anterior (single-use) e devolve novo par no JSON
And o app substitui os dois tokens no secure storage
And `GET /api/auth/me` com o novo Bearer retorna `200` e `{ user }`

### Scenario 3: Replay de refresh
Given um refresh já revogado é reenviado
When `POST /api/auth/refresh`
Then a API revoga todos os refresh daquele usuário e retorna `401`
And o app limpa o storage e mostra a tela de login

### Scenario 4: Logout
Given sessão nativa ativa
When `POST /api/auth/logout` com `{ refreshToken }`
Then o refresh é revogado
And o app apaga access e refresh do secure storage

### Scenario 5: Cadastro e verificação
Given dados válidos (nome ≥3, e-mail único, senha forte)
When `POST /api/auth/register`
Then retorna `201` e a conta nasce `verificado=false` (mesmo contrato da Web)
And o e-mail de verificação continua apontando para `FRONTEND_URL/verify-email/:token`
And após `GET /api/auth/verify-email/:token` o login no app passa a ser permitido

### Scenario 6: Recuperação de senha
Given um e-mail de conta EMAIL
When `POST /api/auth/forgot-password`
Then a resposta é genérica (anti-enumeração)
And `POST /api/auth/reset-password/:token` com senha forte atualiza a senha e revoga sessões
And o app pode fazer login com a nova senha

### Scenario 7: Google nativo
Given o SDK `google_sign_in` obteve um ID token válido
When `POST /api/auth/google/mobile` (NOVO) com `{ idToken }`
Then a API valida o token no Google, localiza ou cria o usuário (mesmo seed de categorias da Web)
And emite a mesma sessão (`issueAuthTokens`) e devolve tokens no JSON
And **não** redireciona para `FRONTEND_URL/auth/callback`

### Scenario 8: Cliente Web inalterado
Given o SPA chama login/refresh sem `X-Pulso-Client: mobile`
When `POST /api/auth/login` / `POST /api/auth/refresh`
Then o JSON **não** precisa expor os tokens (cookies httpOnly bastam)
And `withCredentials` continua funcionando

### Scenario 9: Sem token
Given o app chama `GET /api/auth/me` sem Bearer e sem cookie
When a request chega em `authMiddleware`
Then retorna `401` "Token não fornecido ou inválido."
