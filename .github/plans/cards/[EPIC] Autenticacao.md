# [EPIC] Autenticação

Tipo:        Epic  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Autenticação, Segurança, Backend, Frontend  
Relator:     (preencher)  
Pai:         —  
Data Limite: (preencher)

---

## 📋 Descrição do Epic

Sistema completo de autenticação e autorização para o Pulso, abrangendo cadastro, login, recuperação de senha, verificação de email e integração com Google OAuth 2.0. Este módulo é a base de segurança de toda a aplicação e garante que apenas usuários autenticados e verificados possam acessar as funcionalidades financeiras.

### 🎯 Objetivos do Epic

- ✅ Permitir cadastro de novos usuários com validação de email
- ✅ Permitir login seguro com JWT (access + refresh token)
- ✅ Permitir login via Google OAuth 2.0
- ✅ Permitir recuperação de senha via email
- ✅ Garantir segurança com hash bcryptjs e tokens temporários
- ✅ Implementar 7 telas responsivas (claro + escuro) conforme protótipos

### 🎭 Funcionalidades (Features)

Este Epic é dividido em **4 Features principais**:

1. **[FEATURE] Cadastro e Verificação de Email**
   - Tela de cadastro com formulário (nome, email, senha, confirmar senha)
   - Botão "Cadastrar com Google"
   - Envio de email de confirmação
   - Tela de feedback "Email enviado"
   - Endpoint de verificação de email (via link no email)

2. **[FEATURE] Login e Gestão de Sessão**
   - Tela de login com formulário (email/usuário, senha)
   - Checkbox "Lembrar-me"
   - Botão "Entrar com Google"
   - Link "Esqueci minha senha"
   - Geração de JWT (access token 15min + refresh token 7 dias)
   - Middleware de autenticação para rotas protegidas

3. **[FEATURE] Recuperação de Senha**
   - Tela "Recuperar senha" (campo email)
   - Envio de email com link temporário (expira em 1h)
   - Tela de feedback "Email de reset enviado"
   - Tela "Criar nova senha" (senha + confirmar + checklist de requisitos)
   - Indicador visual de força da senha
   - Tela de confirmação "Senha alterada com sucesso"

4. **[FEATURE] Segurança e Validações**
   - Hash de senhas com bcryptjs (salt rounds 10)
   - Validação de senha forte (min 8 caracteres, 1 maiúscula, 1 número, 1 especial)
   - Tokens temporários com expiração (verificação 24h, reset 1h)
   - Apenas usuários com email verificado podem logar
   - Logout com invalidação de refresh token

### 📊 Estrutura de Telas (7 telas × 2 modos = 14 protótipos)

| # | Tela | Rota | Layout | Protótipo |
|---|---|---|---|---|
| 1 | Cadastro | /register | AuthLayout | ✅ |
| 2 | Email de Confirmação Enviado | /register/email-sent | AuthLayout | ✅ |
| 3 | Login | /login | AuthLayout | ✅ |
| 4 | Recuperar Senha | /forgot-password | AuthLayout | ✅ |
| 5 | Email de Reset Enviado | /forgot-password/email-sent | AuthLayout | ✅ |
| 6 | Criar Nova Senha | /reset-password/:token | AuthLayout | ✅ |
| 7 | Senha Alterada com Sucesso | /reset-password/success | AuthLayout | ✅ |

### 🎨 Sistema de Cores (conforme protótipos)

**Modo Escuro:**
- Background: `#09090B` (fundo geral) / `#18181B` (cards)
- Primary: `#7C3AED` (botões, links, destaques)
- Text: `#FAFAFA` (principal) / `#A1A1AA` (secundário)
- Border: `#27272A`

**Modo Claro:**
- Background: `#FAFAFA` (fundo geral) / `#FFFFFF` (cards)
- Primary: `#7C3AED` (botões, links, destaques)
- Text: `#18181B` (principal) / `#71717A` (secundário)
- Border: `#E4E4E7`

### 🔒 Requisitos de Segurança (Não Funcionais)

| Requisito | Especificação |
|---|---|
| Hash de Senha | bcryptjs com 10 salt rounds |
| Access Token | JWT com expiração de 15 minutos |
| Refresh Token | JWT com expiração de 7 dias |
| Token Verificação Email | String aleatória (32 chars), expira em 24h |
| Token Reset Senha | String aleatória (32 chars), expira em 1h |
| Validação Senha | Mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial |
| Email Verificado | Obrigatório para login (verificado = true) |
| HTTPS | Obrigatório em produção |
| Rate Limiting | Recomendado: 5 tentativas/min no login (não implementado agora) |

### 📦 Dependências Técnicas

**Backend:**
- bcryptjs (hash de senhas)
- jsonwebtoken (JWT)
- passport.js + passport-google-oauth20 (OAuth)
- nodemailer (envio de emails)
- crypto (geração de tokens aleatórios)
- zod (validação de schemas)

**Frontend:**
- react-hook-form (formulários)
- @hookform/resolvers/zod (validação)
- axios (requisições HTTP)
- react-router-dom (navegação)
- Design System do Pulso (componentes UI)

---

# [FEATURE] Cadastro e Verificação de Email

---

## [STORY DATABASE] Tokens de Verificação de Email

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Banco de Dados  
Relator:     (preencher)  
Pai:         [EPIC] Autenticação  
Data Limite: (preencher)

---

### 📝 Descrição

Como sistema, eu quero armazenar tokens temporários de verificação de email e reset de senha, para que usuários possam confirmar seus endereços de email e recuperar senhas de forma segura.

---

### 🔧 Alterações no Prisma Schema

**Arquivo:** `Codigo/Pulso/api/prisma/schema.prisma`

O Prisma é o **espelho do banco de dados**. Toda alteração é feita primeiro no schema, depois sincronizada com o banco em nuvem.

**Passo 1:** Adicionar os campos no model `Usuario`

Abra o arquivo `schema.prisma` e localize o model `Usuario`. Adicione os seguintes campos:

```prisma
model Usuario {
  id           String       @id @default(cuid())
  nome         String       @db.VarChar(120)
  email        String       @unique @db.VarChar(180)
  senhaHash    String?      @map("senha_hash")
  urlAvatar    String?      @map("url_avatar")
  provedorAuth ProvedorAuth @default(EMAIL) @map("provedor_auth")
  googleId     String?      @unique @map("google_id")
  verificado   Boolean      @default(false)
  
  // ✨ NOVOS CAMPOS PARA AUTENTICAÇÃO ✨
  tokenVerificacaoEmail  String?   @map("token_verificacao_email") @db.VarChar(64)
  tokenVerificacaoExpira DateTime? @map("token_verificacao_expira")
  tokenResetSenha        String?   @map("token_reset_senha") @db.VarChar(64)
  tokenResetExpira       DateTime? @map("token_reset_expira")
  
  criadoEm     DateTime     @default(now()) @map("criado_em")
  atualizadoEm DateTime     @updatedAt @map("atualizado_em")

  configuracoes       ConfiguracaoUsuario?
  tokensRenovacao     TokenRenovacao[]
  // ... demais relações existentes

  @@index([email])
  @@index([tokenVerificacaoEmail]) // ✨ NOVO ÍNDICE
  @@index([tokenResetSenha])       // ✨ NOVO ÍNDICE
  @@map("usuarios")
}
```

---

### 🚀 Comandos do Prisma

**Passo 2:** Após salvar o `schema.prisma`, execute os comandos na ordem:

```bash
# 1. Gerar migration (Prisma cria o SQL automaticamente e aplica no banco local)
npx prisma migrate dev --name add_auth_tokens

# 2. Gerar Prisma Client atualizado (atualiza os tipos TypeScript)
npx prisma generate

# 3. (OPCIONAL) Verificar se tudo está sincronizado
npx prisma db push

# 4. Aplicar migration em PRODUÇÃO (banco em nuvem Neon)
npx prisma migrate deploy
```

**O que cada comando faz:**
- `migrate dev`: Cria arquivo `.sql` na pasta `prisma/migrations/`, aplica no banco local, atualiza Client
- `generate`: Atualiza os tipos TypeScript do Prisma Client
- `db push`: Sincroniza schema com o banco SEM criar migration (útil para dev)
- `migrate deploy`: Aplica migrations pendentes no banco de produção

---

### � O que o Prisma vai gerar automaticamente:

Quando você rodar `npx prisma migrate dev --name add_auth_tokens`, o Prisma vai criar um arquivo SQL como este:

