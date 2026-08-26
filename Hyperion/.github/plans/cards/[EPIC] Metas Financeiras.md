# [EPIC] Metas Financeiras — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-004 | Metas Financeiras |
| Feature | PULSO-FEAT-018 | Backend — API de metas |
| Feature | PULSO-FEAT-019 | Cálculos, progresso e reserva de emergência |
| Feature | PULSO-FEAT-020 | Aportes e ciclo de vida da meta |
| Feature | PULSO-FEAT-021 | Frontend — página de metas |
| Feature | PULSO-FEAT-022 | QA — testes de metas |
| Task | PULSO-TASK-037–048 | DB, backend, aportes, frontend, QA |

---

---
card_id: PULSO-EPIC-004
title: "Metas Financeiras"
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

# [EPIC] Metas Financeiras

> **Contexto:** Planejamento de objetivos financeiros — criar metas com valor-alvo e prazo, registrar aportes manuais, acompanhar progresso visual, pausar/retomar/concluir; sugerir valor mensal; meta especial de reserva de emergência com base no gasto médio.

**Refs:** RF-026–032 · RF-142 · RN-061–068

## 🎯 Objetivos

- CRUD de metas pessoais (nome, valor-alvo, prazo, descrição, prioridade, tipo curto/longo prazo)
- Aportes manuais com validação de valor restante e data não futura
- Progresso com barra, percentual e sugestão mensal (RN-067)
- Transições de status: ATIVA ↔ PAUSADA, auto-conclusão ao atingir valor (RN-063)
- Notificação `META_ATINGIDA` ao concluir meta (RF-032)
- Sugestão de reserva de emergência: média de 3 meses de despesas × N meses (RF-142, padrão 6)
- Alerta visual "Meta vencida" quando prazo passou sem conclusão (RN-068)
- Exclusão de aporte em meta concluída reabre meta para ATIVA quando aplicável
- Resumo agregado: totais, progresso médio, categorias por tipo/status, atividade recente

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/goals` | Metas Financeiras | Tabs (todas/ativas/pausadas/concluídas), busca, filtros de prazo, sidebar resumo |
| Modal | Nova/Editar meta | Campos + atalho "Reserva de Emergência"; histórico de aportes no edit |
| Modal | Registrar aporte | Valor + data; validação valor restante |
| Modal | Excluir meta | Confirmação irreversível |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `transactionRepository.calcularAgregados` para sugestão RF-142 |
| Notificações | `META_ATINGIDA` em `registrarAporte` |
| Gamificação | `processarAposCriarMeta` em `criarMeta` |
| Dashboard | Widget `DashboardActiveGoals` (RF-013) |
| Viagens | `Viagem.metaId` 1:1 opcional — `onDelete: SetNull` (RN-073) |
| Planejamento de Compra | `ItemPlanejamentoCompra.metaId` vinculável (RF-137) |
| Grupos | Metas compartilhadas em epic separado (`MetaGrupo`) |

## 🔗 Sub-issues

- PULSO-FEAT-018
- PULSO-FEAT-019
- PULSO-FEAT-020
- PULSO-FEAT-021
- PULSO-FEAT-022

## 📋 Resumo

### ✅ Concluído
- Escopo RF-026–032, RF-142 e RN-061–068 mapeado
- Hierarquia Epic → 5 Features → 12 Tasks definida
- Contratos API e fluxos de UI documentados como spec

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Metas de grupo (RF-096–097) — epic Grupos

---
---
card_id: PULSO-FEAT-018
title: "Backend — API de metas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de metas

> **Contexto:** Camada REST autenticada para CRUD, listagem paginada e resumo agregado de metas pessoais.

**Refs:** RF-026 · RF-031

## 📝 Descrição

Expor endpoints em `/api/metas` para criar, editar, excluir, listar com filtros e obter resumo consolidado.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/metas` | Lista paginada; headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page` |
| `GET` | `/metas/resumo` | Totais, progresso médio, categorias, contadores, atividade recente |
| `POST` | `/metas` | Cria meta com prazo futuro (RN-061) |
| `PATCH` | `/metas/:id` | Edita parcialmente; transições de status |
| `DELETE` | `/metas/:id` | Exclui meta (204) |

**Filtros query:** `status`, `tipo`, `busca`, `prazoInicio`, `prazoFim`, `pagina`, `limite`

## 🔗 Sub-issues

- PULSO-TASK-037
- PULSO-TASK-039
- PULSO-TASK-040

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e payloads definidos

### ⏳ Pendente
- PULSO-TASK-037–040 — persistência, service e rotas

---
---
card_id: PULSO-FEAT-019
title: "Cálculos, progresso e reserva de emergência"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Cálculos, progresso e reserva de emergência

> **Contexto:** Utilitários de domínio para progresso, sugestão mensal, tipo curto/longo prazo e meta especial RF-142.

**Refs:** RF-029 · RF-030 · RF-142 · RN-067 · RN-068

## 📝 Descrição

Implementar cálculos compartilhados API/Web e endpoint de sugestão de reserva de emergência baseado em despesas dos últimos 3 meses.

## ✅ Critérios de Aceite

| Endpoint / util | Comportamento |
|-----------------|---------------|
| `GET /metas/sugestao-reserva-emergencia?meses=N` | Retorna `mediaGastoMensal`, `valorSugerido`, `mesesHistoricoAnalisado` |
| `calcProgressoMeta` | `valorRestante`, `percentual` cap 100% |
| `calcValorMensalSugerido` | `valorRestante / diffMesesAte(prazo)` (RN-067) |
| `inferirTipoMeta` | ≤ 6 meses → `CURTO_PRAZO`; senão `LONGO_PRAZO` |
| `metaEstaVencida` | Prazo passou e status não CONCLUIDA/CANCELADA (RN-068) |
| `mapMeta` | DTO com `vencida`, `valorMensalSugerido`, `mesesRestantes`, aportes |

## 🔗 Sub-issues

- PULSO-TASK-038
- PULSO-TASK-041

## 📋 Resumo

### ✅ Concluído
- Fórmulas e contrato de sugestão RF-142 definidos

### ⏳ Pendente
- PULSO-TASK-038–041 — utils, mapper e endpoint de sugestão

---
---
card_id: PULSO-FEAT-020
title: "Aportes e ciclo de vida da meta"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Notificações
---

# [FEATURE] Aportes e ciclo de vida da meta

> **Contexto:** Registrar aportes, auto-conclusão, pausar/retomar, exclusão com reabertura e notificação de meta atingida.

**Refs:** RF-027 · RF-031 · RF-032 · RN-062–066 · RN-063

## 📝 Descrição

Implementar fluxos de aporte e transições de status com validações de domínio e integração a notificações.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/metas/:id/aportes` | Registra aporte; atualiza `valorAtual`; auto-conclui se `valorRestante <= 0` |
| `DELETE` | `/metas/:id/aportes/:aporteId` | Remove aporte; recalcula; reabre meta CONCLUIDA → ATIVA se necessário |

