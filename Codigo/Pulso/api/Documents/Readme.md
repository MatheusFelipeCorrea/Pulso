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
| **Importação** (OFX/CSV/XLSX/PDF → preview → confirmar) | 🟡 Core entregue; RF-138 aprendizado pendente |
| **Planejamento de compra** | ✅ |
| **Divisão de despesas** | ✅ |
| **Grupos** (CRUD, convite, membros, viagem, metas, chat Socket.IO) | 🟡 Premium — ver gaps menores |
| Insights, chatbot | 🔜 Schema / parcial |
| Planos Free/Premium | ✅ Gate Premium em grupos, viagens e sync Google Calendar |
| RabbitMQ (emails; filas alerts/reminders reservadas) | ✅ Opcional — fail-soft (cai o broker → SMTP/cron direto) |

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
    ├── messaging/       rabbit.js, emailBridge.js, jobBridge.js (emails + fail-soft)
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
| PATCH | `/me/plano` | 🔒 Troca Free/Premium (sem billing — seed/admin/demo) |
| DELETE | `/me` | 🔒 Apagar conta — body `{ "confirmacao": "APAGAR" }` (cascade dos dados do usuário) |
| POST | `/forgot-password` | 🔓 |
| GET | `/reset-password/:token` | 🔓 |
| POST | `/reset-password/:token` | 🔓 |
| GET | `/verify-email/:token` | 🔓 |
| POST | `/resend-verification` | 🔓 |
| GET | `/google` | 🔓 |
| GET | `/google/callback` | 🔓 |
| POST | `/google/mobile` | 🔓 ID token nativo (Flutter) |
| POST | `/oauth/exchange` | 🔓 Troca do código `exchange` pós-redirect Google |

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
- Validação cruzada recurso × categoria (VA / VR × `grupoBeneficio`) — backend e frontend
- Recurso **VT** é rejeitado na criação/edição de transações (fora do escopo TI5)
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

**Premium:** rotas de grupos exigem plano `PREMIUM`. Gaps restantes: integração RF-091 ↔ `/expense-split`. Ver [Modulos/Grupos.md](../Modulos/Grupos.md).

---

## 🐇 RabbitMQ + Socket.IO (TI5)

| Recurso | Detalhe |
|---------|---------|
| Filas | `pulso.emails` (verificação / reset) · `pulso.alerts` / `pulso.reminders` (reservadas, jobs ainda não no repo) |
| Código | `src/messaging/rabbit.js`, `src/messaging/emailBridge.js`, `src/messaging/jobBridge.js` |
| Credencial | Só `RABBITMQ_URL` (ex. `amqp://pulso:pulso@localhost:5672` ou URL `amqps://` do provedor) |
| Fail-soft | Sem URL, broker caído, publish falho ou Vercel: emails SMTP na hora |
| Socket.IO | Path `/api/socket.io` — chat de grupos |
| Deploy | API **long-running** para consumers; Vercel ignora o broker |

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
| POST | `/:id/lembrete` | Criar lembrete de cobrança (RF-111) para 1+ participantes pendentes |
| DELETE | `/:id` | Excluir — bloqueado se quitada; remove os lembretes de cobrança vinculados |

**Regras de negócio:** rateio em aritmética de centavos determinística (RNF-016); nomes de participantes únicos (case-insensitive) e diferentes de "Você"; divisão some automaticamente para "Quitada" quando todos pagam (e reabre se algum pagamento for desfeito); lembrete de cobrança é cancelado automaticamente quando todos os participantes que ele cobre já pagaram, e um mesmo participante não pode ter dois lembretes ativos simultâneos.

**Limpeza automática:** job diário remove divisões quitadas há mais de 180 dias (`jobs/expenseSplitCleanupJob.js`).

Implementação: `controllers/expenseSplitController.js`, `services/expenseSplitService.js`, `repositories/expenseSplitRepository.js`.

---

## 🗺️ Roadmap (não implementado)

Módulos parciais hoje: chatbot, insights IA. **Grupos** e **Divisão de Despesas:** API/UI principais entregues; integração do toggle de rateio (RF-091) ainda pendente. **Importação:** core entregue; falta RF-138 (aprendizado).

**Próximos passos sugeridos:** ver [Analise-Produto.md](../../01-Produto/Analise-Produto.md).

Epics: [`.github/plans/cards/`](../../../.github/plans/cards/) · Pack: [`.github/INDEX.md`](../../../.github/INDEX.md)