```sql
-- CreateIndex
CREATE INDEX "usuarios_token_verificacao_email_idx" ON "usuarios"("token_verificacao_email");

-- CreateIndex
CREATE INDEX "usuarios_token_reset_senha_idx" ON "usuarios"("token_reset_senha");

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "token_verificacao_email" VARCHAR(64),
ADD COLUMN "token_verificacao_expira" TIMESTAMP(3),
ADD COLUMN "token_reset_senha" VARCHAR(64),
ADD COLUMN "token_reset_expira" TIMESTAMP(3);
```

**Você NÃO precisa escrever esse SQL manualmente!** O Prisma gera automaticamente. 🎉

---

### ✅ Critérios de Aceite

→ Tabela `usuarios` possui os 4 novos campos (token_verificacao_email, token_verificacao_expira, token_reset_senha, token_reset_expira)  
→ Índices criados para busca rápida por tokens  
→ Prisma Client atualizado e gerando tipos TypeScript corretos  
→ Migration aplicada sem erros  

---

**OBS: ATUALIZAR NO DIAGRAMA**

- Tabela `usuarios`: adicionar os 4 novos campos mencionados acima

---

# [STORY BACKEND] APIs de Cadastro e Verificação

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Backend  
Relator:     (preencher)  
Pai:         [FEATURE] Cadastro e Verificação de Email  
Data Limite: (preencher)

---

## 📝 Descrição

Como sistema backend, eu quero disponibilizar endpoints para cadastro de novos usuários e verificação de email, para que o frontend possa implementar o fluxo completo de registro.

---

## ✅ Critérios de Aceite

### Cenário 1 — Cadastro com Email e Senha (Sucesso)

**Dado** que o usuário preenche nome, email válido, senha forte e confirma a senha,  
**Quando** POST /api/auth/register é chamado com `{ nome, email, senha, confirmarSenha }`,  
**Então** o sistema:
- Valida que todos os campos estão preenchidos
- Valida que o email tem formato válido
- Valida que a senha atende aos requisitos (min 8 chars, 1 maiúscula, 1 número, 1 especial)
- Valida que senha === confirmarSenha
- Verifica se o email já existe no banco
- Faz hash da senha com bcryptjs (10 salt rounds)
- Gera token aleatório de 32 caracteres (crypto.randomBytes)
- Define expiração do token para 24h
- Cria registro no banco com `verificado = false`
- Envia email com link: `https://pulso.com/verify-email/{token}`
- Retorna 201 com `{ message: "Cadastro realizado! Verifique seu email.", email: "user@example.com" }`

**Se** email já existe: Retorna 409 `{ error: "Este email já está cadastrado." }`  
**Se** senha fraca: Retorna 400 `{ error: "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial." }`  
**Se** senhas não conferem: Retorna 400 `{ error: "As senhas não conferem." }`

---

### Cenário 2 — Cadastro via Google OAuth (Sucesso)

**Dado** que o usuário clica em "Cadastrar com Google",  
**Quando** GET /api/auth/google é chamado,  
**Então** o sistema redireciona para o consentimento do Google.

**Quando** o Google redireciona para GET /api/auth/google/callback com o código,  
**Então** o sistema:
- Troca o código por access token com o Google
- Busca dados do perfil (email, nome, foto)
- Verifica se já existe usuário com esse `googleId`
- Se NÃO existe: cria novo usuário com `provedorAuth = GOOGLE`, `verificado = true` (Google já validou)
- Se JÁ existe: apenas faz login
- Gera access token JWT (15min) e refresh token (7 dias)
- Armazena refresh token no banco
- Redireciona para o frontend com token: `https://pulso.com/auth/callback?token={jwt}`
- Frontend armazena token e redireciona para /dashboard

---

### Cenário 3 — Verificação de Email (Sucesso)

**Dado** que o usuário recebeu email de confirmação e clicou no link,  
**Quando** GET /api/auth/verify-email/:token é chamado,  
**Então** o sistema:
- Busca usuário por `tokenVerificacaoEmail = :token`
- Verifica se o token não expirou (tokenVerificacaoExpira > agora)
- Atualiza `verificado = true`
- Limpa os campos `tokenVerificacaoEmail` e `tokenVerificacaoExpira`
- Redireciona para o frontend: `https://pulso.com/login?verified=true`
- Frontend exibe toast: "Email verificado com sucesso! Faça login para continuar."

**Se** token inválido ou não encontrado: Retorna 400 `{ error: "Token de verificação inválido." }`  
**Se** token expirado: Retorna 400 `{ error: "Token expirado. Solicite um novo email de verificação." }`  
**Se** já verificado: Retorna 200 `{ message: "Email já foi verificado anteriormente." }`

---

### Cenário 4 — Reenvio de Email de Verificação

**Dado** que o usuário não recebeu o email ou o token expirou,  
**Quando** POST /api/auth/resend-verification é chamado com `{ email }`,  
**Então** o sistema:
- Busca usuário por email
- Verifica se já não está verificado (se sim, retorna erro)
- Gera novo token e nova data de expiração
- Envia novo email
- Retorna 200 `{ message: "Email de verificação reenviado." }`

**Se** email já verificado: Retorna 400 `{ error: "Este email já foi verificado." }`  
**Se** email não encontrado: Retorna 404 `{ error: "Email não encontrado." }`

---

## 🛠️ Implementação

### auth.controller.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/controllers/authController.js`

Métodos existentes (não alterar):
* *(arquivo atualmente vazio)*

Métodos NOVOS a adicionar:
* `register()` → POST /api/auth/register
* `verifyEmail()` → GET /api/auth/verify-email/:token
* `resendVerification()` → POST /api/auth/resend-verification
* `googleAuth()` → GET /api/auth/google
* `googleCallback()` → GET /api/auth/google/callback

```javascript
// Exemplo de implementação do register

export const register = async (req, res, next) => {
  try {
    const { nome, email, senha, confirmarSenha } = req.body
    
    // Chama o service
    const result = await authService.registerUser({ nome, email, senha, confirmarSenha })
    
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}
```

---

### auth.service.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/services/authService.js`  
**Seguir padrão de:** `userService.js` (ver exemplars.md)

Métodos:
* `registerUser({ nome, email, senha, confirmarSenha })` — Lógica de cadastro
* `verifyEmailToken(token)` — Verifica token e ativa conta
* `resendVerificationEmail(email)` — Reenvia email
* `authenticateGoogle(profile)` — Cria ou encontra usuário via Google

**Regras de negócio:**
→ Validar senha forte: min 8 chars, 1 maiúscula, 1 número, 1 especial (usar regex)  
→ Hash de senha: `bcrypt.hash(senha, 10)`  
→ Gerar token: `crypto.randomBytes(32).toString('hex')`  
→ Expiração token verificação: `new Date(Date.now() + 24 * 60 * 60 * 1000)` (24h)  
→ Verificar se email já existe antes de criar  
→ Chamar `emailProvider.sendVerificationEmail(email, token)`  
→ Google OAuth: se usuário já existe com mesmo email mas `provedorAuth = EMAIL`, retornar erro sugerindo login com senha  

---

### auth.repository.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/repositories/authRepository.js`  
**Seguir padrão de:** `userRepository.js` (ver exemplars.md)

Métodos:
* `createUser(data)` — Cria usuário no banco
* `findByEmail(email)` — Busca por email
* `findByGoogleId(googleId)` — Busca por googleId
* `findByVerificationToken(token)` — Busca por token de verificação
* `updateUser(id, data)` — Atualiza usuário (verificado, tokens, etc)

```javascript
// Exemplo usando Prisma

import prisma from '@/config/database.js'

export const createUser = async (data) => {
  return await prisma.usuario.create({ data })
}

export const findByEmail = async (email) => {
  return await prisma.usuario.findUnique({ where: { email } })
}
```

---

## 📐 Schemas (Zod)

### auth.schemas.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/schemas/authSchemas.js`

Schemas existentes (não alterar):
* *(arquivo atualmente vazio)*

Schemas NOVOS a adicionar:

```javascript
import { z } from 'zod'

// Regex para senha forte
const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(120),
    email: z.string().email('Email inválido'),
    senha: z.string().regex(senhaForteRegex, 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial'),
    confirmarSenha: z.string()
  }).refine(data => data.senha === data.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha']
  })
})

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido')
  })
})

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().length(64, 'Token inválido')
  })
})
```

---

## 🛣️ Rotas

### auth.routes.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/routes/authRoutes.js`

Rotas existentes (não alterar):
* *(arquivo atualmente vazio)*

Rotas NOVAS a adicionar:

