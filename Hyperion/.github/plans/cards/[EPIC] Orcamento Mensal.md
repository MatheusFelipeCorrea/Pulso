# [EPIC] Orçamento Mensal — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-009 | Orçamento Mensal |
| Feature | PULSO-FEAT-046 | Backend — API de orçamentos |
| Feature | PULSO-FEAT-047 | Rollover e status por categoria |
| Feature | PULSO-FEAT-048 | Alertas 80%/100% e jobs |
| Feature | PULSO-FEAT-049 | Frontend — BudgetPage e resumo |
| Feature | PULSO-FEAT-050 | Frontend — edição de limites e estilos |
| Feature | PULSO-FEAT-051 | QA — testes de orçamento mensal |
| Task | PULSO-TASK-093–104 | DB, API, rollover, alertas, frontend, QA |

---

---
card_id: PULSO-EPIC-009
title: "Orçamento Mensal"
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
  - Notificações
---

# [EPIC] Orçamento Mensal

> **Contexto:** Limites mensais por categoria de despesa, progresso visual, rollover opcional, alertas 80%/100% e cópia entre meses — sem bloquear o registro de transações.

**Refs:** RF-109–114 · RF-150 · RN-055–060 · RN-170

## 🎯 Objetivos

- Definir limite mensal de gasto por categoria de despesa (RF-109, RN-055)
- Exibir progresso gasto vs limite e resumo do que ainda pode gastar (RF-110, RF-114)
- Alertar em 80% e ao estourar 100% do limite (RF-111, RF-112, RN-056–057)
- Editar limites a qualquer momento; lista vazia remove orçamentos do mês (RF-113)
- Rollover ativável por categoria: sobra positiva do mês anterior soma ao limite ao criar o mês (RF-150, RN-170)
- Orçamento não bloqueia transação — apenas alerta (RN-058)
- Warning permanente se orçamento total > renda planejada (RN-059)
- Categorias sem limite não geram alertas (RN-060)
- Copiar orçamentos de um mês para outro (destino vazio → 409 se já houver)
- Job/cron + sync pós-transação para notificações com dedup

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/budget` | Orçamento Mensal | Filtrar mês, ver status, editar limites, copiar mês anterior |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | Gastos agregados por categoria no mês; sync alertas via `userSyncService` |
| Categorias | Apenas categorias `DESPESA` do usuário |
| Dashboard | `obterStatusOrcamento` no agregado; widget `DashboardBudgetAlerts` |
| Notificações | Tipos `ALERTA_ORCAMENTO` e `ORCAMENTO_ESTOURADO`; link `/budget` |
| Config. financeira | `rendaMensalPlanejada` (Módulo 10) — aviso RN-059 só dispara se renda > 0 |

## 🔗 Sub-issues

- PULSO-FEAT-046
- PULSO-FEAT-047
- PULSO-FEAT-048
- PULSO-FEAT-049
- PULSO-FEAT-050
- PULSO-FEAT-051

## 📋 Resumo

### ✅ Concluído
- Escopo RF-109–114, RF-150 e RN-055–060 / RN-170 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Configuração de renda mensal (Módulo 10 / RNF-NOVO-N2) — evolução futura

---
---
card_id: PULSO-FEAT-046
title: "Backend — API de orçamentos"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de orçamentos

> **Contexto:** Camada REST autenticada para listar, salvar, remover e copiar limites mensais por categoria.

**Refs:** RF-109 · RF-113 · RN-055

## 📝 Descrição

Expor endpoints em `/api/orcamentos` para ciclo de vida dos limites do mês.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/orcamentos` | Lista orçamentos do mês (`?mes=YYYY-MM`) |
| GET | `/orcamentos/status` | Resumo + categorias com/sem limite + gastos |
| POST | `/orcamentos` | Upsert em lote (`limites[]`); lista vazia zera o mês |
| POST | `/orcamentos/copiar` | Copia origem → destino; 409 se destino já tem; 404 se origem vazia |
| DELETE | `/orcamentos/:id` | Remove limite de uma categoria no mês |

**Validação:** categorias devem ser `DESPESA` do usuário (403 caso contrário)

## 🔗 Sub-issues

- PULSO-TASK-093
- PULSO-TASK-094
- PULSO-TASK-096
- PULSO-TASK-097

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-093–097 — DB, repository, service core e cópia

