# [EPIC] Gerenciamento de Transações — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-003 | Gerenciamento de Transações |
| Feature | PULSO-FEAT-012 | Backend — API de transações |
| Feature | PULSO-FEAT-013 | Categorias, tags e sugestão automática |
| Feature | PULSO-FEAT-014 | Transferências entre recursos |
| Feature | PULSO-FEAT-015 | Recorrência e geração automática |
| Feature | PULSO-FEAT-016 | Frontend — página de transações |
| Feature | PULSO-FEAT-017 | QA — testes de transações |
| Task | PULSO-TASK-025–036 | DB, backend, recorrência, frontend, QA |

---

---
card_id: PULSO-EPIC-003
title: "Gerenciamento de Transações"
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
  - Banco de Dados
  - Regra de Negócio
---

# [EPIC] Gerenciamento de Transações

> **Contexto:** Núcleo financeiro do Pulso — registrar, listar, filtrar, editar e excluir receitas, despesas e transferências; vincular categorias/tags; recorrência automática; validação recurso×categoria (VA/VR/VT); sugestão de categoria por histórico.

**Refs:** RF-015–025 · RF-140 · RF-141

## 🎯 Objetivos

- CRUD de transações (receita, despesa, transferência) com validações de domínio
- Categorias padrão + personalizadas com `grupoBeneficio` (VA/VR/VT)
- Tags livres M:N com criação inline no formulário
- Filtros por período, categoria, tipo, recurso; busca por descrição/tag
- Cards de resumo (receitas, despesas, saldo) sincronizados com filtros
- Recorrência RFC 5545 (semanal, quinzenal, mensal, anual) + job diário
- Transferências entre recursos sem contabilizar em totais de receita/despesa (RF-140)
- Sugestão automática de categoria ao digitar descrição (RF-141)
- Impedir despesa de alimentação com recurso VT (RF-025 via `grupoBeneficio`)
- Exclusão recorrente "esta e futuras" preservando histórico passado

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/transactions` | Transações | Resumo, filtros, lista paginada agrupada por data |
| Modal | Nova/Editar | Toggle receita/despesa/transferência, recorrência, tags |
| Modal | Excluir | Simples ou recorrente (só esta / esta e futuras) |
| Modal | Categorias | CRUD categorias custom com preset benefício |
| Modal | Tags | CRUD tags com ícone e cor |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Categorias | Seed no cadastro; `categoryService`, `CategoryManageModal` |
| Tags | `tagService`, `TagManageModal`, `TransacaoTag` |
| Gamificação | `incrementarStreak`, `gamificationService.processarAposTransacao` |
| Notificações | `RECEITA_REGISTRADA`, `DESPESA_REGISTRADA`, `TRANSFERENCIA_REGISTRADA` |
| Insights | `insightService.tentarGerarInsightAposTransacao` |
| Dashboard | `calcularResumo` reutilizado em `dashboardService` |
| Importação | `categorySuggestionUtils` compartilhado com import |
| Cron | `recurringTransactions.js` — 00:05 diário |

## 🔗 Sub-issues

- PULSO-FEAT-012
- PULSO-FEAT-013
- PULSO-FEAT-014
- PULSO-FEAT-015
- PULSO-FEAT-016
- PULSO-FEAT-017

## 📋 Resumo

### ✅ Concluído
- Escopo RF-015–025, RF-140–141 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida
- Contratos API e fluxos de UI documentados como spec

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Concorrência otimista em edição (If-Match) — evolução futura
- Indicador visual de recorrência na lista — opcional

---
---
card_id: PULSO-FEAT-012
title: "Backend — API de transações"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de transações

> **Contexto:** Camada REST para CRUD, listagem paginada, resumo agregado e opções de filtro (RF-015–022, RF-023).

**Refs:** RF-015 · RF-016 · RF-022 · RF-023

## 📝 Descrição

Expor endpoints autenticados em `/api/transacoes` para criar, editar, excluir, listar com filtros e obter resumo financeiro do período.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/transacoes` | Lista paginada com filtros |
| `GET` | `/transacoes/resumo` | Totais receita/despesa/saldo + modos benefício/carteira/fluxo |
| `GET` | `/transacoes/filtros` | Opções para selects (categorias, tags, recursos) |
| `POST` | `/transacoes` | Cria transação |
| `PATCH` | `/transacoes/:id` | Edita parcialmente |
| `DELETE` | `/transacoes/:id` | Exclui (query `excluirFuturas`, `dataCorte`) |

