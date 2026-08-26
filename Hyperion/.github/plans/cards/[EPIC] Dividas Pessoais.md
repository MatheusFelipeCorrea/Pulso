# [EPIC] Dívidas Pessoais — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-012 | Dívidas Pessoais |
| Feature | PULSO-FEAT-064 | Backend — API core de dívidas |
| Feature | PULSO-FEAT-065 | Pagamentos parciais, quitar e reabrir |
| Feature | PULSO-FEAT-066 | Saldo consolidado e contadores |
| Feature | PULSO-FEAT-067 | Alertas de vencimento e limpeza |
| Feature | PULSO-FEAT-068 | Frontend — página e componentes |
| Feature | PULSO-FEAT-069 | QA — testes de dívidas |
| Task | PULSO-TASK-129–140 | DB, pagamentos, resumo, alertas, frontend, QA |

---

---
card_id: PULSO-EPIC-012
title: "Dívidas Pessoais"
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

# [EPIC] Dívidas Pessoais

> **Contexto:** Controle de empréstimos pessoais (me devem / eu devo) com pagamentos parciais, prazo, saldo consolidado, alertas de vencimento e histórico de quitadas — sem gerar transação automática.

**Refs:** RF-126–132 · RN-075–080

## 🎯 Objetivos

- Registrar empréstimo feito (ME_DEVEM) ou recebido (EU_DEVO) com valor, pessoa e data (RF-126–127, RN-075)
- Definir prazo de devolução opcional (RF-128)
- Marcar como paga / quitar saldo restante; registrar data de quitação (RF-129, RN-076)
- Pagamentos parciais; excluir pagamento reabre se necessário (RF-NOVO-O1)
- Saldo consolidado: total me devem vs eu devo (RF-130, RN-080)
- Histórico de ativas e quitadas com tabs/filtros (RF-131)
- Alertar próximo do vencimento (7, 2 e 0 dias) — `DIVIDA_COBRANCA` (RF-132, RN-077)
- Badge “Vencida” quando prazo passou sem quitar (RN-078)
- Dívida NÃO gera transação automaticamente (RN-079)
- Limpeza automática de quitadas após 180 dias

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/debts` | Dívidas | Tabs Me devem / Eu devo / Quitadas; CRUD; pagar; quitar; reabrir |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Notificações | Tipo `DIVIDA_COBRANCA`; link `/debts` |
| Cron | `debtAlertJob` + `debtCleanupJob` |
| Transações | Sem vínculo automático (RN-079) |

## 🔗 Sub-issues

- PULSO-FEAT-064
- PULSO-FEAT-065
- PULSO-FEAT-066
- PULSO-FEAT-067
- PULSO-FEAT-068
- PULSO-FEAT-069

## 📋 Resumo

### ✅ Concluído
- Escopo RF-126–132 e RN-075–080 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend

---
---
card_id: PULSO-FEAT-064
title: "Backend — API core de dívidas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API core de dívidas

> **Contexto:** CRUD autenticado em `/api/dividas` para empréstimos pessoais.

**Refs:** RF-126–128 · RN-075 · RN-079

## 📝 Descrição

Expor criar, editar, listar e excluir dívidas (pessoa por nome livre).

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/dividas` | Lista paginada com filtros (direção, quitada, busca, datas, valor) |
| POST | `/dividas` | Criar ME_DEVEM ou EU_DEVO |
| PATCH | `/dividas/:id` | Editar (bloqueia se quitada; valor ≥ já pago) |
| DELETE | `/dividas/:id` | Só abertas; quitadas → 400 (limpeza 180d) |

Validações: data empréstimo ≤ hoje; prazo > data empréstimo; observação ≤ 250

## 🔗 Sub-issues

- PULSO-TASK-129
- PULSO-TASK-130
- PULSO-TASK-132

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-129–132 — DB, repository e CRUD

---
---
card_id: PULSO-FEAT-065
title: "Pagamentos parciais, quitar e reabrir"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Pagamentos parciais, quitar e reabrir

> **Contexto:** Ciclo de pagamento e sincronização de quitação.

**Refs:** RF-129 · RN-076 · RF-NOVO-O1

## 📝 Descrição

