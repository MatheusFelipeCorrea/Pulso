# [EPIC] Dashboard Principal — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-002 | Dashboard Principal |
| Feature | PULSO-FEAT-006 | Backend — agregação GET /dashboard |
| Feature | PULSO-FEAT-007 | Página dashboard, saldos e recursos |
| Feature | PULSO-FEAT-008 | Gráficos receitas/despesas e categorias |
| Feature | PULSO-FEAT-009 | Widgets resumo e saúde financeira |
| Feature | PULSO-FEAT-010 | Importação de extratos via dashboard |
| Feature | PULSO-FEAT-011 | Quick-add via chatbot (RF-139) |
| Task | PULSO-TASK-013–024 | Backend, frontend, import, QA |

---

---
card_id: PULSO-EPIC-002
title: "Dashboard Principal"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
  - Integração Externa
---

# [EPIC] Dashboard Principal

> **Contexto:** Painel central pós-login do Pulso — consolida saldos, gráficos, alertas de orçamento, metas ativas, saúde financeira e ponto de entrada para importação de extratos. Destino autenticado padrão: `/dashboard`.

**Refs:** RF-007–014 · RF-155–158 · RF-160 · RF-139 (pendente)

## 🎯 Objetivos

- Exibir saldo total do mês e saldos por recurso (DINHEIRO, VA, VR, VT) com variação vs. mês anterior (RF-007, RF-008)
- Gráfico receitas vs. despesas diárias do mês com seletor de período (RF-009)
- Gráfico donut de gastos por categoria (RF-010)
- Listar últimas transações, alertas de orçamento (≥80%), progresso de metas ativas (RF-011–013)
- Score de saúde financeira com checklist explicativo (RF-014)
- Importar extratos (OFX/CSV/XLSX/PDF) via modal no dashboard (RF-155–158, RF-160)
- Quick-add via chatbot para lançamento em linguagem natural (RF-139 — pendente)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/dashboard` | Dashboard | Carrega `GET /dashboard?mes=YYYY-MM`; header com saudação + importar extrato |
| Modal import | ImportStatementModal | pick → mapping (CSV) → preview → confirmar → recarrega dashboard |

**Layout:** `MainLayout` + sidebar · **API única:** `GET /api/dashboard` · **Redirect pós-login:** `/dashboard`

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `transactionService.calcularResumo`, `transactionRepository.listarPorUsuario` |
| Orçamento | `budgetService.obterStatusOrcamento` → alertas ≥80% |
| Metas | `metaRepository.listarPorUsuario` (status ATIVA, limite 4) |
| VT | `transportService.obterSaldoVt` para saldo VT em tempo real |
| Importação | `POST /importacoes/analisar` + `POST /importacoes/confirmar` |
| Notificações | `NotificationPanel` no header (MainLayout) — tipos linkam para `/dashboard` |

## 🔗 Sub-issues

- PULSO-FEAT-006
- PULSO-FEAT-007
- PULSO-FEAT-008
- PULSO-FEAT-009
- PULSO-FEAT-010
- PULSO-FEAT-011

## 📋 Resumo

### ✅ Concluído
- Escopo mapeado nos RFs RF-007–014 e RF-155–158/160
- Contrato agregado `GET /dashboard` especificado com payloads por seção
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar endpoint agregado e todos os widgets frontend
- Fluxo completo de importação via modal
- RF-139 quick-add (depende módulo Chatbot)
- RF-159 aprendizado de categorização na importação (fora do escopo mínimo deste epic)
- Testes unitários dedicados para `dashboardService`

---
---
card_id: PULSO-FEAT-006
title: "Backend — agregação GET /dashboard"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Arquitetura
---

# [FEATURE] Backend — agregação GET /dashboard

> **Contexto:** Endpoint único que compõe todos os blocos do dashboard reutilizando services existentes (transações, orçamento, metas, VT), evitando N+1 requests no frontend.

**Refs:** RF-007–014 (dados)

## 📝 Descrição

`GET /api/dashboard?mes=YYYY-MM` deve retornar payload agregado: saldo total com variação, recursos, série receitas/despesas, gastos por categoria, últimas transações, alertas de orçamento, metas ativas e saúde financeira.

## ✅ Critérios de Aceite

### Cenário 1 — Mês corrente
**Quando** `GET /api/dashboard` sem query,  
**Então** usa mês atual como referência.

### Cenário 2 — Mês histórico
**Quando** `GET /api/dashboard?mes=2026-03`,  
**Então** todos os blocos refletem março/2026.

### Cenário 3 — Autenticação
**Quando** request sem JWT válido,  
**Então** retorna `401`.

### Cenário 4 — Payload completo
**Então** JSON contém: `mes`, `saldoTotal`, `recursos`, `receitasDespesas`, `gastosPorCategoria`, `ultimasTransacoes`, `alertasOrcamento`, `metasAtivas`, `saudeFinanceira`.

## 🔗 Sub-issues

- PULSO-TASK-013
- PULSO-TASK-014

## 📋 Resumo

### ✅ Concluído
- Contrato de resposta e dependências entre services documentados

### ⏳ Pendente
- PULSO-TASK-013 — `dashboardService.obterDashboard`
- PULSO-TASK-014 — controller, routes e mount

---
---
card_id: PULSO-FEAT-007
title: "Página dashboard, saldos e recursos"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [FEATURE] Página dashboard, saldos e recursos

> **Contexto:** Shell da página principal pós-login com saldo total destacado e cards por recurso financeiro (RF-007, RF-008).

**Refs:** RF-007 · RF-008

## 📝 Descrição

Como **usuário autenticado**, quero ver meu saldo total e saldos separados por DINHEIRO, VA, VR e VT (com sugestão diária de VR), para entender minha disponibilidade financeira do mês.

## ✅ Critérios de Aceite

### Cenário 1 — Carregamento
**Quando** acesso `/dashboard`,  
**Então** exibe loading e chama `GET /dashboard?mes=YYYY-MM`.

### Cenário 2 — Saldo total
**Então** card principal mostra saldo formatado + badge de variação % vs. mês anterior (quando aplicável).

### Cenário 3 — Recursos
**Então** carousel/grid de `ResourceCard` por tipo (DINHEIRO, VA, VR, VT) com scroll horizontal em mobile.

### Cenário 4 — Destino pós-login
**Quando** login/OAuth concluído,  
**Então** redirect para `/dashboard` (`DEFAULT_AUTHENTICATED_ROUTE`).

## 🔗 Sub-issues

- PULSO-TASK-015
- PULSO-TASK-016

## 📋 Resumo

### ✅ Concluído
- Spec de layout header + seção de saldos definida

### ⏳ Pendente
- PULSO-TASK-015 — DashboardPage + routing
- PULSO-TASK-016 — BalanceSection + ResourceCard

---
---
card_id: PULSO-FEAT-008
title: "Gráficos receitas/despesas e categorias"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [FEATURE] Gráficos receitas/despesas e categorias

> **Contexto:** Visualizações principais do dashboard — evolução diária de receitas vs. despesas e distribuição de gastos por categoria (RF-009, RF-010).

**Refs:** RF-009 · RF-010

## 📝 Descrição

Gráfico de área (Recharts) com série diária do mês e donut de categorias. Seletor de mês sincronizado com query `?mes=` do endpoint agregado.

## ✅ Critérios de Aceite

### Cenário 1 — Receitas vs. despesas
**Então** `AreaChart` com duas séries (receitas verde, despesas vermelho), eixo X por dia, tooltip formatado em BRL.

### Cenário 2 — Tema claro/escuro
**Então** cores do gráfico adaptam via `useTheme` (tokens distintos light/dark).

### Cenário 3 — Navegação de mês
**Quando** altero mês no picker ou setas prev/next,  
**Então** recarrega dashboard para o período selecionado.

### Cenário 4 — Donut categorias
**Então** exibe top categorias com cor/ícone, percentual e total; estado vazio amigável.

## 🔗 Sub-issues

- PULSO-TASK-017

## 📋 Resumo

### ✅ Concluído
- Spec Recharts + MonthPicker + empty states definida

### ⏳ Pendente
- PULSO-TASK-017 — IncomeExpenseChart + CategoryDonut

---
---
card_id: PULSO-FEAT-009
title: "Widgets resumo e saúde financeira"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - Backend
  - UX / UI
  - Regra de Negócio
---

# [FEATURE] Widgets resumo e saúde financeira

> **Contexto:** Blocos informativos complementares — transações recentes, alertas de orçamento, metas ativas e score de saúde (RF-011–014).

**Refs:** RF-011 · RF-012 · RF-013 · RF-014

## 📝 Descrição

Compor widgets que consomem dados já agregados em `GET /dashboard`: últimas 25 transações do mês, categorias de orçamento ≥80%, até 4 metas ATIVAS e score 0–100 com checklist.

## ✅ Critérios de Aceite

### Cenário 1 — Últimas transações
**Então** lista com descrição, valor, categoria e link para `/transactions`.

### Cenário 2 — Alertas orçamento
**Então** banner/cards para categorias ≥80% do limite; destaque visual para ≥100%.

### Cenário 3 — Metas ativas
**Então** cards com progresso %, valor atual/meta e link para `/goals`.

### Cenário 4 — Saúde financeira
**Então** score 0–100, label (Atenção/Regular/Bom/Excelente), mensagem e checklist (fluxo, orçamento, metas).

## 🔗 Sub-issues

- PULSO-TASK-018
- PULSO-TASK-019

## 📋 Resumo

### ✅ Concluído
- Algoritmo de score e critérios de alerta especificados

### ⏳ Pendente
- PULSO-TASK-018 — widgets transações, alertas e metas
- PULSO-TASK-019 — `calcularSaudeFinanceira` + componente health

---
---
card_id: PULSO-FEAT-010
title: "Importação de extratos via dashboard"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Integração Externa
  - Regra de Negócio
  - Inteligência Artificial
---

# [FEATURE] Importação de extratos via dashboard

> **Contexto:** Fluxo upload → preview editável → confirmar, acionado pelo botão "Importar extrato" no dashboard (RF-155–158, RF-160).

**Refs:** RF-155 · RF-156 · RF-157 · RF-158 · RF-160

## 📝 Descrição

Suportar importação de extratos bancários (OFX, CSV, XLSX, PDF via Gemini), benefícios VA/VR/VT, preview editável com dedupe, mapeamento manual de colunas CSV e ajuste de saldo quando necessário.

## ✅ Critérios de Aceite

### Cenário 1 — Upload
**Quando** seleciono tipo (CONTA, VA, VR, VT) e arquivo válido,  
**Então** `POST /importacoes/analisar` retorna linhas parseadas ou pede mapeamento.

### Cenário 2 — Mapeamento CSV
**Quando** CSV desconhecido,  
**Então** step mapping para data/valor/descrição antes do preview.

### Cenário 3 — Preview editável
**Então** usuário edita categorias, ignora duplicatas sinalizadas (hash data+valor+descrição).

### Cenário 4 — Confirmar
**Quando** `POST /importacoes/confirmar`,  
**Então** transações gravadas em lote; modal fecha e dashboard recarrega.

### Cenário 5 — PDF
**Quando** PDF de extrato,  
**Então** parser via Gemini (`GEMINI_API_KEY_PDF` / `GEMINI_PDF_MODEL`).

## 🔗 Sub-issues

- PULSO-TASK-020
- PULSO-TASK-021

## 📋 Resumo

### ✅ Concluído
- Fluxo multi-step e contratos analyze/confirm definidos

### ⏳ Pendente
- PULSO-TASK-020 — backend parsers + importService
- PULSO-TASK-021 — ImportStatementModal + steps frontend
- RF-159 aprendizado de categorização (evolução futura)

---
---
card_id: PULSO-FEAT-011
title: "Quick-add via chatbot"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - Integração Externa
  - Inteligência Artificial
  - UX / UI
---

# [FEATURE] Quick-add via chatbot

> **Contexto:** Botão de acesso rápido (FAB) no dashboard para registrar transação em linguagem natural via chatbot (RF-139). **Depende do módulo Chatbot/Insights.**

**Refs:** RF-139

## 📝 Descrição

Como **usuário**, quero um atalho no dashboard para abrir o chatbot e registrar uma transação por texto livre (ex.: "gastei 45 reais no almoço"), reutilizando parser Gemini Flash do chatbot.

## ✅ Critérios de Aceite

### Cenário 1 — FAB visível
**Então** botão flutuante fixo no dashboard (mobile-friendly).

### Cenário 2 — Abrir chatbot
**Quando** clico no FAB,  
**Então** abre painel/modal do chatbot focado em quick-add de transação.

### Cenário 3 — Confirmação
**Quando** chatbot propõe transação parseada,  
**Então** usuário confirma e transação é criada; dashboard recarrega.

## 🔗 Sub-issues

- PULSO-TASK-022

## 📋 Resumo

### ✅ Concluído
- RF-139 documentado como extensão do dashboard

### ⏳ Pendente
- PULSO-TASK-022 — FAB + integração chatbot (bloqueado até módulo Chatbot existir)

---
---
card_id: PULSO-TASK-013
title: "Backend — dashboardService.obterDashboard"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-006
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Arquitetura
---

# [TASK] Backend — dashboardService.obterDashboard

> **Contexto:** Service de agregação que compõe todos os blocos do dashboard em uma única chamada paralela.

## 📝 Descrição

Implementar `obterDashboard(usuarioId, query)` orchestrando resumo mensal, série diária, categorias, saldos, metas, orçamento e saúde financeira.

## ✅ Critérios de Aceite

**Quando** `obterDashboard(userId, { mes: '2026-08' })`,  
**Então** retorna objeto com todas as chaves do contrato documentado na feature PULSO-FEAT-006.

## 🛠️ Implementação

### `dashboardService.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/services/dashboardService.js`

```javascript
// obterDashboard(usuarioId, query)
// obterSerieReceitasDespesas(usuarioId, inicio, fim)
// obterGastosPorCategoria(usuarioId, inicio, fim)
// obterSaldosRecursos(usuarioId, mesReferencia)
// calcularSaudeFinanceira({ resumoMes, alertasOrcamento, metasAtivas })
// buildVariacaoPercentual(atual, anterior)
```

**Dependências (reutilizar, não duplicar lógica):**

| Service/Util | Uso |
|--------------|-----|
| `transactionService.calcularResumo` | Resumo mês atual e anterior |
| `transactionRepository.listarPorUsuario` | Últimas transações (limite 25) |
| `budgetService.obterStatusOrcamento` | Alertas ≥80% |
| `metaRepository.listarPorUsuario` | Metas ATIVAS (limite 4) |
| `transportService.obterSaldoVt` | Saldo VT real-time |
| `resourceBalanceUtils` | `calcularSaldosPorRecurso`, `saldoTotalDisponivel`, `diasUteisRestantesNoMes` |
| `monthUtils` | `mesReferenciaFromQuery`, `intervaloDoMes`, `mesAnterior` |

**Filtros:** excluir ajustes de saldo de importação via `whereExcluiAjusteSaldoImportacao`

## 📐 Regras de Negócio

- Saldo total = soma DINHEIRO + VA + VR + VT
- Sugestão diária VR = saldo VR / dias úteis restantes no mês
- Alertas orçamento: categorias com `percentualUsado >= 80`
- Score saúde: 0–100 baseado em fluxo, orçamento estourado e progresso de metas

## 📋 Resumo

### ✅ Concluído
- Contrato de agregação e mapa de dependências definidos

### ⏳ Pendente
- Implementar service e helpers internos
- Garantir `Promise.all` para performance

---
---
card_id: PULSO-TASK-014
title: "Backend — controller, routes e mount /dashboard"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-006
due_date: null
categories:
  - Backend
---

# [TASK] Backend — controller, routes e mount /dashboard

> **Contexto:** Expor o service de dashboard via REST autenticado.

## 📝 Descrição

Criar camada HTTP fina: controller → service, rota protegida por `authMiddleware`.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/api/dashboard` | `authMiddleware` → `obterDashboard(req.user.id, req.query)` → `200` |

