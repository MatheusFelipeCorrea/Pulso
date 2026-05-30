# 🌐 Web — Frontend

Interface construída com **React + Vite** estilizada com **Tailwind CSS v4.2**, gerenciamento de estado global com **Redux Toolkit (Slices)** e um **Design System próprio reutilizável** seguindo uma arquitetura baseada em **componentes, páginas e camadas de dados**.

---

## 🗂️ Índice

- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Arquitetura em Camadas](#-arquitetura-em-camadas)
- [Design System vs Projeto](#-design-system-vs-projeto)
- [Descrição das Camadas](#-descrição-das-camadas)
- [Fluxo de Dados](#-fluxo-de-dados)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Sidebar — Menus e Submenus](#-sidebar--menus-e-submenus)
- [Modais](#-modais)
- [Como Rodar](#-como-rodar)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca de interface |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS v4.2 | Estilização (CSS-first, plugin Vite) |
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
 │
 ├── design-system/           ← 🎨 REUTILIZÁVEL (portável)
 │   ├── components/
 │   │   ├── inputs/
 │   │   ├── selects/
 │   │   ├── pickers/
 │   │   ├── buttons/
 │   │   ├── feedback/
 │   │   ├── data-display/
 │   │   ├── navigation/
 │   │   ├── overlays/
 │   │   ├── forms/
 │   │   └── index.js
 │   ├── hooks/
 │   ├── utils/
 │   ├── styles/
 │   │   ├── tokens.css
 │   │   ├── base.css
 │   │   └── animations.css
 │   └── README.md
 │
 ├── components/              ← 💼 ESPECÍFICO DO PULSO
 │   ├── layouts/
 │   │   ├── MainLayout/
 │   │   ├── AuthLayout/
 │   │   ├── Header/
 │   │   ├── Sidebar/
 │   │   └── Footer/
 │   └── features/
 │       ├── auth/
 │       ├── dashboard/
 │       ├── transactions/
 │       ├── goals/
 │       ├── trips/
 │       ├── insights/
 │       ├── chatbot/
 │       ├── reminders/
 │       ├── transport/
 │       ├── reports/
 │       ├── gamification/
 │       ├── groups/
 │       ├── budget/
 │       ├── debts/
 │       ├── split/
 │       ├── purchase/
 │       ├── calendar/
 │       └── homepage/
 │
 ├── pages/
 ├── hooks/                   ← hooks específicos do Pulso
 ├── store/
 │   └── slices/
 ├── services/
 ├── schemas/
 ├── utils/                   ← utils específicos do Pulso
 ├── styles/
 │   └── globals.css          ← importa design-system + tema Pulso
 └── tests/
     ├── components/
     ├── hooks/
     └── services/
```

---

## 🏗️ Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                        PAGES                             │
│  Telas completas que compõem as rotas                    │
└─────────────────────────┬───────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│              COMPONENTS (features + layouts)              │
│  Componentes de NEGÓCIO específicos do Pulso             │
│  Importam do design-system para construir a UI           │
└───────────┬─────────────────────────┬───────────────────┘
         ▼                         ▼
┌───────────────────────┐  ┌──────────────────────────────┐
│    DESIGN SYSTEM      │  │      HOOKS + STORE           │
│  Componentes puros    │  │  Lógica + Estado global      │
│  Não conhecem Pulso   │  │  Conectam UI com dados       │
│  Portáveis            │  │                              │
└───────────────────────┘  └──────────────┬───────────────┘
                                       ▼
                        ┌──────────────────────────────┐
                        │         SERVICES              │
                        │  Comunicação HTTP (Axios)     │
                        └──────────────┬───────────────┘
                                       ▼
                        ┌──────────────────────────────┐
                        │         API BACKEND           │
                        └──────────────────────────────┘
```

---

## 🎨 Design System vs Projeto

| Aspecto | 🎨 design-system/ | 💼 components/ |
|---|---|---|
| Conhece "Pulso"? | ❌ Não | ✅ Sim |
| Importa de fora? | ❌ Nunca | ✅ Importa do design-system |
| Acessa Redux? | ❌ Nunca | ✅ Sim |
| Faz HTTP? | ❌ Nunca | ✅ Via hooks/services |
| Recebe dados via? | Props | Props + Store + Hooks |
| Cores via? | CSS Variables (--ds-*) | CSS Variables (definidas no tema Pulso) |
| Portável? | ✅ Copia pra qualquer projeto | ❌ Específico do Pulso |

**Import correto:**

```jsx
// ✅ Feature importa do design-system
import { Button, InputMoney, Select, Modal } from '@/design-system/components'

// ✅ Feature importa hooks do projeto
import { useTransactions } from '@/hooks/useTransactions'

// ❌ Design-system NUNCA importa do projeto
// import { useAuth } from '@/hooks/useAuth'  ← PROIBIDO dentro de design-system
```

---

## 📖 Descrição das Camadas

---

### 📁 `design-system/` — Componentes Reutilizáveis

Biblioteca de UI genérica. Não sabe o que é "transação", "meta" ou "VT". Só sabe o que é "input", "botão", "modal". Pode ser copiada integralmente para qualquer outro projeto React + Tailwind.

**Documentação completa:** Ver `design-system/README.md`

**Categorias de componentes:**

| Categoria | Componentes |
|---|---|
| inputs/ | InputText, InputPassword, InputMoney, InputNumber, InputSearch, Textarea |
| selects/ | Select, SelectSearch, MultiSelect, MultiSelectSearch, TagsInput |
| pickers/ | DatePicker, DateRangePicker, MonthPicker, TimePicker |
| buttons/ | Button, IconButton |
| feedback/ | Toast, Alert, Spinner, Skeleton, EmptyState, ErrorState |
| data-display/ | Badge, Avatar, ProgressBar, ProgressCircle, Table, Tooltip, Card |
| navigation/ | Tabs, Breadcrumbs, Pagination |
| overlays/ | Modal, Drawer, Dropdown |
| forms/ | Toggle, Checkbox, Radio, FormField |

**Hooks genéricos:** useTheme, useMediaQuery, useClickOutside, useDebounce, useLocalStorage, useKeyboard, useCopyToClipboard, useToggle

**Utils genéricos:** cn (classnames), formatCurrency, formatDate, formatNumber

---

### 📁 `components/layouts/` — Esqueletos Visuais

Layouts que envolvem as páginas. Específicos do Pulso. Usam componentes do design-system.

**MainLayout/** — Header + Sidebar + Conteúdo + Footer. Todas as páginas logadas.

**AuthLayout/** — Tela limpa centralizada. Login, cadastro, recuperação.

**Header/** — Logo, streak, score, avatar, toggle tema.

**Sidebar/** — Menus com dropdown, tag de modo, colapsável, responsiva.

**Footer/** — Versão, créditos.

---

### 📁 `components/features/` — Componentes de Negócio

Organizados por domínio. Cada feature importa do design-system e adiciona lógica de negócio do Pulso.

| Feature | Responsabilidade |
|---|---|
| auth/ | Login, cadastro, recuperação, Google OAuth |
| dashboard/ | Cards de saldo, gráficos, resumos |
| transactions/ | CRUD transações, filtros, recorrentes |
| goals/ | CRUD metas, aportes, progresso |
| trips/ | CRUD viagens, pretensões, conversor, câmbio |
| insights/ | Resumo IA, score, projeções, alertas |
| chatbot/ | Interface de chat com Gemini |
| reminders/ | CRUD lembretes, Google Calendar |
| transport/ | Gestão VT (saldo, vendas, uso) |
| reports/ | Gráficos comparativos, export PDF/CSV |
| gamification/ | Streak, conquistas, XP, desafios, quiz |
| groups/ | CRUD grupos, membros, viagem/meta compartilhada |
| budget/ | Orçamento mensal, limites por categoria |
| debts/ | Dívidas pessoais (quem deve, quem eu devo) |
| split/ | Divisão de despesas (rachas) |
| purchase/ | Planejamento de compra, simulação parcelas |
| calendar/ | Calendário financeiro + lembretes unificados |
| homepage/ | Landing page (hero, features, CTA) |

---

### 📁 `pages/` — Telas da Aplicação

Cada page monta uma tela completa usando components/features. Dispatcham actions do Redux. Gerenciam estado local quando necessário.

| Página | Rota | Layout |
|---|---|---|
| Homepage.jsx | / | Próprio |
| Login.jsx | /login | AuthLayout |
| Register.jsx | /register | AuthLayout |
| ForgotPassword.jsx | /forgot-password | AuthLayout |
| ResetPassword.jsx | /reset-password/:token | AuthLayout |
| VerifyEmail.jsx | /verify-email/:token | AuthLayout |
| Dashboard.jsx | /dashboard | MainLayout |
| Transactions.jsx | /transactions | MainLayout |
| Budget.jsx | /budget | MainLayout |
| Transport.jsx | /transport | MainLayout |
| Calendar.jsx | /calendar | MainLayout |
| Debts.jsx | /debts | MainLayout |
| Split.jsx | /split | MainLayout |
| Goals.jsx | /goals | MainLayout |
| Trips.jsx | /trips | MainLayout |
| TripDetail.jsx | /trips/:id | MainLayout |
| Purchase.jsx | /purchase | MainLayout |
| Groups.jsx | /groups | MainLayout |
| GroupDetail.jsx | /groups/:id | MainLayout |
| Reports.jsx | /reports | MainLayout |
| Insights.jsx | /insights | MainLayout |
| Chatbot.jsx | /chatbot | MainLayout |
| Achievements.jsx | /achievements | MainLayout |
| Profile.jsx | /profile | MainLayout |
| Settings.jsx | /settings | MainLayout |
| NotFound.jsx | * | — |

---

### 📁 `hooks/` — Lógica Reutilizável (Pulso)

Hooks específicos do projeto. Usam useAppSelector/useAppDispatch. Encapsulam operações de cada domínio.

| Hook | Responsabilidade |
|---|---|
| useAuth.js | Autenticação, user, isAuthenticated |
| useTransactions.js | CRUD transações, filtros |
| useGoals.js | CRUD metas, aportes |
| useTrips.js | CRUD viagens, pretensões |
| useCurrency.js | Cotações, conversão, favoritas |
| useInsights.js | Insights IA, score, projeções |
| useChatbot.js | Mensagens do chatbot |
| useReminders.js | CRUD lembretes, sync calendar |
| useTransport.js | Saldo VT, vendas, uso |
| useBudget.js | Limites por categoria |
| useDebts.js | Dívidas pessoais |
| useSplit.js | Divisão de despesas |
| usePurchase.js | Planejamento de compra |
| useReports.js | Dados de relatórios |
| useGamification.js | Streak, conquistas, XP |
| useGroups.js | CRUD grupos, membros |

---

### 📁 `store/` — Estado Global (Redux Toolkit)

| Slice | Estado | Async Thunks |
|---|---|---|
| authSlice.js | user, token, isAuthenticated | loginUser, registerUser, logoutUser, refreshToken |
| transactionSlice.js | transactions, filtros | fetchTransactions, createTransaction, updateTransaction, deleteTransaction |
| goalSlice.js | metas | fetchGoals, createGoal, contributeToGoal |
| tripSlice.js | viagens, pretensões | fetchTrips, createTrip, addTripExpense |
| insightSlice.js | insights, score | fetchInsights, fetchScore |
| reminderSlice.js | lembretes | fetchReminders, createReminder, syncCalendar |
| transportSlice.js | saldo VT, vendas, uso | fetchVTData, registerSale, registerUsage |
| budgetSlice.js | limites por categoria | fetchBudget, updateLimits |
| debtSlice.js | dívidas | fetchDebts, createDebt, markAsPaid |
| splitSlice.js | divisões | fetchSplits, createSplit |
| purchaseSlice.js | itens desejados | fetchItems, createItem |
| gamificationSlice.js | streak, conquistas, XP | fetchGamificationData |
| groupSlice.js | grupos, membros | fetchGroups, createGroup, joinGroup |
| themeSlice.js | tema (light/dark) | toggleTheme, setTheme |

---

### 📁 `services/` — Comunicação HTTP

Toda comunicação HTTP. Retornam promises. Chamados pelos async thunks dos slices.

**api.js** — Instância Axios com baseURL, interceptor JWT e refresh automático em 401.

| Service | Prefixo de rota |
|---|---|
| authService.js | /auth/* |
| transactionService.js | /transactions/* |
| goalService.js | /goals/* |
| tripService.js | /trips/* |
| insightService.js | /insights/* |
| chatbotService.js | /chatbot/* |
| reminderService.js | /reminders/* |
| transportService.js | /transport/* |
| budgetService.js | /budget/* |
| debtService.js | /debts/* |
| splitService.js | /split/* |
| purchaseService.js | /purchase/* |
| reportService.js | /reports/* |
| currencyService.js | /currency/* |
| gamificationService.js | /gamification/* |
| groupService.js | /groups/* |

---

### 📁 `schemas/` — Validação com Zod

Validação no front ANTES de enviar pro back (defesa em profundidade).

| Schema | Campos validados |
|---|---|
| authSchemas.js | login, register, forgot, reset |
| transactionSchemas.js | create/edit transação |
| goalSchemas.js | create/edit meta, aporte |
| tripSchemas.js | create/edit viagem, pretensão |
| reminderSchemas.js | create/edit lembrete |
| transportSchemas.js | venda VT, uso VT |
| budgetSchemas.js | limites de orçamento |
| debtSchemas.js | novo empréstimo |
| splitSchemas.js | nova divisão |
| purchaseSchemas.js | novo item de compra |
| groupSchemas.js | novo grupo, meta grupo |

---

### 📁 `styles/` — Estilos Globais

**globals.css:**
```css
/* Importa estilos do design system */
@import "../design-system/styles/tokens.css";
@import "../design-system/styles/base.css";
@import "../design-system/styles/animations.css";

/* Importa Tailwind */
@import "tailwindcss";

/* Tema do Pulso (sobrescreve tokens) */
:root { /* cores light */ }
.dark { /* cores dark */ }

/* Estilos específicos do Pulso (se necessário) */
```

---

### 📁 `utils/` — Utilitários Específicos do Pulso

Funções que fazem sentido SÓ no contexto do Pulso (não são genéricas).

| Função | Uso |
|---|---|
| constants.js | ROUTES, RESOURCE_TYPES, GOAL_STATUS, CHART_COLORS, FINANCIAL_LEVELS |
| helpers.js | calculatePercentage, getResourceColor, getScoreColor |
| validators.js | isValidVTSale, isCompatibleResource |

> Funções genéricas (formatCurrency, formatDate, cn) ficam em `design-system/utils/`

---

## 🔄 Fluxo de Dados

```
👤 Usuário interage com a tela
     │
     ▼
Page / Feature Component
(usa componentes do design-system pra UI)
(usa hooks do projeto pra lógica)
     │
     ▼
dispatch(asyncThunk)
     │
     ▼
Async thunk chama Service (Axios)
     │
     ▼
═══════ HTTPS ═══════
 /api/endpoint
═══════ HTTPS ═══════
     │
     ▼
Slice atualiza o state
     │
     ▼
Componente re-renderiza via useAppSelector
```

Se token expirar (401): interceptor detecta → tenta refresh → sucesso: repete | falha: logout + redirect /login

---

## 🛣️ Rotas da Aplicação

**Públicas (sem auth):**

| Rota | Tela |
|---|---|
| / | Homepage |
| /login | Login |
| /register | Cadastro |
| /forgot-password | Esqueci a Senha |
| /reset-password/:token | Redefinir Senha |
| /verify-email/:token | Verificar Email |

**Privadas (autenticadas):**

| Rota | Tela |
|---|---|
| /dashboard | Dashboard |
| /transactions | Transações |
| /budget | Orçamento Mensal |
| /transport | Vale Transporte |
| /calendar | Calendário + Lembretes |
| /debts | Dívidas Pessoais |
| /split | Divisão de Despesas |
| /goals | Metas Financeiras |
| /trips | Viagens e Moedas |
| /trips/:id | Detalhe da Viagem |
| /purchase | Planejamento de Compra |
| /groups | Grupos |
| /groups/:id | Detalhe do Grupo |
| /reports | Relatórios |
| /insights | Insights IA |
| /chatbot | Chatbot |
| /achievements | Gamificação |
| /profile | Perfil |
| /settings | Configurações |
| * | 404 |

---

## 🗂️ Sidebar — Menus e Submenus

```
📊 Dashboard

💰 Financeiro ▾
💳 Transações
📊 Orçamento Mensal
🚌 Vale Transporte
📅 Calendário Financeiro
🤝 Dívidas
💸 Divisão de Despesas

🎯 Planejamento & Metas ▾
🎯 Metas Financeiras
🌍 Viagens e Moedas
🛒 Planejamento de Compra
👥 Grupos

🧠 Inteligência & Relatórios ▾
📈 Relatórios        → /reports
✨ Insights          → /insights   (item próprio — não agrupar com Chatbot)
💬 Chatbot           → /chatbot    (item próprio)
🎮 Gamificação       → /achievements

> Config em código: `src/config/sidebarNavigation.js`

────────
👤 Perfil
⚙️ Configurações
🚪 Sair
```

---

## 📦 Modais

| Modal | Onde abre |
|---|---|
| Nova/Editar Transação | Transações |
| Nova/Editar Meta | Metas |
| Aporte na Meta | Metas |
| Nova/Editar Viagem | Viagens |
| Nova Pretensão | Detalhe Viagem |
| Observação Viagem | Detalhe Viagem |
| Novo/Editar Lembrete | Calendário |
| Registrar Venda VT | Vale Transporte |
| Registrar Uso VT | Vale Transporte |
| Novo Grupo | Grupos |
| Entrar no Grupo | Grupos |
| Convidar pro Grupo | Detalhe Grupo |
| Meta do Grupo | Detalhe Grupo |
| Aporte Meta Grupo | Detalhe Grupo |
| Nova Divisão | Divisão Despesas |
| Lembrete Cobrança | Divisão Despesas |
| Nova Dívida | Dívidas |
| Novo Item Compra | Planejamento Compra |
| Vincular Meta | Planejamento Compra |
| Editar Limites | Orçamento |
| Quiz Financeiro | Gamificação |
| Alterar Senha | Perfil |
| Sessões Ativas | Perfil |
| Confirmar Exclusão | Global (genérico) |

---

## ▶️ Como Rodar

```bash
# Instalar dependências
npm install

# Copiar o .env
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
# → http://localhost:5173

# Build de produção
npm run build

# Testes
npm test

# Lint
npm run lint
```

---

## 📋 Scripts

| Script | Descrição |
|---|---|
| npm run dev | Desenvolvimento com hot reload |
| npm run build | Build de produção |
| npm run preview | Preview do build |
| npm test | Testes unitários (Vitest) |
| npm run lint | Lint (ESLint) |

---

## 🔑 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3333/api
VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
`

---