Registrar/excluir pagamentos, quitar saldo restante e reabrir dívida.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/:id/pagamentos` | Parcial; valor ≤ restante; auto-quita se zerar |
| DELETE | `/:id/pagamentos/:pagamentoId` | Remove; reabre se quitada sem saldo pago |
| PATCH | `/:id/quitar` | Registra pagamento do restante + dataQuitacao |
| PATCH | `/:id/reabrir` | Reabre se não estiver coberta só por pagamentos |

**sincronizarQuitacao:** totalmente paga → quitar; pagamentos removidos → reabrir

## 🔗 Sub-issues

- PULSO-TASK-131
- PULSO-TASK-133
- PULSO-TASK-134

## 📋 Resumo

### ✅ Concluído
- Fluxos de pagamento mapeados

### ⏳ Pendente
- PULSO-TASK-131–134 — saldo, pagamentos e quitação

---
---
card_id: PULSO-FEAT-066
title: "Saldo consolidado e contadores"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Saldo consolidado e contadores

> **Contexto:** Resumo me devem / eu devo para cards e tabs (RF-130).

**Refs:** RF-130 · RF-131 · RN-080

## 📝 Descrição

Implementar `GET /dividas/resumo` com totais e contadores por aba.

## ✅ Critérios de Aceite

- `meDevem` / `euDevo`: `{ total, quantidade }` sobre valor restante de ativas
- `contadores` por aba (me devem, eu devo, quitadas)
- Somente dívidas não quitadas entram no saldo consolidado
- Listagem sincroniza quitação antes de filtrar

## 🔗 Sub-issues

- PULSO-TASK-135

## 📋 Resumo

### ✅ Concluído
- Contrato de resumo definido

### ⏳ Pendente
- PULSO-TASK-135 — calcularResumo e contadores

---
---
card_id: PULSO-FEAT-067
title: "Alertas de vencimento e limpeza"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Notificações
---

# [FEATURE] Alertas de vencimento e limpeza

> **Contexto:** Notificações `DIVIDA_COBRANCA` e retenção de quitadas.

**Refs:** RF-132 · RN-077

## 📝 Descrição

Job de alertas (7 / 2 / 0 dias) com dedup e cleanup de 180 dias.

## ✅ Critérios de Aceite

- Alertar dívidas abertas com prazo nos dias 7, 2 e 0
- Skip se `valorRestante ≤ 0`
- Dedup via `verificarNotificacaoDuplicadaDivida`
- `linkAcao: /debts`
- Job cleanup remove quitadas com `dataQuitacao` > 180 dias
- Excluir quitada manualmente → 400

## 🔗 Sub-issues

- PULSO-TASK-136
- PULSO-TASK-137

## 📋 Resumo

### ✅ Concluído
- Matriz de alertas e retenção definida

### ⏳ Pendente
- PULSO-TASK-136–137 — alertas e job cleanup

---
---
card_id: PULSO-FEAT-068
title: "Frontend — página e componentes"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/debts` com tabs, filtros, cards e modais.

**Refs:** RF-126–132 · RN-078

## 📝 Descrição

Implementar página de dívidas com fluxo completo de CRUD e pagamentos.

## ✅ Critérios de Aceite

- Rota autenticada `/debts`
- Tabs: Me devem / Eu devo / Quitadas
- Summary cards + filtros (busca, valor, datas)
- Badges: vencida, parcial, sem prazo, quitada (`debtStatusUtils`)
- Modais: form, pagamento, quitar, reabrir, detalhes, delete
- Client `debtService.js` + `debts.css`

## 🔗 Sub-issues

- PULSO-TASK-138
- PULSO-TASK-139

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-138–139 — página e componentes

---
---
card_id: PULSO-FEAT-069
title: "QA — testes de dívidas"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de dívidas

> **Contexto:** Regressão para saldo, pagamentos, alertas e UI utils.

## 📝 Descrição

Implementar suites unitárias API e Web do módulo.

## 🔗 Sub-issues

- PULSO-TASK-140

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-140 — implementar suites

---
---
card_id: PULSO-TASK-129
title: "Banco de dados — Divida e PagamentoDivida"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-064
due_date: null
categories:
  - Banco de Dados
---

# [TASK] Banco de dados — Divida e PagamentoDivida

> **Contexto:** Persistência de empréstimos e pagamentos parciais.

## 📝 Descrição

Criar models Prisma, enum e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Divida` | direcao, nomePessoa, valor, dataEmprestimo, prazoDevolucao, observacao, quitada, dataQuitacao |
| `PagamentoDivida` | dividaId, valor, dataPagamento, observacao |

**Enum:** `DirecaoDivida` (ME_DEVEM, EU_DEVO)

**Migrations:** `20260612120000_dividas`, `20260614120000_pagamentos_divida`

## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations

---
---
card_id: PULSO-TASK-130
title: "Backend — debtRepository e mappers"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-064
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — debtRepository e mappers

> **Contexto:** Persistência Prisma e DTOs com saldo calculado.

## 📝 Descrição

Implementar repository e mappers de dívida/pagamento.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/debtRepository.js` | CRUD, listar, pagamentos, alertas, cleanup, contarPorAba |
| `utils/debtMapper.js` | `mapDivida` — valorPago/Restante + pagamentos |
| `utils/debtPaymentMapper.js` | `mapPagamento` |

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mappers