Query opcional: `mes=YYYY-MM`

## 🛠️ Implementação

### `dashboardController.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/controllers/dashboardController.js`

- `obterDashboard(req, res, next)`

### `dashboardRoutes.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/routes/dashboardRoutes.js`

```javascript
router.get('/', authMiddleware, dashboardController.obterDashboard)
```

### `routes/index.js` (EXISTENTE — MODIFICAR)

Adicionar: `router.use('/dashboard', dashboardRoutes)`

## 📋 Resumo

### ✅ Concluído
- Contrato HTTP definido

### ⏳ Pendente
- Implementar controller e routes
- Registrar mount em `routes/index.js`

---
---
card_id: PULSO-TASK-015
title: "Frontend — DashboardPage e routing"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — DashboardPage e routing

> **Contexto:** Página principal do app autenticado e destino pós-login.

## 📝 Descrição

Como **usuário**, quero acessar `/dashboard` após login e ver meu resumo financeiro carregado via API agregada.

## ✅ Critérios de Aceite

### Cenário 1 — Rota protegida
**Então** `/dashboard` sob `ProtectedRoute` + `MainLayout`.

### Cenário 2 — Fetch com abort
**Quando** mudo período ou desmonto componente,  
**Então** request anterior é cancelada (`AbortController`).