---
---
card_id: PULSO-FEAT-047
title: "Rollover e status por categoria"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Rollover e status por categoria

> **Contexto:** Cálculo de gastos no mês, status visual (normal/alerta/estourado) e rollover RN-170.

**Refs:** RF-110 · RF-114 · RF-150 · RN-055 · RN-059 · RN-170

## 📝 Descrição

Implementar agregação de gastos, mapper de status e aplicação de rollover ao criar limites no mês.

## ✅ Critérios de Aceite

- `calcularGastosPorCategoria` — soma transações DESPESA no intervalo do mês
- Status: `normal` (<80%), `alerta` (≥80%), `estourado` (≥100%)
- `calcularValorRollover` — sobra positiva do mês anterior se `rolloverAtivo`; estouro não herda
- Rollover aplica-se na criação (salvar categoria nova no mês ou copiar), não retroage em mês já existente
- `resumo.orcamentoExcedeRenda` quando `rendaMensalPlanejada > 0` e total limites > renda (RN-059)
- Expor `valorRollover` e `rolloverAtivo` no status

## 🔗 Sub-issues

- PULSO-TASK-095
- PULSO-TASK-098

## 📋 Resumo

### ✅ Concluído
- Regras RN-170 e status mapeadas

### ⏳ Pendente
- PULSO-TASK-095 / 098 — mapper e rollover

---
---
card_id: PULSO-FEAT-048
title: "Alertas 80%/100% e jobs"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Backend
  - Notificações
  - Regra de Negócio
---

# [FEATURE] Alertas 80%/100% e jobs

> **Contexto:** Notificações de orçamento com deduplicação, job periódico e sync pós-transação.

**Refs:** RF-111 · RF-112 · RN-056–058 · RN-060

## 📝 Descrição

Criar alertas `ALERTA_ORCAMENTO` (80%) e `ORCAMENTO_ESTOURADO` (100%+), sem bloquear transações.

## ✅ Critérios de Aceite

| Tipo | Gatilho | Dedup |
|------|---------|-------|
| `ALERTA_ORCAMENTO` | percentual ≥ 80 e < 100 | metadados `{ categoriaId, mesReferencia, percentual }` |
| `ORCAMENTO_ESTOURADO` | percentual ≥ 100 | idem |

- Categorias sem orçamento no mês: skip (RN-060)
- `linkAcao`: `/budget`
- Job `budgetAlertJob` via cron e startup
- `userSyncService` chama `verificarLimitesUsuarioENotificar` após mutações relevantes

## 🔗 Sub-issues

- PULSO-TASK-099
- PULSO-TASK-100

## 📋 Resumo

### ✅ Concluído
- Matriz de alertas e pontos de disparo definidos

### ⏳ Pendente
- PULSO-TASK-099–100 — notificações e job

---
---
card_id: PULSO-FEAT-049
title: "Frontend — BudgetPage e resumo"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend — BudgetPage e resumo

> **Contexto:** Página `/budget` com filtro de mês, cards de resumo e listas de categorias.

**Refs:** RF-110 · RF-114 · RN-059

## 📝 Descrição

Implementar tela de orçamento mensal consumindo `GET /orcamentos/status`.

## ✅ Critérios de Aceite

- Rota autenticada `/budget` em `App.jsx` / `appRoutes.js`
- Filtro de período (mês) via `TransactionFilters` / query `mes`
- `BudgetSummaryCards` — totais, % usado, aviso RN-059 se `orcamentoExcedeRenda`
- `BudgetCategoryList` — barras de progresso por status
- `BudgetCategoriesWithoutLimit` — CTA para adicionar limite
- Ação copiar do mês anterior
- Empty state quando sem limites

## 🔗 Sub-issues

- PULSO-TASK-101
- PULSO-TASK-102

## 📋 Resumo

### ✅ Concluído
- Layout e fluxos da página definidos

### ⏳ Pendente
- PULSO-TASK-101–102 — página e componentes de lista/resumo

---
---
card_id: PULSO-FEAT-050
title: "Frontend — edição de limites e estilos"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — edição de limites e estilos

> **Contexto:** Modal de edição em lote, toggle de rollover e folha de estilos.

**Refs:** RF-109 · RF-113 · RF-150