## 🔗 Sub-issues

- PULSO-TASK-025
- PULSO-TASK-026
- PULSO-TASK-027

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e payloads definidos

### ⏳ Pendente
- PULSO-TASK-025–027 — persistência, service e rotas

---
---
card_id: PULSO-FEAT-013
title: "Categorias, tags e sugestão automática"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [FEATURE] Categorias, tags e sugestão automática

> **Contexto:** Categorias padrão/personalizadas, tags livres e inteligência de sugestão + validação recurso×categoria (RF-017–019, RF-025, RF-141).

**Refs:** RF-017 · RF-018 · RF-019 · RF-025 · RF-141

## 📝 Descrição

Seed de categorias no cadastro; CRUD de categorias custom com `grupoBeneficio`; tags M:N; endpoint de sugestão por similaridade de descrição; bloqueio VT em categorias de alimentação via regra desacoplada do nome.

## ✅ Critérios de Aceite

### Cenário 1 — Categorias padrão
**Então** novo usuário recebe seed (`categoryService.seedCategoriasPadrao`).

### Cenário 2 — Categoria custom
**Quando** cria categoria DESPESA com `grupoBeneficio=VA`,  
**Então** só aceita despesas com recurso VA.

### Cenário 3 — Tags
**Então** transação pode ter N tags; nome único por usuário.

### Cenário 4 — Sugestão RF-141
**Quando** `GET /transacoes/sugestao-categoria?tipo=&descricao=`,  
**Então** retorna `categoriaId` sugerida por histórico (Dice/bigramas).

### Cenário 5 — RF-025
**Quando** despesa categoria alimentação + recurso VT,  
**Então** retorna `400` com mensagem explicativa (`recursoCategoriaRules`).

## 🔗 Sub-issues

- PULSO-TASK-028
- PULSO-TASK-029

## 📋 Resumo

### ✅ Concluído
- Regras de domínio e modais de gestão especificados

### ⏳ Pendente
- PULSO-TASK-028 — validação recurso×categoria + modals categorias/tags
- PULSO-TASK-029 — sugestão automática backend + debounce no form

---
---
card_id: PULSO-FEAT-014
title: "Transferências entre recursos"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [FEATURE] Transferências entre recursos

> **Contexto:** Movimentação entre recursos (ex.: DINHEIRO → POUPANCA) sem contabilizar como receita/despesa nos relatórios (RF-140).

**Refs:** RF-140

## 📝 Descrição

Tipo `TRANSFERENCIA` com `recurso` origem e `recursoDestino` destino; sem `categoriaId`; excluída de agregados receita/despesa; notificação `TRANSFERENCIA_REGISTRADA`.

## ✅ Critérios de Aceite

### Cenário 1 — Criar transferência
**Quando** `tipo=TRANSFERENCIA`, `recurso≠recursoDestino`,  
**Então** grava transação; saldos origem/destino atualizados via lógica de recurso.

### Cenário 2 — Resumo
**Então** transferências **não** entram em totais de receitas/despesas do `/resumo`.

### Cenário 3 — UI
**Então** toggle transferência no form; selects origem/destino; validação client-side.

## 🔗 Sub-issues

- PULSO-TASK-030

## 📋 Resumo

### ✅ Concluído
- Spec RF-140 e enum `TipoRecurso` incluindo POUPANCA documentados

### ⏳ Pendente
- PULSO-TASK-030 — backend + frontend transferências

---
---
card_id: PULSO-FEAT-015
title: "Recorrência e geração automática"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Infra / DevOps
  - Regra de Negócio
---

# [FEATURE] Recorrência e geração automática

> **Contexto:** Transações recorrentes com RRULE e job cron que gera ocorrências filhas (RF-020, RF-021); exclusão inteligente preservando passado.

**Refs:** RF-020 · RF-021

## 📝 Descrição

Mãe recorrente com `regraRecorrencia` (RFC 5545); filhas com `paiId`; job `recurringTransactions` às 00:05; exclusão "esta e futuras" aplica `UNTIL` na regra e remove filhas futuras.

## ✅ Critérios de Aceite

### Cenário 1 — Criar recorrente
**Quando** `recorrente=true` + `regraRecorrencia`,  
**Então** transação mãe criada; data futura permitida.

### Cenário 2 — Job diário
**Então** gera filha se hoje é dia de ocorrência e ainda não existe filha do dia.

### Cenário 3 — Excluir só esta
**Então** remove apenas transação selecionada.

