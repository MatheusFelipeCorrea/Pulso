# ⚙️ API — Backend

Servidor HTTP construído com **Node.js + Express** seguindo uma arquitetura em **camadas** com separação clara entre **Routes, Controllers, Services, Repositories e Providers** para máxima organização e testabilidade.

---

## 🗂️ Índice

- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Descrição das Camadas](#-descrição-das-camadas)
- [Fluxo de uma Requisição](#-fluxo-de-uma-requisição)
- [Rotas da API](#-rotas-da-api)
- [Regras de Negócio](#-regras-de-negócio)
- [Modelo do Banco de Dados](#-modelo-do-banco-de-dados)
- [Como Rodar](#-como-rodar)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Padrão de Erros](#-padrão-de-erros)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js | Runtime |
| Express | Framework HTTP |
| Prisma 5.10.0 | ORM / Banco de dados |
| PostgreSQL | Banco de dados (Neon — free tier) |
| Zod | Validação de dados |
| JWT | Autenticação (access + refresh token) |
| Bcryptjs | Criptografia de senhas |
| Passport.js | Google OAuth 2.0 |
| Nodemailer | Envio de emails (confirmação, recuperação) |
| Helmet | Headers HTTP de segurança |
| CORS | Controle de origens permitidas |
| express-rate-limit | Limitação de requisições |
| Winston | Logs estruturados |
| node-cron | Agendamento de tarefas (recorrências, lembretes) |
| Google Gemini | Inteligência Artificial (insights + chatbot) |
| AwesomeAPI | Cotação de moedas em tempo real |
| Google Calendar API | Integração de lembretes |
| Swagger | Documentação interativa da API |
| Vitest + Supertest | Testes unitários e de integração |

---

## 📁 Estrutura de Pastas

```
Pulso/api/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
├── Documents/
│   └── Readme.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
├── server.js
├── app.js
├── config/
│   ├── env.js
│   ├── database.js
│   ├── passport.js
│   └── swagger.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── validateMiddleware.js
│   ├── rateLimitMiddleware.js
│   └── errorMiddleware.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   ├── goalRoutes.js
│   ├── tripRoutes.js
│   ├── insightRoutes.js
│   ├── reminderRoutes.js
│   ├── transportRoutes.js
│   ├── reportRoutes.js
│   ├── gamificationRoutes.js
│   └── userRoutes.js
├── controllers/
│   ├── authController.js
│   ├── transactionController.js
│   ├── goalController.js
│   ├── tripController.js
│   ├── insightController.js
│   ├── reminderController.js
│   ├── transportController.js
│   ├── reportController.js
│   ├── gamificationController.js
│   └── userController.js
├── services/
│   ├── authService.js
│   ├── transactionService.js
│   ├── goalService.js
│   ├── tripService.js
│   ├── insightService.js
│   ├── reminderService.js
│   ├── transportService.js
│   ├── reportService.js
│   ├── gamificationService.js
│   └── userService.js
├── repositories/
│   ├── userRepository.js
│   ├── transactionRepository.js
│   ├── goalRepository.js
│   ├── tripRepository.js
│   ├── reminderRepository.js
│   ├── transportRepository.js
│   └── gamificationRepository.js
├── providers/
│   ├── geminiProvider.js
│   ├── currencyProvider.js
│   ├── googleCalendarProvider.js
│   └── emailProvider.js
├── schemas/
│   ├── authSchemas.js
│   ├── transactionSchemas.js
│   ├── goalSchemas.js
│   ├── tripSchemas.js
│   ├── reminderSchemas.js
│   └── transportSchemas.js
├── jobs/
│   ├── recurringTransactions.js
│   └── reminderSync.js
├── utils/
│   ├── appError.js
│   ├── logger.js
│   └── helpers.js
└── tests/
├── services/
├── controllers/
└── integration/
```
---

## 📖 Descrição das Camadas

---

### 📄 `server.js` — Ponto de entrada da aplicação

Importa o app.js. Sobe o servidor na porta definida no .env. Inicia os cron jobs (recorrências e lembretes). Conecta com o banco via Prisma. Loga confirmação via Winston.

---

### 📄 `app.js` — Configura e monta o Express

Registra middlewares globais: helmet (headers seguros), cors (origens permitidas), express.json (parse body), rateLimitMiddleware (global). Registra Swagger em /api/docs. Registra Passport (Google OAuth). Registra todas as rotas com prefixo /api. Registra o errorMiddleware (sempre por último).

---

### 📁 `config/` — Configurações técnicas

**env.js** — Valida se todas as variáveis de ambiente existem. Exporta objeto com todas as variáveis. A aplicação não sobe se faltar alguma.

**database.js** — Instância do Prisma 5.10.0 com driver adapter do Neon. Configuração de connection pooling. Importado pelos repositories.

**passport.js** — Configuração do Google OAuth 2.0. Strategy: GoogleStrategy. Callback: cria ou encontra o usuário. Serialização/deserialização do user.

**swagger.js** — Configuração do swagger-jsdoc + swagger-ui-express. Define título, versão e descrição da API. Gera documentação a partir dos comentários nas rotas. Acessível em /api/docs.

---

### 📁 `middlewares/` — Funções entre a requisição e o controller

**authMiddleware.js** — Verifica se o access token JWT existe e é válido. Extrai token do header Authorization: Bearer. Bloqueia com 401 se inválido ou ausente. Anexa dados do usuário no req.user. Verifica se o usuário ainda existe no banco.

**validateMiddleware.js** — Recebe um schema Zod como parâmetro. Valida req.body, req.params e req.query. Retorna 400 com mensagem clara se dados inválidos. Sanitiza dados contra XSS.

**rateLimitMiddleware.js** — Limita requisições por IP. Global: 100 req/min. Auth (login/register): 10 req/min (anti brute-force). IA (insights/chatbot): 20 req/min (economia de quota).

**errorMiddleware.js** — Captura TODOS os erros da aplicação. Diferencia AppError (erros conhecidos) de erros inesperados. Retorna resposta padronizada com status e mensagem. DEVE ser o último middleware registrado. Loga o erro com Winston (nunca loga dados sensíveis).

---

### 📁 `routes/` — Define URLs e conecta aos controllers

Aplica middlewares específicos por rota. Aplica validateMiddleware com schema por rota. Chama o controller correto. Sem lógica de negócio.

| Arquivo | Prefixo |
|---|---|
| authRoutes.js | /api/auth |
| transactionRoutes.js | /api/transactions |
| goalRoutes.js | /api/goals |
| tripRoutes.js | /api/trips |
| insightRoutes.js | /api/insights |
| reminderRoutes.js | /api/reminders |
| transportRoutes.js | /api/transport |
| reportRoutes.js | /api/reports |
| gamificationRoutes.js | /api/gamification |
| userRoutes.js | /api/users |
| index.js | Agrupa todas as rotas. Único arquivo registrado no app.js |

---

### 📁 `controllers/` — Recebe requisição, retorna resposta

Recebe req e res. Chama o service correto. Retorna resposta JSON padronizada. Erros sempre com try/catch → next(error). Sem regra de negócio. Sem acesso direto ao banco.

**authController.js** — register (POST /auth/register), login (POST /auth/login), verifyEmail (GET /auth/verify), forgotPwd (POST /auth/forgot-password), resetPwd (POST /auth/reset-password), refresh (POST /auth/refresh), logout (POST /auth/logout), googleCb (GET /auth/google/callback)

**transactionController.js** — getAll (GET /transactions), getById (GET /transactions/:id), create (POST /transactions), update (PUT /transactions/:id), delete (DELETE /transactions/:id), getRecurring (GET /transactions/recurring)

**goalController.js** — getAll (GET /goals), getById (GET /goals/:id), create (POST /goals), update (PUT /goals/:id), delete (DELETE /goals/:id), contribute (POST /goals/:id/contribute)

**tripController.js** — getAll (GET /trips), getById (GET /trips/:id), create (POST /trips), update (PUT /trips/:id), delete (DELETE /trips/:id), addExpense (POST /trips/:id/expenses), rmExpense (DELETE /trips/:id/expenses/:eid), getRates (GET /currency/rates), convert (GET /currency/convert), getHistory (GET /currency/history), getFavorites (GET /currency/favorites), toggleFav (POST /currency/favorites)

**insightController.js** — getSummary (GET /insights/summary), getSuggestions (GET /insights/suggestions), getAlerts (GET /insights/alerts), getScore (GET /insights/score), chatMessage (POST /chatbot/message)

**reminderController.js** — getAll (GET /reminders), create (POST /reminders), update (PUT /reminders/:id), delete (DELETE /reminders/:id), syncCalendar (POST /reminders/sync)

**transportController.js** — getData (GET /transport), regSale (POST /transport/sales), regUsage (POST /transport/usage), getSales (GET /transport/sales)

**reportController.js** — getMonthly (GET /reports/monthly), getByCategory (GET /reports/categories), getComparison (GET /reports/comparison), getEvolution (GET /reports/evolution)

**gamificationController.js** — getData (GET /gamification), getAchievements (GET /gamification/achievements), getChallenge (GET /gamification/challenge)

**userController.js** — getProfile (GET /users/profile), updateProfile (PUT /users/profile), updatePwd (PUT /users/password), updateSettings (PUT /users/settings), deleteAccount (DELETE /users/account)

---

### 📁 `services/` — Regras de negócio (coração da aplicação)

Toda regra de negócio fica aqui. Chama repositories para acessar o banco. Chama providers para APIs externas. Lança AppError quando algo é inválido. Não conhece req/res. Sem acesso direto ao banco.

**authService.js** — register: cria usuário, hash da senha (bcrypt salt 12), envia email de confirmação via emailProvider. login: valida credenciais, gera access token (15min) e refresh token (7 dias), salva refresh no banco. verifyEmail: valida token de confirmação, ativa conta. forgotPassword: gera token de reset, envia email. resetPassword: valida token, atualiza senha. refresh: valida refresh token, rotação (gera novos, invalida anterior). logout: invalida refresh token. googleAuth: cria ou encontra user via Google ID, vincula se email já existe.

**transactionService.js** — Valida que recurso é obrigatório. Bloqueia despesa de alimentação com recurso VT. Registra transações recorrentes (frequência configurável). Calcula saldos por tipo de recurso. Atualiza streak de gamificação ao registrar.

**goalService.js** — Calcula valor mensal necessário para atingir a meta no prazo. Valida que aporte não ultrapasse o valor-alvo. Gerencia status: ACTIVE → PAUSED → COMPLETED → CANCELLED. Notifica quando meta é atingida (100%). Concede conquista ao completar primeira meta.

**tripService.js** — Calcula custo total somando todas as pretensões. Converte total para BRL via currencyProvider (cotação atual). Vincula viagem a uma meta financeira (opcional). Permite múltiplas viagens simultâneas.

**insightService.js** — Busca dados financeiros do usuário no banco. Monta prompt contextualizado para a Gemini (receitas, despesas, categorias, metas, padrões). Gera resumo mensal em linguagem natural. Identifica categorias com aumento vs mês anterior. Gera sugestões personalizadas de economia (mín. 2). Gera alertas preditivos ("VA acaba dia X"). Calcula score de saúde financeira (0-100). Chatbot: recebe pergunta + contexto financeiro, envia pra Gemini, retorna resposta contextualizada. Chatbot limitado a perguntas sobre finanças.

**reminderService.js** — Cria lembretes com título, valor, data, antecedência. Sincroniza com Google Calendar via googleCalendarProvider. Gerencia status de sincronização (synced/pending). Respeita opt-in do usuário (google_calendar_on).

**transportService.js** — Registra valor mensal recebido de VT. Registra uso real (passagens utilizadas). Registra venda: comprador, data, nominal, recebido. Calcula diferença (perda na venda). Valor recebido entra como receita tipo MONEY. Calcula saldo: recebido - usado - vendido. Gerencia intervalo entre vendas (configurável). Calcula próxima data de venda disponível.

**reportService.js** — Gera relatório mensal (total receitas, despesas, saldo). Agrupa gastos por categoria com percentual. Compara até 6 meses anteriores. Calcula evolução temporal do saldo.

**gamificationService.js** — Rastreia streak: incrementa a cada dia com registro, zera se passar 1 dia sem atividade. Avalia conquistas: verifica marcos atingidos e desbloqueia. Calcula nível: Iniciante → Consciente → Estrategista → Investidor baseado em XP acumulado. Gera desafio mensal via Gemini baseado no perfil.

**userService.js** — Atualiza perfil (nome, email, foto). Altera senha (valida senha atual antes). Configura receitas fixas (salário, VA, VR, VT com dia). Gera receitas automaticamente todo mês baseado nas configs. Exclui conta e TODOS os dados associados (cascade).

---

### 📁 `repositories/` — Única camada que fala com o banco

Toda query de banco fica aqui (via Prisma). Se trocar de banco, só mexe aqui. Queries parametrizadas (anti SQL injection nativo do Prisma). Sem regra de negócio. Sem req/res.

**userRepository.js** — findById, findByEmail, findByGoogleId, create, update, delete, findSettings, updateSettings, saveRefreshToken, findRefreshToken, revokeRefreshToken.

**transactionRepository.js** — findAll (com filtros: período, categoria, tipo, recurso), findById, findByUser, findRecurring, create, update, delete, sumByResource (saldo por tipo), sumByCategory (gastos agrupados), sumByMonth (receitas e despesas mensais).

**goalRepository.js** — findAll, findById, findByUser, create, update, delete, addContribution, findContributions.

**tripRepository.js** — findAll, findById, findByUser, create, update, delete, addExpense, removeExpense, findExpenses.

**reminderRepository.js** — findAll, findById, findByUser, findPending (não sincronizados), create, update, delete, updateSyncStatus.

**transportRepository.js** — findByUser (dados do mês atual), findSaleHistory, createSale, createUsage, getBalance (recebido - usado - vendido), getLastSaleDate.

**gamificationRepository.js** — findStreak, updateStreak, findAchievements, unlockAchievement, findUserLevel, updateXP, findChallenge, saveChallenge.

---

### 📁 `providers/` — APIs e serviços externos

Cada provider é independente e substituível. Se trocar de API de câmbio, só mexe no currencyProvider. Se trocar de IA, só mexe no geminiProvider. Sem regra de negócio. Sem acesso ao banco.

**geminiProvider.js** — Conecta com Google Gemini API (@google/generative-ai). generateInsight(prompt): envia prompt e retorna texto. chatResponse(messages): conversa contextualizada. Configurações: model, temperature, maxTokens. Tratamento de erros e rate limit. Limita respostas ao escopo financeiro.

**currencyProvider.js** — Conecta com AwesomeAPI (economia.awesomeapi.com.br). getRates(): cotações atuais (USD, EUR, GBP, ARS). convert(from, to, amount): conversão de moedas. getHistory(code, days): histórico de cotação. Cache em memória para evitar requisições repetidas. API 100% gratuita, sem chave necessária.

**googleCalendarProvider.js** — Conecta com Google Calendar API (googleapis). createEvent(tokens, event): cria evento no calendar. deleteEvent(tokens, eventId): remove evento. Usa tokens OAuth do usuário (armazenados criptografados). Respeita opt-in: só funciona se o usuário ativou.

**emailProvider.js** — Conecta com serviço SMTP via Nodemailer. sendVerification(email, token): email de confirmação de conta. sendPasswordReset(email, token): email de recuperação de senha. Templates HTML para os emails. Configurável via variáveis de ambiente.

---

### 📁 `schemas/` — Validação de entrada com Zod

Garante que dados inválidos nem chegam no controller. Retorna mensagens de erro claras e padronizadas. Sempre usado junto com o validateMiddleware.

**authSchemas.js** — registerSchema: name (string, mín 2), email (formato válido), password (mín 8, 1 número, 1 maiúscula), confirmPassword (igual ao password). loginSchema: email, password. forgotPasswordSchema: email. resetPasswordSchema: token, password.

**transactionSchemas.js** — createTransactionSchema: amount (positivo, > 0), date (obrigatória), description (opcional, máx 255), categoryId (uuid), resource (MONEY/VA/VR/VT), type (INCOME/EXPENSE), isRecurring (boolean), recurrenceRule (obrigatório se isRecurring).

**goalSchemas.js** — createGoalSchema: name (mín 2), targetAmount (positivo), deadline (futura), type (SHORT_TERM/LONG_TERM), description (opcional). contributionSchema: amount (positivo).

**tripSchemas.js** — createTripSchema: destination (obrigatório), currency (código ISO), plannedDate (obrigatória), goalId (opcional). tripExpenseSchema: category (transport/accommodation/food/tours/shopping/other), description (opcional), estimatedAmount (positivo).

**reminderSchemas.js** — createReminderSchema: title (obrigatório), amount (opcional, positivo), dueDate (obrigatória), advanceDays (0/1/3, default 1).

**transportSchemas.js** — vtSaleSchema: buyerName (obrigatório), saleDate (obrigatória), nominalValue (positivo), receivedValue (positivo). vtUsageSchema: quantity (inteiro, positivo), valuePerTrip (positivo), date (obrigatória).

---

### 📁 `jobs/` — Tarefas agendadas

**recurringTransactions.js** — Cron que roda todo dia às 00:01. Busca transações marcadas como recorrentes. Verifica se a data programada é hoje. Cria automaticamente a transação do dia. Respeita a frequência configurada. Loga cada transação gerada via Winston.

**reminderSync.js** — Cron que roda a cada 6 horas. Busca lembretes com sync pendente. Sincroniza com Google Calendar via provider. Atualiza status para synced. Só executa para usuários com calendar ativado.

---

### 📁 `utils/` — Código reutilizado em todo o backend

**appError.js** — Classe de erro customizado. Recebe message e statusCode. Propriedade isOperational (diferencia de bugs). Lançado nos services. Capturado pelo errorMiddleware. Ex: throw new AppError('VA insuficiente', 400).

**logger.js** — Instância configurada do Winston. Níveis: error, warn, info, debug. Formato: timestamp + level + message. Em produção: só error e warn. Em dev: todos os níveis. Nunca logar dados sensíveis.

**helpers.js** — generateToken(length): gera string aleatória. hashToken(token): hash SHA256 para tokens de email. calculateDaysUntil(date): dias restantes. paginateResults(query, page, limit): paginação padrão.

---

### 📁 `tests/` — Testes automatizados

Cobertura mínima: 85%.

**tests/services/ (unitários)** — Testa funções isoladas de cada service. Sem banco real, usa mock do repository.

| Teste | O que valida |
|---|---|
| authService.spec.js | Hash de senha, geração/validação JWT, rotação refresh token, bloqueio conta não verificada |
| transactionService.spec.js | Bloqueio alimentação com VT, cálculo saldo por recurso, criação recorrente |
| goalService.spec.js | Cálculo valor mensal, bloqueio aporte acima do alvo, transição de status |
| tripService.spec.js | Cálculo custo total, conversão moeda, vínculo com meta |
| insightService.spec.js | Montagem prompt Gemini, cálculo score, limitação escopo chatbot |
| reminderService.spec.js | Criação com antecedência, sincronização Google Calendar |
| transportService.spec.js | Cálculo saldo VT, diferença nominal/recebido, intervalo entre vendas |
| reportService.spec.js | Agrupamento por categoria, comparação entre meses |
| gamificationService.spec.js | Incremento/reset streak, desbloqueio conquistas, cálculo nível/XP |
| userService.spec.js | Atualização perfil, geração receitas fixas, exclusão cascata |

**tests/controllers/ (unitários)** — Testa se controller chama service correto. Testa status code esperado. Mock do service.

**tests/integration/** — Testa fluxo completo da rota até o banco.

| Teste | Fluxo |
|---|---|
| auth.integration.spec.js | Registro → confirmação → login → refresh → logout |
| transactions.integration.spec.js | CRUD completo + filtros + validação recurso |
| goals.integration.spec.js | Criar meta → aportar → completar |
| trips.integration.spec.js | Criar viagem → adicionar pretensões → calcular total |
| transport.integration.spec.js | Registrar VT → usar → vender → verificar saldo |

---

## 🔄 Fluxo de uma Requisição

REQUEST
│
▼
routes/index.js — agrupa todas as rotas
│
▼
MIDDLEWARES
1. helmet          → headers seguros
2. cors            → origens permitidas
3. rateLimitMiddleware → limite de req/min
4. authMiddleware   → token JWT válido?
5. validateMiddleware(schema) → body/params válidos?
   │
   ▼
   CONTROLLER
   → recebe req/res
   → chama o service
   → retorna JSON
   │
   ▼
   SERVICE
   → regra de negócio
   → lança AppError
   │
   ├──────────────────────┐
   ▼                      ▼
   REPOSITORY              PROVIDERS
   (banco via Prisma)      (Gemini, AwesomeAPI,
   │                    Calendar, Nodemailer)
   ▼
   Neon (PostgreSQL)
   │
   ▼
   RESPONSE

CRON JOBS (paralelos):
→ recurringTransactions.js: roda todo dia às 00:01
→ reminderSync.js: roda a cada 6 horas

Se ocorrer erro:
service lança AppError → controller next(error) → errorMiddleware loga e retorna JSON padronizado

---

## 🛣️ Rotas da API

Todas as rotas seguem o prefixo /api. 🔓 = pública | 🔒 = autenticada.

**AUTH**

| Método | Rota | Acesso |
|---|---|---|
| POST | /api/auth/register | 🔓 |
| POST | /api/auth/login | 🔓 |
| GET | /api/auth/verify?token=x | 🔓 |
| POST | /api/auth/forgot-password | 🔓 |
| POST | /api/auth/reset-password | 🔓 |
| POST | /api/auth/refresh | 🔓 |
| POST | /api/auth/logout | 🔒 |
| GET | /api/auth/google | 🔓 |
| GET | /api/auth/google/callback | 🔓 |

**TRANSACTIONS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/transactions | 🔒 |
| GET | /api/transactions/:id | 🔒 |
| GET | /api/transactions/recurring | 🔒 |
| POST | /api/transactions | 🔒 |
| PUT | /api/transactions/:id | 🔒 |
| DELETE | /api/transactions/:id | 🔒 |

**GOALS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/goals | 🔒 |
| GET | /api/goals/:id | 🔒 |
| POST | /api/goals | 🔒 |
| PUT | /api/goals/:id | 🔒 |
| DELETE | /api/goals/:id | 🔒 |
| POST | /api/goals/:id/contribute | 🔒 |

**TRIPS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/trips | 🔒 |
| GET | /api/trips/:id | 🔒 |
| POST | /api/trips | 🔒 |
| PUT | /api/trips/:id | 🔒 |
| DELETE | /api/trips/:id | 🔒 |
| POST | /api/trips/:id/expenses | 🔒 |
| DELETE | /api/trips/:id/expenses/:eid | 🔒 |

**CURRENCY**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/currency/rates | 🔒 |
| GET | /api/currency/convert | 🔒 |
| GET | /api/currency/history | 🔒 |
| GET | /api/currency/favorites | 🔒 |
| POST | /api/currency/favorites | 🔒 |

**INSIGHTS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/insights/summary | 🔒 |
| GET | /api/insights/suggestions | 🔒 |
| GET | /api/insights/alerts | 🔒 |
| GET | /api/insights/score | 🔒 |

**CHATBOT**

| Método | Rota | Acesso |
|---|---|---|
| POST | /api/chatbot/message | 🔒 |

**REMINDERS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/reminders | 🔒 |
| POST | /api/reminders | 🔒 |
| PUT | /api/reminders/:id | 🔒 |
| DELETE | /api/reminders/:id | 🔒 |
| POST | /api/reminders/sync | 🔒 |

**TRANSPORT (VT)**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/transport | 🔒 |
| POST | /api/transport/sales | 🔒 |
| POST | /api/transport/usage | 🔒 |
| GET | /api/transport/sales | 🔒 |

**REPORTS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/reports/monthly | 🔒 |
| GET | /api/reports/categories | 🔒 |
| GET | /api/reports/comparison | 🔒 |
| GET | /api/reports/evolution | 🔒 |

**GAMIFICATION**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/gamification | 🔒 |
| GET | /api/gamification/achievements | 🔒 |
| GET | /api/gamification/challenge | 🔒 |

**USER**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/users/profile | 🔒 |
| PUT | /api/users/profile | 🔒 |
| PUT | /api/users/password | 🔒 |
| PUT | /api/users/settings | 🔒 |
| DELETE | /api/users/account | 🔒 |

**DOCS**

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/docs | 🔓 |

---

## ⚙️ Regras de Negócio

**Autenticação** — Senha: mínimo 8 chars, 1 número, 1 maiúscula. Hash com bcrypt salt 12. Access token expira em 15 minutos. Refresh token expira em 7 dias (rotativo). Refresh token em httpOnly cookie. Conta só ativa após confirmação do email. Login com Google cria conta ou vincula se email já existe.

**Transações** — Recurso de origem é obrigatório (MONEY, VA, VR, VT). Despesa de alimentação NÃO pode usar recurso VT. Valor deve ser positivo e maior que zero. Transações recorrentes geram automaticamente pelo cron. Cada registro incrementa o streak de gamificação.

**Metas** — Deadline deve ser uma data futura. Aporte não pode ultrapassar o valor-alvo. Sistema calcula valor mensal = (alvo - atual) / meses restantes. Status: ACTIVE ↔ PAUSED → COMPLETED ou CANCELLED. Concede conquista ao completar primeira meta.

**Viagens** — Custo total = soma de todas as pretensões. Conversão para BRL usa cotação atual (AwesomeAPI). Pode vincular a uma meta para acompanhar progresso. Permite múltiplas viagens simultâneas.

**Insights e Chatbot** — Gemini recebe APENAS dados financeiros do usuário. Chatbot recusa perguntas fora do escopo financeiro. Resumo mensal gerado automaticamente ou sob demanda. Score de saúde: 0-30 (crítico), 31-50 (alerta), 51-70 (regular), 71-90 (bom), 91-100 (excelente).

**Lembretes** — Sincronização com Google Calendar é opt-in. Antecedência configurável: no dia, 1 dia, 3 dias antes. Usuário pode desconectar a qualquer momento. Cron sincroniza a cada 6 horas.

**Vale Transporte** — Saldo = recebido - usado - vendido. Venda registra comprador, nominal, recebido, data. Diferença nominal vs recebido = perda na venda. Valor recebido entra como receita tipo MONEY. Intervalo entre vendas é configurável. Contador regressivo até próxima venda.

**Gamificação** — Streak incrementa a cada dia com pelo menos 1 registro. Zera se passar 1 dia sem atividade. Conquistas em marcos: 7, 30, 90 dias. Conquista: primeira meta completa, primeiro mês positivo. Nível baseado em XP. Desafio mensal gerado pela Gemini. Módulo opcional (ativável/desativável).

**Perfil e Configurações** — Receitas fixas configuráveis (salário, VA, VR, VT). Sistema gera automaticamente todo mês na data configurada. Exclusão de conta remove TODOS os dados (cascade). Tema claro/escuro persistido nas configurações.

---

## 🗄️ Modelo do Banco de Dados

**users** — id, name, email (unique), password_hash, avatar_url, auth_provider (EMAIL/GOOGLE), google_id, is_verified, created_at, updated_at.

**user_settings** — id, user_id (FK unique), salary_amount, salary_day, va_amount, va_day, vr_amount, vr_day, vt_amount, vt_day, vt_sale_interval_days, theme (light/dark), gamification_on, google_calendar_on, google_tokens (encrypted).

**refresh_tokens** — id, user_id (FK), token (unique, hashed), expires_at, is_revoked, created_at, revoked_at.

**categories** — id, name, icon, type (INCOME/EXPENSE), is_default, user_id (FK nullable).

**transactions** — id, user_id (FK), category_id (FK), type (INCOME/EXPENSE), resource (MONEY/VA/VR/VT), amount, description, date, is_recurring, recurrence_rule, created_at.

**tags** — id, name, user_id (FK).

**transaction_tags** — transaction_id (FK), tag_id (FK).

**goals** — id, user_id (FK), name, target_amount, current_amount, deadline, type (SHORT_TERM/LONG_TERM), status (ACTIVE/PAUSED/COMPLETED/CANCELLED), description, created_at.

**goal_contributions** — id, goal_id (FK), amount, date.

**trips** — id, user_id (FK), destination, currency, planned_date, goal_id (FK nullable), created_at.

**trip_expenses** — id, trip_id (FK), category, description, estimated_amount.

**reminders** — id, user_id (FK), title, amount, due_date, advance_days, google_event_id, is_synced, created_at.

**vt_sales** — id, user_id (FK), buyer_name, sale_date, nominal_value, received_value, next_sale_date.

**streaks** — id, user_id (FK), current_streak, longest_streak, last_activity.

**achievements** — id, name, description, icon, criteria.

**user_achievements** — id, user_id (FK), achievement_id (FK), unlocked_at.

---

## ▶️ Como Rodar

# Instalar dependências
npm install

# Copiar o .env
cp .env.example .env

# Gerar o client do Prisma
npm run db:generate

# Rodar migrations (primeira vez)
npm run db:migrate

# Rodar em desenvolvimento
npm run dev
# → servidor rodando em http://localhost:3333

# Acessar documentação
# → http://localhost:3333/api/docs

---

## 📋 Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Desenvolvimento com hot reload (nodemon) |
| `npm start` | Produção |
| `npm test` | Testes (Vitest) |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run db:generate` | Gera o client do Prisma |
| `npm run db:migrate` | Executa migrations pendentes |
| `npm run db:studio` | Interface visual do banco (Prisma Studio) |
| `npm run lint` | Lint (ESLint) |

---

## 🔑 Variáveis de Ambiente

Copie o `.env.example` e crie seu `.env`:

cp .env.example .env

# Servidor
PORT=3333
NODE_ENV=development

# Banco de dados (Neon)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_REFRESH_SECRET=sua_chave_refresh_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3333/api/auth/google/callback

# Google Gemini (IA)
GEMINI_API_KEY=sua_api_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email
SMTP_PASS=sua_senha_app

# CORS
CORS_ORIGIN=http://localhost:5173

# Frontend URL (para links em emails)
FRONTEND_URL=http://localhost:5173

---

## ⚠️ Padrão de Erros

Todos os erros retornam o mesmo formato:

{
"status": "error",
"message": "Descrição clara do que aconteceu"
}

| Código | Situação |
|---|---|
| 400 | Dados inválidos ou regra de negócio violada |
| 401 | Não autenticado (token ausente/inválido/expirado) |
| 403 | Sem permissão para acessar o recurso |
| 404 | Registro não encontrado |
| 409 | Conflito (ex: email já cadastrado) |
| 429 | Muitas requisições (rate limit excedido) |
| 500 | Erro interno do servidor |