# 🗄️ Pulso — Dicionário de Dados

Documento de referência das entidades do banco de dados do **Pulso**.

> **Fonte de verdade:** `Codigo/Pulso/api/prisma/schema.prisma`  
> **Última revisão:** ago/2026 — alinhado ao schema Prisma 5.x (PostgreSQL / Neon)

---

## 📊 Estado do schema vs API

| Camada | Situação |
|--------|----------|
| **Prisma** | Modelos no schema · documentados abaixo |
| **API em uso** | Auth, transações, categorias, tags, orçamento, notificações, lembretes, calendário, dívidas, metas, viagens, moedas, planejamento de compra, grupos (Premium + Socket.IO), divisão de despesas, dashboard, importação |
| **Pendente na API** | IA (chat/insights) completo |
| **TI5** | Planos Free/Premium · RabbitMQ (alerts + reminders + emails) · Socket.IO |

Tabelas físicas usam **snake_case** via `@@map` (ex.: `usuarios`, `transacoes`, `configuracoes_usuario`).

> **Fora do escopo produto TI5:** tabelas/campos legados de gestão de vale-transporte (`VendaVt`, `UsoVt`), gamificação (`Sequencia`, `Conquista`, …) e relatórios produto — podem existir no schema histórico; não são módulos do produto documentado.

---

## 📑 Sumário