### Cenário 4 — Excluir esta e futuras
**Então** remove filhas ≥ data corte; encerra mãe com `UNTIL`; **preserva** filhas passadas.

## 🔗 Sub-issues

- PULSO-TASK-031
- PULSO-TASK-032

## 📋 Resumo

### ✅ Concluído
- Fluxos de recorrência e exclusão especificados (RF-NOVO-C1)

### ⏳ Pendente
- PULSO-TASK-031 — job + recurrenceUtils
- PULSO-TASK-032 — excluirTransacao recorrente + UI DeleteTransactionModal

---
---
card_id: PULSO-FEAT-016
title: "Frontend — página de transações"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend — página de transações

> **Contexto:** Tela principal `/transactions` com resumo, filtros, lista, paginação e modais (RF-015–024).

**Refs:** RF-015 · RF-016 · RF-022 · RF-023 · RF-024

## 📝 Descrição

Página orquestra listagem + resumo paralelos; filtros pendentes vs. ativos; modais criar/editar/excluir; gestão inline de categorias e tags.

## ✅ Critérios de Aceite

### Cenário 1 — Listagem
**Então** transações agrupadas por data; paginação 10/página; loading/error states.

### Cenário 2 — Filtros
**Então** período, categoria, tipo, recurso, busca texto/tag; botões Filtrar/Limpar.

### Cenário 3 — Resumo
**Então** cards receitas/despesas/saldo refletem filtros ativos.

### Cenário 4 — CRUD
**Então** modais criar/editar com validação; toast sucesso/erro.

## 🔗 Sub-issues

- PULSO-TASK-033
- PULSO-TASK-034
- PULSO-TASK-035

## 📋 Resumo

### ✅ Concluído
- Spec de UX e componentes mapeada

### ⏳ Pendente
- PULSO-TASK-033 — TransactionsPage + listagem/filtros/resumo
- PULSO-TASK-034 — TransactionFormModal
- PULSO-TASK-035 — DeleteTransactionModal + estilos

---
---
card_id: PULSO-FEAT-017
title: "QA — testes de transações"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de transações

> **Contexto:** Cobertura de regressão para service, filtros, recorrência, regras de recurso e utils web.

**Refs:** RNF-015

## 📝 Descrição

Suites unitárias API e Web para fluxos críticos de transações, incluindo exclusão recorrente e validação VA/VR/VT.

## ✅ Critérios de Aceite

**Quando** `npm test` API,  
**Então** passam: `transactionService`, `transactionFilterService`, `recurringTransactions`, `recursoCategoriaRules`, `categorySuggestionService`, `transactionMapper`.

**Quando** `npm test` Web,  
**Então** passam: `transactionFilters`, `transactionValidation`, `transactionRecurrence`, `useTransactionFilterOptions`.

## 🔗 Sub-issues

- PULSO-TASK-036

## 📋 Resumo

### ✅ Concluído
- Escopo de testes mapeado

### ⏳ Pendente
- PULSO-TASK-036 — implementar/expandir suites

---
---
card_id: PULSO-TASK-025
title: "Banco de dados — transações, tags e vínculos"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-012
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — transações, tags e vínculos

> **Contexto:** Modelagem persistente para transações financeiras e tags.

## 📝 Descrição

Criar models Prisma e migrations para `Transacao`, `Tag`, `TransacaoTag` e campo `grupoBeneficio` em `Categoria`.

## ✅ Critérios de Aceite

**Então** schema contém:
- `Transacao`: tipo, recurso, recursoDestino?, valor, data, recorrente, regraRecorrencia, paiId
- `Tag`: nome único por usuário, icone, cor
- `TransacaoTag`: M:N
- Índices: `[usuarioId, data]`, tipo, recurso, categoria, recorrente

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Enums:** `TipoTransacao` (RECEITA, DESPESA, TRANSFERENCIA), `TipoRecurso` (DINHEIRO, VA, VR, VT, POUPANCA), `GrupoBeneficioCategoria`

**Migrations relevantes:**
- `20260422195021_init`
- `20260708100000_add_transferencia_poupanca`
- `20260804120000_categoria_grupo_beneficio`

## 📋 Resumo

### ✅ Concluído
- Spec de models e índices definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma

---
---
card_id: PULSO-TASK-026
title: "Backend — transactionService e repository"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-012
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — transactionService e repository

> **Contexto:** Regras de negócio centrais para CRUD, resumo e side-effects.

## 📝 Descrição