## 📝 Descrição

Implementar `BudgetEditModal` e utilitários/CSS do módulo.

## ✅ Critérios de Aceite

- Adicionar/remover categorias de despesa no mês
- Editar `limiteValor` (InputMoney) e toggle `rolloverAtivo`
- Preview de total vs `rendaMensal` com warning se exceder
- Persistência via `POST /orcamentos` (payload `limites[]`)
- `budget.css` responsivo; `BudgetTruncatedLabel` para nomes longos
- Client `services/budgetService.js` + utils de mês/filtro

## 🔗 Sub-issues

- PULSO-TASK-103

## 📋 Resumo

### ✅ Concluído
- UX do modal e rollover definida

### ⏳ Pendente
- PULSO-TASK-103 — modal, CSS e utils

---
---
card_id: PULSO-FEAT-051
title: "QA — testes de orçamento mensal"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-009
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de orçamento mensal

> **Contexto:** Regressão para status, rollover, alertas, cópia e UI utils.

## 📝 Descrição

Implementar suites unitárias API/Web cobrindo regras críticas do módulo.

## 🔗 Sub-issues

- PULSO-TASK-104

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-104 — implementar suites

---
---
card_id: PULSO-TASK-093
title: "Banco de dados — model Orcamento"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-046
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — model Orcamento

> **Contexto:** Persistência de limites mensais por categoria com suporte a rollover.

## 📝 Descrição

Criar model Prisma `Orcamento` e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Campo | Tipo | Notas |
|-------|------|-------|
| usuarioId | String | FK Usuario |
| categoriaId | String | FK Categoria |
| mesReferencia | DateTime @db.Date | 1º dia do mês |
| limiteValor | Decimal(12,2) | Limite efetivo do mês |
| rolloverAtivo | Boolean | default false |
| valorRollover | Decimal(12,2) | default 0 — sobra herdada |

**Constraints:** `@@unique([usuarioId, categoriaId, mesReferencia])`

**Migrations:** tabela `orcamentos` + `20260714150000_add_orcamento_rollover`

## 📋 Resumo

### ✅ Concluído
- Spec do model definida

### ⏳ Pendente
- Criar/aplicar migrations

---
---
card_id: PULSO-TASK-094
title: "Backend — budgetRepository e gastos do mês"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-046
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — budgetRepository e gastos do mês

> **Contexto:** Persistência Prisma e agregação de despesas por categoria no mês.

## 📝 Descrição

Implementar repository de orçamentos e cálculo de gastos.

## 🛠️ Implementação

### `repositories/budgetRepository.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `buscarPorUsuarioEMes` | Include categoria; order nome |
| `upsert` | Unique usuario+categoria+mês |
| `deletar` / `deletarForaDaLista` | Remoção unitária ou sync da lista |
| `copiarParaMes` | Clona limites origem → destino com rollover |
| `calcularGastosPorCategoria` | `groupBy` Transacao DESPESA no intervalo do mês |
| `buscarUsuariosComOrcamentoNoMes` | Distinct para job de alertas |

Usar `intervaloDoMes` de `monthUtils`.

## 📋 Resumo

### ✅ Concluído
- Contratos do repository definidos

### ⏳ Pendente
- Implementar budgetRepository

---
---
card_id: PULSO-TASK-095
title: "Backend — budgetMapper e status de categoria"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-047
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — budgetMapper e status de categoria

> **Contexto:** DTO de orçamento e classificação visual por percentual usado.

## 📝 Descrição

Implementar mapper e helper de status.

## 🛠️ Implementação

### `utils/budgetMapper.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `mapOrcamento` | id, categoria*, limiteValor, rolloverAtivo, valorRollover |
| `calcularStatusCategoria` | `normal` / `alerta` (≥80) / `estourado` (≥100) |

Consumido por `obterStatusOrcamento` e listagens.

## 📋 Resumo

### ✅ Concluído
- Faixas de status definidas (RN-056–057)

### ⏳ Pendente
- Implementar budgetMapper

---
---
card_id: PULSO-TASK-096
title: "Backend — budgetService core e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-046
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — budgetService core e rotas

> **Contexto:** Listar, status, salvar e remover orçamentos do mês.

## 📝 Descrição