- [👤 Usuario](#-usuario)
- [⚙️ ConfiguracaoUsuario](#️-configuracaousuario)
- [🔑 TokenRenovacao](#-tokenrenovacao)
- [🏷️ Categoria](#️-categoria)
- [💳 Transacao](#-transacao)
- [🏷️ Tag](#️-tag)
- [🔗 TransacaoTag](#-transacaotag)
- [🎯 Meta](#-meta)
- [💰 AporteMeta](#-aportemeta)
- [✈️ Viagem](#️-viagem)
- [🧳 DespesaViagem](#-despesaviagem)
- [💱 MoedaFavorita](#-moedafavorita)
- [📅 Lembrete](#-lembrete)
- [🛒 ItemPlanejamentoCompra](#-itemplanejamentocompra)
- [🚌 VendaVt / UsoVt (legado)](#-vendavt--usovt-legado-schema)
- [🔥 Sequencia / Conquistas (legado)](#-sequencia--conquista--conquistausuario--desafio-mensal-legado-schema)
- [💬 MensagemChat](#-mensagemchat)
- [📊 HistoricoScore](#-historicoscore)
- [👥 Grupo](#-grupo)
- [👤 MembroGrupo](#-membrogrupo)
- [✈️ ViagemGrupo](#️-viagemgrupo)
- [🧳 DespesaViagemGrupo](#-despesaviagemgrupo)
- [🎯 MetaGrupo](#-metagrupo)
- [💵 AporteMetaGrupo](#-aportemetagrupo)
- [💬 MensagemChatGrupo](#-mensagemchatgrupo)
- [💸 Divisao](#-divisao)
- [🙋 DivisaoParticipante](#-divisaoparticipante)
- [📊 Orcamento](#-orcamento)
- [🔔 Notificacao](#-notificacao)
- [📊 Resumo Geral](#-resumo-geral)
- [🎨 Enums Disponíveis](#-enums-disponíveis)
- [🔗 Relações Importantes](#-relações-importantes)

---

## 👤 Usuario

Dados principais da conta do usuário. Tabela: `usuarios`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String (cuid) | ✅ | Identificador único |
| `nome` | VarChar(120) | ✅ | Nome completo |
| `email` | VarChar(180) | ✅ | Email único |
| `senhaHash` | String | ❌ | Senha hasheada (bcrypt). Nulo se Google |
| `urlAvatar` | String | ❌ | URL da foto de perfil |
| `provedorAuth` | Enum | ✅ | `EMAIL` ou `GOOGLE` |
| `googleId` | String | ❌ | ID único do Google (se OAuth) |
| `verificado` | Boolean | ✅ | Email já confirmado? |
| `tokenVerificacaoEmail` | VarChar(64) | ❌ | Token de confirmação de email |
| `tokenVerificacaoExpira` | DateTime | ❌ | Expiração do token de verificação |
| `tokenResetSenha` | VarChar(64) | ❌ | Token de recuperação de senha |
| `tokenResetExpira` | DateTime | ❌ | Expiração do token de reset |
| `criadoEm` | DateTime | ✅ | Data de cadastro |
| `atualizadoEm` | DateTime | ✅ | Última atualização |

---

## ⚙️ ConfiguracaoUsuario

Preferências e receitas fixas recorrentes do usuário. Tabela: `configuracoes_usuario`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK único) | Dono das configs |
| `valorSalario` | Decimal(12,2) | Valor mensal do salário |
| `diaSalario` | Int (1-31) | Dia do mês em que cai |
| `valorVa` | Decimal(12,2) | Valor do Vale Alimentação |
| `diaVa` | Int | Dia em que cai o VA |
| `valorVr` | Decimal(12,2) | Valor do Vale Refeição |
| `diaVr` | Int | Dia em que cai o VR |
| `valorVt` | Decimal(12,2) | Valor de benefício VT (tipo de recurso) |
| `diaVt` | Int | Dia em que cai o VT |
| `tema` | Enum | `CLARO` ou `ESCURO` |
| `plano` | Enum | `FREE` ou `PREMIUM` (TI5) |
| `googleCalendarAtivo` | Boolean | Integração com Google Calendar? |
| `googleCalendarId` | String | ID do calendário dedicado no Google |
| `googleCalendarEmail` | VarChar(180) | E-mail da conta Google conectada (OAuth) |
| `tokensGoogle` | Json | Tokens OAuth do Google (criptografados) |
| `limiteGastos` | Decimal(12,2) | Limite de gastos pra alerta |
| `rendaMensalPlanejada` | Decimal(12,2) | Renda mensal planejada (orçamento) |
| `modoUso` | Enum | `ESTAGIARIO`, `CLT`, `PJ`, `PESSOA_FISICA` (RF-073) |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 🔑 TokenRenovacao

Controle de sessões ativas (refresh tokens opacos). Tabela: `tokens_renovacao`

### Arquitetura de sessão (RN-134, RN-135, RN-136)

| Camada | Comportamento |
|--------|----------------|
| **Cliente (browser)** | Cookies `pulso_access` (JWT, ~15 min) e `pulso_refresh` (`httpOnly`, `Secure` em prod, `SameSite=none` prod / `lax` dev, `path=/api`). Front usa `withCredentials` — **não** persiste tokens em `localStorage`. Implementação: `utils/authCookies.js`. |
| **Transporte alternativo** | Header `Authorization: Bearer` (access) ou body `refreshToken` em `/auth/refresh` e `/auth/logout` — fallback para scripts/OAuth exchange; fluxo normal do SPA é só cookie. |
| **Banco (`tokens_renovacao`)** | Valor opaco do refresh (96 hex chars, `crypto.randomBytes(48)`) armazenado **em texto** em `token` — lookup por igualdade exata, como ID de sessão. **Não é hasheado** (diferente de senha). Mitigação: cookie `httpOnly` + rotação single-use + revogação em reuse. |
| **Rotação** | Cada `POST /auth/refresh` revoga o token apresentado e emite outro, mantendo `expiraEm` original da sessão. |
| **Reuse detectado** | Reapresentar refresh já revogado → `revokeAllRefreshTokensForUser` (logout global da sessão). |
| **Logout** | `POST /auth/logout` revoga o refresh atual e limpa cookies. |
| **Troca de senha** | Invalida todos os refresh tokens do usuário (RN-136). |

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `token` | String único | Valor opaco do refresh (texto no banco — ver tabela acima) |
| `expiraEm` | DateTime | 7 dias (padrão) ou 30 dias com "Lembrar-me" no login |
| `revogado` | Boolean | Se foi invalidado (rotação, logout ou reuse) |
| `criadoEm` | DateTime | Criação |
| `revogadoEm` | DateTime | Quando foi revogado |

> **Endurecimento futuro (opcional):** persistir apenas hash (ex.: SHA-256) do refresh no banco exigiria alterar `authRepository.findRefreshToken` / rotação — hoje não implementado; cookie `httpOnly` + rotação cobrem o risco principal para MVP.

---

## 🏷️ Categoria

Categorias de receitas/despesas por usuário. Tabela: `categorias`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `nome` | VarChar(60) | ✅ | Ex: "Alimentação" |
| `icone` | VarChar(40) | ❌ | Nome Lucide (ex: `UtensilsCrossed`, `Bus`) |
| `cor` | VarChar(7) | ✅ | Hex `#RRGGBB` (default `#7C3AED`) |
| `tipo` | Enum | ✅ | `RECEITA` ou `DESPESA` |
| `padrao` | Boolean | ✅ | `true` = categoria do catálogo inicial (RN-165) |
| `grupoBeneficio` | Enum? | ❌ | `ALIMENTACAO`, `COMPRAS`, `TRANSPORTE` — compatibilidade VA/VR/VT (RF-NOVO-C2); null = sem grupo |
| `usuarioId` | String | ❌ | FK do dono (null permitido no schema; seed usa id do usuário) |
| `criadoEm` | DateTime | ✅ | Timestamp |

**Índice único:** `(usuarioId, nome, tipo)`

---

## 💳 Transacao

Receitas e despesas. Tabela: `transacoes`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `categoriaId` | String (FK) | ❌ | Categoria vinculada — nula em transferências (RF-027) |
| `tipo` | Enum | ✅ | `RECEITA`, `DESPESA` ou `TRANSFERENCIA` |
| `recurso` | Enum | ✅ | `DINHEIRO`, `VA`, `VR`, `VT`, `POUPANCA` |
| `recursoDestino` | Enum | ❌ | Recurso de destino — usado apenas quando `tipo = TRANSFERENCIA` (RF-027) |
| `valor` | Decimal(12,2) | ✅ | Valor (sempre > 0) |
| `descricao` | VarChar(255) | ❌ | Descrição livre |
| `data` | DateTime | ✅ | Data da transação |
| `recorrente` | Boolean | ✅ | Se repete periodicamente |
| `regraRecorrencia` | String | ❌ | JSON com frequência, `ateQuando`, `dataFim` |
| `paiId` | String | ❌ | Transação “mãe” se gerada por recorrência |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Regras de negócio (validação recurso × categoria):**
- ❌ Alimentação **não** pode usar `VT`
- ❌ `VT` só com categoria Transporte (despesas)
- ❌ `VR` só com Alimentação; `VA` com Alimentação ou Compras
- ✅ Valor sempre > 0
- **Transferência (RF-027):** `tipo = TRANSFERENCIA` exige `recursoDestino` diferente de `recurso` e não tem `categoriaId`; excluída dos totais de receita/despesa (`calcularAgregados`/`montarResumo`) e dos marcadores do Calendário
- **Sugestão de categoria (RF-028):** endpoint `GET /transacoes/sugestao-categoria` compara a descrição informada com o histórico do usuário (mesmo `tipo`) via similaridade de bigramas (`categorySuggestionUtils.js`), sem persistir nada

---

## 🏷️ Tag

Etiquetas do usuário para classificar transações. Tabela: `tags`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `nome` | VarChar(40) | Nome da tag (único por usuário) |
| `icone` | VarChar(40) | Nome Lucide (default `Tag`) |
| `cor` | VarChar(7) | Hex `#RRGGBB` (default `#71717A`) |
| `usuarioId` | String (FK) | Dono |

---

## 🔗 TransacaoTag

Relação N:N entre Transação ↔ Tags. Tabela: `transacoes_tags`

| Campo | Descrição |
|---|---|
| `transacaoId` | FK da transação |
| `tagId` | FK da tag |

---

## 🎯 Meta

Objetivos de economia do usuário.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `nome` | VarChar(100) | ✅ | Ex: "Viagem Japão" |
| `valorAlvo` | Decimal(12,2) | ✅ | Valor a atingir |
| `valorAtual` | Decimal(12,2) | ✅ | Já guardado (default 0) |
| `prazo` | DateTime | ✅ | Data limite |
| `tipo` | Enum | ✅ | `CURTO_PRAZO` ou `LONGO_PRAZO` |
| `status` | Enum | ✅ | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `prioridade` | Enum | ❌ | `ALTA`, `MEDIA`, `BAIXA` |
| `descricao` | VarChar(500) | ❌ | Descrição opcional |
| `concluidaEm` | DateTime | ❌ | Data da conclusão |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 💰 AporteMeta

Histórico de aportes em cada meta.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `metaId` | String (FK) | Meta vinculada |
| `valor` | Decimal(12,2) | Valor do aporte |
| `data` | DateTime | Data do aporte |
| `criadoEm` | DateTime | Timestamp |

---

## ✈️ Viagem

Planejamento de viagens com orçamento.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `destino` | VarChar(120) | ✅ | Ex: "Tóquio" |
| `moeda` | VarChar(3) | ✅ | Código ISO (USD, JPY, EUR) |
| `dataPrevista` | DateTime | ✅ | Data prevista da viagem |
| `metaId` | String | ❌ | FK opcional — meta vinculada |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 🧳 DespesaViagem

Pretensões de gastos dentro da viagem.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `viagemId` | String (FK) | Viagem |
| `categoria` | Enum | `TRANSPORTE`, `HOSPEDAGEM`, `ALIMENTACAO`, `PASSEIOS`, `COMPRAS`, `OUTROS` |
| `categoriaId` | String | FK opcional — vincular a Categoria do usuário |
| `descricao` | VarChar(255) | Descrição |
| `valorEstimado` | Decimal(12,2) | Valor estimado na moeda local |
| `criadoEm` | DateTime | Timestamp |

---

## 💱 MoedaFavorita

Moedas favoritas do usuário para acesso rápido.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `codigo` | VarChar(3) | Código ISO (USD, EUR, ARS) |
| `criadoEm` | DateTime | Timestamp |

---

## 📅 Lembrete

Lembretes de contas a pagar (sincronizáveis com Google Calendar).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `titulo` | VarChar(120) | ✅ | Título do lembrete |
| `valor` | Decimal(12,2) | ❌ | Valor opcional |
| `dataVencimento` | DateTime | ✅ | Data de vencimento |
| `horaLembrete` | String | ✅ | Horário (`HH:MM`, padrão `10:00`) usado no evento sincronizado com o Google Agenda |
| `antecedencia` | Enum | ✅ | `NO_DIA`, `UM_DIA`, `TRES_DIAS`, `CINCO_DIAS`, `UMA_SEMANA` |
| `categoria` | Enum | ✅ | `CategoriaLembrete` (ex.: `ALUGUEL`, `LUZ`, `FATURA_CARTAO`, `OUTRO`) |
| `pago` | Boolean | ✅ | Já foi pago? |
| `googleEventId` | String | ❌ | ID do evento no Calendar |
| `sincronizado` | Boolean | ✅ | Sincronizado com Google? |
| `repetirMensal` | Boolean | ✅ | Recria o lembrete automaticamente todo mês |
| `diaRecorrencia` | Int | ❌ | Dia do mês (1–28) para a recorrência |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 🛒 ItemPlanejamentoCompra

Itens de uma lista de desejos, com simulação de parcelamento e vínculo opcional a uma meta. Tabela: `itens_planejamento_compra`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `nome` | VarChar(120) | ✅ | Nome do item desejado |
| `valorEstimado` | Decimal(12,2) | ✅ | Valor estimado do item |
| `prioridade` | Enum | ✅ | `Prioridade` (`ALTA`, `MEDIA`, `BAIXA`) |
| `categoria` | Enum | ✅ | `CategoriaItemCompra`, inferida automaticamente pelo nome (default `OUTROS`) |
| `observacoes` | VarChar(300) | ❌ | Notas livres |
| `linkProduto` | VarChar(500) | ❌ | Link da loja |
| `imagemUrl` | VarChar(2048) | ❌ | Imagem (upload próprio ou sugerida) |
| `simularParcelas` | Boolean | ✅ | Se deve simular parcelamento |
| `parcelas` | Int | ✅ | Quantidade de parcelas simuladas (padrão 12) |
| `metaId` | String (FK) | ❌ | Meta vinculada, opcional |
| `status` | Enum | ✅ | `StatusItemCompra` (`DESEJADO`, `COMPRADO`) |
| `compradoEm` | DateTime | ❌ | Quando foi marcado como comprado |
| `transacaoId` | String (FK, único) | ❌ | Transação gerada ao marcar "Comprei!" |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Regra de comprometimento (RN-090/RN-091):** `parcela ÷ renda_mensal × 100` — ≤20% saudável, 21–30% atenção, >30% arriscado.

---

## 🚌 VendaVt / UsoVt (legado schema)

> **Fora do escopo TI5.** Tabelas históricas (`VendaVt`, `UsoVt`); não há módulo de produto correspondente.

---

## 🔥 Sequencia / 🏆 Conquista / 🎖️ ConquistaUsuario / 🎲 DesafioMensal (legado schema)

> **Fora do escopo TI5.** Entidades históricas de engajamento; não fazem parte do produto documentado.

---

## 💬 MensagemChat

Histórico do chatbot Gemini.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `papel` | VarChar(20) | `user` ou `assistant` |
| `conteudo` | Text | Conteúdo da mensagem |
| `criadoEm` | DateTime | Timestamp |

---

## 📊 HistoricoScore

Evolução do score de saúde financeira.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `score` | Int (0-100) | Valor calculado |
| `detalhes` | Json | Breakdown do cálculo |
| `criadoEm` | DateTime | Timestamp |

**Faixas do score:**

| Faixa | Label | Indicador |
|---|---|---|
| 0-30 | Crítico | 🔴 |
| 31-50 | Alerta | 🟡 |
| 51-70 | Regular | 🔵 |
| 71-90 | Bom | 🟢 |
| 91-100 | Excelente | 🟣 |

---

## 👥 Grupo

Grupos para metas/viagens coletivas.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `nome` | VarChar(100) | ✅ | Nome do grupo |
| `descricao` | VarChar(500) | ❌ | Descrição |
| `codigoConvite` | String único | ✅ | Código/link de convite |
| `criadorId` | String (FK) | ✅ | Quem criou |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 👤 MembroGrupo

Relação N:N entre Usuários ↔ Grupos.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `usuarioId` | String (FK) | Membro |
| `papel` | Enum | `ADMIN` ou `MEMBRO` |
| `entrouEm` | DateTime | Quando entrou |

---

## ✈️ ViagemGrupo

Viagens planejadas pelo grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `destino` | VarChar(120) | Destino |
| `moeda` | VarChar(3) | Moeda local |
| `dataPrevista` | DateTime | Data prevista |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 🧳 DespesaViagemGrupo

Pretensões de cada membro na viagem do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `viagemGrupoId` | String (FK) | Viagem do grupo |
| `adicionadoPorId` | String (FK) | Quem adicionou |
| `categoria` | Enum | Mesma de DespesaViagem |
| `descricao` | VarChar(255) | Descrição |
| `valorEstimado` | Decimal(12,2) | Valor estimado |
| `criadoEm` | DateTime | Timestamp |

---

## 🎯 MetaGrupo

Metas coletivas do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `nome` | VarChar(100) | Nome |
| `valorAlvo` | Decimal(12,2) | Valor-alvo |
| `valorAtual` | Decimal(12,2) | Já guardado |
| `prazo` | DateTime | Prazo |
| `status` | Enum | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `descricao` | VarChar(500) | Descrição |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 💵 AporteMetaGrupo

Quem contribuiu e com quanto em cada meta do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `metaGrupoId` | String (FK) | Meta do grupo |
| `usuarioId` | String (FK) | Quem contribuiu |
| `valor` | Decimal(12,2) | Valor |
| `data` | DateTime | Data |
| `criadoEm` | DateTime | Timestamp |

---

## 💬 MensagemChatGrupo

Chat interno do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `usuarioId` | String (FK) | Autor |
| `conteudo` | Text | Mensagem |
| `criadoEm` | DateTime | Timestamp |

---

## 💸 Divisao

Despesa compartilhada com participantes por nome livre (sem exigir conta Pulso — mesmo padrão de Dívidas Pessoais). Tabela: `divisoes`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Organizador (dono do registro) |
| `titulo` | VarChar(120) | ✅ | Ex: "Jantar no Outback" |
| `valorTotal` | Decimal(12,2) | ✅ | Valor total da despesa |
| `tipo` | Enum | ✅ | `TipoRateioDivisao`: `IGUAL` ou `PERSONALIZADA` |
| `status` | Enum | ✅ | `StatusDivisao`: `ATIVA` ou `QUITADA` |
| `data` | Date | ✅ | Data da despesa |
| `icone` | VarChar(40) | ❌ | Ícone Lucide |
| `cor` | VarChar(20) | ❌ | Cor do card |
| `observacao` | VarChar(250) | ❌ | Notas livres |
| `quitadaEm` | DateTime | ❌ | Quando todos os participantes pagaram |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Regras:** rateio em aritmética de centavos determinística (RNF-016); passa para `QUITADA` automaticamente quando todos os participantes ficam `PAGO`, e reabre se algum pagamento for desfeito; edição de participantes/valores bloqueada se já houver pagamento manual registrado; exclusão bloqueada se quitada (limpeza automática após 180 dias via `expenseSplitCleanupJob`).

---

## 🙋 DivisaoParticipante

Cada pessoa envolvida em uma `Divisao`, incluindo o organizador (linha com `ehOrganizador = true`, exibida como "Você"). Tabela: `divisao_participantes`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `divisaoId` | String (FK) | ✅ | Divisão à qual pertence |
| `nome` | VarChar(120) | ✅ | Nome livre, único (case-insensitive) por divisão e diferente de "Você" |
| `valor` | Decimal(12,2) | ✅ | Parte do participante nesta divisão |
| `ehOrganizador` | Boolean | ✅ | `true` para a linha do próprio usuário dono |
| `pagouAConta` | Boolean | ✅ | Se foi quem adiantou o valor total |
| `status` | Enum | ✅ | `StatusParticipanteDivisao`: `PENDENTE` ou `PAGO` |
| `dataPagamento` | DateTime | ❌ | Quando foi marcado como pago |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Relação com Lembrete:** N:N (`divisaoParticipantes` ↔ `Lembrete.divisaoParticipantes`, tabela de junção `_DivisaoParticipanteToLembrete`, `ON DELETE CASCADE` nos dois lados) — um único lembrete de cobrança (RF-111) pode cobrir 1+ participantes pendentes. O lembrete é cancelado automaticamente quando todos os participantes que ele cobre já pagaram, e removido junto se a `Divisao` for excluída.

---

## 📊 Orcamento

Limite mensal por categoria de despesa. Tabela: `orcamentos`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `categoriaId` | String (FK) | Categoria de despesa |
| `mesReferencia` | Date | Primeiro dia do mês de referência |
| `limiteValor` | Decimal(12,2) | Valor máximo planejado |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

**Constraint:** único por `(usuarioId, categoriaId, mesReferencia)`.

---

## 🔔 Notificacao

Alertas in-app para o usuário. Tabela: `notificacoes`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Destinatário |
| `tipo` | Enum | `TipoNotificacao` (ex.: `ALERTA_ORCAMENTO`, `ORCAMENTO_ESTOURADO`) |
| `titulo` | VarChar(120) | Título exibido |
| `mensagem` | VarChar(500) | Corpo opcional |
| `lida` | Boolean | Já foi lida? |
| `linkAcao` | VarChar(255) | Rota de destino no frontend |
| `metadados` | Json | Dados extras (categoria, percentual, etc.) |
| `criadoEm` | DateTime | Timestamp |

---

## 📊 Resumo Geral

| # | Categoria | Entidades | Total |
|---|---|---|---|
| 1 | 👤 Usuário | Usuario, ConfiguracaoUsuario, TokenRenovacao | 3 |
| 2 | 💳 Financeiro | Categoria, Transacao, Tag, TransacaoTag | 4 |
| 3 | 🎯 Metas | Meta, AporteMeta | 2 |
| 4 | ✈️ Viagens | Viagem, DespesaViagem | 2 |
| 5 | 💱 Câmbio | MoedaFavorita | 1 |
| 6 | 📅 Lembretes | Lembrete | 1 |
| 7 | 📊 Orçamento & Alertas | Orcamento, Notificacao | 2 |
| 8 | 🤖 IA | MensagemChat, HistoricoScore | 2 |
| 9 | 👥 Grupos | Grupo, MembroGrupo, ViagemGrupo, DespesaViagemGrupo, MetaGrupo, AporteMetaGrupo, MensagemChatGrupo | 7 |
| 10 | 🛒 Planejamento de Compra | ItemPlanejamentoCompra | 1 |
| 11 | 💸 Divisão de Despesas | Divisao, DivisaoParticipante | 2 |
| — | 📦 Legado (fora TI5) | VendaVt, UsoVt, Sequencia, Conquista, ConquistaUsuario, DesafioMensal | 6 |

---

## 🎨 Enums Disponíveis

| Enum | Valores |
|---|---|
| `ProvedorAuth` | `EMAIL`, `GOOGLE` |
| `TipoTransacao` | `RECEITA`, `DESPESA`, `TRANSFERENCIA` |
| `TipoRecurso` | `DINHEIRO`, `VA`, `VR`, `VT`, `POUPANCA` |
| `StatusMeta` | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `TipoMeta` | `CURTO_PRAZO`, `LONGO_PRAZO` |
| `TipoCategoria` | `RECEITA`, `DESPESA` |
| `CategoriaDespesaViagem` | `TRANSPORTE`, `HOSPEDAGEM`, `ALIMENTACAO`, `PASSEIOS`, `COMPRAS`, `OUTROS` |
| `Tema` | `CLARO`, `ESCURO` |
| `AntecedenciaLembrete` | `NO_DIA`, `UM_DIA`, `TRES_DIAS`, `CINCO_DIAS`, `UMA_SEMANA` |
| `CategoriaItemCompra` | `ELETRONICOS`, `CASA_ELETRODOMESTICOS`, `VESTUARIO`, `VEICULO`, `ACESSORIOS`, `OUTROS` |
| `StatusItemCompra` | `DESEJADO`, `COMPRADO` |
| `PapelGrupo` | `ADMIN`, `MEMBRO` |
| `NivelFinanceiro` | `INICIANTE`, `CONSCIENTE`, `ESTRATEGISTA`, `INVESTIDOR` |
| `ModoUso` | `ESTAGIARIO`, `CLT`, `PJ`, `PESSOA_FISICA` |
| `Prioridade` | `ALTA`, `MEDIA`, `BAIXA` |
| `TipoRateioDivisao` | `IGUAL`, `PERSONALIZADA` |
| `StatusDivisao` | `ATIVA`, `QUITADA` |
| `StatusParticipanteDivisao` | `PENDENTE`, `PAGO` |
| `CategoriaLembrete` | `ALUGUEL`, `CONDOMINIO`, `IPTU`, `LUZ`, `AGUA`, `GAS`, `INTERNET`, `FATURA_CARTAO`, `OUTRO`, … (ver schema) |
| `TipoNotificacao` | `RECEITA_REGISTRADA`, `DESPESA_REGISTRADA`, `TRANSFERENCIA_REGISTRADA`, `META_ATINGIDA`, `ALERTA_ORCAMENTO`, `ORCAMENTO_ESTOURADO` |

---

## 🔗 Relações Importantes

```
Usuario (1) ──── (1) ConfiguracaoUsuario
  (1) ──── (N) Transacao ──── (0:1) Categoria [nula em TRANSFERENCIA]
                        └──── (N:N) Tag
  (1) ──── (N) Meta ──── (N) AporteMeta
                    └──── (0:1) Viagem
  (1) ──── (N) Viagem ──── (N) DespesaViagem
  (1) ──── (N) Lembrete
  (1) ──── (N) ItemPlanejamentoCompra ──── (0:1) Meta
                                     └──── (0:1) Transacao
  (1) ──── (N) Orcamento ──── (N) Categoria
  (1) ──── (N) Notificacao
  (1) ──── (N) MoedaFavorita
  (1) ──── (N) MensagemChat
  (1) ──── (N) HistoricoScore
  (N:N) ── Grupo (via MembroGrupo)
  (1) ──── (N) Divisao ──── (N) DivisaoParticipante ──── (N:N) Lembrete

Grupo ──── (N) ViagemGrupo ──── (N) DespesaViagemGrupo
──── (N) MetaGrupo ──── (N) AporteMetaGrupo
──── (N) MensagemChatGrupo
```

---

## 📝 Notas

- **Fonte de verdade:** alterações de modelo → editar `prisma/schema.prisma` e rodar `npm run db:migrate`
- **Timestamps:** `criadoEm` e `atualizadoEm` gerenciados pelo Prisma (`@default(now())`, `@updatedAt`)
- **IDs:** `cuid()` em todas as entidades
- **Valores monetários:** `Decimal(12,2)` (ou `Decimal(10,2)` em campos unitários)
- **Cores:** hex `#RRGGBB` (7 caracteres)
- **Ícones:** string com nome Lucide (ex: `UtensilsCrossed`, `Banknote`) — ver `web/src/components/badges/iconRegistry.jsx`
- **Moedas:** ISO 4217, 3 letras (`USD`, `BRL`, `EUR`)
- **Tokens Google:** criptografados em repouso (AES-256-GCM, `utils/googleTokenCrypto.js`) antes de persistir em `tokensGoogle` — chave via env `GOOGLE_TOKENS_ENCRYPTION_KEY`
- **Refresh tokens (sessão):** transporte em cookie `httpOnly` (`pulso_refresh`); persistência opaca em `tokens_renovacao.token` (texto, não hash) — ver seção [TokenRenovacao](#-tokenrenovacao)
- **Recorrência:** `regraRecorrencia` armazena JSON (`frequencia`, `ateQuando`, `dataFim`), não RRULE RFC 5545
- **Nomes de tabela:** ver `@@map` em cada model no schema Prisma