```javascript
import express from 'express'
import passport from 'passport'
import * as authController from '@/controllers/authController.js'
import { validateMiddleware } from '@/middlewares/validateMiddleware.js'
import * as authSchemas from '@/schemas/authSchemas.js'

const router = express.Router()

// Cadastro com email/senha
router.post('/register', 
  validateMiddleware(authSchemas.registerSchema), 
  authController.register
)

// Verificação de email
router.get('/verify-email/:token', 
  validateMiddleware(authSchemas.verifyEmailSchema), 
  authController.verifyEmail
)

// Reenviar email de verificação
router.post('/resend-verification', 
  validateMiddleware(authSchemas.resendVerificationSchema), 
  authController.resendVerification
)

// Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
)

export default router
```

**Registrar em:** `Codigo/Pulso/api/src/routes/index.js`

```javascript
import authRoutes from './authRoutes.js'

router.use('/auth', authRoutes)
```

---

## 🔧 Providers

### email.provider.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/providers/emailProvider.js`

Métodos existentes (não alterar):
* *(verificar se já existe algum método)*

Métodos NOVOS a adicionar:

```javascript
import nodemailer from 'nodemailer'
import { env } from '@/config/env.js'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
})

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email/${token}`
  
  await transporter.sendMail({
    from: `"Pulso" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Verifique seu email - Pulso',
    html: `
      <h1>Bem-vindo ao Pulso!</h1>
      <p>Clique no link abaixo para verificar seu email:</p>
      <a href="${verificationUrl}">Verificar Email</a>
      <p>Este link expira em 24 horas.</p>
    `
  })
}
```

---

### passport.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/config/passport.js`

Configuração existente (não alterar):
* *(arquivo pode estar vazio ou com config básica)*

Configuração NOVA a adicionar:

```javascript
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './env.js'
import * as authService from '@/services/authService.js'

passport.use(new GoogleStrategy({
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${env.API_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await authService.authenticateGoogle(profile)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
}))

export default passport
```

---

## 🚫 Regras de Negócio

* **RN-001**: Estagiário recebe bolsa auxílio (não tem descontos INSS/IRRF) — *não se aplica a este módulo*
* **RN-046**: Toda transação deve ter valor, data, categoria, recurso e tipo — *não se aplica*
* **RF-001**: O sistema deve permitir cadastro com email e senha ✅
* **RF-002**: O sistema deve permitir login via Google OAuth 2.0 ✅
* **RF-003**: O sistema deve enviar email de confirmação ao cadastrar ✅

**Regras específicas deste módulo:**

* Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial
* Token de verificação expira em 24 horas
* Usuário só pode logar após verificar email (verificado = true)
* Hash de senha usa bcryptjs com 10 salt rounds
* Google OAuth cria usuário com verificado = true automaticamente
* Se email já existe com provedor diferente, retornar erro específico

---

# [STORY FRONTEND] Telas de Cadastro e Verificação

Tipo:        Story  
Prioridade:  🔼 High  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Cadastro e Verificação de Email  
Data Limite: (preencher)

---

## 📝 Descrição

Como usuário, eu quero criar uma conta no Pulso fornecendo meu nome, email e senha, para que eu possa começar a usar o sistema de gestão financeira.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregar Tela de Cadastro

**Dado** que o usuário acessa /register  
**Quando** a página carrega  
**Então** exibe:
- Layout dividido: Hero à esquerda (ilustração + features) + Formulário à direita
- Ícone circular roxo com usuário
- Título "Crie sua conta"
- Subtítulo "Preencha os dados abaixo para começar a usar o Pulso."
- 4 campos: Nome completo, E-mail, Senha, Confirmar senha
- Cada campo de senha tem toggle de visibilidade (ícone 👁️)
- Checkbox "Eu aceito os Termos de Uso e a Política de Privacidade" (com links)
- Botão primário "Cadastrar" (desabilitado até preencher todos os campos)
- Divisor "ou cadastre-se com"
- Botão secundário "Cadastrar com Google" (ícone do Google)
- Link "Já possui uma conta? Fazer Login" (redireciona para /login)
- Tema adapta automaticamente (modo claro/escuro)

---

### Cenário 2 — Validação de Campos (Client-side)

**Dado** que o usuário está preenchendo o formulário  
**Quando** o usuário digita e sai do campo (onBlur)  
**Então**:
- Se campo vazio: exibe "Este campo é obrigatório" abaixo do campo (texto vermelho)
- Se email inválido: exibe "Email inválido"
- Se senha não atende requisitos: exibe "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial"
- Se confirmar senha diferente de senha: exibe "As senhas não conferem"
- Se checkbox não marcado: ao clicar em Cadastrar, exibe erro "Você deve aceitar os termos"
- Erros desaparecem quando o campo é corrigido

---

### Cenário 3 — Cadastro com Sucesso (Email/Senha)

**Dado** que todos os campos estão válidos e checkbox marcado  
**Quando** o usuário clica em "Cadastrar"  
**Então**:
- Botão muda para estado loading (spinner + texto "Cadastrando...")
- Faz POST /api/auth/register com `{ nome, email, senha, confirmarSenha }`
- Se sucesso (201):
  - Redireciona para /register/email-sent?email={email}
  - Tela de feedback exibe o email cadastrado

---

### Cenário 4 — Erro no Cadastro (Email já Existe)

**Dado** que o usuário tenta cadastrar com email já existente  
**Quando** o backend retorna 409  
**Então**:
- Exibe toast de erro: "Este email já está cadastrado."
- Mantém usuário na tela de cadastro
- Campo email fica destacado em vermelho

---

### Cenário 5 — Cadastro via Google OAuth

**Dado** que o usuário clica em "Cadastrar com Google"  
**Quando** o botão é clicado  
**Então**:
- Abre popup do Google para seleção de conta
- Após autorização, backend redireciona para /auth/callback?token={jwt}
- Frontend armazena token no localStorage
- Redireciona para /dashboard
- Exibe toast de sucesso: "Bem-vindo ao Pulso!"

---

### Cenário 6 — Tela "Email Enviado" (Feedback)

**Dado** que o cadastro foi bem-sucedido  
**Quando** o usuário é redirecionado para /register/email-sent  
**Então** exibe:
- Layout dividido: Hero à esquerda + Card de feedback à direita
- Ícone circular roxo com envelope
- Título "Email Enviado!"
- Subtítulo "Enviamos um email de confirmação para o endereço:"
- Box roxo claro com o email cadastrado (destaque visual)
- Alert azul: "Não recebeu o email? Verifique sua caixa de entrada, spam ou lixo eletrônico."
- Texto: "Clique no link do email para ativar sua conta e desbloquear todas as funcionalidades do Pulso."
- Botão primário "Ir para o Login" (redireciona para /login)
- Link "← Voltar para o Cadastro" (redireciona para /register)

---

### Cenário 7 — Verificação de Email via Link

**Dado** que o usuário recebeu o email e clicou no link  
**Quando** acessa /verify-email/:token  
**Então**:
- Exibe spinner de loading
- Faz GET /api/auth/verify-email/:token
- Se sucesso: redireciona para /login?verified=true e exibe toast "Email verificado com sucesso!"
- Se erro (token inválido/expirado): exibe tela de erro com opção "Reenviar Email"

---

## 🎨 Visual e UX

### Protótipos Fornecidos

✅ **Tela 1 e 2**: Cadastro (modo escuro + claro)  
✅ **Tela 3 e 4**: Email Enviado (modo escuro + claro)

### Layout

- **Responsividade**: 
  - Desktop (>1024px): Layout dividido 50/50 (Hero | Formulário)
  - Tablet (768-1024px): Hero reduzido, formulário maior
  - Mobile (<768px): Hero oculto, formulário full-width

- **Componentes do Design System**:
  - `InputText` — Nome completo, E-mail
  - `InputPassword` — Senha, Confirmar senha (com toggle de visibilidade)
  - `Checkbox` — Aceite dos termos
  - `Button` — Cadastrar (primary), Cadastrar com Google (secondary)
  - `Alert` — Info box azul "Não recebeu o email?"
  - `Spinner` — Loading durante cadastro
  - Toast (Sonner) — Mensagens de sucesso/erro

- **Cores**:
  - Botão primário: `#7C3AED` (roxo)
  - Links: `#7C3AED` (roxo)
  - Erro: `#EF4444` (vermelho claro) / `#F87171` (vermelho escuro)
  - Success: `#10B981` (verde claro) / `#34D399` (verde escuro)

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useAuthMutations.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/hooks/useAuthMutations.js`  
**Seguir padrão de:** hooks existentes no projeto

Hooks:
* `useRegister()` — Mutation para cadastro
* `useResendVerification()` — Mutation para reenviar email
* `useVerifyEmail()` — Query para verificar token

```javascript
import { useMutation } from '@tanstack/react-query'
import * as authService from '@/services/authService.js'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useRegister = () => {
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      navigate(`/register/email-sent?email=${data.email}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar')
    }
  })
}
```

---

### Componentes

#### Register/ (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/pages/Register.jsx`

Componente existente (não alterar):
* *(arquivo atualmente vazio)*

Implementação NOVA a adicionar:

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputText, InputPassword, Button, Checkbox } from '@/design-system/components'
import { registerSchema } from '@/schemas/authSchemas'
import { useRegister } from '@/hooks/useAuthMutations'
import AuthLayout from '@/components/layouts/AuthLayout'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  })
  
  const registerMutation = useRegister()
  
  const onSubmit = (data) => {
    registerMutation.mutate(data)
  }
  
  return (
    <AuthLayout hero={<RegisterHero />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos do formulário */}
      </form>
    </AuthLayout>
  )
}
```

---

#### RegisterHero/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/features/auth/RegisterHero.jsx`