**Regras:**
- Aporte só em meta ATIVA (RN-064, RN-066)
- Valor aporte ≤ valor restante (RN-062)
- Data aporte não futura
- Pausar só ATIVA; retomar só PAUSADA
- Conclusão manual só se `valorRestante <= 0`
- Notificação `META_ATINGIDA` ao concluir via aporte (RF-032)

## 🔗 Sub-issues

- PULSO-TASK-042
- PULSO-TASK-043

## 📋 Resumo

### ✅ Concluído
- Máquina de estados e regras RN-062–066 documentadas

### ⏳ Pendente
- PULSO-TASK-042–043 — aportes, conclusão e transições

---
---
card_id: PULSO-FEAT-021
title: "Frontend — página de metas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-004
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página de metas

> **Contexto:** Interface completa em `/goals` — listagem, resumo lateral, modais de CRUD/aporte/exclusão e reserva de emergência.

**Refs:** RF-026–031 · RF-028 · RF-142 · RN-068

## 📝 Descrição

Implementar página de metas com tabs por status, filtros, cards de progresso, sidebar com donut e atividade recente, e modais integrados ao design system.

## ✅ Critérios de Aceite

- Rota `/goals` registrada em `App.jsx` sob `MainLayout`
- Tabs: Todas, Ativas, Pausadas, Concluídas
- Busca por nome + filtro de intervalo de prazo
- Paginação server-side (`limite: 10`)
- Barra de progresso e percentual em cada meta (RF-028)
- Alerta "Meta vencida" via `goalStatusUtils` (RN-068)
- Atalho "Reserva de Emergência" no modal de criação (RF-142)
- Histórico de aportes editável no modal de edição

## 🔗 Sub-issues

- PULSO-TASK-044
- PULSO-TASK-045
- PULSO-TASK-046
- PULSO-TASK-047

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes e fluxos de UI definido

### ⏳ Pendente
- PULSO-TASK-044–047 — página, modais e estilos

---
---
card_id: PULSO-FEAT-022
title: "QA — testes de metas"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-004
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de metas