### Cenário 3 — Header
**Então** saudação "Olá, {nome}!" + subtítulo do mês + botão "Importar extrato".

### Cenário 4 — Pós-login
**Então** `DEFAULT_AUTHENTICATED_ROUTE = '/dashboard'`.

## 🛠️ Implementação

### Páginas e config (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `Codigo/Pulso/web/src/pages/DashboardPage.jsx` | Orquestra widgets + estado `periodo` |
| `Codigo/Pulso/web/src/services/dashboardService.js` | `obterDashboard({ mes }, { signal })` |
| `Codigo/Pulso/web/src/config/defaultAuthenticatedRoute.js` | Export `/dashboard` |
| `Codigo/Pulso/web/src/config/sidebarNavigation.js` | Item menu dashboard |
| `Codigo/Pulso/web/src/App.jsx` | Route `path="dashboard"` |

## 📋 Resumo

### ✅ Concluído
- Spec de layout e fluxo de dados definida

### ⏳ Pendente
- Implementar DashboardPage com loading/error states
- Wire routing e redirect pós-auth

---
---
card_id: PULSO-TASK-016
title: "Frontend — saldos e ResourceCard"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — saldos e ResourceCard

> **Contexto:** Seção de saldo total e cards por recurso (RF-007, RF-008).

## 📝 Descrição