Componente que renderiza o lado esquerdo da tela de cadastro (ilustração + features).

---

#### EmailSent/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/EmailSent.jsx`

Tela de feedback após cadastro.

---

#### VerifyEmail/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/VerifyEmail.jsx`

Tela que processa o token de verificação e exibe resultado.

---

### Services

#### auth.service.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/services/authService.js`

Métodos existentes (não alterar):
* *(verificar se já existe algum método)*

Métodos NOVOS a adicionar:

```javascript
import api from '@/config/api'

export const register = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`)
  return response.data
}

export const resendVerification = async (email) => {
  const response = await api.post('/auth/resend-verification', { email })
  return response.data
}

export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
}
```

---

### Schemas (Zod — Frontend)

#### auth.schemas.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/schemas/authSchemas.js`

```javascript
import { z } from 'zod'

const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

export const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().regex(senhaForteRegex, 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial'),
  confirmarSenha: z.string(),
  aceitarTermos: z.boolean().refine(val => val === true, 'Você deve aceitar os termos')
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha']
})
```

---

### Endpoints consumidos

* POST /api/auth/register
* GET /api/auth/verify-email/:token
* POST /api/auth/resend-verification
* GET /api/auth/google
* GET /api/auth/google/callback

---

## 🚫 Regras de Negócio

* Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial
* Checkbox de termos é obrigatório
* Email de verificação expira em 24h
* Google OAuth cria conta automaticamente verificada
* Após cadastro, usuário deve verificar email antes de logar

---

## 🛠️ Refinamento

* **Estado Global**: Não usar Redux para formulário — React Hook Form gerencia localmente
* **Validação**: Zod no frontend (client-side) + backend (server-side)
* **Senhas**: Nunca armazenar em plain text, sempre hash com bcryptjs
* **Tokens**: Usar crypto.randomBytes para gerar tokens seguros
* **Email**: Usar template HTML profissional (considerar biblioteca como mjml futuramente)
* **OAuth**: Popup do Google abre em nova janela, não redireciona a aba atual

---

# [FEATURE] Login e Gestão de Sessão

---

## [STORY DATABASE] Gestão de Refresh Tokens

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Banco de Dados  
Relator:     (preencher)  
Pai:         [FEATURE] Login e Gestão de Sessão  
Data Limite: (preencher)

---

### 📝 Descrição

Como sistema, eu quero armazenar e gerenciar refresh tokens de forma segura, para que usuários possam renovar suas sessões sem precisar fazer login novamente a cada 15 minutos.

---

### ✅ Verificação no Prisma Schema

**Arquivo:** `Codigo/Pulso/api/prisma/schema.prisma`

A tabela `TokenRenovacao` **JÁ EXISTE** no schema. Verifique se possui os índices corretos:

```prisma
model TokenRenovacao {
  id         String    @id @default(cuid())
  usuarioId  String    @map("usuario_id")
  token      String    @unique
  expiraEm   DateTime  @map("expira_em")
  revogado   Boolean   @default(false)
  criadoEm   DateTime  @default(now()) @map("criado_em")
  revogadoEm DateTime? @map("revogado_em")

  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([usuarioId])   // ✅ Índice para busca por usuário
  @@index([expiraEm])    // ✅ Índice para busca por expiração
  @@map("tokens_renovacao")
}
```

**Se os índices já existem:** ✅ Nenhuma alteração necessária!

**Se falta algum índice:** Adicione `@@index([expiraEm])` e rode:

```bash
npx prisma migrate dev --name add_token_indexes
npx prisma generate
```

---

### ✅ Critérios de Aceite

→ Tabela `tokens_renovacao` existe e funciona corretamente  
→ Índices criados para busca rápida por usuário, data de expiração e status de revogação  
→ Cada login gera um novo refresh token e armazena no banco  
→ Tokens revogados não podem ser reutilizados  
→ Limpeza automática de tokens expirados (cron job recomendado)  

---

**OBS: ATUALIZAR NO DIAGRAMA**

- Tabela `tokens_renovacao`: já existe, nenhuma alteração necessária

---

## [STORY BACKEND] APIs de Login e JWT

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Backend  
Relator:     (preencher)  
Pai:         [FEATURE] Login e Gestão de Sessão  
Data Limite: (preencher)

---

## 📝 Descrição

Como sistema backend, eu quero disponibilizar endpoints para login com email/senha, renovação de tokens e logout, para que usuários autenticados possam acessar a aplicação de forma segura.

---

## ✅ Critérios de Aceite

### Cenário 1 — Login com Email e Senha (Sucesso)

**Dado** que o usuário possui conta verificada,  
**Quando** POST /api/auth/login é chamado com `{ email, senha, lembrarMe }`,  
**Então** o sistema:
- Busca usuário por email
- Verifica se `verificado = true`
- Compara hash da senha com bcryptjs
- Gera access token JWT com payload: `{ id, email, nome }` e expiração 15min
- Gera refresh token JWT com payload: `{ id }` e expiração 7 dias (ou 30 dias se `lembrarMe = true`)
- Armazena refresh token no banco (`TokenRenovacao`)
- Retorna 200 com `{ accessToken, refreshToken, user: { id, nome, email, urlAvatar } }`

**Se** email não encontrado: Retorna 401 `{ error: "Email ou senha incorretos." }`  
**Se** senha incorreta: Retorna 401 `{ error: "Email ou senha incorretos." }`  
**Se** email não verificado: Retorna 403 `{ error: "Você precisa verificar seu email antes de fazer login. Verifique sua caixa de entrada." }`

---

### Cenário 2 — Renovação de Access Token

**Dado** que o access token expirou (15min),  
**Quando** POST /api/auth/refresh é chamado com `{ refreshToken }` no body,  
**Então** o sistema:
- Verifica se o refresh token é válido (assinatura JWT)
- Busca o token no banco
- Verifica se não está revogado (`revogado = false`)
- Verifica se não expirou (`expiraEm > agora`)
- Gera novo access token (15min)
- Retorna 200 com `{ accessToken }`

**Se** refresh token inválido/expirado/revogado: Retorna 401 `{ error: "Sessão expirada. Faça login novamente." }`

---

### Cenário 3 — Logout

**Dado** que o usuário está logado,  
**Quando** POST /api/auth/logout é chamado com `{ refreshToken }`,  
**Então** o sistema:
- Busca o refresh token no banco
- Marca como revogado (`revogado = true`, `revogadoEm = agora`)
- Retorna 200 `{ message: "Logout realizado com sucesso." }`

---

### Cenário 4 — Middleware de Autenticação

**Dado** que uma rota requer autenticação,  
**Quando** a requisição chega sem token ou com token inválido,  
**Então** o middleware retorna 401 `{ error: "Token não fornecido ou inválido." }`

**Quando** o token é válido,  
**Então** o middleware:
- Decodifica o payload
- Anexa `req.user = { id, email, nome }`
- Permite que a requisição continue

---

## 🛠️ Implementação

### auth.controller.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/controllers/authController.js`

Métodos NOVOS a adicionar:
* `login()` → POST /api/auth/login
* `refresh()` → POST /api/auth/refresh
* `logout()` → POST /api/auth/logout
* `me()` → GET /api/auth/me (retorna dados do usuário logado)

---

### auth.service.js (EXISTENTE — MODIFICAR)

Métodos NOVOS a adicionar:
* `loginUser({ email, senha, lembrarMe })` — Valida credenciais e gera tokens
* `refreshAccessToken(refreshToken)` — Valida e gera novo access token
* `logoutUser(refreshToken)` — Revoga refresh token
* `generateTokens(userId, lembrarMe)` — Gera access + refresh tokens