Implementar service e repository com listagem filtrada, agregados, validações e integrações pós-criação.

## ✅ Critérios de Aceite

**Então** métodos:
- `listarTransacoes`, `calcularResumo` (modos fluxo/benefício/carteira)
- `criarTransacao`, `editarTransacao`, `excluirTransacao`

**Side-effects em criar:**
- `incrementarStreak`, `gamificationService`, `notificationService`, `insightService`

## 🛠️ Implementação

### `transactionService.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/services/transactionService.js`

### `transactionRepository.js` (NOVO — CRIAR)

- `listarPorUsuario`, `calcularAgregados`, `criar`, `atualizar`, `excluir`
- `vincularTags`, `desvincularTags`, `listarRecorrentesMae`
- `excluirRecorrentesFilhasAPartirDe`, `encerrarRecorrencia`

### `transactionFilterService.js` (NOVO — CRIAR)

Montagem de `where` Prisma a partir de query (período, categoria, tipo, recurso, busca)

### Utils (NOVO — CRIAR)

- `transactionMapper.js` — DTO API
- `resourceBalanceUtils.js` — saldos por recurso

## 📐 Regras de Negócio

- Data futura bloqueada exceto recorrentes
- TRANSFERENCIA: origem ≠ destino, sem categoria
- Resumo exclui TRANSFERENCIA dos totais receita/despesa

## 📋 Resumo

### ✅ Concluído
- Assinaturas e side-effects documentados

### ⏳ Pendente
- Implementar service + repository + filter service

---
---
card_id: PULSO-TASK-027
title: "Backend — routes, controller e schemas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-012
due_date: null
categories:
  - Backend
---

# [TASK] Backend — routes, controller e schemas

> **Contexto:** Camada HTTP para `/api/transacoes`.

## 📝 Descrição

Expor endpoints com validação Zod e auth middleware.

## 🛠️ Implementação

### `transactionRoutes.js` (NOVO — CRIAR)

Rotas: `GET /`, `GET /resumo`, `GET /filtros`, `GET /sugestao-categoria`, `POST /`, `PATCH /:id`, `DELETE /:id`

### `transactionController.js` (NOVO — CRIAR)

Handlers delegando ao service + `transactionFilterService.obterOpcoes`

### `transactionSchemas.js` (NOVO — CRIAR)

`criarTransacaoSchema`, `editarTransacaoSchema`, `listarTransacoesQuerySchema`, `excluirTransacaoSchema`, `sugerirCategoriaQuerySchema`

### `routes/index.js` (EXISTENTE — MODIFICAR)

`router.use('/transacoes', transactionRoutes)`

### `transactionOptions.js` (NOVO — CRIAR)

Constantes de recursos/frequências para `/filtros`

## 📋 Resumo

### ✅ Concluído
- Mapa de rotas definido

### ⏳ Pendente
- Implementar controller, routes e schemas Zod

---
---
card_id: PULSO-TASK-028
title: "Categorias, tags e validação recurso×categoria"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-013
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Categorias, tags e validação recurso×categoria

> **Contexto:** RF-017–019, RF-025 — gestão de taxonomia e compatibilidade recurso/categoria.

## 📝 Descrição

Implementar seed de categorias, CRUD via modais na página de transações e validação `grupoBeneficio` no backend e frontend.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `categoryService.js` | `seedCategoriasPadrao`, CRUD |
| `tagService.js` / `tagRepository.js` | CRUD tags |
| `recursoCategoriaRules.js` | `validarRecursoCategoria`, `buildMensagemIncompativel` |
| `categoryRoutes.js`, `tagRoutes.js` | REST categorias/tags |

**Campo:** `Categoria.grupoBeneficio` enum (VA, VR, VT, ALIMENTACAO, etc.)

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `CategoryManageModal.jsx` | CRUD categorias + preset grupoBeneficio |
| `TagManageModal.jsx` | CRUD tags |
| `transactionValidation.js` | `validarRecursoCategoria` espelho client |
| `useTransactionFilterOptions.js` | Hook cache opções `/filtros` |

## 📐 Regras de Negócio

- RF-025: categoria alimentação incompatível com VT
- Categoria.tipo deve bater com transação.tipo
- Tag nome único case-insensitive por usuário

## 📋 Resumo

### ✅ Concluído
- Spec de validação desacoplada do nome literal (RF-NOVO-C2/C3)

### ⏳ Pendente
- Implementar rules + modais de gestão