---
---
card_id: PULSO-TASK-131
title: "Backend — debtBalanceUtils"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-065
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — debtBalanceUtils

> **Contexto:** Cálculo de saldo, quitação efetiva e arredondamento monetário.

## 📝 Descrição

Implementar utilitários de saldo compartilhados (também usados por divisão de despesas).

## 🛠️ Implementação

### `utils/debtBalanceUtils.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `roundMoney` | 2 casas |
| `calcSaldoFromPagamentos` | total, pago, restante |
| `calcSaldoDivida` | Se quitada efetiva → restante 0 |
| `estaTotalmentePaga` | restante ≤ 0 |
| `isDividaQuitada` | restante ≤ 0 OU (flag quitada sem pagamentos) |

## 📋 Resumo

### ✅ Concluído
- Fórmulas de saldo documentadas

### ⏳ Pendente
- Implementar debtBalanceUtils

---
---
card_id: PULSO-TASK-132
title: "Backend — debtService CRUD e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-064
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — debtService CRUD e rotas

> **Contexto:** Criar, editar, listar e excluir dívidas.

## 📝 Descrição

Implementar service core, schemas, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/debtService.js` | `criarDivida`, `editarDivida`, `listarDividas`, `excluirDivida` |
| `schemas/debtSchemas.js` | Zod criar/editar/query/params |
| `controllers/debtController.js` | Handlers |
| `routes/debtRoutes.js` | Montar em `/dividas` |

Bloquear edição/exclusão de quitadas; valor editado ≥ valorPago.

## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP

---
---
card_id: PULSO-TASK-133
title: "Backend — pagamentos e sincronizarQuitacao"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-065
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — pagamentos e sincronizarQuitacao

> **Contexto:** Pagamentos parciais e reabertura automática (RF-NOVO-O1).

## 📝 Descrição

Implementar registrar/excluir pagamento com sync de status.

## 🛠️ Implementação

### Funções (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `registrarPagamento` | valor ≤ restante; data ≤ hoje; chama sync |
| `excluirPagamento` | Remove; sync reabre se necessário |
| `sincronizarQuitacao` | restante 0 → quitar; quitada sem pago efetivo → reabrir |

Rotas: POST `/:id/pagamentos`, DELETE `/:id/pagamentos/:pagamentoId`

## 📋 Resumo

### ✅ Concluído
- Regras RF-129 / RF-NOVO-O1 documentadas

### ⏳ Pendente
- Implementar pagamentos e sync

---
---
card_id: PULSO-TASK-134
title: "Backend — quitar, reabrir e excluir"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-065
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — quitar, reabrir e excluir

> **Contexto:** Atalhos de quitação total, reabertura manual e exclusão.

## 📝 Descrição

Implementar endpoints de quitar/reabrir e regras de exclusão.

## 🛠️ Implementação

| Função | Comportamento |
|--------|---------------|
| `quitarDivida` | Se restante > 0 → `registrarPagamento` do saldo; set `dataQuitacao` |
| `reabrirDivida` | Bloqueia se coberta só por pagamentos (remover pagamento antes) |
| `excluirDivida` | Bloqueia quitada (mensagem 180 dias) |

Rotas: PATCH `/:id/quitar`, PATCH `/:id/reabrir`, DELETE `/:id`

## 📋 Resumo

### ✅ Concluído
- Contratos definidos

### ⏳ Pendente
- Implementar quitar/reabrir/excluir

---
---
card_id: PULSO-TASK-135
title: "Backend — resumo consolidado e contadores"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-066
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — resumo consolidado e contadores

> **Contexto:** RF-130 / RN-080 — totais me devem / eu devo.

## 📝 Descrição

Implementar `GET /dividas/resumo` e contadores de abas.

## 🛠️ Implementação

### `calcularResumo` / `montarResumo` (NOVO — CRIAR)

- Somar `valorRestante` por direção nas ativas
- Retornar `{ meDevem: { total, quantidade }, euDevo: { total, quantidade }, contadores }`
- Sync quitação antes de agregar

`contarPorAba` no repository para badges das tabs do frontend.

## 📋 Resumo

### ✅ Concluído
- Fórmula RN-080 definida

### ⏳ Pendente
- Implementar resumo e contadores

---
---
card_id: PULSO-TASK-136
title: "Backend — debtAlertService e job"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-067
due_date: null
categories:
  - Backend
  - Notificações
---

# [TASK] Backend — debtAlertService e job

> **Contexto:** RF-132 / RN-077 — alertas 7, 2 e 0 dias antes do prazo.

## 📝 Descrição

Implementar verificação diária e criação de `DIVIDA_COBRANCA`.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/debtAlertService.js` | `verificarDividasENotificar`; `DIAS_ALERTA = [7, 2, 0]` |
| `jobs/debtAlertJob.js` | `runDebtAlertJob` |
| Cron | Registrar no daily |