Implementar service principal, schemas Zod, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/budgetService.js` | `listarOrcamentos`, `obterStatusOrcamento`, `salvarOrcamentos`, `removerOrcamento` |
| `schemas/budgetSchemas.js` | queryMes, salvarOrcamentos, remover |
| `controllers/budgetController.js` | Handlers autenticados |
| `routes/budgetRoutes.js` | Montar em `/orcamentos` |

**Status:** categorias com gasto/%, `categoriasSemOrcamento`, resumo + `orcamentoExcedeRenda` (RN-059)

**Salvar:** upsert por categoria; lista vazia remove todos do mês; valida DESPESA do usuário

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-109/113/114 especificados

### ⏳ Pendente
- Implementar service core e HTTP

---
---
card_id: PULSO-TASK-097
title: "Backend — copiar orçamento entre meses"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-046
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — copiar orçamento entre meses

> **Contexto:** Replicar limites de um mês para outro vazio, aplicando rollover quando ativo.

## 📝 Descrição

Implementar `POST /orcamentos/copiar` e `copiarOrcamento` no service.

## 🛠️ Implementação

### Regras

| Cenário | Resposta |
|---------|----------|
| Destino já tem orçamentos | 409 |
| Origem sem orçamentos | 404 |
| Sucesso | `{ mesDestino, orcamentos, quantidadeCopiada }` |

Body: `{ mesOrigem, mesDestino }` (YYYY-MM-01 ou equivalente validado)

Schema: `copiarOrcamentoSchema` em `budgetSchemas.js`

## 📋 Resumo

### ✅ Concluído
- Contratos de cópia definidos

### ⏳ Pendente
- Implementar fluxo de cópia

---
---
card_id: PULSO-TASK-098
title: "Backend — budgetRolloverUtils (RN-170)"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-047
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — budgetRolloverUtils (RN-170)

> **Contexto:** Herança de sobra positiva ao criar orçamento no mês seguinte.

## 📝 Descrição

Implementar cálculo de rollover e integrar em salvar/copiar.

## 🛠️ Implementação

### `utils/budgetRolloverUtils.js` (NOVO — CRIAR)

```js
// sobra = limiteAnterior − gastoAnterior; retorna sobra > 0 se rolloverAtivo
calcularValorRollover(orcamentoAnterior, gastoAnterior)
```

### Integração

| Ponto | Comportamento |
|-------|---------------|
| `salvarOrcamentos` | Se categoria **nova** no mês e `rolloverAtivo` → soma sobra ao `limiteValor`; grava `valorRollover` |
| `copiarParaMes` | Aplica mesma lógica por categoria |
| Toggle em mês existente | Não recalcula limite já criado |

Estouro (sobra negativa) **não** é herdado.

## 📋 Resumo

### ✅ Concluído
- RN-170 documentada

### ⏳ Pendente
- Implementar utils e integração

---
---
card_id: PULSO-TASK-099
title: "Backend — alertas de orçamento e dedup"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-048
due_date: null
categories:
  - Backend
  - Notificações
  - Regra de Negócio
---

# [TASK] Backend — alertas de orçamento e dedup

> **Contexto:** Criar notificações 80%/100% sem duplicar e sem bloquear transações.

## 📝 Descrição

Implementar `verificarLimitesUsuarioENotificar` e helper de criação com dedup.

## 🛠️ Implementação

### `budgetService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `criarNotificacaoOrcamento` | Tipos `ALERTA_ORCAMENTO` / `ORCAMENTO_ESTOURADO`; `verificarNotificacaoDuplicada` |
| `verificarLimitesUsuarioENotificar` | Skip se usuário sem orçamento no mês (RN-060) |
| `verificarLimitesENotificar` | Loop usuários com orçamento no mês atual |

**RN-058:** apenas notifica — nunca rejeita transação.

Metadados: `{ categoriaId, mesReferencia, percentual }` · `linkAcao: '/budget'`

## 📋 Resumo

### ✅ Concluído
- Matriz RF-111/112 definida

### ⏳ Pendente
- Implementar criação e dedup de alertas

---
---
card_id: PULSO-TASK-100
title: "Backend — budgetAlertJob, cron e userSync"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-048
due_date: null
categories:
  - Backend
  - Notificações
---

# [TASK] Backend — budgetAlertJob, cron e userSync