---
---
card_id: PULSO-TASK-029
title: "Sugestão automática de categoria (RF-141)"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-013
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Sugestão automática de categoria (RF-141)

> **Contexto:** Sugerir categoria com base em descrições similares do histórico do usuário.

## 📝 Descrição

Endpoint backend + debounce no formulário para preencher categoria automaticamente ao digitar descrição.

## ✅ Critérios de Aceite

**Quando** descrição ≥3 chars no form,  
**Então** após 400ms chama `GET /transacoes/sugestao-categoria`; preenche select se confiança suficiente.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `categorySuggestionService.js` | Orquestra histórico + utils |
| `categorySuggestionUtils.js` | `similaridade`, `sugerirCategoriaId` (Dice bigramas) |
| `transactionRepository.js` | `listarDescricoesPorTipo` |

### Frontend (NOVO — CRIAR)

Em `TransactionFormModal.jsx`:
- Debounce 400ms (`SUGESTAO_DEBOUNCE_MS`)
- Flag `categoriaAutoSugerida` para UX
- `transactionService.sugerirCategoria({ tipo, descricao })`

## 📋 Resumo

### ✅ Concluído
- Algoritmo e contrato API especificados

### ⏳ Pendente
- Implementar service + integração no form

---
---
card_id: PULSO-TASK-030
title: "Transferências — backend e formulário"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-014
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Transferências — backend e formulário

> **Contexto:** RF-140 — tipo TRANSFERENCIA ponta a ponta.

## 📝 Descrição

Implementar fluxo completo de transferência entre recursos no service e no TransactionFormModal.

## ✅ Critérios de Aceite

**Então** criar/editar transferência valida origem≠destino; UI oculta categoria; notificação específica.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

Em `transactionService.criarTransacao` / `editarTransacao`:
- Branch `tipo === 'TRANSFERENCIA'`
- `notificarTransferenciaRegistrada`

Agregados em `calcularAgregados`: filtrar apenas RECEITA/DESPESA

### Frontend (NOVO — CRIAR)

Em `TransactionFormModal.jsx`:
- Toggle tipo inclui `TRANSFERENCIA`
- Campos `recurso` + `recursoDestino`
- `validarTransferencia()` em `transactionValidation.js`

## 📋 Resumo

### ✅ Concluído
- Spec RF-140 documentada

### ⏳ Pendente
- Implementar branch transferência API + UI

---
---
card_id: PULSO-TASK-031
title: "Job recurringTransactions e recurrenceUtils"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-015
due_date: null
categories:
  - Backend
  - Infra / DevOps
  - Regra de Negócio
---

# [TASK] Job recurringTransactions e recurrenceUtils

> **Contexto:** RF-021 — geração automática de ocorrências recorrentes.

## 📝 Descrição

Job cron que avalia mães recorrentes e cria filhas no dia correto, respeitando UNTIL e deduplicação diária.

## 🛠️ Implementação

### `recurringTransactions.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/jobs/recurringTransactions.js`

- `runRecurringTransactions()` — lista mães, `isOccurrenceToday`, cria filha
- Frequências: WEEKLY (INTERVAL), MONTHLY, YEARLY
- Registro cron: `server.js` 00:05 + `cronController.daily`

### `recurrenceUtils.js` (NOVO — CRIAR)

- `buildRecurrenceRule` (front espelha via `transactionRecurrence.js`)
- `calcularUntilAPartirDoCorte`, `aplicarUntilNaRegra`
- `startOfDay`

### Form (NOVO — CRIAR)

`TransactionFormModal`: checkbox recorrente, frequência, até quando, `buildRecurrenceRule`

## 📋 Resumo

### ✅ Concluído
- Lógica de ocorrência e RRULE básica especificada

### ⏳ Pendente
- Implementar job + utils + wire cron

---
---
card_id: PULSO-TASK-032
title: "Exclusão recorrente com preservação de histórico"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-015
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Exclusão recorrente com preservação de histórico

> **Contexto:** RF-NOVO-C1 — "excluir esta e futuras" sem apagar passado.

## 📝 Descrição

Implementar `excluirTransacao` com flag `excluirFuturas` e UI de opções no DeleteTransactionModal.

## ✅ Critérios de Aceite

**Quando** DELETE com `excluirFuturas=true`,  
**Então** remove filhas ≥ dataCorte; aplica UNTIL na mãe; mantém filhas anteriores.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