Renderizar saldo total com badge de variação e carousel horizontal de recursos financeiros, responsivo em mobile.

## ✅ Critérios de Aceite

### Cenário 1 — Saldo total
**Então** valor formatado BRL + `VariacaoBadge` (% vs. mês anterior quando `tipo: percentual`).

### Cenário 2 — Resource cards
**Então** um card por `recursos[]` (DINHEIRO, VA, VR, VT) com ícone/cor de `resourceConfig.js`.

### Cenário 3 — Sugestão VR
**Quando** recurso VR com `sugestaoDiaria`,  
**Então** exibir hint "≈ R$ X/dia útil restante".

### Cenário 4 — Mobile
**Então** carousel com scroll horizontal + botões prev/next quando overflow.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `components/features/dashboard/DashboardBalanceSection.jsx` | Saldo total + track de cards |
| `components/features/dashboard/ResourceCard/ResourceCard.jsx` | Card individual por recurso |
| `components/features/dashboard/ResourceCard/resourceConfig.js` | Ícones, labels, cores por tipo |
| `styles/dashboard.css` | Layout balance + carousel mobile |
| `styles/pulso-components.css` | Estilos ResourceCard compartilhados |

### Backend util relacionado (NOVO — CRIAR)

`Codigo/Pulso/api/src/utils/resourceBalanceUtils.js` — `RECURSOS_DASHBOARD`, `calcularSaldosPorRecurso`

