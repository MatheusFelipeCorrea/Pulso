# ⚙️ API — Backend

Servidor **Node.js + Express** com arquitetura em camadas (routes → controllers → services → repositories).

> Este documento separa o que **já está implementado** do que está **planeado** nos epics.

---

## 🗂️ Índice

- [Estado do projeto](#-estado-do-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura de pastas (atual)](#-estrutura-de-pastas-atual)
- [Fluxo de uma requisição](#-fluxo-de-uma-requisição)
- [Rotas implementadas](#-rotas-implementadas)
- [Transações — detalhes](#-transações--detalhes)
- [Orçamento — detalhes](#-orçamento--detalhes)
- [Notificações — detalhes](#-notificações--detalhes)
- [Lembretes e Calendário — detalhes](#-lembretes-e-calendário--detalhes)
- [Autenticação](#-autenticação)
- [Regras de negócio (transações)](#-regras-de-negócio-transações)
- [Seed de desenvolvimento](#-seed-de-desenvolvimento)
- [Como rodar](#-como-rodar)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Padrão de erros](#-padrão-de-erros)
- [Roadmap (não implementado)](#-roadmap-não-implementado)

---

## 📊 Estado do projeto

| Módulo | Status |
|--------|--------|
| Auth (email, JWT, refresh, Google OAuth) | ✅ |
| Categorias padrão no registro | ✅ |
| Tags | ✅ |
| **Transações** (CRUD, filtros, resumo, recorrência) | ✅ |
| **Vale Transporte** (saldo, vendas, usos) | ✅ |
| **Orçamento mensal** (limites, cópia, alertas) | ✅ |
| **Notificações** (listagem, contador, marcar lida) | ✅ |
| **Lembretes** (CRUD, marcar pago) | ✅ |
| **Calendário** (visão mês/dia, Google Calendar) | 🟡 Parcial — integração com IA pendente |
| Job transações recorrentes | ✅ |
| Job alertas de orçamento | ✅ |
| Metas, viagens, insights, relatórios, … | 🔜 Planejado |

Prefixo global: **`/api`**

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| Node.js + Express | HTTP |
| Prisma + PostgreSQL (Neon) | ORM / banco |
| Zod | Validação de entrada |
| JWT + bcrypt | Auth |
| Passport | Google OAuth |
| Nodemailer | Emails transacionais |
| node-cron | Jobs (recorrência, cleanup tokens, alertas de orçamento) |
| Winston | Logs |
| Jest + Supertest | Testes |

---

## 📁 Estrutura de pastas (atual)

```
Pulso/api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
└── src/
    ├── server.js
    ├── app.js
    ├── config/          env, database, passport
    ├── middlewares/     auth, validate, rate limit, error
    ├── routes/
    │   ├── index.js     → monta todas as rotas abaixo
    │   ├── authRoutes.js
    │   ├── transactionRoutes.js
    │   ├── categoryRoutes.js
    │   ├── tagRoutes.js
    │   ├── transportRoutes.js
    │   ├── budgetRoutes.js
    │   ├── notificationRoutes.js
    │   ├── reminderRoutes.js
    │   └── calendarRoutes.js
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── providers/       email (+ templates)
    ├── schemas/
    ├── constants/       defaultCategories, transactionOptions
    ├── utils/           transactionMapper, recursoCategoriaRules, …
    └── jobs/            recurringTransactions, tokenCleanupJob, budgetAlertJob
```

---

## 🔄 Fluxo de uma requisição

```
Request → helmet / cors / json
       → rate limit (rotas sensíveis)
       → authMiddleware (se 🔒)
       → validateMiddleware (Zod)
       → controller → service → repository (Prisma)
       → response JSON
```

Erros: `AppError` → `errorMiddleware` → `{ status: 'error', message }`

---

## 🛣️ Rotas implementadas

🔓 = pública | 🔒 = requer JWT

### Auth — `/api/auth`

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/register` | 🔓 |
| POST | `/login` | 🔓 |
| POST | `/refresh` | 🔓 |
| POST | `/logout` | 🔓 |
| GET | `/me` | 🔒 |
| POST | `/forgot-password` | 🔓 |
| GET | `/reset-password/:token` | 🔓 |
| POST | `/reset-password/:token` | 🔓 |
| GET | `/verify-email/:token` | 🔓 |
| POST | `/resend-verification` | 🔓 |
| GET | `/google` | 🔓 |
| GET | `/google/callback` | 🔓 |

### Transações — `/api/transacoes`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/filtros` | 🔒 Metadados (categorias, tags, tipos, recursos) |
| GET | `/resumo` | 🔒 Totais receitas/despesas/saldo no período |
| GET | `/` | 🔒 Lista paginada com filtros |
| POST | `/` | 🔒 Criar |
| PATCH | `/:id` | 🔒 Editar |
| DELETE | `/:id` | 🔒 Excluir (`?excluirFuturas=true` para recorrentes) |

### Categorias — `/api/categorias`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/` | 🔒 Listar do usuário (`?tipo=RECEITA\|DESPESA` opcional) |

### Tags — `/api/tags`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/` | 🔒 |
| POST | `/` | 🔒 Criar tag (usado pelo formulário de transações) |

### Vale Transporte — `/api/transporte`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/saldo` | 🔒 Resumo do mês (`?periodo=YYYY-MM`) |
| GET | `/vendas` | 🔒 Histórico de vendas paginado |
| POST | `/vendas` | 🔒 Registrar venda (+ receita DINHEIRO RN-041) |
| GET | `/usos` | 🔒 Histórico de usos paginado |
| POST | `/usos` | 🔒 Registrar uso de passagens |

Acesso restrito a `modoUso` **ESTAGIARIO** ou **CLT** (403 para PJ / Pessoa Física).

### Orçamento — `/api/orcamentos`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/status` | 🔒 Resumo do mês (`?mes=YYYY-MM`) |
| GET | `/` | 🔒 Lista limites + gastos por categoria |
| POST | `/` | 🔒 Salvar/atualizar limites em lote |
| POST | `/copiar` | 🔒 Copiar limites do mês anterior |
| DELETE | `/:id` | 🔒 Remover limite de uma categoria |

### Notificações — `/api/notificacoes`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/contador` | 🔒 Quantidade de não lidas |
| GET | `/` | 🔒 Lista paginada |
| PATCH | `/:id/marcar-lida` | 🔒 Marcar uma como lida |
| PATCH | `/marcar-todas-lidas` | 🔒 Marcar todas como lidas |

Tipos ativos no job de alertas: `ALERTA_ORCAMENTO` (80%) e `ORCAMENTO_ESTOURADO`.

### Lembretes — `/api/lembretes`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/` | 🔒 Lista do mês (`?mes=YYYY-MM`) |
| POST | `/` | 🔒 Criar |
| PATCH | `/:id` | 🔒 Editar |
| POST | `/:id/pagar` | 🔒 Marcar como pago |
| DELETE | `/:id` | 🔒 Excluir |

### Calendário — `/api/calendario`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/mes` | 🔒 Visão mensal (transações + lembretes + insights) |
| GET | `/dia` | 🔒 Detalhe de um dia (`?data=YYYY-MM-DD`) |
| GET | `/google/status` | 🔒 Status da integração (inclui e-mail da conta Google) |
| GET | `/google/url` | 🔒 URL de autorização OAuth |
| GET | `/google/callback` | 🔓 Callback OAuth |
| POST | `/google/desconectar` | 🔒 Revogar integração |
| GET | `/google/sync/pendentes` | 🔒 Lembretes pendentes de sync |
| POST | `/google/sync` | 🔒 Sincronizar lembretes com Google Calendar |

---

## 💳 Transações — detalhes

**Query params (listagem e resumo):**

- `periodo` — `YYYY-MM`
- `categoria` — UUID
- `tipo` — `TODOS` | `RECEITA` | `DESPESA`
- `recurso` — `TODOS` | `DINHEIRO` | `VA` | `VR` | `VT`
- `busca` — descrição ou nome de tag
- `pagina`, `limite` — paginação (listagem)

**Headers de paginação:** `x-total-count`, `x-total-pages`, `x-current-page`

**Categorias padrão:** criadas no registro a partir de `constants/defaultCategories.js` (RN-165).

**Recorrência:** job `jobs/recurringTransactions.js` gera lançamentos conforme regra.

---

## 📊 Orçamento — detalhes

- Limite único por `(usuarioId, categoriaId, mesReferencia)`
- Gastos calculados a partir das transações de despesa do período
- Job `jobs/budgetAlertJob.js` verifica limites e cria notificações (`ALERTA_ORCAMENTO`, `ORCAMENTO_ESTOURADO`)
- Agendamento em `server.js`: a cada **20 min** (`*/20 * * * *`)

---

## 🔔 Notificações — detalhes

- Persistidas em `notificacoes` com `tipo`, `titulo`, `mensagem`, `linkAcao`, `metadados`
- `linkAcao` usado pelo frontend para navegação ao clicar em **Ver**
- Contador e listagem filtram por usuário autenticado

---

## 📅 Lembretes e Calendário — detalhes

- Lembretes com categoria (`CategoriaLembrete`), valor opcional, antecedência e flag `pago`
- Integração Google Calendar: tokens em `ConfiguracaoUsuario.tokensGoogle`, e-mail exibido em `googleCalendarEmail`
- Sync cria/atualiza eventos no calendário dedicado do Pulso (`googleCalendarId`)
- Visão mensal agrega transações, lembretes e cards de insight (variação vs mês anterior)
- **Pendente:** integração com IA na tela do calendário (análises/sugestões via Gemini)

---

## 🔐 Autenticação

- Access token (curta duração) + refresh token (rotativo)
- Senha com bcrypt (salt 12)
- Conta email exige verificação antes do login
- Google OAuth cria ou vincula usuário existente

---

## ⚙️ Regras de negócio (transações)

- Valor obrigatório e > 0
- Categoria e recurso obrigatórios
- Validação cruzada recurso × categoria (VA, VR, VT) — backend e frontend
- VT **não** pode ser usado em Alimentação
- VT só em categoria Transporte (despesas)
- VR só em Alimentação; VA em Alimentação ou Compras

Implementação: `utils/recursoCategoriaRules.js`, `services/transactionService.js`

---

## 🌱 Seed de desenvolvimento

```bash
npm run db:seed
```

Cria usuário de exemplo, categorias padrão e transações de demo (ver `prisma/seed.js`).

---

## ▶️ Como rodar

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed    # opcional
npm run dev
```

Servidor: `http://localhost:3333`

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Nodemon |
| `npm start` | Produção |
| `npm test` | Jest |
| `npm run db:generate` | Prisma client |
| `npm run db:migrate` | Migrations |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed dev |

---

## 🔑 Variáveis de ambiente

Copie `.env.example`. Principais:

```env
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3333/api/auth/google/callback
GOOGLE_CALENDAR_CALLBACK_URL=http://localhost:3333/api/calendario/google/callback
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

---

## ⚠️ Padrão de erros

```json
{
  "status": "error",
  "message": "Descrição clara do que aconteceu"
}
```

| Código | Situação |
|--------|----------|
| 400 | Dados inválidos ou regra de negócio |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 409 | Conflito (ex.: email duplicado) |
| 429 | Rate limit |
| 500 | Erro interno |

---

## 🗺️ Roadmap (não implementado)

Módulos ainda planejados (metas, viagens, insights, gamificação, Swagger, etc.) fazem parte do **plano de produto** (`.github/plans/cards/`), mas **ainda não têm routes/controllers/services** no código.

Quando cada epic for implementado, esta seção deve migrar para [Rotas implementadas](#-rotas-implementadas).

**Referência de modelo de dados completo:** `prisma/schema.prisma` e `Documents/Database.md`.