**Regras de negócio:**
→ Access token expira em 15 minutos  
→ Refresh token expira em 7 dias (padrão) ou 30 dias (se lembrarMe = true)  
→ Payload do access token: `{ id, email, nome, iat, exp }`  
→ Payload do refresh token: `{ id, iat, exp }`  
→ Secret do JWT vem de variável de ambiente `JWT_SECRET`  
→ Comparar senha: `bcrypt.compare(senha, senhaHash)`  

---

### auth.middleware.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/middlewares/authMiddleware.js`

Implementação NOVA:

```javascript
import jwt from 'jsonwebtoken'
import { env } from '@/config/env.js'
import { AppError } from '@/utils/appError.js'
import * as userRepository from '@/repositories/userRepository.js'

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extrair token do header Authorization: Bearer <token>
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401)
    }
    
    const token = authHeader.split(' ')[1]
    
    // 2. Verificar assinatura e expiração
    const decoded = jwt.verify(token, env.JWT_SECRET)
    
    // 3. Buscar usuário no banco (garantir que ainda existe)
    const user = await userRepository.findById(decoded.id)
    if (!user) {
      throw new AppError('Usuário não encontrado', 401)
    }
    
    // 4. Anexar dados do usuário na requisição
    req.user = {
      id: user.id,
      email: user.email,
      nome: user.nome
    }
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401))
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401))
    }
    next(error)
  }
}
```

---

## 📐 Schemas (Zod)

### auth.schemas.js (EXISTENTE — MODIFICAR)

Schemas NOVOS a adicionar:

```javascript
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(1, 'Senha é obrigatória'),
    lembrarMe: z.boolean().optional().default(false)
  })
})

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token é obrigatório')
  })
})

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token é obrigatório')
  })
})
```

---

## 🛣️ Rotas

### auth.routes.js (EXISTENTE — MODIFICAR)

Rotas NOVAS a adicionar:

```javascript
// Login com email/senha
router.post('/login', 
  validateMiddleware(authSchemas.loginSchema), 
  authController.login
)

// Renovar access token
router.post('/refresh', 
  validateMiddleware(authSchemas.refreshSchema), 
  authController.refresh
)

// Logout
router.post('/logout', 
  validateMiddleware(authSchemas.logoutSchema), 
  authController.logout
)

// Obter dados do usuário logado
router.get('/me', 
  authMiddleware, 
  authController.me
)
```

---

## 🚫 Regras de Negócio

* **RF-002**: O sistema deve permitir login via Google OAuth 2.0 ✅ (já implementado na feature anterior)
* **RF-005**: O sistema deve manter a sessão ativa via token JWT com refresh token ✅
* **RF-006**: O sistema deve permitir logout com invalidação de sessão ✅

**Regras específicas:**

* Access token expira em 15 minutos
* Refresh token expira em 7 dias (padrão) ou 30 dias (lembrar-me)
* Apenas usuários com email verificado podem logar
* Logout revoga o refresh token (não pode ser reutilizado)
* Tokens expirados devem ser limpos do banco periodicamente (cron job)

---

## [STORY FRONTEND] Tela de Login

Tipo:        Story  
Prioridade:  🔼 High  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Login e Gestão de Sessão  
Data Limite: (preencher)

---

## 📝 Descrição

Como usuário verificado, eu quero fazer login no Pulso com meu email e senha ou via Google, para que eu possa acessar meu dashboard financeiro.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregar Tela de Login

**Dado** que o usuário acessa /login  
**Quando** a página carrega  
**Então** exibe:
- Layout dividido: Hero à esquerda (gráficos + features) + Formulário à direita
- Ícone circular roxo com usuário
- Título "Bem-vindo de volta!"
- Subtítulo "Acesse sua conta para continuar cuidando das suas finanças."
- 2 campos: E-mail ou Nome de Usuário, Senha (com toggle 👁️)
- Checkbox "Lembrar-me" (esquerda) + Link "Esqueci minha senha" (direita, roxo, alinhado na mesma linha)
- Botão primário "Entrar" (roxo, full-width)
- Divisor "ou continue com"
- Botão secundário "Entrar com o Google" (ícone do Google)
- Link "Ainda não possui uma conta? Cadastre-se" (redireciona para /register)

---

### Cenário 2 — Login com Sucesso

**Dado** que o usuário preenche email e senha corretos  
**Quando** clica em "Entrar"  
**Então**:
- Botão muda para loading (spinner + "Entrando...")
- Faz POST /api/auth/login com `{ email, senha, lembrarMe }`
- Se sucesso (200):
  - Armazena `accessToken` no localStorage
  - Armazena `refreshToken` no localStorage (ou httpOnly cookie se backend suportar)
  - Armazena dados do usuário no Redux (`authSlice`)
  - Redireciona para /dashboard
  - Exibe toast: "Bem-vindo de volta, {nome}!"

---

### Cenário 3 — Erro: Email não Verificado

**Dado** que o usuário tenta logar sem ter verificado o email  
**Quando** o backend retorna 403  
**Então**:
- Exibe toast de erro: "Você precisa verificar seu email antes de fazer login. Verifique sua caixa de entrada."
- Exibe link "Reenviar email de verificação" abaixo do formulário
- Ao clicar, chama POST /api/auth/resend-verification

---

### Cenário 4 — Erro: Credenciais Inválidas

**Dado** que o usuário digita email ou senha incorretos  
**Quando** o backend retorna 401  
**Então**:
- Exibe toast de erro: "Email ou senha incorretos."
- Campos ficam destacados em vermelho
- Botão volta ao estado normal

---

### Cenário 5 — Checkbox "Lembrar-me"

**Dado** que o usuário marca o checkbox "Lembrar-me"  
**Quando** faz login com sucesso  
**Então**:
- Backend gera refresh token com expiração de 30 dias (em vez de 7)
- Usuário não precisa logar novamente por 30 dias

---

### Cenário 6 — Login via Google OAuth

**Dado** que o usuário clica em "Entrar com o Google"  
**Quando** autoriza no popup do Google  
**Então**:
- Backend redireciona para /auth/callback?token={jwt}
- Frontend armazena token e redireciona para /dashboard
- Exibe toast: "Bem-vindo de volta!"

---

### Cenário 7 — Renovação Automática de Token

**Dado** que o usuário está navegando e o access token expira (15min)  
**Quando** uma requisição retorna 401  
**Então**:
- Interceptor do axios tenta renovar automaticamente
- Faz POST /api/auth/refresh com `{ refreshToken }`
- Se sucesso: atualiza accessToken no localStorage e retenta a requisição original
- Se falha: exibe modal "Sessão expirada. Faça login novamente." e redireciona para /login

---

### Cenário 8 — Logout

**Dado** que o usuário está logado  
**Quando** clica em "Sair" no menu do usuário  
**Então**:
- Faz POST /api/auth/logout com `{ refreshToken }`
- Remove tokens do localStorage
- Limpa estado do Redux
- Redireciona para /login
- Exibe toast: "Logout realizado com sucesso."

---

## 🎨 Visual e UX

### Protótipos Fornecidos

✅ **Tela 5 e 6**: Login (modo escuro + claro)

### Componentes do Design System

- `InputText` — E-mail ou Nome de Usuário
- `InputPassword` — Senha (com toggle)
- `Checkbox` — Lembrar-me
- `Button` — Entrar (primary), Entrar com Google (secondary)
- `Modal` — Sessão expirada
- Toast (Sonner) — Mensagens de feedback

---

## ⚙️ Integração Técnica

### Hooks

#### useAuthMutations.js (EXISTENTE — MODIFICAR)

Hooks NOVOS a adicionar:

```javascript
export const useLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      dispatch(setUser(data.user))
      navigate('/dashboard')
      toast.success(`Bem-vindo de volta, ${data.user.nome}!`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao fazer login')
    }
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      dispatch(clearUser())
      navigate('/login')
      toast.success('Logout realizado com sucesso')
    }
  })
}
```

---

### Redux Slice

#### authSlice.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/store/slices/authSlice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    }
  }
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
```

---

### Axios Interceptor

#### api.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/config/api.js`