## 📋 Resumo

### ✅ Concluído
- Spec visual e comportamento mobile definidos

### ⏳ Pendente
- Implementar BalanceSection + ResourceCard
- Estilos responsivos em `dashboard.css`

---
---
card_id: PULSO-TASK-017
title: "Frontend — gráficos Recharts e seletor de mês"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-008
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — gráficos Recharts e seletor de mês

> **Contexto:** RF-009 e RF-010 — visualizações com Recharts e navegação de período.

## 📝 Descrição

Implementar gráfico de área receitas/despesas e donut de categorias, sincronizados com `periodo` do DashboardPage.

## ✅ Critérios de Aceite

### Cenário 1 — Area chart
**Então** `DashboardIncomeExpenseChart` com `receitasDespesas.serie`, totais no header, link "Ver transações".

### Cenário 2 — Month picker
**Então** `MonthPicker` + setas prev/next; emite `onChangePeriodo(YYYY-MM)`.

### Cenário 3 — Donut
**Então** `DashboardCategoryDonut` com `gastosPorCategoria[]`; legenda com cor da categoria.

### Cenário 4 — Tema
**Então** paleta `CHART_THEME` light/dark via `useTheme`.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DashboardIncomeExpenseChart.jsx` | AreaChart Recharts + MonthPicker |
| `DashboardCategoryDonut.jsx` | Pie/Donut chart categorias |
| `utils/transactionRecurrence.js` | `monthPickerParaPeriodo`, `periodoParaMonthPicker` |

**Helper exportado:** `currentDashboardPeriodo()` → `YYYY-MM` atual

**Dependência:** `recharts`, `date-fns`, `@/design-system/components/pickers/MonthPicker`

## 📋 Resumo

### ✅ Concluído
- Spec de charts e navegação de mês definida

### ⏳ Pendente
- Implementar ambos os gráficos com empty/loading states

---
---
card_id: PULSO-TASK-018
title: "Frontend — transações, alertas e metas"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-009
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — transações, alertas e metas

> **Contexto:** Widgets RF-011, RF-012, RF-013.

## 📝 Descrição

Exibir últimas transações do mês, banner de alertas de orçamento e cards de metas ativas.

## ✅ Critérios de Aceite

### Cenário 1 — Transações
**Então** `DashboardRecentTransactions` lista até 25 itens com valor colorido por tipo.

### Cenário 2 — Alertas
**Então** `DashboardBudgetAlerts` no topo quando `alertasOrcamento.length > 0`; link para `/budget?mes=`.

### Cenário 3 — Metas
**Então** `DashboardActiveGoals` com barra de progresso e CTA `/goals`.

### Cenário 4 — Empty states
**Então** mensagens amigáveis quando listas vazias.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DashboardRecentTransactions.jsx` | Lista compacta |
| `DashboardBudgetAlerts.jsx` | Banner/cards alerta orçamento |
| `DashboardActiveGoals.jsx` | Grid de metas ativas |

