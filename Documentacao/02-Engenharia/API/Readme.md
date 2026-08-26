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
| **Orçamento mensal** (limites, cópia, alertas) | ✅ |
| **Notificações** (listagem, contador, marcar lida) | ✅ |
| **Lembretes** (CRUD, marcar pago) | ✅ |
| **Calendário** (visão mês/dia, Google Calendar) | 🟡 Parcial — integração com IA pendente |
| Job transações recorrentes | ✅ |
| Job alertas de orçamento | ✅ |
| **Dívidas** (CRUD, pagamentos, resumo, alertas) | ✅ |
| **Metas** (CRUD, aportes, resumo, pausar/concluir) | ✅ |
| **Viagens** (CRUD, despesas, observações, destinos, passagens) | ✅ |
| **Moedas** (cotações AwesomeAPI, favoritas, conversor) | ✅ |
| GeoNames / Duffel / Amadeus (passagens) | 🟡 Opcional — estimativas sazonais sem API |
| **Dashboard** (`GET /dashboard`) | ✅ |
| **Importação** (OFX/CSV/XLSX/PDF → preview → confirmar) | 🟡 Core entregue; RF-159 aprendizado pendente |
| **Planejamento de compra** | ✅ |
| **Divisão de despesas** | ✅ |
| **Grupos** (CRUD, convite, membros, viagem, metas, chat Socket.IO) | 🟡 Premium — ver gaps menores |
| Insights, chatbot | 🔜 Schema / parcial |
| Planos Free/Premium | ✅ Gate Premium em grupos |
| RabbitMQ (alerts + reminders + emails) | ✅ Opcional — fallback modo direto |

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
| node-cron | Jobs (recorrência, cleanup tokens, alertas) |
| amqplib / RabbitMQ | Filas `pulso.alerts`, `pulso.reminders`, `pulso.emails` (TI5) |
| Socket.IO | Chat de grupos em tempo real |
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
    │   ├── index.js
    │   ├── authRoutes.js
    │   ├── transactionRoutes.js
    │   ├── categoryRoutes.js
    │   ├── tagRoutes.js
│   ├── budgetRoutes.js
│   ├── notificationRoutes.js
│   ├── reminderRoutes.js
│   ├── calendarRoutes.js
│   ├── debtRoutes.js
│   ├── metaRoutes.js
│   ├── viagemRoutes.js
│   ├── moedaRoutes.js
│   ├── grupoRoutes.js
│   ├── purchasePlanningRoutes.js
│   ├── expenseSplitRoutes.js
│   ├── dashboardRoutes.js
│   ├── importRoutes.js
│   ├── syncRoutes.js
│   └── cronRoutes.js
    ├── controllers/
    ├── services/        (+ importService, dashboardService, …)
    ├── repositories/
    ├── messaging/       rabbit.js, jobBridge.js (alerts + reminders)
    ├── parsers/         ofx, csv, xlsx, pdf (+ Gemini)
    ├── providers/       email, geonames, duffel, amadeus (+ templates)
    ├── schemas/
    ├── constants/       defaultCategories, tripSeasonalPricing, …
    ├── utils/           transactionMapper, importHashUtils, …
    └── jobs/            recurringTransactions, tokenCleanupJob, budgetAlertJob, …
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

### Dashboard — `/api/dashboard`

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/` | 🔒 Resumo: saldos por recurso, gráficos, alertas, metas, saúde financeira |

### Importação — `/api/importacoes`

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/analisar` | 🔒 Upload + parse (OFX/CSV/XLSX/PDF) → preview com dedupe e categorias sugeridas |
| POST | `/confirmar` | 🔒 Gravação em lote (+ ajuste de saldo opcional) |

Multipart via `statementImportUploadMiddleware`. PDF usa `GEMINI_API_KEY_PDF`.

### Planejamento de compra — `/api/planejamento-compra`

| Método | Rota | Acesso |
|--------|------|--------|
| CRUD + histórico | ver `purchasePlanningRoutes.js` | 🔒 |

### Divisão de despesas — `/api/divisoes`