Em `transactionService.excluirTransacao`:
- Detectar mãe vs. filha recorrente
- `transactionRepository.excluirRecorrentesFilhasAPartirDe`
- `encerrarRecorrencia(paiId, novaRegra)`

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DeleteTransactionModal.jsx` | Opções: só esta / esta e futuras |
| `transactionService.excluirTransacao` | Query params delete |

## 📋 Resumo

### ✅ Concluído
- Comportamento RF-NOVO-C1 especificado

### ⏳ Pendente
- Implementar backend + modal de exclusão

---
---
card_id: PULSO-TASK-033
title: "Frontend — TransactionsPage, filtros e listagem"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — TransactionsPage, filtros e listagem

> **Contexto:** Shell da página `/transactions` com dados paralelos lista + resumo.

## 📝 Descrição

Implementar página principal com filtros pendentes/ativos, paginação e cards de resumo.

## 🛠️ Implementação

### Páginas e componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TransactionsPage.jsx` | Orquestração estado, modais, fetch |
| `TransactionSummaryCards.jsx` | Receitas, despesas, saldo |
| `TransactionFilters.jsx` | Período, categoria, tipo, recurso, busca |
| `TransactionList.jsx` | Lista agrupada por data |
| `services/transactionService.js` | `buscarTransacoes`, `obterResumo`, CRUD |
| `utils/transactionFilters.js` | `DEFAULT_TRANSACTION_FILTROS`, `buildTransactionApiFiltros` |

**Padrão:** `AbortController` + `Promise.all` lista/resumo; paginação `limite: 10`

**Rota:** `App.jsx` → `path="transactions"` sob MainLayout

## 📋 Resumo

### ✅ Concluído
- Spec de estado e fetch paralelo definida

### ⏳ Pendente
- Implementar página e componentes de listagem/filtro

---
---
card_id: PULSO-TASK-034
title: "Frontend — TransactionFormModal"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — TransactionFormModal

> **Contexto:** Formulário criar/editar receita, despesa, transferência e recorrência.

## 📝 Descrição

Modal completo com validação client, sugestão de categoria, tags inline e toggles de tipo.

## 🛠️ Implementação

### `TransactionFormModal.jsx` (NOVO — CRIAR)

Campos:
- Toggle RECEITA / DESPESA / TRANSFERENCIA
- `InputMoney`, `DatePicker`, `Select` categoria/recurso
- `TagsInput` com criação inline
- Recorrência: checkbox, frequência, até quando
- Integração `sugerirCategoria` debounced

**Design system:** Modal, FormFieldLabel, Button, Checkbox, IconButton

**Modos:** `create` | `edit` — hidrata form a partir de `transacao`

## 📋 Resumo

### ✅ Concluído
- Spec de campos e validações definida

### ⏳ Pendente
- Implementar modal create/edit

---
---
card_id: PULSO-TASK-035
title: "Frontend — exclusão e estilos transactions.css"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — exclusão e estilos transactions.css

> **Contexto:** Modal de exclusão recorrente + layout responsivo da página.

## 📝 Descrição

Implementar confirmação de delete com opções recorrentes e folha de estilos da página de transações.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DeleteTransactionModal.jsx` | Confirmar; opções recorrentes |
| `styles/transactions.css` | Layout page, filtros, lista, modais, mobile |

**Responsivo:** filtros empilham; lista legível em mobile; CTAs full-width onde necessário

Importar CSS na TransactionsPage ou bundle global.

## 📋 Resumo

### ✅ Concluído
- Spec delete recorrente + breakpoints definidos

### ⏳ Pendente
- Implementar DeleteTransactionModal + transactions.css

---
---
card_id: PULSO-TASK-036
title: "QA — testes unitários de transações"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-017
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de transações

> **Contexto:** Regressão para CRUD, filtros, recorrência e regras VA/VR/VT.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/transactionService.test.js` | CRUD, resumo, exclusão recorrente |
| `unit/services/transactionFilterService.test.js` | Filtros query |
| `unit/jobs/recurringTransactions.test.js` | Geração filhas |
| `unit/utils/recursoCategoriaRules.test.js` | RF-025 |
| `unit/services/categorySuggestionService.test.js` | RF-141 |
| `unit/utils/transactionMapper.test.js` | DTO |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/transactionFilters.test.js` | Build filtros API |
| `unit/utils/transactionValidation.test.js` | Validações client |
| `unit/utils/transactionRecurrence.test.js` | RRULE builder |
| `unit/hooks/useTransactionFilterOptions.test.js` | Hook filtros |
| `unit/services/transactionService.test.js` | Chamadas HTTP |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas

---