**Dados:** props vindos de `DashboardPage` (`data.ultimasTransacoes`, `data.alertasOrcamento`, `data.metasAtivas`)

## 📋 Resumo

### ✅ Concluído
- Spec de widgets e links de navegação definida

### ⏳ Pendente
- Implementar 3 componentes + estilos em `dashboard.css`

---
---
card_id: PULSO-TASK-019
title: "Saúde financeira — algoritmo e widget"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-009
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Saúde financeira — algoritmo e widget

> **Contexto:** RF-014 — score composto e checklist explicativo.

## 📝 Descrição

Calcular score 0–100 no backend e exibir widget visual no dashboard com label, mensagem motivacional e checklist de 3 itens.

## ✅ Critérios de Aceite

**Então** payload `saudeFinanceira: { score, label, mensagem, checklist[] }`

**Labels:** Atenção (≤40), Regular, Bom (≥61), Excelente (≥81)

**Checklist items:** fluxo (receitas ≥ despesas), orçamento (0 estourados), metas (progresso médio ou incentivo a criar)

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

Em `dashboardService.js`:

```javascript
// calcularSaudeFinanceira({ resumoMes, alertasOrcamento, metasAtivas })
```

Pontuação base 45 + bônus/penalidades documentados na feature PULSO-FEAT-009.

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DashboardFinancialHealth.jsx` | Score circular/barra + checklist |

## 📋 Resumo

### ✅ Concluído
- Fórmula de score e critérios de checklist especificados

### ⏳ Pendente
- Implementar `calcularSaudeFinanceira` no service
- Implementar widget `DashboardFinancialHealth`

---
---
card_id: PULSO-TASK-020
title: "Backend — importação de extratos"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-010
due_date: null
categories:
  - Backend
  - Integração Externa
  - Regra de Negócio
  - Inteligência Artificial
---

# [TASK] Backend — importação de extratos

> **Contexto:** API de analyze/confirm para RF-155–158 e RF-160.

## 📝 Descrição

Implementar parse multi-formato, sugestão de categorias, dedupe e gravação em lote de transações importadas.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/api/importacoes/analisar` | Upload multipart → linhas + resumo + `precisaMapeamento` |
| `POST` | `/api/importacoes/confirmar` | Grava linhas válidas; ajuste saldo se necessário |