Ver seção [Divisão de Despesas](#-divisão-de-despesas--detalhes) abaixo.

---

### Dívidas — `/api/dividas`

CRUD de dívidas/empréstimos, pagamentos parciais, resumo consolidado, jobs de alerta (`DIVIDA_COBRANCA`) e limpeza de quitadas.

### Metas — `/api/metas`

CRUD, aportes, resumo, filtros por status. Notificação `META_ATINGIDA` ao concluir/atingir meta.

### Viagens — `/api/viagens`

CRUD, despesas, observações, origens, busca de destinos (GeoNames + catálogo), média de passagem (avião/ônibus/trem), cotação de moedas por viagem.

Integrações opcionais: `GEONAMES_USERNAME`, `DUFFEL_ACCESS_TOKEN`, `AMADEUS_*` — ver `.env.example`.

### Moedas — `/api/moedas`

Catálogo, cotações ao vivo (AwesomeAPI), histórico, conversor e moedas favoritas do usuário.

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

Sessão JWT + refresh rotativo (RN-134–136). Detalhes de persistência: [Documents/Database.md](./Database.md#-tokenrenovacao).

| Aspecto | Implementação |
|---------|-----------------|
| Access token | JWT ~15 min — cookie `pulso_access` (`httpOnly`) ou header `Authorization` |
| Refresh token | Opaco 96 hex — cookie `pulso_refresh` (`httpOnly`); no banco em `tokens_renovacao` (texto, lookup direto) |
| Rotação | Single-use: cada refresh revoga o anterior e emite novo |
| Reuse | Refresh revogado reapresentado → logout global (`revokeAllRefreshTokensForUser`) |
| Front | `withCredentials: true` em `api.js`; mutex no interceptor evita refresh concorrente |
| OAuth Google | Exchange via `POST /auth/oauth/exchange` após redirect (`?exchange=`) |
| Senha | bcrypt (salt 12); verificação de email obrigatória antes do login |
| Rate limit | Por rota em `authRateLimit.js` (login, register, refresh, reset, etc.) |

Cookies: `utils/authCookies.js` · Lógica: `services/authService.js` · Repositório: `repositories/authRepository.js`

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
GOOGLE_TOKENS_ENCRYPTION_KEY=...  # hex 64 chars — openssl rand -hex 32 (criptografia AES-256-GCM dos tokens Google em repouso)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
CRON_SECRET=...                    # produção / Vercel Cron
GEONAMES_USERNAME=...              # opcional — busca global de destinos
DUFFEL_ACCESS_TOKEN=...            # opcional — cotação aérea ao vivo
GEMINI_API_KEY_PDF=...             # opcional — importação de extratos em PDF (Gemini)
GEMINI_PDF_MODEL=gemini-3.1-flash-lite  # opcional — modelo Gemini para PDF
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

## 👥 Grupos — detalhes

Prefixo: **`/api/grupos`** (todas 🔒).

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/preview` | Prévia por código |
| POST | `/entrar` | Entrar no grupo |
| GET/POST | `/` | Listar / criar |
| GET/PATCH/DELETE | `/:id` | Detalhe / editar / excluir |
| POST | `/:id/sair` | Sair |
| DELETE | `/:id/membros/:membroId` | Remover membro |
| PATCH | `/:id/membros/:membroId` | Alterar papel |
| POST | `/:id/viagem` | Vincular viagem |
| GET | `/:id/viagem/media-passagem` | Estimativas de transporte |
| POST/PATCH/DELETE | `/:id/viagem/despesas[/:despesaId]` | Pretensões |
| POST | `/:id/metas` | Criar metas (lote) |
| POST | `/:id/metas/:metaId/aportes` | Aporte |
| POST | `/:id/mensagens` | Chat (também em tempo real via Socket.IO) |

**Premium:** rotas de grupos exigem plano `PREMIUM`. Gaps restantes: integração RF-095 ↔ `/expense-split`. Ver [Modulos/Grupos.md](../Modulos/Grupos.md).

---

## 🐇 RabbitMQ + Socket.IO (TI5)

| Recurso | Detalhe |
|---------|---------|
| Filas | `pulso.alerts` (orçamento, dívidas) · `pulso.reminders` (lembretes) · `pulso.emails` (verificação / reset) |
| Código | `src/messaging/rabbit.js`, `src/messaging/jobBridge.js` |
| Fallback | Sem `RABBITMQ_URL`, jobs executam em modo direto |
| Socket.IO | Path `/api/socket.io` — chat de grupos |
| Deploy | API **long-running** — [TI5-Hospedagem.md](../Deploy/TI5-Hospedagem.md) |

---

## 💸 Divisão de Despesas — detalhes

Prefixo: **`/api/divisoes`** (todas 🔒; página do frontend em `/expense-split`). Participantes por nome livre (mesmo padrão de Dívidas Pessoais — sem exigir conta Pulso).

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/resumo` | Saldo consolidado (quanto me devem vs quanto eu devo) |
| GET | `/ativas` | Divisões ativas |
| GET | `/historico` | Divisões quitadas (paginado) |
| POST | `/` | Criar divisão (igual ou personalizada) |
| PATCH | `/:id` | Editar — **bloqueado** se já houver pagamento manual registrado ou a divisão estiver quitada |
| PATCH | `/:id/participantes/:participanteId/pagar` | Marcar participante como pago |
| PATCH | `/:id/participantes/:participanteId/despagar` | Desfazer pagamento |
| POST | `/:id/lembrete` | Criar lembrete de cobrança (RF-120) para 1+ participantes pendentes |
| DELETE | `/:id` | Excluir — bloqueado se quitada; remove os lembretes de cobrança vinculados |

**Regras de negócio:** rateio em aritmética de centavos determinística (RNF-016); nomes de participantes únicos (case-insensitive) e diferentes de "Você"; divisão some automaticamente para "Quitada" quando todos pagam (e reabre se algum pagamento for desfeito); lembrete de cobrança é cancelado automaticamente quando todos os participantes que ele cobre já pagaram, e um mesmo participante não pode ter dois lembretes ativos simultâneos.

**Limpeza automática:** job diário remove divisões quitadas há mais de 180 dias (`jobs/expenseSplitCleanupJob.js`).

Implementação: `controllers/expenseSplitController.js`, `services/expenseSplitService.js`, `repositories/expenseSplitRepository.js`.

---

## 🗺️ Roadmap (não implementado)

Módulos parciais hoje: chatbot, insights IA. **Grupos** e **Divisão de Despesas:** API/UI principais entregues; integração do toggle de rateio (RF-095) ainda pendente. **Importação:** core entregue; falta RF-159 (aprendizado).

**Próximos passos sugeridos:** ver [Analise-Produto.md](../../01-Produto/Analise-Produto.md).

Epics: [`.github/plans/cards/`](../../../.github/plans/cards/) · Pack: [`.github/INDEX.md`](../../../.github/INDEX.md)
