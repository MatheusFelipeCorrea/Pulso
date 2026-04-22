# 🌐 Web — Frontend

Interface construída com **React + Vite** estilizada com **Tailwind CSS v4.2**, gerenciamento de estado global com **Redux Toolkit (Slices)** seguindo uma arquitetura baseada em **componentes, páginas e camadas de dados**.

---

## 🗂️ Índice

- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Descrição das Camadas](#-descrição-das-camadas)
- [Fluxo de Dados](#-fluxo-de-dados)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Como Rodar](#-como-rodar)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca de interface |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS v4.2 | Estilização (CSS-first, plugin Vite) |
| shadcn/ui | Componentes acessíveis e customizáveis |
| React Router DOM v6 | Navegação entre páginas |
| Redux Toolkit | Gerenciamento de estado global (slices) |
| Axios | Requisições HTTP |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de dados |
| Recharts | Gráficos e visualizações |
| Lucide React | Ícones |
| date-fns | Manipulação de datas |
| Sonner | Notificações toast |
| @react-pdf/renderer | Exportação de relatórios em PDF |
| PapaParse | Exportação de dados em CSV |
| Vitest + Testing Library | Testes unitários |

---

## 📁 Estrutura de Pastas

```
Pulso/web/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
├── Documents/
│   └── Readme.md
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
├── main.jsx
├── App.jsx
├── assets/
├── components/
│   ├── ui/
│   ├── layouts/
│   └── features/
├── pages/
├── hooks/
├── store/
│   └── slices/
├── services/
├── schemas/
├── utils/
├── styles/
└── tests/
├── components/
├── hooks/
└── services/
```
---

## 📖 Descrição das Camadas

---

### 📄 Arquivos da Raiz

| Arquivo | Descrição |
|---|---|
| `.env` | Variáveis de ambiente da aplicação. Nunca versionar |
| `.env.example` | Modelo do .env para o time. Versionar |
| `.gitignore` | Arquivos ignorados pelo git (node_modules, .env, dist, .vite) |
| `eslint.config.js` | Regras de qualidade e padronização do código |
| `index.html` | HTML base da aplicação. Ponto de montagem do React (#root) |
| `package.json` | Dependências e scripts do projeto |
| `vite.config.js` | Configuração do Vite: plugin React, Tailwind v4 (@tailwindcss/vite), aliases de importação, proxy para a API |

---

### 📄 `src/main.jsx` — Ponto de entrada da aplicação

Renderiza o App no DOM. Configura o Provider store (Redux). Configura o BrowserRouter (rotas). Importa o styles/globals.css.

---

### 📄 `src/App.jsx` — Componente raiz

Chama o componente de rotas. Providers globais (toast, tema). Verifica autenticação inicial (refresh token).

---

### 📁 `assets/` — Arquivos estáticos

Logos, banners, ilustrações (.png .jpg .svg). Logo do Pulso. Não colocar imagens que vêm de URL/API externa.

---

### 📁 `components/ui/` — Design system (shadcn/ui)

Componentes visuais genéricos estilizados com Tailwind v4. Recebem tudo via props. Reutilizáveis em qualquer parte do projeto. Não acessam store. Não fazem chamada de API.

- **Button** — Variações: primary, secondary, danger, outline, ghost
- **Input** — Campo de texto padrão
- **Modal** — Janela modal reutilizável
- **Select** — Campo de seleção (dropdown)
- **Card** — Container visual com bordas e sombra
- **Badge** — Etiqueta colorida (recurso, status de meta, categorias)
- **Table** — Tabela de dados reutilizável
- **Spinner** — Indicador de carregamento
- **ProgressBar** — Barra de progresso (metas, score)
- **Tooltip** — Dica flutuante ao passar o mouse

---

### 📁 `components/layouts/` — Esqueletos visuais

Podem acessar store (tema, user). Conhecem a estrutura da aplicação. Não são páginas completas.

**MainLayout/** (MainLayout.jsx + MainLayout.styles.jsx) — Tela completa com navegação. Renderiza Header + Sidebar + conteúdo + Footer. Usado em todas as páginas logadas.

**AuthLayout/** (AuthLayout.jsx + AuthLayout.styles.jsx) — Tela limpa sem menu lateral. Usado em /login, /register e /forgot-password.

**Header/** (Header.jsx + Header.styles.jsx) — Cabeçalho da aplicação. Exibe logo Pulso, nome do usuário, score de saúde financeira, streak ativo, toggle de tema claro/escuro.

**Sidebar/** (Sidebar.jsx + Sidebar.styles.jsx) — Navegação lateral. Links para todas as páginas. Destaca a rota ativa. Colapsável em telas menores.

**Footer/** (Footer.jsx + Footer.styles.jsx) — Rodapé. Exibe versão do sistema e créditos.

---

### 📁 `components/features/` — Componentes de negócio

Organizados por domínio. Cada componente tem sua própria pasta com JSX e estilos separados.

#### `features/auth/`

**Login/** — Formulário de login. Campos: email e senha. Validação com React Hook Form + Zod. Dispatch: loginUser() async thunk.

**Register/** — Formulário de cadastro. Campos: nome, email, senha, confirmação. Validação: senha mínima 8 chars, 1 número, 1 maiúscula.

**ForgotPassword/** — Formulário de recuperação de senha. Campo: email. Envia link de redefinição.

**Google/** — Botão "Entrar com Google". Redireciona para OAuth. Callback cria ou vincula conta.

#### `features/dashboard/`

**BalanceCards/** — Container dos cards de saldo. Exibe os 4 ResourceBalanceCards + total geral.

**ResourceBalanceCard/** — Card individual por tipo de recurso. Tipos: Salário (roxo), VA (verde), VR (laranja), VT (azul). Exibe: recebido, gasto, saldo restante.

**IncomeExpenseChart/** — Gráfico de barras: receitas vs despesas do mês. Cores: verde (receita) e vermelho (despesa). Recharts.

**CategoryChart/** — Gráfico de pizza: distribuição de gastos por categoria. 8 cores da paleta. Tooltip com valor e percentual.

**RecentTransactions/** — Lista das últimas 5-10 transações. Exibe: ícone, descrição, valor, data, badge de recurso.

**GoalsProgress/** — Resumo das metas ativas (máx 3). Barra de progresso com percentual.

**HealthScore/** — Score de saúde financeira (0-100). Gauge colorido (vermelho→amarelo→azul→verde→roxo). Gerado pela Gemini.

**AlertsBanner/** — Alertas visuais no topo do dashboard. Tipos: gasto acima do limite, VA acabando, meta próxima.

#### `features/transactions/`

**TransactionForm/** — Formulário de nova receita ou despesa. Campos: valor, data, descrição, categoria, recurso (Salário/VA/VR/VT). Toggle receita/despesa. Checkbox recorrente. Validação: valor > 0, recurso obrigatório, não permitir alimentação com VT.

**TransactionList/** — Lista paginada de todas as transações. Ordenação por data.

**TransactionItem/** — Linha individual. Exibe: ícone, descrição, valor, data, badge recurso. Cor: verde (receita) ou vermelho (despesa). Ações: editar, excluir.

**TransactionFilters/** — Barra de filtros: período, categoria, tipo, recurso. Campo de busca por descrição ou tag.

**RecurringBadge/** — Badge indicando transação recorrente. Exibe frequência e ícone de repetição.

#### `features/goals/`

**GoalForm/** — Formulário de criação/edição de meta. Campos: nome, valor-alvo, prazo, descrição, tipo.

**GoalCard/** — Card visual de uma meta. Exibe: nome, valor atual/alvo, prazo, tipo, barra de progresso. Ações: editar, pausar, concluir, excluir.

**GoalList/** — Lista de todas as metas. Filtro: ativas, pausadas, concluídas.

**GoalProgressBar/** — Barra de progresso visual. Cor: primary (em andamento), success (concluída). Exibe percentual e valor faltante.

**ContributionForm/** — Formulário de aporte parcial. Campos: valor, data.

#### `features/trips/`

**TripForm/** — Formulário de criação/edição de viagem. Campos: destino, moeda local, data prevista. Opção de vincular a meta.

**TripCard/** — Card visual de viagem planejada. Exibe: destino, data, moeda, total estimado em BRL, progresso da meta vinculada.

**TripList/** — Lista de todas as viagens planejadas.

**TripExpenseForm/** — Formulário de pretensão de gasto. Campos: categoria (transporte, hospedagem, alimentação, passeios, compras), descrição, valor estimado na moeda do destino.

**TripExpenseList/** — Lista de pretensões dentro da viagem. Exibe total somado. Conversão automática para BRL.

**CurrencyConverter/** — Conversor simples de moedas. Campos: valor, moeda origem, moeda destino. Resultado com cotação atual e horário. AwesomeAPI.

**CurrencyChart/** — Gráfico de histórico de cotação. Período: 7d, 30d, 90d. Recharts.

**FavoriteCurrencies/** — Lista de moedas favoritas. Acesso rápido. Botão adicionar/remover.

#### `features/insights/`

**MonthlySummary/** — Resumo mensal em linguagem natural (Gemini). Análise de receitas, despesas e padrões. Botão regenerar.

**CategoryComparison/** — Comparativo de gastos por categoria vs mês anterior. Setas e percentual de variação.

**SuggestionsList/** — Sugestões personalizadas de economia (Gemini). Mínimo 2 por mês.

**PredictiveAlerts/** — Alertas preditivos baseados no ritmo de gasto. Ex: "No ritmo atual, seu VA acaba dia 22".

**HealthScoreCard/** — Card detalhado do score (0-100). Breakdown dos critérios. Dicas para melhorar.

#### `features/chatbot/`

**ChatWindow/** — Janela do chatbot financeiro. Flutuante no canto inferior direito. Expandível/minimizável. Histórico da sessão.

**ChatMessage/** — Balão individual. Tipos: usuário (direita, roxo) e bot (esquerda, cinza). Texto formatado.

**ChatInput/** — Campo de pergunta. Botão enviar. Placeholder: "Pergunte ao Pulso...". Enter para enviar.

#### `features/reminders/`

**ReminderForm/** — Formulário de lembrete. Campos: título, valor, data de vencimento, antecedência (no dia, 1 dia, 3 dias).

**ReminderList/** — Lista de lembretes. Ordenação por data de vencimento.

**ReminderItem/** — Card individual. Exibe: título, valor, data, status de sincronização. Ações: editar, excluir.

**GoogleCalendarConnect/** — Botão conectar/desconectar Google Calendar. Status: conectado (verde) ou desconectado (cinza). OAuth com consentimento explícito.

#### `features/transport/`

**VTBalanceCard/** — Card com saldo atual de VT. Exibe: recebido, usado, vendido, saldo restante. Cor: azul.

**VTSaleForm/** — Formulário de venda de VT. Campos: comprador, data, valor nominal, valor recebido. Calcula diferença automaticamente.

**VTSaleHistory/** — Tabela com histórico de vendas. Colunas: data, comprador, nominal, recebido, diferença. Totais acumulados.

**VTUsageForm/** — Formulário de uso real do VT. Campos: quantidade de passagens, valor por passagem, data.

**VTNextSaleCountdown/** — Contador regressivo para próxima venda. Barra de progresso. Intervalo configurável.

#### `features/reports/`

**MonthlyReport/** — Relatório mensal completo. Total receitas, despesas, saldo. Seletor de mês/ano.

**CategoryPieChart/** — Gráfico de pizza por categoria. 8 cores da paleta. Tooltip com valor e percentual.

**MonthComparisonChart/** — Gráfico de barras comparando até 6 meses.

**BalanceEvolutionChart/** — Gráfico de linha: evolução do saldo. Cor: primary (roxo) com área translúcida.

**ExportPDFButton/** — Gera PDF do relatório. @react-pdf/renderer.

**ExportCSVButton/** — Exporta transações em CSV. PapaParse.

#### `features/gamification/`

**StreakCounter/** — Dias consecutivos de registro. Ícone de fogo. Cor: amarelo dourado. Conquista em 7, 30, 90 dias.

**AchievementCard/** — Card de conquista. Estados: desbloqueada (roxo) ou bloqueada (cinza). Exibe: ícone, nome, descrição, data.

**AchievementsList/** — Painel com todas as conquistas. Separação: desbloqueadas e pendentes. Progresso geral.

**FinancialLevel/** — Nível financeiro: Iniciante → Consciente → Estrategista → Investidor. Barra de XP.

**MonthlyChallenge/** — Desafio do mês gerado pela Gemini. Progresso visual com barra.

---

### 📁 `pages/` — Telas da aplicação

Montam a tela usando components/features. Dispatcham actions do Redux. Gerenciam estado local quando necessário. Não fazem fetch direto. Lógica complexa vai para hooks.

| Página | Rota | Layout | Componentes usados |
|---|---|---|---|
| Login.jsx | /login | AuthLayout | LoginForm, GoogleLoginButton |
| Register.jsx | /register | AuthLayout | RegisterForm, GoogleLoginButton |
| ForgotPassword.jsx | /forgot-password | AuthLayout | ForgotPasswordForm |
| Dashboard.jsx | / | MainLayout | BalanceCards, ResourceBalanceCard, IncomeExpenseChart, CategoryChart, RecentTransactions, GoalsProgress, HealthScore, AlertsBanner, StreakCounter |
| Transactions.jsx | /transactions | MainLayout | TransactionForm, TransactionList, TransactionItem, TransactionFilters, RecurringBadge |
| Goals.jsx | /goals | MainLayout | GoalForm, GoalCard, GoalList, GoalProgressBar, ContributionForm |
| Trips.jsx | /trips | MainLayout | TripForm, TripCard, TripList, TripExpenseForm, TripExpenseList, CurrencyConverter, CurrencyChart, FavoriteCurrencies |
| Insights.jsx | /insights | MainLayout | MonthlySummary, CategoryComparison, SuggestionsList, PredictiveAlerts, HealthScoreCard |
| Reminders.jsx | /reminders | MainLayout | ReminderForm, ReminderList, ReminderItem, GoogleCalendarConnect |
| Transport.jsx | /transport | MainLayout | VTBalanceCard, VTSaleForm, VTSaleHistory, VTUsageForm, VTNextSaleCountdown |
| Reports.jsx | /reports | MainLayout | MonthlyReport, CategoryPieChart, MonthComparisonChart, BalanceEvolutionChart, ExportPDFButton, ExportCSVButton |
| Profile.jsx | /profile | MainLayout | Edição de perfil, receitas fixas, preferências, exclusão de conta |
| NotFound.jsx | * | — | Página 404 |

---

### 📁 `hooks/` — Lógica reutilizável

Sempre começam com "use". Retornam dados e funções. Usam useAppSelector e useAppDispatch do Redux. Não renderizam JSX.

| Hook | Responsabilidade |
|---|---|
| useAuth.js | Verifica autenticação. Retorna: user, isAuthenticated, isLoading |
| useTransactions.js | Operações de transações. Retorna: transactions, create, update, delete, filters |
| useGoals.js | Operações de metas. Retorna: goals, create, update, contribute, pause, complete |
| useTrips.js | Operações de viagens. Retorna: trips, create, update, addExpense, removeExpense |
| useCurrency.js | Cotações e histórico. Retorna: rates, convert, history, favorites |
| useInsights.js | Insights da Gemini. Retorna: summary, suggestions, alerts, score |
| useChatbot.js | Conversa com chatbot. Retorna: messages, sendMessage, clearHistory |
| useReminders.js | Operações de lembretes. Retorna: reminders, create, update, delete, syncStatus |
| useTransport.js | Operações de VT. Retorna: balance, sales, registerSale, registerUsage, countdown |
| useReports.js | Dados para relatórios. Retorna: monthlyData, categoryData, comparisonData |
| useGamification.js | Dados de gamificação. Retorna: streak, achievements, level, challenge |
| useTheme.js | Tema claro/escuro. Retorna: theme, toggleTheme. Persiste no localStorage |

---

### 📁 `store/` — Estado global (Redux Toolkit)

Dados que múltiplos componentes precisam. Persiste entre navegações. Async thunks chamam os services. Não colocar estado local de um componente só.

**index.js** — configureStore com todos os reducers.

**hooks.js** — useAppSelector e useAppDispatch tipados. Usar ESSES ao invés dos originais.

| Slice | Estado | Async Thunks |
|---|---|---|
| authSlice.js | user, accessToken, isAuthenticated, isLoading, error | loginUser, registerUser, logoutUser, refreshToken |
| transactionSlice.js | transactions, filtros ativos | fetchTransactions, createTransaction, updateTransaction, deleteTransaction |
| goalSlice.js | metas do usuário | fetchGoals, createGoal, updateGoal, contributeToGoal |
| tripSlice.js | viagens e pretensões | fetchTrips, createTrip, addTripExpense |
| insightSlice.js | insights e score | fetchInsights, fetchScore |
| reminderSlice.js | lembretes | fetchReminders, createReminder, syncCalendar |
| transportSlice.js | dados de VT (saldo, vendas, uso) | fetchVTData, registerSale, registerUsage |
| gamificationSlice.js | streak, conquistas, nível, desafio | fetchGamificationData |
| themeSlice.js | tema (light/dark). Persiste no localStorage | toggleTheme, setTheme |

---

### 📁 `services/` — Comunicação HTTP

Toda comunicação HTTP fica aqui. Retornam a promise diretamente. Chamados pelos async thunks dos slices. Não tratam loading/error. Não acessam store.

**api.js** — Instância axios com baseURL, interceptor de token JWT e refresh automático em 401.

| Service | Endpoints |
|---|---|
| authService.js | POST /auth/login, POST /auth/register, GET /auth/verify, POST /auth/forgot-password, POST /auth/reset-password, POST /auth/refresh, POST /auth/logout, GET /auth/google/callback |
| transactionService.js | GET /transactions, GET /transactions/:id, POST /transactions, PUT /transactions/:id, DELETE /transactions/:id, GET /transactions/recurring |
| goalService.js | GET /goals, GET /goals/:id, POST /goals, PUT /goals/:id, DELETE /goals/:id, POST /goals/:id/contribute |
| tripService.js | GET /trips, GET /trips/:id, POST /trips, PUT /trips/:id, DELETE /trips/:id, POST /trips/:id/expenses, DELETE /trips/:id/expenses/:eid |
| insightService.js | GET /insights/summary, GET /insights/suggestions, GET /insights/alerts, GET /insights/score |
| chatbotService.js | POST /chatbot/message |
| reminderService.js | GET /reminders, POST /reminders, PUT /reminders/:id, DELETE /reminders/:id, POST /reminders/sync |
| transportService.js | GET /transport, POST /transport/sales, POST /transport/usage, GET /transport/sales |
| reportService.js | GET /reports/monthly, GET /reports/categories, GET /reports/comparison, GET /reports/evolution |
| currencyService.js | GET /currency/rates, GET /currency/convert, GET /currency/history, GET /currency/favorites, POST /currency/favorites |
| gamificationService.js | GET /gamification, GET /gamification/achievements, GET /gamification/challenge |

---

### 📁 `schemas/` — Validação com Zod

Usados pelo React Hook Form (zodResolver). Validação no front ANTES de enviar pro back. O back TAMBÉM valida (defesa em profundidade).

| Schema | Campos |
|---|---|
| authSchemas.js | loginSchema (email, password), registerSchema (name, email, password, confirmPassword), forgotSchema (email) |
| transactionSchemas.js | transactionSchema (amount, date, description, category, resource, type, isRecurring, frequency) |
| goalSchemas.js | goalSchema (name, targetAmount, deadline, type, description), contributionSchema (amount, date) |
| tripSchemas.js | tripSchema (destination, currency, plannedDate), tripExpenseSchema (category, description, estimatedAmount) |
| reminderSchemas.js | reminderSchema (title, amount, dueDate, advanceDays) |
| transportSchemas.js | vtSaleSchema (buyerName, saleDate, nominalValue, receivedValue), vtUsageSchema (quantity, valuePerTrip, date) |

---

### 📁 `utils/` — Funções puras de utilidade

Funções puras (mesmo input = mesmo output). Sem efeitos colaterais. Sem hooks, store ou chamadas HTTP.

**formatCurrency.js** — formatBRL(valor) → R$ 1.200,00 | formatUSD(valor) → $ 1,200.00 | formatGeneric(valor, moeda)

**formatDate.js** — formatDate → 22/04/2026 | formatDateTime → 22/04/2026 às 14:30 | formatRelative → "há 2 dias" | daysUntil → 12

**constants.js** — ROUTES, RESOURCE_TYPES, GOAL_STATUS, CHART_COLORS, FINANCIAL_LEVELS

**helpers.js** — calculatePercentage, getResourceColor, getScoreColor, truncateText

---

### 📁 `styles/` — Estilos globais

**globals.css** — @import "tailwindcss". @theme com variáveis da paleta Vital Purple. Cores customizadas: primary, success, danger, warning, info. Dark mode via classe .dark. Fontes: Inter (sans), JetBrains Mono (mono).

---

### 📁 `tests/` — Testes unitários (Vitest + Testing Library)

Cobertura mínima: 85%. Rodar com: npm test.

- **tests/components/** — NomeComponente.spec.jsx. Testa: renderização, interação, props.
- **tests/hooks/** — useNome.spec.js. Testa: retorno de dados, chamadas dispatch.
- **tests/services/** — nomeService.spec.js. Testa: chamadas HTTP corretas, payloads.

---

## 🔄 Fluxo de Dados

👤 Usuário interage com a tela
│
▼
page / component (estilizado com Tailwind v4)
│
▼
dispatch(asyncThunk) — ex: dispatch(fetchTransactions())
│
▼
async thunk chama o service — ex: transactionService.getAll()
│
▼
service (axios) faz a requisição HTTP
│
▼
══════ HTTPS ══════
/api/transactions
══════ HTTPS ══════
│
▼
async thunk resolve → slice atualiza o state
│
▼
componente re-renderiza via useAppSelector(state => state.transactions)

Se token expirar (401): interceptor do axios detecta → tenta refresh automático → sucesso: repete requisição | falha: dispatch(logout) e redireciona para /login.

---

## 🛣️ Rotas da Aplicação

**Públicas (AuthLayout — sem menu)**

| Rota | Tela |
|---|---|
| /login | Login |
| /register | Cadastro |
| /forgot-password | Recuperação de senha |

**Privadas (MainLayout — usuário logado)**

| Rota | Tela |
|---|---|
| / | Dashboard |
| /transactions | Gestão de transações |
| /goals | Metas financeiras |
| /trips | Planejador de viagens + câmbio |
| /insights | Análises inteligentes (Gemini) |
| /reminders | Lembretes + Google Agenda |
| /transport | Controle de Vale Transporte |
| /reports | Relatórios e exportações |
| /profile | Perfil e configurações |

**Catch-all:** * → Página 404

---

## ▶️ Como Rodar

# Instalar dependências
npm install

# Copiar o .env
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
# → http://localhost:5173

# Gerar build de produção
npm run build

# Rodar os testes
npm test

# Rodar o lint
npm run lint

---

## 📋 Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm test` | Testes unitários (Vitest) |
| `npm run lint` | Lint (ESLint) |

---

## 🔑 Variáveis de Ambiente

Copie o `.env.example` e crie seu `.env`:

cp .env.example .env

VITE_API_URL=http://localhost:3333/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