> **Contexto:** Regressão para CRUD, aportes, conclusão automática, reabertura e cálculos de progresso.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🔗 Sub-issues

- PULSO-TASK-048

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-048 — implementar/expandir suites

---
---
card_id: PULSO-TASK-037
title: "Banco de dados — Meta e AporteMeta"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-018
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — Meta e AporteMeta

> **Contexto:** Modelagem persistente para metas pessoais e histórico de aportes.

## 📝 Descrição

Criar models Prisma e migrations para `Meta` e `AporteMeta` com enums de tipo e status.

## ✅ Critérios de Aceite

**Então** schema contém:
- `Meta`: nome, valorAlvo, valorAtual, prazo, tipo, status, prioridade?, descricao?, concluidaEm?
- `AporteMeta`: metaId, valor, data
- Enums: `TipoMeta` (CURTO_PRAZO, LONGO_PRAZO), `StatusMeta` (ATIVA, PAUSADA, CONCLUIDA, CANCELADA)
- Índices: `[usuarioId, status]`, `[usuarioId, prazo]`, `[metaId, data DESC]`
- Relação `Viagem.metaId` com `onDelete: SetNull`

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Migration relevante:** `20260615120000_metas`

## 📋 Resumo

### ✅ Concluído
- Spec de models e índices definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma

---
---
card_id: PULSO-TASK-038
title: "Backend — metaBalanceUtils e metaMapper"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-019
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — metaBalanceUtils e metaMapper

> **Contexto:** Funções puras de cálculo e DTO de resposta da API.

## 📝 Descrição

Implementar utilitários de progresso, sugestão mensal, inferência de tipo, vencimento e mapper para JSON.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Funções |
|---------|---------|
| `api/src/utils/metaBalanceUtils.js` | `roundMoney`, `diffMesesAte`, `inferirTipoMeta`, `calcProgressoMeta`, `calcValorMensalSugerido`, `calcSugestaoReservaEmergencia`, `metaEstaVencida`, `podeReceberAporte` |
| `api/src/utils/metaMapper.js` | `mapMeta`, `mapAporte` — inclui `vencida`, `valorMensalSugerido`, `mesesRestantes` |

**Constante:** `MESES_RESERVA_EMERGENCIA_PADRAO = 6`

## 📋 Resumo

### ✅ Concluído
- Fórmulas RN-067 e RN-068 especificadas

### ⏳ Pendente
- Implementar utils e mapper

---
---
card_id: PULSO-TASK-039
title: "Backend — metaService e metaRepository"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-018
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — metaService e metaRepository

> **Contexto:** Camada de domínio — listagem, resumo, CRUD e montagem de filtros.

## 📝 Descrição

Implementar repository Prisma e service com validações de prazo, valor-alvo e exclusão.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Responsabilidade |
|---------|------------------|
| `api/src/repositories/metaRepository.js` | `listarPorUsuario`, `listarTodasComAportes`, `contarPorStatus`, `listarAtividadeRecente`, CRUD meta/aporte |
| `api/src/services/metaService.js` | `listarMetas`, `calcularResumo`, `criarMeta`, `editarMeta`, `excluirMeta`, `montarResumo` |

**Validações:**
- `validarPrazoFuturo` — RN-061
- `valorAlvo` ≥ `valorAtual` na edição
- Meta cancelada/concluída — regras de edição

**Integração:** `gamificationService.processarAposCriarMeta` em criação

## 📋 Resumo

### ✅ Concluído
- Contratos de service e queries definidos

### ⏳ Pendente
- Implementar repository e service base

---
---
card_id: PULSO-TASK-040
title: "Backend — metaRoutes, controller e schemas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-018
due_date: null
categories:
  - Backend
  - API
---

# [TASK] Backend — metaRoutes, controller e schemas

> **Contexto:** Exposição HTTP com auth, validação Zod e headers de paginação.

## 📝 Descrição

Registrar rotas `/metas` no app Express com middleware de autenticação e schemas de entrada.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Conteúdo |
|---------|----------|
| `api/src/routes/metaRoutes.js` | Rotas GET/POST/PATCH/DELETE |
| `api/src/controllers/metaController.js` | Handlers + headers paginação |
| `api/src/schemas/metaSchemas.js` | Zod: criar, editar, aporte, listagem, sugestão reserva |

**Montagem:** `app.use('/api/metas', metaRoutes)` (ou prefixo equivalente do projeto)

## 📋 Resumo

### ✅ Concluído
- Mapa de rotas e schemas definido