**Origens:** `CONTA`, `VA`, `VR`, `VT` — mapeiam recurso (`DINHEIRO`, `VA`, `VR`, `VT`)

## 🛠️ Implementação

### Service (NOVO — CRIAR)

`Codigo/Pulso/api/src/services/importService.js`

```javascript
// analisarArquivo(usuarioId, { arquivo, origem, mapeamento })
// confirmarImportacao(usuarioId, body)
```

### Parsers (NOVO — CRIAR)

`Codigo/Pulso/api/src/parsers/` — OFX, CSV (delimitador/encoding), XLSX, PDF (Gemini)

### Utils (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `importHashUtils.js` | `buildImportHash` dedupe |
| `importCategoryRules.js` | Regras descrição → categoria |
| `importBeneficioUtils.js` | Saldo extrato, ajuste benefício |
| `categorySuggestionUtils.js` | Sugestão por histórico |

### HTTP (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `importController.js` | `analisarArquivo`, `confirmarImportacao` |
| `importRoutes.js` | Rotas + `handleStatementUpload` middleware |
| `schemas/importSchemas.js` | Zod validate |
| `routes/index.js` | `router.use('/importacoes', importRoutes)` |

**Env PDF:** `GEMINI_API_KEY_PDF`, `GEMINI_PDF_MODEL`

## 📐 Regras de Negócio

- Dedupe: hash estável data+valor+descrição normalizada (RF-158)
- Categorização: regras + histórico + categoria ajuste saldo para benefícios
- Preview obrigatório antes de confirmar (RF-157)

## 📋 Resumo

### ✅ Concluído
- Fluxo analyze/confirm e mapa de parsers definidos

### ⏳ Pendente
- Implementar importService + parsers
- Middleware upload e schemas

---
---
card_id: PULSO-TASK-021
title: "Frontend — modal ImportStatementModal"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-010
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Integração Externa
---

# [TASK] Frontend — modal ImportStatementModal

> **Contexto:** UI multi-step acionada pelo botão "Importar extrato" no dashboard.

## 📝 Descrição

Implementar wizard modal: escolher tipo → upload → (mapping CSV) → preview editável → confirmar.

## ✅ Critérios de Aceite

### Cenário 1 — Steps
**Então** fluxo `pick` → `mapping?` → `preview` → `balance?` → confirmar.

### Cenário 2 — Tipos suportados
**Então** CONTA (OFX/CSV/XLSX/PDF), VA/VR/VT conforme `importStatementTypes.js`.

### Cenário 3 — Preview
**Então** editar categoria por linha, marcar ignorar duplicata, ver totais.

### Cenário 4 — Sucesso
**Então** `onImported()` recarrega dashboard; toast de confirmação.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `ImportStatementModal.jsx` | Orquestrador steps + upload |
| `ImportColumnMappingStep.jsx` | Mapeamento colunas CSV |
| `ImportPreviewStep.jsx` | Tabela editável + dedupe |
| `ImportManualBalanceStep.jsx` | Ajuste saldo manual quando necessário |

### Serviços (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/importService.js` | `analisarExtrato`, `confirmarImportacao` |
| `utils/importStatementTypes.js` | Tipos, validação extensão, labels |

**Hook:** `useTransactionFilterOptions` para lista de categorias no preview

## 📋 Resumo

### ✅ Concluído
- Spec de steps e integração com dashboard definida

### ⏳ Pendente
- Implementar modal e sub-componentes
- Wire botão no header do DashboardPage