> **Contexto:** Disparo periódico e sob demanda dos alertas de orçamento.

## 📝 Descrição

Registrar job de alertas no cron e no sync pós-mutação do usuário.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `jobs/budgetAlertJob.js` | `runBudgetAlertJob` → `verificarLimitesENotificar` |
| `controllers/cronController.js` | Incluir job no endpoint de cron |
| `server.js` | Opcional: run no startup |
| `services/userSyncService.js` | Chamar `verificarLimitesUsuarioENotificar` |

Logar quantidade de notificações criadas e usuários verificados.

## 📋 Resumo

### ✅ Concluído
- Pontos de disparo mapeados

### ⏳ Pendente
- Wire job + sync

---
---
card_id: PULSO-TASK-101
title: "Frontend — BudgetPage e client HTTP"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-049
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — BudgetPage e client HTTP

> **Contexto:** Página `/budget` com filtro de mês, carregamento de status e ações.

## 📝 Descrição

Implementar página e serviço HTTP do módulo.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/BudgetPage.jsx` | Estado filtros/status; carregar; copiar; abrir modal |
| `services/budgetService.js` | GET status, POST salvar, POST copiar, DELETE |
| Rota | `App.jsx` → `/budget`; label em `appRoutes.js` |

**Query:** `?mes=YYYY-MM` via search params / `TransactionFilters`

Ações: editar limites, copiar mês anterior (toast de sucesso/erro 409)

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar BudgetPage e client

---
---
card_id: PULSO-TASK-102
title: "Frontend — cards de resumo e listas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-049
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — cards de resumo e listas

> **Contexto:** Visualização de totais, progresso por categoria e categorias sem limite.

## 📝 Descrição

Implementar componentes de resumo e listas do orçamento.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `BudgetSummaryCards.jsx` | Totais, %, aviso RN-059 se `orcamentoExcedeRenda` |
| `BudgetCategoryList.jsx` | Ordenar por %; item com barra |
| `BudgetCategoryItem.jsx` | Progresso + status visual |
| `BudgetCategoriesWithoutLimit.jsx` | Lista + CTA adicionar limite |
| `DashboardBudgetAlerts.jsx` | Widget opcional no dashboard |

Filtro client: `budgetFilterUtils.filtrarCategoriasOrcamento`

## 📋 Resumo

### ✅ Concluído
- Componentes RF-110/114 mapeados

### ⏳ Pendente
- Implementar cards e listas

---
---
card_id: PULSO-TASK-103
title: "Frontend — BudgetEditModal, CSS e utils"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-050
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — BudgetEditModal, CSS e utils

> **Contexto:** Edição em lote de limites, toggle rollover e estilos responsivos.

## 📝 Descrição

Implementar modal de edição e utilitários/CSS.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `BudgetEditModal.jsx` | Limites[], add/remove categoria, InputMoney, Toggle rollover |
| `BudgetTruncatedLabel.jsx` | Truncar nomes longos |
| `styles/budget.css` | Layout página, barras, modal, mobile |
| `utils/budgetUtils.js` | `mesReferenciaAnterior`, `periodoToMesReferencia` |
| `utils/budgetFilterUtils.js` | Filtro de categorias na UI |

Warning no modal se soma dos limites > `rendaMensal`.

Payload salvar: `{ mesReferencia, limites: [{ categoriaId, limiteValor, rolloverAtivo }] }`

## 📋 Resumo

### ✅ Concluído
- UX edição e rollover definida

### ⏳ Pendente
- Implementar modal, CSS e utils

---
---
card_id: PULSO-TASK-104
title: "QA — testes unitários de orçamento"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-051
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de orçamento

> **Contexto:** Regressão para status, rollover, alertas, cópia e utils web.

## 📝 Descrição

Implementar suites API e Web do módulo.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/budgetService.test.js` | status, salvar, copiar 409, alertas |
| `unit/utils/budgetRolloverUtils.test.js` | sobra positiva / estouro / inativo |
| `unit/utils/budgetMapper.test.js` | status normal/alerta/estourado |
| `unit/jobs/budgetAlertJob.test.js` | run job |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/budgetService.test.js` | HTTP client |
| `unit/utils/budgetUtils.test.js` | mês anterior / conversões |
| `unit/utils/budgetFilterUtils.test.js` | filtro categorias |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites

---