Adicionar interceptor para renovação automática de token:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Request interceptor: adiciona token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: renova token automaticamente se expirado
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        // Redireciona para login
        window.location.href = '/login'
        return Promise.reject(error)
      }
      
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          refreshToken
        })
        
        localStorage.setItem('accessToken', data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token também expirou
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
```

---

### Componentes

#### Login/ (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/pages/Login.jsx`

Implementação similar ao Register.jsx, mas com campos de login.

---

#### LoginHero/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/features/auth/LoginHero.jsx`

Hero com gráficos e features do lado esquerdo.

---

### Services

#### auth.service.js (EXISTENTE — MODIFICAR)

Métodos NOVOS a adicionar:

```javascript
export const login = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const refresh = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refreshToken })
  return response.data
}

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  const response = await api.post('/auth/logout', { refreshToken })
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
```

---

### Endpoints consumidos

* POST /api/auth/login
* POST /api/auth/refresh
* POST /api/auth/logout
* GET /api/auth/me
* GET /api/auth/google
* GET /api/auth/google/callback

---

## 🚫 Regras de Negócio

* Apenas usuários com email verificado podem logar
* "Lembrar-me" aumenta expiração do refresh token para 30 dias
* Token expirado dispara renovação automática
* Se renovação falhar, redireciona para login
* Google OAuth loga automaticamente (não precisa verificar email)

---

# [FEATURE] Recuperação de Senha

---

## [STORY DATABASE] Tokens de Reset de Senha

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Banco de Dados  
Relator:     (preencher)  
Pai:         [FEATURE] Recuperação de Senha  
Data Limite: (preencher)

---
✅ Verificação no Prisma Schema

**Arquivo:** `Codigo/Pulso/api/prisma/schema.prisma`

Os campos de reset de senha **JÁ FORAM ADICIONADOS** na **[STORY DATABASE] Tokens de Verificação de Email** anterior.

Verifique se o model `Usuario` possui:

```prisma
model Usuario {
  // ... campos existentes ...
  
  tokenResetSenha        String?   @map("token_reset_senha") @db.VarChar(64)
  tokenResetExpira       DateTime? @map("token_reset_expira")
  
  // ... demais campos ...
  
  @@index([tokenResetSenha])  // ✅ Índice já adicionado
  @@map("usuarios")
}
```

**Se os campos e índice já existem:** ✅ Nenhuma alteração necessária!

**Caso contrário:** Volte para a **[STORY DATABASE] Tokens de Verificação de Email** e execute os comandos Prisma.

---

### ✅ Critérios de Aceite

→ Campos `tokenResetSenha` e `tokenResetExpira` existem na tabela `usuarios` (via Prisma)  
→ Índice criado automaticamente pelo Prisma para busca rápida por token  
→ Token expira em 1 hora (validado no backend)  
→ Token é invalidado após uso (limpar campos no service

### ✅ Critérios de Aceite

→ Campos `token_reset_senha` e `token_reset_expira` existem na tabela `usuarios`  
→ Índice criado para busca rápida por token  
→ Token expira em 1 hora  
→ Token é invalidado após uso (limpar campos)  

---

**OBS: ATUALIZAR NO DIAGRAMA**

- Tabela `usuarios`: campos já adicionados anteriormente

---

## [STORY BACKEND] APIs de Reset de Senha

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Backend  
Relator:     (preencher)  
Pai:         [FEATURE] Recuperação de Senha  
Data Limite: (preencher)

---

## 📝 Descrição

Como sistema backend, eu quero disponibilizar endpoints para solicitar reset de senha e redefinir senha com token temporário, para que usuários possam recuperar acesso à conta.

---

## ✅ Critérios de Aceite

### Cenário 1 — Solicitar Reset de Senha

**Dado** que o usuário esqueceu a senha,  
**Quando** POST /api/auth/forgot-password é chamado com `{ email }`,  
**Então** o sistema:
- Busca usuário por email
- Gera token aleatório de 32 caracteres (crypto.randomBytes)
- Define expiração para 1 hora
- Atualiza campos `tokenResetSenha` e `tokenResetExpira` no banco
- Envia email com link: `https://pulso.com/reset-password/{token}`
- Retorna 200 `{ message: "Email de recuperação enviado.", email: "u***@example.com" }` (email parcialmente oculto)

**Se** email não encontrado: Retorna 200 com mesma mensagem (não revelar se email existe — segurança)

---

### Cenário 2 — Validar Token de Reset

**Dado** que o usuário clicou no link do email,  
**Quando** GET /api/auth/reset-password/:token é chamado,  
**Então** o sistema:
- Busca usuário por `tokenResetSenha = :token`
- Verifica se não expirou (`tokenResetExpira > agora`)
- Retorna 200 `{ valid: true, email: "user@example.com" }`

**Se** token inválido ou expirado: Retorna 400 `{ valid: false, error: "Token inválido ou expirado." }`

---

### Cenário 3 — Redefinir Senha

**Dado** que o token é válido,  
**Quando** POST /api/auth/reset-password/:token é chamado com `{ senha, confirmarSenha }`,  
**Então** o sistema:
- Valida que senha atende requisitos (min 8 chars, 1 maiúscula, 1 número, 1 especial)
- Valida que senha === confirmarSenha
- Busca usuário por token
- Verifica se não expirou
- Faz hash da nova senha (bcryptjs)
- Atualiza `senhaHash` no banco
- Limpa campos `tokenResetSenha` e `tokenResetExpira`
- Revoga TODOS os refresh tokens do usuário (forçar novo login em todos os dispositivos)
- Retorna 200 `{ message: "Senha alterada com sucesso." }`

**Se** token inválido/expirado: Retorna 400 `{ error: "Token inválido ou expirado." }`  
**Se** senha fraca: Retorna 400 `{ error: "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial." }`  
**Se** senhas não conferem: Retorna 400 `{ error: "As senhas não conferem." }`

---

## 🛠️ Implementação

### auth.controller.js (EXISTENTE — MODIFICAR)

Métodos NOVOS a adicionar:
* `forgotPassword()` → POST /api/auth/forgot-password
* `validateResetToken()` → GET /api/auth/reset-password/:token
* `resetPassword()` → POST /api/auth/reset-password/:token

---

### auth.service.js (EXISTENTE — MODIFICAR)

Métodos NOVOS a adicionar:
* `requestPasswordReset(email)` — Gera token e envia email
* `validateResetToken(token)` — Verifica se token é válido
* `resetPassword(token, senha, confirmarSenha)` — Redefine senha

**Regras de negócio:**
→ Token expira em 1 hora  
→ Após redefinir senha, revogar TODOS os refresh tokens (segurança)  
→ Email de reset deve ter template profissional com botão/link destacado  
→ Não revelar se email existe no sistema (sempre retornar 200)  

---

### email.provider.js (EXISTENTE — MODIFICAR)

Métodos NOVOS a adicionar:

```javascript
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${token}`
  
  await transporter.sendMail({
    from: `"Pulso" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Recuperação de Senha - Pulso',
    html: `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha da sua conta Pulso.</p>
      <p>Clique no botão abaixo para criar uma nova senha:</p>
      <a href="${resetUrl}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Redefinir Senha</a>
      <p>Este link expira em 1 hora.</p>
      <p>Se você não solicitou esta recuperação, ignore este email.</p>
    `
  })
}
```

---

## 📐 Schemas (Zod)

### auth.schemas.js (EXISTENTE — MODIFICAR)

Schemas NOVOS a adicionar:

```javascript
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido')
  })
})

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().length(64, 'Token inválido')
  }),
  body: z.object({
    senha: z.string().regex(senhaForteRegex, 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial'),
    confirmarSenha: z.string()
  }).refine(data => data.senha === data.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha']
  })
})
```

---

## 🛣️ Rotas

### auth.routes.js (EXISTENTE — MODIFICAR)

Rotas NOVAS a adicionar:

```javascript
// Solicitar reset de senha
router.post('/forgot-password', 
  validateMiddleware(authSchemas.forgotPasswordSchema), 
  authController.forgotPassword
)

// Validar token de reset
router.get('/reset-password/:token', 
  authController.validateResetToken
)

// Redefinir senha
router.post('/reset-password/:token', 
  validateMiddleware(authSchemas.resetPasswordSchema), 
  authController.resetPassword
)
```

---

## 🚫 Regras de Negócio

* **RF-004**: O sistema deve permitir recuperação de senha via email ✅

**Regras específicas:**

* Token de reset expira em 1 hora
* Após redefinir senha, todos os refresh tokens são revogados (forçar novo login)
* Não revelar se email existe no sistema (sempre retornar 200)
* Senha deve atender requisitos de força
* Email deve ter design profissional e claro

---

## [STORY FRONTEND] Telas de Recuperação de Senha

Tipo:        Story  
Prioridade:  🔼 High  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Recuperação de Senha  
Data Limite: (preencher)

---

## 📝 Descrição

Como usuário que esqueceu a senha, eu quero solicitar reset de senha via email e criar uma nova senha, para que eu possa recuperar acesso à minha conta.

---

## ✅ Critérios de Aceite

### Cenário 1 — Tela "Recuperar Senha" (/forgot-password)

**Dado** que o usuário acessa /forgot-password  
**Quando** a página carrega  
**Então** exibe:
- Layout dividido: Hero à esquerda (cadeado + envelope + features) + Formulário à direita
- Ícone circular roxo com usuário
- Título "Recupere sua Senha"
- Subtítulo "Informe seu Email para receber um link de Recuperação."
- Campo: E-mail
- Botão primário "📧 Enviar Link De Recuperação" (roxo, full-width, com ícone)
- Link "← Voltar para o Login" (roxo)
- Alert roxo claro: "Enviaremos um link para redefinir sua senha. Verifique sua caixa de entrada e spam."

---

### Cenário 2 — Envio do Email de Reset (Sucesso)

**Dado** que o usuário preenche email válido  
**Quando** clica em "Enviar Link De Recuperação"  
**Então**:
- Botão muda para loading (spinner + "Enviando...")
- Faz POST /api/auth/forgot-password com `{ email }`
- Se sucesso (200):
  - Redireciona para /forgot-password/email-sent?email={email}

---

### Cenário 3 — Tela "Email de Reset Enviado" (/forgot-password/email-sent)

**Dado** que o email foi enviado com sucesso  
**Quando** o usuário é redirecionado para /forgot-password/email-sent  
**Então** exibe:
- Layout dividido: Hero à esquerda (envelope com senha + features) + Card de feedback à direita
- Ícone circular roxo com envelope
- Título "Email Enviado!"
- Subtítulo "Enviamos um email de alteração de senha para o endereço:"
- Box roxo escuro com email + ícone: `📧 seu@email.com`
- Alert azul: "Não recebeu o email? Verifique sua caixa de entrada, spam ou lixo eletrônico." + ícone envelope com interrogação
- Texto: "Clique no link do email para alterar sua senha."
- Botão primário "📧 Ir para o Login" (roxo, full-width, com ícone)
- Link "← Voltar para o Login" (roxo)
- Badge inferior (🛡️): "Este link expira em 1 hora por segurança."

---

### Cenário 4 — Tela "Criar Nova Senha" (/reset-password/:token)

**Dado** que o usuário clicou no link do email  
**Quando** acessa /reset-password/:token  
**Então**:
- Faz GET /api/auth/reset-password/:token para validar token
- Se token inválido/expirado: exibe tela de erro com opção "Solicitar novo link"
- Se token válido: exibe formulário:
  - Layout dividido: Hero à esquerda (cadeado + escudo + features) + Formulário à direita
  - Ícone circular roxo com usuário
  - Título "Altere sua Senha"
  - Subtítulo "Informe seu Email para receber um link de Recuperação." *(ajustar texto: "Crie uma nova senha forte para sua conta.")*
  - Campo: 🔒 Nova senha (com toggle 👁️)
  - **Indicador de força de senha**:
    - Label dinâmico: "Força da senha: **Fraca**" (vermelho) | "**Média**" (laranja) | "**Forte**" (verde)
    - Barra de progresso horizontal com 3 segmentos (preenche conforme força)
  - Campo: 🔒 Confirmar nova senha (com toggle 👁️)
  - **Checklist de requisitos** (abaixo dos campos):
    - Título: "Sua senha deve conter:"
    - ☐ Mínimo de 8 caracteres
    - ☐ Uma letra maiúscula
    - ☐ Um número
    - ☐ Um caractere especial
    - (Checkboxes marcados em **roxo** dinamicamente enquanto usuário digita)
  - Botão primário "Alterar Senha" (roxo, full-width)
  - Divisor: "ou"
  - Link "← Voltar para o Login" (roxo)
  - Badge inferior (🛡️): "Este link expira em 1 hora por segurança."

---

### Cenário 5 — Validação de Senha em Tempo Real

**Dado** que o usuário está digitando a nova senha  
**Quando** cada caractere é digitado  
**Então**:
- **Checklist atualiza dinamicamente**:
  - Se >= 8 caracteres: marca "Mínimo de 8 caracteres" ✅
  - Se tem letra maiúscula: marca "Uma letra maiúscula" ✅
  - Se tem número: marca "Um número" ✅
  - Se tem caractere especial: marca "Um caractere especial" ✅
- **Barra de força atualiza**:
  - 0-1 requisito: Vermelho "Fraca" (1/3 da barra)
  - 2-3 requisitos: Laranja "Média" (2/3 da barra)
  - 4 requisitos: Verde "Forte" (barra completa)
- Botão "Alterar Senha" só habilita quando TODOS os 4 requisitos forem atendidos E senha === confirmarSenha

---

### Cenário 6 — Redefinir Senha com Sucesso

**Dado** que todos os requisitos estão atendidos  
**Quando** o usuário clica em "Alterar Senha"  
**Então**:
- Botão muda para loading (spinner + "Alterando...")
- Faz POST /api/auth/reset-password/:token com `{ senha, confirmarSenha }`
- Se sucesso (200):
  - Redireciona para /reset-password/success

---

### Cenário 7 — Tela "Senha Alterada com Sucesso" (/reset-password/success)

**Dado** que a senha foi alterada com sucesso  
**Quando** o usuário é redirecionado para /reset-password/success  
**Então** exibe:
- Layout dividido: Hero à esquerda (cadeado + medalha check + features) + Card de confirmação à direita
- Ícone circular roxo com check mark
- Título "Senha alterada **com sucesso!**" (palavra "com sucesso!" em roxo)
- Subtítulo "Sua senha foi atualizada e sua conta está ainda mais segura."
- Alert roxo claro (🛡️): "Recomendamos que você não compartilhe sua senha com ninguém."
- Botão primário "🎯 Ir para o Dashboard" (roxo, full-width, com ícone de grid)
- Divisor: "ou"
- Botão secundário "🔒 Ir para o Login" (outline roxo, com ícone de cadeado)

---

### Cenário 8 — Token Expirado ou Inválido

**Dado** que o token expirou ou é inválido  
**Quando** o usuário acessa /reset-password/:token  
**Então**:
- Exibe tela de erro: "Link expirado ou inválido"
- Botão "Solicitar novo link" (redireciona para /forgot-password)
- Link "Voltar para o Login"

---

## 🎨 Visual e UX

### Protótipos Fornecidos

✅ **Tela 7 e 8**: Recuperar Senha (modo escuro + claro)  
✅ **Tela 9 e 10**: Email de Reset Enviado (modo escuro + claro)  
✅ **Tela 11 e 12**: Criar Nova Senha (modo escuro + claro)  
✅ **Tela 13 e 14**: Senha Alterada com Sucesso (modo escuro + claro)

### Componentes do Design System

- `InputText` — E-mail
- `InputPassword` — Nova senha, Confirmar senha (com toggle)
- `ProgressBar` — Força da senha (3 segmentos: fraca/média/forte)
- `Checkbox` — Checklist de requisitos (dinâmico, não interativo)
- `Button` — Enviar Link, Alterar Senha, Ir para Dashboard, Ir para Login
- `Alert` — Info boxes (azul e roxo)
- `Badge` — "Link expira em 1 hora"
- Toast (Sonner) — Mensagens de feedback

### Cores Dinâmicas (Força da Senha)

| Força | Cor | Segmentos Preenchidos |
|---|---|---|
| Fraca | `#EF4444` (vermelho) | 1/3 |
| Média | `#F59E0B` (laranja) | 2/3 |
| Forte | `#10B981` (verde) | 3/3 |

---

## ⚙️ Integração Técnica

### Hooks

#### useAuthMutations.js (EXISTENTE — MODIFICAR)

Hooks NOVOS a adicionar:

```javascript
export const useForgotPassword = () => {
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      navigate(`/forgot-password/email-sent?email=${data.email}`)
    },
    onError: (error) => {
      toast.error('Erro ao enviar email de recuperação')
    }
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      navigate('/reset-password/success')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao redefinir senha')
    }
  })
}
```

---

### Componentes

#### ForgotPassword/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/ForgotPassword.jsx`

Tela de solicitação de reset com campo email.

---

#### ForgotPasswordEmailSent/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/ForgotPasswordEmailSent.jsx`

Tela de feedback "Email enviado".

---

#### ResetPassword/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/ResetPassword.jsx`

Tela de criação de nova senha com checklist dinâmico e indicador de força.

**Lógica do indicador de força:**

```javascript
const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Fraca', color: '#EF4444' })

const calculateStrength = (password) => {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&#]/.test(password)) score++
  
  if (score <= 1) return { score: 1, label: 'Fraca', color: '#EF4444' }
  if (score <= 3) return { score: 2, label: 'Média', color: '#F59E0B' }
  return { score: 3, label: 'Forte', color: '#10B981' }
}

useEffect(() => {
  if (password) {
    setPasswordStrength(calculateStrength(password))
  }
}, [password])
```

---

#### PasswordChanged/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/PasswordChanged.jsx`

Tela de confirmação "Senha alterada com sucesso".

---

### Services

#### auth.service.js (EXISTENTE — MODIFICAR)

Métodos NOVOS a adicionar:

```javascript
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email })
  return response.data
}

export const validateResetToken = async (token) => {
  const response = await api.get(`/auth/reset-password/${token}`)
  return response.data
}

export const resetPassword = async ({ token, senha, confirmarSenha }) => {
  const response = await api.post(`/auth/reset-password/${token}`, { senha, confirmarSenha })
  return response.data
}
```

---

### Endpoints consumidos

* POST /api/auth/forgot-password
* GET /api/auth/reset-password/:token
* POST /api/auth/reset-password/:token

---

## 🚫 Regras de Negócio

* Token de reset expira em 1 hora
* Senha deve atender requisitos: min 8 chars, 1 maiúscula, 1 número, 1 especial
* Indicador de força atualiza em tempo real
* Checklist marca itens dinamicamente enquanto usuário digita
* Botão "Alterar Senha" só habilita quando TODOS os requisitos forem atendidos
* Após redefinir senha, todos os refresh tokens são revogados (backend)

---

## 🛠️ Refinamento

* **Estado Local**: Usar useState para força da senha e checklist
* **Validação**: Regex em tempo real para cada requisito
* **UX**: Feedback visual imediato (cores, checkboxes, barra de progresso)
* **Segurança**: Token de 1 hora, revogação de todas as sessões após reset
* **Email**: Template profissional com botão destacado

---

# 🎉 Conclusão do Epic

Este Epic cobre todo o fluxo de autenticação do Pulso, desde cadastro até recuperação de senha, com foco total em segurança e experiência do usuário.

## 📌 Progresso da implementação (31/05/2026)

### ✅ Já feito

**Backend**
- Schema Prisma: tokens verificação, reset, refresh (`TokenRenovacao`) — sync via `db push`
- `POST /api/auth/register` — bcrypt, email, rollback se SMTP falhar
- `GET /api/auth/google` + `/google/callback` — OAuth, JWT + refresh no redirect
- `emailProvider.sendVerificationEmail` — template HTML Pulso
- `passport.js`, `authSchemas` (register), `tokenUtils` (JWT 15min)

**Frontend**
- `/register` — formulário + Google + validação Zod
- `/register/email-sent` — protótipo (hero envelope PNG)
- `/auth/callback` — armazena tokens Google
- `/termos` + `/privacidade` — layout legal estilizado
- AuthLayout, heroes (register + email-sent), `auth.css`, `legal.css`
- Interceptor axios básico (401 → `/login`)

### 🔜 Próximo (prioridade)

> **Feature 2 — Login e sessão** (Feature 1 de cadastro/verificação concluída em 31/05/2026)

### ❌ Ainda falta (por feature)

**Feature 1 — Cadastro e verificação** ✅
- [x] Verificação + reenvio (backend + frontend)
- [x] Tela `/verify-email/:token` (loading / sucesso / erro + reenviar)
- [x] Botão reenviar em `/register/email-sent`
- [x] Stub `/login?verified=true` (toast; tela completa na Feature 2)

**Feature 2 — Login e sessão**
- [ ] `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`
- [ ] `authMiddleware.js` (rotas protegidas)
- [ ] Tela `/login` (protótipo)
- [ ] `authSlice` Redux + refresh automático no axios
- [ ] Bloquear login se `verificado = false`

**Feature 3 — Recuperação de senha**
- [ ] `POST /forgot-password`, `GET/POST /reset-password/:token`
- [ ] `emailProvider.sendPasswordReset`
- [ ] Telas: `/forgot-password`, `/forgot-password/email-sent`, `/reset-password/:token`, `/reset-password/success`
- [ ] Indicador de força de senha + checklist (reset)

**Feature 4 — Segurança / infra**
- [ ] Migration Prisma formal (shadow DB)
- [ ] Rate limiting login
- [ ] Cron limpeza tokens expirados
- [ ] Testes (unit, integração, E2E)
- [ ] Deploy prod (HTTPS, CORS, OAuth, SMTP)

### Telas (7 protótipos)

| Tela | Rota | Status |
|------|------|--------|
| Cadastro | `/register` | ✅ |
| Email enviado | `/register/email-sent` | ✅ |
| Verificar email | `/verify-email/:token` | ✅ |
| Login | `/login` | ⚠️ stub (Feature 2) |
| Recuperar senha | `/forgot-password` | ❌ |
| Email reset enviado | `/forgot-password/email-sent` | ❌ |
| Nova senha | `/reset-password/:token` | ❌ |
| Senha alterada | `/reset-password/success` | ❌ |
| Callback Google | `/auth/callback` | ✅ |

---

## ✅ Checklist de Implementação

### Backend
- [ ] Adicionar campos de token no schema.prisma e gerar migration
- [ ] Implementar authService.js completo (cadastro, login, refresh, reset)
- [ ] Implementar authController.js com todos os endpoints
- [ ] Implementar authMiddleware.js para proteção de rotas
- [ ] Configurar passport.js com Google OAuth
- [ ] Implementar emailProvider.js com templates de email
- [ ] Criar authSchemas.js com validações Zod
- [ ] Registrar todas as rotas em authRoutes.js
- [ ] Testar todos os endpoints com Postman/Insomnia

### Frontend
- [ ] Criar authSlice.js no Redux
- [ ] Configurar interceptor no axios para renovação automática de token
- [ ] Implementar todas as 7 páginas (Register, EmailSent, Login, ForgotPassword, etc.)
- [ ] Criar componentes Hero para cada tela
- [ ] Implementar hooks useAuthMutations.js
- [ ] Criar authSchemas.js com validações Zod (frontend)
- [ ] Implementar authService.js com métodos de API
- [ ] Implementar indicador de força de senha dinâmico
- [ ] Implementar checklist de requisitos dinâmico
- [ ] Adicionar rotas no react-router-dom
- [ ] Testar fluxo completo end-to-end

### Testes
- [ ] Testes unitários: authService.js (backend)
- [ ] Testes unitários: authController.js (backend)
- [ ] Testes de integração: rotas de autenticação
- [ ] Testes E2E: fluxo completo de cadastro → verificação → login
- [ ] Testes E2E: fluxo de recuperação de senha
- [ ] Testes de segurança: validação de tokens, hash de senhas

### Segurança
- [ ] Validar que senhas nunca são logadas
- [ ] Validar que tokens são gerados com crypto.randomBytes
- [ ] Validar que refresh tokens são revogados no logout
- [ ] Validar que tokens expirados não são aceitos
- [ ] Validar que email não verificado bloqueia login
- [ ] Validar rate limiting (recomendado: implementar)

### Deploy
- [ ] Configurar variáveis de ambiente em produção (SMTP, JWT_SECRET, GOOGLE_CLIENT_ID, etc.)
- [ ] Configurar HTTPS obrigatório
- [ ] Configurar CORS para domínio de produção
- [ ] Testar OAuth em produção (callback URL correto)
- [ ] Configurar cron job para limpeza de tokens expirados

---

## 📊 Estimativa de Esforço

| Story | Complexidade | Estimativa |
|---|---|---|
| [STORY DATABASE] Tokens de Verificação | Baixa | 2h |
| [STORY BACKEND] APIs de Cadastro e Verificação | Alta | 8h |
| [STORY FRONTEND] Telas de Cadastro e Verificação | Média | 6h |
| [STORY DATABASE] Gestão de Refresh Tokens | Baixa | 1h |
| [STORY BACKEND] APIs de Login e JWT | Alta | 6h |
| [STORY FRONTEND] Tela de Login | Média | 4h |
| [STORY DATABASE] Tokens de Reset de Senha | Baixa | 1h |
| [STORY BACKEND] APIs de Reset de Senha | Média | 4h |
| [STORY FRONTEND] Telas de Recuperação de Senha | Alta | 8h |
| **TOTAL** | — | **40h** (~1 semana) |

---

## 🚀 Próximos Passos Sugeridos

Após concluir este Epic, recomenda-se:

1. **Implementar Onboarding** — Após primeiro login, coletar modo de uso (Estagiário, CLT, PJ, Pessoa Física) e configurações iniciais
2. **Implementar Dashboard** — Tela principal com visão geral financeira
3. **Configurar Monitoramento** — Sentry para erros, Analytics para métricas
4. **Testes de Carga** — Validar performance das APIs de autenticação
5. **Documentação** — Atualizar Swagger com todos os endpoints de autenticação

---

**Fim do Epic de Autenticação** 🎉