---
---
card_id: PULSO-TASK-022
title: "Frontend — FAB quick-add chatbot"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-011
due_date: null
categories:
  - Frontend
  - Web
  - Integração Externa
  - Inteligência Artificial
  - UX / UI
---

# [TASK] Frontend — FAB quick-add chatbot

> **Contexto:** RF-139 — atalho no dashboard para lançamento via linguagem natural.

## 📝 Descrição

Adicionar FAB (floating action button) no dashboard que abre o chatbot em modo quick-add de transação.

## ✅ Critérios de Aceite

### Cenário 1 — Visibilidade
**Então** FAB fixo canto inferior direito, visível apenas em `/dashboard`, acessível por teclado.

### Cenário 2 — Integração
**Quando** chatbot module disponível,  
**Então** abre painel com contexto `quick-add-transaction`.

### Cenário 3 — Pós-confirmação
**Então** dashboard recarrega dados após transação criada.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `components/features/dashboard/DashboardQuickAddFab.jsx` | FAB + handler open chatbot |
| Integração com módulo Chatbot (a criar) | Parser NL → `POST /transacoes` |

**Dependência externa:** módulo Chatbot/Insights (RF-139 bloqueado até existir)

## 📋 Resumo

### ✅ Concluído
- RF-139 especificado como extensão do dashboard

### ⏳ Pendente
- Implementar FAB e hook de abertura do chatbot
- Aguardar API/surface do módulo Chatbot

---
---
card_id: PULSO-TASK-023
title: "Estilos — dashboard.css responsivo"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Estilos — dashboard.css responsivo

> **Contexto:** Layout responsivo unificado para todas as seções do dashboard.

## 📝 Descrição

Criar folha de estilos do dashboard com grid adaptativo, safe-area mobile e tokens do design system (claro/escuro).

## ✅ Critérios de Aceite

### Cenário 1 — Desktop
**Então** grid 2 colunas para charts; bottom row transações + saúde lado a lado.

### Cenário 2 — Mobile
**Então** header em coluna; charts empilhados; carousel saldos sem overflow horizontal da página.

### Cenário 3 — Import modal
**Então** classes `dashboard-import-*` para mapping/preview legíveis em telas pequenas.

## 🛠️ Implementação

### Estilos (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `Codigo/Pulso/web/src/styles/dashboard.css` | Page layout, charts grid, balance, import modal |
| `Codigo/Pulso/web/src/styles/pulso-components.css` | ResourceCard, NotificationPanel (parcial) |

Importar em `DashboardPage.jsx` ou entry global de estilos.

## 📋 Resumo

### ✅ Concluído
- Breakpoints e seções a estilizar mapeados

### ⏳ Pendente
- Implementar CSS responsivo completo
- Validar tema claro/escuro em todos os widgets

---
---
card_id: PULSO-TASK-024
title: "QA — testes dashboard e importação"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes dashboard e importação

> **Contexto:** Cobertura de regressão para agregação e fluxo de import.

## 📝 Descrição

Garantir testes unitários para `dashboardService`, utils de import e smoke dos serviços web.

## ✅ Critérios de Aceite

**Quando** `npm test` na API,  
**Então** suites passam para `importService`, `importHashUtils`, `importBeneficioUtils`.

**Quando** `dashboardService.test.js` existir,  
**Então** cobre saldo total, alertas filtrados, score saúde e variação percentual.

## 🛠️ Implementação

### API — criar em `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/dashboardService.test.js` | Agregação, saúde financeira, saldos |
| `unit/services/importService.test.js` | Analyze, confirm, dedupe, saldo |
| `unit/utils/importHashUtils.test.js` | Hash estável |
| `unit/utils/importBeneficioUtils.test.js` | Regras benefício/ajuste |

### Web — criar (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/dashboardService.test.js` | Chamada GET /dashboard |
| `unit/services/importService.test.js` | Upload mock |

## 📋 Resumo

### ✅ Concluído
- Escopo de testes mapeado por camada

### ⏳ Pendente
- Escrever `dashboardService.test.js` (hoje ausente)
- Expandir cobertura web dos widgets (opcional)

---