Dedup por metadados (`dividaId`, `dataAlerta`, `diasRestantes`); skip saldo zero.

## 📋 Resumo

### ✅ Concluído
- Matriz de alertas definida

### ⏳ Pendente
- Implementar alertas e job

---
---
card_id: PULSO-TASK-137
title: "Backend — debtCleanupJob 180 dias"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-067
due_date: null
categories:
  - Backend
---

# [TASK] Backend — debtCleanupJob 180 dias

> **Contexto:** Remoção automática de dívidas quitadas antigas.

## 📝 Descrição

Implementar job de retenção e wire no cron.

## 🛠️ Implementação

### `jobs/debtCleanupJob.js` (NOVO — CRIAR)

- `debtRepository.excluirQuitadasAntigas(180)`
- Registrar em `cronController` / `server.js`
- Logar quantidade removida

## 📋 Resumo

### ✅ Concluído
- Política 180 dias definida

### ⏳ Pendente
- Implementar cleanup job

---
---
card_id: PULSO-TASK-138
title: "Frontend — DebtsPage e client"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-068
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — DebtsPage e client

> **Contexto:** Página `/debts` orquestrando tabs, lista e modais.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/DebtsPage.jsx` | Tabs, filtros, resumo, lista paginada, modais |
| `services/debtService.js` | resumo, listar, CRUD, pagamentos, quitar, reabrir |
| `utils/debtFilters.js` | `DEBT_TABS`, `buildApiFiltros` |
| Rota | `App.jsx` → `/debts`; sidebar + `appRoutes.js` |

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar DebtsPage e client

---
---
card_id: PULSO-TASK-139
title: "Frontend — cards, modais, badges e CSS"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-068
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — cards, modais, badges e CSS

> **Contexto:** Componentes visuais e badges de status (RN-078).

## 📝 Descrição

Implementar UI de lista, badges e modais.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DebtSummaryCards.jsx` | Totais me devem / eu devo |
| `DebtTabs.jsx` / `DebtFilters.jsx` / `DebtList.jsx` / `DebtCard.jsx` | Navegação e lista |
| `DebtFormModal.jsx` | Criar/editar |
| `DebtPaymentModal.jsx` / `SettleDebtModal.jsx` | Pagar / quitar |
| `ReopenDebtModal.jsx` / `DeleteDebtModal.jsx` / `DebtDetailsModal.jsx` | Reabrir, excluir, detalhes |
| `utils/debtStatusUtils.js` | Badge vencida / parcial / quitada |
| `utils/debtBalanceUtils.js` | Saldo no client |
| `styles/debts.css` | Layout responsivo |

## 📋 Resumo

### ✅ Concluído
- Componentes e badges mapeados

### ⏳ Pendente
- Implementar UI completa

---
---
card_id: PULSO-TASK-140
title: "QA — testes de dívidas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-069
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de dívidas

> **Contexto:** Regressão para saldo, pagamentos, alertas e badges.

## 📝 Descrição

Implementar suites unitárias API e Web.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/debtService.test.js` | CRUD, pagar, quitar, reabrir, excluir pagamento |
| `unit/services/debtAlertService.test.js` | dias 7/2/0, dedup |
| `unit/utils/debtMapper.test.js` | mapDivida saldo |
| `unit/jobs/debtCleanupJob.test.js` | retenção 180d |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/debtBalanceUtils.test.js` | saldo client |
| `unit/utils/debtStatusUtils.test.js` | badge vencida |
| `unit/utils/debtFilters.test.js` | tabs/filtros |
| `unit/services/debtService.test.js` | HTTP client |
| `unit/components/debtDetailsModal.test.js` | modal detalhes |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites

---
