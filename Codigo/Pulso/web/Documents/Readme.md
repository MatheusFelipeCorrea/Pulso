# 🌐 Web — Frontend

Interface do **Pulso** com React + Vite, Tailwind CSS v4, Redux (auth) e design system próprio.

> Este documento descreve o **estado atual do código**. Módulos ainda não implementados aparecem em [Roadmap](#-roadmap).

---

## 🗂️ Índice

- [Estado do projeto](#-estado-do-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Arquitetura em camadas](#-arquitetura-em-camadas)
- [Design System vs Pulso](#-design-system-vs-pulso)
- [Rotas](#-rotas)
- [Sidebar](#-sidebar)
- [Módulo Transações (implementado)](#-módulo-transações-implementado)
- [Módulo Orçamento (implementado)](#-módulo-orçamento-implementado)
- [Módulo Calendário (implementado)](#-módulo-calendário-implementado)
- [Notificações (implementado)](#-notificações-implementado)
- [Autenticação](#-autenticação)
- [Store Redux](#-store-redux)
- [Services e hooks](#-services-e-hooks)
- [Estilos globais](#-estilos-globais)
- [Como rodar](#-como-rodar)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Roadmap](#-roadmap)

---

## 📊 Estado do projeto

| Área | Status |
|------|--------|
| Páginas legais (`/termos`, `/privacidade`) | ✅ |
| Homepage / landing (`/`) | ⏳ Prototipação pendente (placeholder mínimo) |
| Auth (login, registro, OAuth, reset, verify) | ✅ |
| Layout autenticado (MainLayout + Sidebar) | ✅ |
| Design System + demo `/design-system` | ✅ |
| **Transações** (`/transactions`) | ✅ |
| **Vale Transporte** (`/transport-voucher`) | ✅ |
| **Orçamento mensal** (`/budget`) | ✅ |
| **Calendário financeiro** (`/calendar`) | 🟡 Parcial — integração com IA pendente |
| **Notificações** (sino no layout) | ✅ |
| Dashboard, metas, viagens, etc. | 🔜 Placeholder (`InDevelopmentPage`) |

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React 19 | UI |
| Vite 6 | Build e dev server |
| Tailwind CSS v4 | Utilitários (`@tailwindcss/vite`) |
| React Router v7 | Rotas |
| Redux Toolkit | Estado global (**auth**; demais slices planejados) |
| Axios | HTTP |
| React Hook Form + Zod | Formulários (auth e futuros módulos) |
| Lucide React | Ícones |
| date-fns | Datas |
| Toast próprio (design-system) | Notificações — **não** usa Sonner em runtime |
| Vitest + Testing Library | Testes |
| Recharts, PapaParse, @react-pdf/renderer | Dependências para módulos futuros |

---

## 📁 Estrutura de pastas

```
Pulso/web/
├── Documents/Readme.md
├── src/
│   ├── main.jsx                 ← imports de CSS (DS + app)
│   ├── App.jsx
│   ├── design-system/           ← UI reutilizável (ver README próprio)
│   ├── components/
│   │   ├── badges/              ← PulsoBadge, iconRegistry, catálogo
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── budget/          ← orçamento mensal
│   │   │   ├── calendar/        ← calendário + lembretes + Google Calendar
│   │   │   ├── dashboard/       ← NotificationPanel (sino)
│   │   │   ├── transactions/
│   │   │   └── transport/       ← vale transporte
│   │   ├── layouts/
│   │   │   ├── MainLayout/
│   │   │   ├── AuthLayout/
│   │   │   └── Sidebar/
│   │   └── routing/             ← ProtectedRoute, AuthBootstrap
│   ├── pages/
│   ├── hooks/                   ← useFilterOptions, useTransactionFilterOptions
│   ├── services/                ← api, auth, transações, orçamento, calendário, …
│   ├── store/slices/            ← authSlice, themeSlice
│   ├── config/                  ← appRoutes, sidebarNavigation
│   ├── utils/                   ← filterOptions, transactionValidation, etc.
│   ├── styles/                  ← globals, auth, sidebar, transactions, …
│   └── content/                 ← textos legais
```

---

## 🏗️ Arquitetura em camadas

```
Pages
  → components/features (+ layouts)
    → design-system (UI pura)
    → hooks + services (dados)
      → API /api/*
```

**Transações hoje:** estado de filtros e listagem ficam em `TransactionsPage` (useState + useEffect), não em Redux/TanStack Query. Serviços em `transactionService.js`.

---

## 🎨 Design System vs Pulso

| | design-system/ | components/ |
|--|----------------|-------------|
| Conhece Pulso? | ❌ | ✅ |
| HTTP / Redux | ❌ | ✅ (via services/hooks) |
| Cores | `--ds-*` em CSS | Badges/recursos em `components/badges/` |

```jsx
import { Button, Select, Modal } from '@/design-system/components'
import { PulsoBadge } from '@/components/badges/PulsoBadge.jsx'
import { obterOpcoesFiltro } from '@/services/transactionService.js'
```

Documentação: `src/design-system/README.md`

---

## 🛣️ Rotas

### Públicas

| Rota | Página |
|------|--------|
| `/` | Landing (placeholder — prototipação pendente) |
| `/login`, `/register` | Auth |
| `/forgot-password`, `/reset-password/:token` | Recuperação de senha |
| `/verify-email/:token` | Verificação de email |
| `/auth/callback` | Retorno OAuth Google |
| `/termos`, `/privacidade` | Legal |
| `/design-system` | Demo do DS |

### Autenticadas (`MainLayout`)

| Rota | Página |
|------|--------|
| `/transactions` | **Transações** |
| `/transport-voucher` | **Vale Transporte** |
| `/budget` | **Orçamento mensal** |
| `/calendar` | **Calendário financeiro** |
| `/dashboard`, `/goals`, `/trips`, … | `InDevelopmentPage` |

Lista completa de paths: `src/config/appRoutes.js`  
Menu lateral: `src/config/sidebarNavigation.js`

---

## 🗂️ Sidebar

Configuração única em `sidebarNavigation.js` (`SIDEBAR_NAV` + `SIDEBAR_NAV_FOOTER`).

- Desktop: sidebar fixa, colapsável
- Mobile: drawer + header com menu e toggle de tema
- Tema: `useTheme()` → classe `.dark` no `<html>`, chave `ds-theme` no localStorage

---

## 💳 Módulo Transações (implementado)

**Página:** `pages/TransactionsPage.jsx`

**Componentes** (`components/features/transactions/`):

| Arquivo | Função |
|---------|--------|
| `TransactionFilters.jsx` | Busca, período, categoria, tipo, recurso, Filtrar/Limpar |
| `TransactionSummaryCards.jsx` | Receitas, despesas, saldo |
| `TransactionList.jsx` | Lista agrupada por data |
| `TransactionFormModal.jsx` | Criar/editar, tags, recorrência |
| `DeleteTransactionModal.jsx` | Exclusão (incl. futuras recorrentes) |

**Dados:**

- `GET /transacoes`, `/transacoes/resumo`, `/transacoes/filtros`
- `POST /transacoes`, `PATCH /transacoes/:id`, `DELETE /transacoes/:id`
- Opções de filtro/formulário vêm do backend (`useTransactionFilterOptions`)
- Ícones de categoria/recurso: `utils/filterOptions.js` + `components/badges/`

**Estilos:** `styles/transactions.css`

---

## 📊 Módulo Orçamento (implementado)

**Página:** `pages/BudgetPage.jsx`

**Componentes** (`components/features/budget/`):

| Arquivo | Função |
|---------|--------|
| `BudgetSummaryCards.jsx` | Totais de limite, gasto e saldo do mês |
| `BudgetCategoryList.jsx` | Lista de categorias com progresso |
| `BudgetCategoryItem.jsx` | Item individual com barra de uso |
| `BudgetCategoriesWithoutLimit.jsx` | Categorias sem limite definido |
| `BudgetEditModal.jsx` | Definir/editar limites por categoria |
| `BudgetTruncatedLabel.jsx` | Rótulo truncado com tooltip |

**Dados:**

- `GET /orcamentos`, `/orcamentos/status`
- `POST /orcamentos`, `/orcamentos/copiar`
- `DELETE /orcamentos/:id`

**UX:** empty state oferece copiar limites do mês anterior ou definir do zero (sem botão de copiar no header).

**Estilos:** `styles/budget.css`

---

## 📅 Módulo Calendário (implementado)

**Página:** `pages/CalendarPage.jsx`

**Componentes** (`components/features/calendar/`):

| Arquivo | Função |
|---------|--------|
| `CalendarMonthNav.jsx` | Navegação entre meses |
| `CalendarMonthGrid.jsx` | Grade mensal com indicadores |
| `CalendarDayPanel.jsx` | Painel do dia selecionado |
| `CalendarInsightCard.jsx` | Cards de resumo (receitas, despesas, saldo, transações) |
| `ReminderDayCard.jsx` | Lembretes do dia |
| `UpcomingReminders.jsx` | Próximos vencimentos |
| `ReminderFormModal.jsx` | Criar/editar lembrete |
| `GoogleCalendarBanner.jsx` | Status da integração Google |
| `GoogleResyncModal.jsx` | Re-sincronizar eventos pendentes |

**Dados:**

- `GET /calendario/mes`, `/calendario/dia`
- `GET/POST /lembretes`, `PATCH /lembretes/:id`, `POST /lembretes/:id/pagar`, `DELETE /lembretes/:id`
- Google Calendar: `/calendario/google/*` (status, OAuth, sync, desconectar)

**Pendente:** integração com IA na tela (insights/sugestões via Gemini ainda não implementados). Os cards de resumo (`CalendarInsightCard`) são estatísticos, não gerados por IA.

**Estilos:** `styles/calendar.css`

---

## 🔔 Notificações (implementado)

**UI:** `components/layouts/NotificationBell/NotificationBell.jsx` + `components/features/dashboard/NotificationPanel/`

- Contador de não lidas, lista paginada, marcar uma/todas como lidas
- Botões **Ver** (marca lida + navega) e **Marcar como lida**
- Rotas de destino: `utils/notificationRoutes.js` (ex.: alertas de orçamento → `/budget`)

**Dados:** `GET /notificacoes`, `/notificacoes/contador`, `PATCH /notificacoes/:id/marcar-lida`, `PATCH /notificacoes/marcar-todas-lidas`

**Service:** `services/notificationService.js`

---

## 🔐 Autenticação

- JWT access + refresh (`services/authService.js`, `store/slices/authSlice.js`)
- Interceptor Axios em `services/api.js` (401 → refresh ou logout)
- Rotas protegidas: `ProtectedRoute`, bootstrap: `AuthBootstrap`

---

## 🗄️ Store Redux

| Slice | Uso |
|-------|-----|
| `authSlice` | Usuário logado, tokens |
| `themeSlice` | Legado; tema visual usa `useTheme()` + `localStorage` (`ds-theme`) |

Slices de transações, metas, etc. estão comentados em `store/index.js` — previstos para módulos futuros.

---

## 🔌 Services e hooks

### Services (implementados)

| Arquivo | Rotas |
|---------|-------|
| `authService.js` | `/auth/*` |
| `transactionService.js` | `/transacoes/*` |
| `categoryService.js` | `/categorias` |
| `tagService.js` | `/tags` |
| `budgetService.js` | `/orcamentos/*` |
| `calendarService.js` | `/calendario/*` |
| `reminderService.js` | `/lembretes/*` |
| `notificationService.js` | `/notificacoes/*` |
| `transportService.js` | `/transporte/*` |

### Hooks (implementados)

| Hook | Função |
|------|--------|
| `useFilterOptions.js` | Genérico para carregar opções com cache simples |
| `useTransactionFilterOptions.js` | Metadados de filtros/formulário de transações |

### Utils relevantes

| Arquivo | Função |
|---------|--------|
| `filterOptions.js` | Categoria/recurso → opções de Select com ícone |
| `transactionValidation.js` | Regras recurso × categoria (front) |
| `transactionRecurrence.js` | Período, MonthPicker, regra de recorrência |

---

## 🎨 Estilos globais

Importados em `main.jsx` (ordem importa):

```js
import './design-system/styles/tokens.css'
import './design-system/styles/base.css'
import './design-system/styles/components.css'  // Select, inputs, badges, pickers…
import './design-system/styles/animations.css'
import './styles/globals.css'
import './styles/auth.css'
import './styles/legal.css'
import './styles/pulso-components.css'
import './styles/sidebar.css'
import './styles/transactions.css'
import './styles/budget.css'
import './styles/calendar.css'
import './styles/transport.css'
```

---

## ▶️ Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server (`http://localhost:5173`) |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |
| `npm test` | Vitest |
| `npm run lint` | ESLint |

---

## 🔑 Variáveis de ambiente

```env
VITE_API_URL=http://localhost:3333/api
VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

---

## 🗺️ Roadmap

Epics e critérios de aceite: `.github/plans/cards/`

Módulos ainda em placeholder (dashboard, metas, viagens, insights, etc.) seguem o plano de produto em `.github/plans/cards/`.

**Calendário:** integração com IA (Gemini) na tela ainda pendente.