### ⏳ Pendente
- Implementar routes, controller e schemas

---
---
card_id: PULSO-TASK-041
title: "Backend — sugestão reserva de emergência (RF-142)"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-019
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — sugestão reserva de emergência (RF-142)

> **Contexto:** Endpoint que calcula valor-alvo sugerido com base no gasto médio mensal.

## 📝 Descrição

Implementar `sugerirReservaEmergencia` agregando despesas dos últimos 3 meses via `transactionRepository`.

## 🛠️ Implementação

### `metaService.sugerirReservaEmergencia` (NOVO — CRIAR)

**Entrada:** `meses` (query, default 6, max 60)

**Saída:**
```json
{
  "mediaGastoMensal": "1234.56",
  "meses": 6,
  "valorSugerido": "7407.36",
  "mesesHistoricoAnalisado": 3
}
```

**Rota:** `GET /metas/sugestao-reserva-emergencia`

## 📋 Resumo

### ✅ Concluído
- Contrato RF-142 e dependência em transações definidos

### ⏳ Pendente
- Implementar agregação e endpoint

---
---
card_id: PULSO-TASK-042
title: "Backend — registrarAporte e notificação META_ATINGIDA"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-020
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Notificações
---

# [TASK] Backend — registrarAporte e notificação META_ATINGIDA

> **Contexto:** Fluxo de aporte com auto-conclusão e alerta ao usuário (RF-032).

## 📝 Descrição

Implementar `registrarAporte` com `sincronizarConclusao` e integração a `notificationService`.

## 🛠️ Implementação

### `metaService.registrarAporte` (NOVO — CRIAR)

1. Validar meta ATIVA (`podeReceberAporte`)
2. Validar valor ≤ valorRestante (RN-062)
3. Validar data não futura
4. Criar `AporteMeta`; incrementar `valorAtual`
5. Se `valorRestante <= 0` → status CONCLUIDA + `concluidaEm`
6. Notificação `META_ATINGIDA` com `linkAcao: '/goals'`

**Rota:** `POST /metas/:id/aportes`

## 📋 Resumo

### ✅ Concluído
- Fluxo RN-062–063 e RF-032 especificados

### ⏳ Pendente
- Implementar registrarAporte e sincronizarConclusao

---
---
card_id: PULSO-TASK-043
title: "Backend — transições de status e excluirAporte com reabertura"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-020
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — transições de status e excluirAporte com reabertura

> **Contexto:** Pausar/retomar/concluir via PATCH e correção de aportes em meta concluída.

## 📝 Descrição

Completar `editarMeta` com máquina de estados e `excluirAporte` que recalcula valor e reabre meta quando necessário.

## 🛠️ Implementação

### `editarMeta` — transições (NOVO — CRIAR)

| De | Para | Condição |
|----|------|----------|
| ATIVA | PAUSADA | Sempre |
| PAUSADA | ATIVA | Retomar |
| * | CONCLUIDA | `valorRestante <= 0` |
| CONCLUIDA | * | Bloqueado (exceto manter CONCLUIDA) |
| * | CANCELADA | Bloqueado — usar DELETE |

### `excluirAporte` (NOVO — CRIAR)

- Recalcular `valorAtual`
- Se meta CONCLUIDA e `valorRestante > 0` → status ATIVA, limpar `concluidaEm`
- Sem guard bloqueando exclusão em meta concluída

**Rota:** `DELETE /metas/:id/aportes/:aporteId`

## 📋 Resumo

### ✅ Concluído
- Máquina de estados e reabertura documentadas

### ⏳ Pendente
- Implementar editarMeta (status) e excluirAporte

---
---
card_id: PULSO-TASK-044
title: "Frontend — GoalsPage, tabs, filtros e sidebar"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — GoalsPage, tabs, filtros e sidebar

> **Contexto:** Shell da página `/goals` com fetch paralelo lista + resumo.

## 📝 Descrição

Implementar página principal com tabs por status, busca, filtros de prazo, paginação e sidebar de resumo.

## 🛠️ Implementação

### Páginas e componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/GoalsPage.jsx` | Orquestração estado, modais, fetch |
| `GoalTabs.jsx` | Todas / Ativas / Pausadas / Concluídas |
| `GoalList.jsx` | Lista paginada de metas |
| `GoalSidebar.jsx` | Resumo, donut categorias, atividade recente |
| `GoalCategoriesDonut.jsx` | Distribuição curto/longo/concluídas/pausadas |
| `GoalRecentActivity.jsx` | Feed aportes + conclusões |
| `services/metaService.js` | `buscarMetas`, `obterResumo`, CRUD, aportes |
| `utils/goalFilters.js` | `GOAL_TABS`, `buildApiFiltros`, `DEFAULT_GOAL_FILTROS` |

**Padrão:** `AbortController`; headers paginação; `Promise.all` resumo + lista

**Rota:** `App.jsx` → `path="goals"` sob MainLayout

## 📋 Resumo

### ✅ Concluído
- Spec de estado e layout definida

### ⏳ Pendente
- Implementar página e componentes de listagem/resumo

---
---
card_id: PULSO-TASK-045
title: "Frontend — GoalFormModal e reserva de emergência"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — GoalFormModal e reserva de emergência

> **Contexto:** Formulário criar/editar meta com atalho RF-142 e inferência de tipo.

## 📝 Descrição

Modal completo com validação client, sugestão mensal inline e botão "Usar sugestão de reserva de emergência".

## 🛠️ Implementação

### `GoalFormModal.jsx` (NOVO — CRIAR)

Campos:
- Nome, valor-alvo (`InputMoney`), prazo (`DatePicker`), descrição
- Tipo curto/longo (inferido via `inferirTipoMeta` / `calcMesesAtePrazo`)
- Preview sugestão mensal (`calcValorMensalSugerido`)
- Botão reserva: chama `sugerirReservaEmergencia()` e preenche nome/valor

**Utils espelhados:** `web/src/utils/goalBalanceUtils.js`

**Modos:** create | edit — pausar/retomar via actions no footer

## 📋 Resumo

### ✅ Concluído
- Spec de campos e fluxo RF-142 definida

### ⏳ Pendente
- Implementar GoalFormModal

---
---
card_id: PULSO-TASK-046
title: "Frontend — aportes, exclusão e GoalAportesSection"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — aportes, exclusão e GoalAportesSection

> **Contexto:** Modais de aporte e exclusão; histórico editável no edit (RF-NOVO-D2).

## 📝 Descrição

Implementar fluxos de contribuição, confirmação de delete e seção de histórico de aportes com exclusão individual.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `GoalContributionModal.jsx` | Registrar aporte (valor + data) |
| `DeleteGoalModal.jsx` | Confirmar exclusão irreversível |
| `GoalAportesSection.jsx` | Lista aportes no edit; excluir com reabertura |

**Regras UI:**
- Botão aporte desabilitado se PAUSADA/CONCLUIDA (RN-064, RN-066)
- Valor máximo = valorRestante
- Loading states `deletingAporteId`

## 📋 Resumo

### ✅ Concluído
- Fluxos de aporte e correção pós-conclusão especificados

### ⏳ Pendente
- Implementar modais e GoalAportesSection

---
---
card_id: PULSO-TASK-047
title: "Frontend — GoalCard, goalStatusUtils e goals.css"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — GoalCard, goalStatusUtils e goals.css

> **Contexto:** Cards de progresso, alertas de vencimento e layout responsivo (RF-028, RN-068).

## 📝 Descrição

Implementar card visual de meta, utilitários de status/insight e folha de estilos da página.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `GoalCard.jsx` | Barra progresso, percentual, ações rápidas |
| `goalIcons.jsx` | Ícones por nome/status |
| `goalIconRules.js` | Regras de ícone |
| `goalStatusUtils.js` | `formatGoalDeadlineLabel`, `getGoalInsight`, variantes progress |
| `styles/goals.css` | Layout page, cards, sidebar, modais, mobile |

**RN-068:** label "Venceu em …" quando `meta.vencida === true`

**Responsivo:** sidebar abaixo da lista em mobile; CTAs touch-friendly

## 📋 Resumo

### ✅ Concluído
- Spec visual e utilitários definidos

### ⏳ Pendente
- Implementar GoalCard, utils e goals.css

---
---
card_id: PULSO-TASK-048
title: "QA — testes unitários de metas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-022
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de metas

> **Contexto:** Regressão para CRUD, aportes, conclusão, reabertura e cálculos.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/metaService.test.js` | CRUD, aportes, conclusão, excluirAporte reabertura |
| `unit/utils/metaBalanceUtils.test.js` | Progresso, sugestão mensal, vencimento, reserva |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/pages/goalsPage.test.jsx` | Render página, tabs |
| `unit/components/goalCard.test.jsx` | Progresso e labels |
| `unit/utils/goalIconRules.test.js` | Regras de ícone |
| `unit/services/metaService.test.js` | Chamadas HTTP |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas

---
