# [EPIC] Lembretes e Google Agenda — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-006 | Lembretes e Google Agenda |
| Feature | PULSO-FEAT-030 | Backend — API de lembretes |
| Feature | PULSO-FEAT-031 | Google Calendar — OAuth e sincronização |
| Feature | PULSO-FEAT-032 | Calendário financeiro — visão mês e dia |
| Feature | PULSO-FEAT-033 | Jobs — alertas e recorrência |
| Feature | PULSO-FEAT-034 | Frontend — calendário e lembretes |
| Feature | PULSO-FEAT-035 | QA — testes de lembretes |
| Task | PULSO-TASK-061–072 | DB, lembretes, Google, calendário, QA |

---

---
card_id: PULSO-EPIC-006
title: "Lembretes e Google Agenda"
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
  - Integração Externa
  - Regra de Negócio
---

# [EPIC] Lembretes e Google Agenda

> **Contexto:** Lembretes financeiros com categorias (52), antecedência configurável, flag pago, recorrência mensal ou a cada N dias; calendário financeiro unificando transações e vencimentos; sync bidirecional com Google Calendar (calendário "Pulso"), tokens OAuth criptografados.

**Refs:** RF-054–058 · RF-058b · RN-094–100 · RN-169

## 🎯 Objetivos

- CRUD de lembretes com título, valor opcional, data, hora, categoria e antecedência (RF-055, RF-058)
- OAuth Google Calendar separado do login (`GOOGLE_CALENDAR_CALLBACK_URL`) (RF-054)
- Sync opt-in: criar/atualizar eventos no calendário "Pulso" (RF-056, RN-096)
- Desconectar Google a qualquer momento; remover eventos ao desativar sync (RF-057)
- Import Google → Pulso: título e data ao abrir mês ou sync manual (RF-058b)
- Falha de sync na criação preserva lembrete com `sincronizado: false` (RN-097)
- Marcar como pago remove evento Google; não gera transação (RN-099)
- Recorrência mensal gera instâncias; `repetirCadaDias` avança vencimento (RN-098)
- Job diário de alertas `LEMBRETE_VENCIMENTO` por antecedência (RN-094, RN-095)
- Calendário financeiro: marcadores de transações + lembretes + recebimentos fixos (RN-100)
- Horário configurável `horaLembrete` no evento Google (RN-169)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/calendar` | Calendário Financeiro | Grade mensal, painel do dia, próximos vencimentos |
| Banner | Google Agenda | Conectar/desconectar, status email |
| Modal | Lembrete | CRUD, categoria, recorrência, sync Google |
| Modal | Resync Google | Sincronizar pendentes (futuros/todos) |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | Marcadores no calendário via `calendarService` |
| Notificações | `LEMBRETE_VENCIMENTO` via `reminderAlertService` |
| Divisão de Despesas | M2M `DivisaoParticipante` ↔ `Lembrete` (epic separado) |
| Cron | `reminderAlertJob`, `reminderRecurrenceJob` |
| Google APIs | `@googleapis/calendar`, `@googleapis/oauth2` |
| Segurança | `googleTokenCrypto` AES-256-GCM em repouso |

## 🔗 Sub-issues

- PULSO-FEAT-030
- PULSO-FEAT-031
- PULSO-FEAT-032
- PULSO-FEAT-033
- PULSO-FEAT-034
- PULSO-FEAT-035

## 📋 Resumo

### ✅ Concluído
- Escopo RF-054–058, RF-058b e RN-094–100 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend + jobs
- Paginação no job de alertas — evolução futura (escala)

---
---
card_id: PULSO-FEAT-030
title: "Backend — API de lembretes"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de lembretes

> **Contexto:** CRUD de lembretes financeiros com categorias, recorrência e hook de sync Google.

**Refs:** RF-055 · RF-058 · RN-099

## 📝 Descrição

Expor endpoints autenticados em `/api/lembretes` para listar, criar, editar, excluir e marcar como pago.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/lembretes?mes=YYYY-MM` | Lista do mês com `diasAteVencimento` |
| `POST` | `/lembretes` | Cria; sync opcional via `sincronizarGoogle` |
| `PATCH` | `/lembretes/:id` | Edita parcialmente; re-sync se campos afetam evento |
| `POST` | `/lembretes/:id/pagar` | Marca pago; remove evento Google |
| `DELETE` | `/lembretes/:id` | Exclui; remove evento Google se existir |

**Categorias:** 52 valores em 11 grupos (`reminderCategories.js`)

**Recorrência:** `repetirMensal` + `diaRecorrencia` (1–28); `repetirCadaDias` opcional

## 🔗 Sub-issues

- PULSO-TASK-061
- PULSO-TASK-062
- PULSO-TASK-063
- PULSO-TASK-064

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e regras RN-099 definidos

### ⏳ Pendente
- PULSO-TASK-061–064 — DB, repository, service e rotas

---
---
card_id: PULSO-FEAT-031
title: "Google Calendar — OAuth e sincronização"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Backend
  - Integração Externa
  - Segurança
---

# [FEATURE] Google Calendar — OAuth e sincronização

> **Contexto:** Conexão OAuth, calendário dedicado "Pulso", sync bidirecional e resync em lote.

**Refs:** RF-054 · RF-056 · RF-057 · RF-058b · RN-096 · RN-097

## 📝 Descrição

Implementar fluxo OAuth Calendar, persistência de tokens criptografados, sync de eventos e importação Google → Pulso.

## ✅ Critérios de Aceite

| Rota | Comportamento |
|------|---------------|
| `GET /calendario/google/status` | `{ conectado, email }` |
| `GET /calendario/google/url` | URL OAuth com state |
| `GET /calendario/google/callback` | Troca code; ativa integração |
| `POST /calendario/google/desconectar` | Revoga; limpa tokens |
| `GET /calendario/google/sync/pendentes` | Contadores futuros/todos |
| `POST /calendario/google/sync` | Resync em lote por escopo |

**Sync:** `garantirCalendarioPulso`, `buildEventBody` com antecedência em minutos, recreate em 404

**Import:** `importarAlteracoesDoGoogle` — título e data (RF-058b)

## 🔗 Sub-issues

- PULSO-TASK-065
- PULSO-TASK-066

## 📋 Resumo

### ✅ Concluído
- Fluxos OAuth e sync documentados

### ⏳ Pendente
- PULSO-TASK-065–066 — OAuth service e sync service

---
---
card_id: PULSO-FEAT-032
title: "Calendário financeiro — visão mês e dia"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Calendário financeiro — visão mês e dia

> **Contexto:** Agregação de transações, lembretes e recebimentos fixos para a UI do calendário.

**Refs:** RN-100

## 📝 Descrição

Expor endpoints `/api/calendario/mes` e `/api/calendario/dia` com resumo financeiro e marcadores por dia.

## ✅ Critérios de Aceite

| Endpoint | Retorno |
|----------|---------|
| `GET /calendario/mes?mes=YYYY-MM` | Resumo receitas/despesas/saldo, variação vs mês anterior, `dias` com marcadores, `proximosVencimentos`, `recebimentosFixos` |
| `GET /calendario/dia?data=YYYY-MM-DD` | Transações do dia, lembretes, totais, recebimentos fixos |

**Marcadores por dia:** `temReceita`, `temDespesa`, `temLembrete`, `temRecebimentoFixo`

**Import Google:** disparar `importarAlteracoesDoGoogle` ao carregar mês (frontend)

## 🔗 Sub-issues

- PULSO-TASK-067

## 📋 Resumo

### ✅ Concluído
- Contratos de visão mês/dia definidos

### ⏳ Pendente
- PULSO-TASK-067 — calendarService e rotas

---
---
card_id: PULSO-FEAT-033
title: "Jobs — alertas e recorrência"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Backend
  - Cron
  - Notificações
---

# [FEATURE] Jobs — alertas e recorrência

> **Contexto:** Cron diário para notificações de vencimento e geração de instâncias recorrentes.

**Refs:** RN-094 · RN-095 · RN-098

## 📝 Descrição

Implementar jobs `reminderAlertJob` e `reminderRecurrenceJob` integrados ao cron da API.

## ✅ Critérios de Aceite

**`reminderAlertJob`:**
- Varre lembretes não pagos
- Calcula data alerta = vencimento − antecedência
- Cria `LEMBRETE_VENCIMENTO` sem duplicata no mesmo dia

**`reminderRecurrenceJob`:**
- `gerarInstanciasMensais` — templates `repetirMensal` sem duplicar mês
- `avancarRepeticaoPorDias` — avança `dataVencimento` com teto 10k iterações
- Guard para `repetirCadaDias <= 0`

## 🔗 Sub-issues

- PULSO-TASK-068

## 📋 Resumo

### ✅ Concluído
- Regras de recorrência e alerta especificadas

### ⏳ Pendente
- PULSO-TASK-068 — jobs e reminderAlertService

---
---
card_id: PULSO-FEAT-034
title: "Frontend — calendário e lembretes"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — calendário e lembretes

> **Contexto:** Página `/calendar` com grade mensal, painel diário, Google Agenda e modais de lembrete.

**Refs:** RF-054–058 · RF-058b · RN-100

## 📝 Descrição

Implementar interface completa do calendário financeiro com integração Google e CRUD de lembretes.

## ✅ Critérios de Aceite

- Rota `/calendar` em `App.jsx`
- Navegação mensal; seleção de dia; marcadores visuais
- `UpcomingReminders` — próximos vencimentos
- `CalendarInsightCard` — resumo do mês
- `GoogleCalendarBanner` — connect/disconnect + callback query params
- `GoogleResyncModal` — escopos futuros/todos
- `ReminderFormModal` — 52 categorias agrupadas, antecedência, hora, recorrência, sync toggle
- Marcar pago / excluir com confirmação

## 🔗 Sub-issues

- PULSO-TASK-069
- PULSO-TASK-070
- PULSO-TASK-071

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes e fluxos UI definido

### ⏳ Pendente
- PULSO-TASK-069–071 — página, modais e estilos

---
---
card_id: PULSO-FEAT-035
title: "QA — testes de lembretes"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de lembretes

> **Contexto:** Regressão para CRUD, sync Google, alertas, recorrência e calendário.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🔗 Sub-issues

- PULSO-TASK-072

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-072 — implementar/expandir suites

---
---
card_id: PULSO-TASK-061
title: "Banco de dados — Lembrete e config Google"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-030
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — Lembrete e config Google

> **Contexto:** Modelagem persistente para lembretes e tokens Google Calendar.

## 📝 Descrição

Criar model `Lembrete` e campos Google em `ConfiguracaoUsuario`.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Lembrete:** titulo, valor?, dataVencimento, horaLembrete, antecedencia, categoria, pago, googleEventId?, sincronizado, repetirMensal, diaRecorrencia?, repetirCadaDias?, lembreteTemplateId?

**Enums:** `AntecedenciaLembrete`, `CategoriaLembrete` (52 valores)

**ConfiguracaoUsuario:** googleCalendarAtivo, googleCalendarId, googleCalendarEmail, tokensGoogle (Json criptografado)

**Índices:** `[usuarioId, dataVencimento]`, sincronizado, repetirMensal

**Migrations:** `20260609120000_lembrete_recorrencia`, `20260707165414_add_hora_lembrete`, `20260715160000_lembrete_repetir_cada_dias_check`

## 📋 Resumo

### ✅ Concluído
- Spec de models definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma

---
---
card_id: PULSO-TASK-062
title: "Backend — reminderRepository, mapper e categorias"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-030
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — reminderRepository, mapper e categorias

> **Contexto:** Persistência, DTO e catálogo de 52 categorias agrupadas.

## 📝 Descrição

Implementar repository, mapper e constantes de categoria/antecedência.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/reminderRepository.js` | listarPorUsuario, listarProximos, CRUD |
| `utils/reminderMapper.js` | `mapLembrete` |
| `constants/reminderCategories.js` | 11 grupos, labels, `normalizeCategoria`, legacy map |
| `utils/reminderAntecedencia.js` | `ANTECEDENCIA_DIAS`, `ANTECEDENCIA_MINUTOS`, labels |

## 📋 Resumo

### ✅ Concluído
- Shape DTO e categorias especificados

### ⏳ Pendente
- Implementar repository, mapper e constants

---
---
card_id: PULSO-TASK-063
title: "Backend — reminderService CRUD e marcar pago"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-030
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Integração Externa
---

# [TASK] Backend — reminderService CRUD e marcar pago

> **Contexto:** Domínio de lembretes com sync Google, recorrência e dias até vencimento.

## 📝 Descrição

Implementar service com CRUD, `aplicarSyncGoogle`, `marcarComoPago` e normalização de recorrência.

## 🛠️ Implementação

### `reminderService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `criarLembrete` | Sync opcional; falha sync → retorna com `sincronizado: false` (RN-097) |
| `atualizarLembrete` | Re-sync se campos afetam evento |
| `marcarComoPago` | `pago: true`; remove evento Google (RN-099) |
| `removerLembrete` | Remove evento Google antes de deletar |
| `normalizarRecorrencia` | `diaRecorrencia` cap 28 |

**Helper:** `diasAteVencimento`, `mapLembreteComContagem`

## 📋 Resumo

### ✅ Concluído
- Fluxos RN-097 e RN-099 documentados

### ⏳ Pendente
- Implementar reminderService

---
---
card_id: PULSO-TASK-064
title: "Backend — reminderRoutes, controller e schemas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-030
due_date: null
categories:
  - Backend
  - API
---

# [TASK] Backend — reminderRoutes, controller e schemas

> **Contexto:** Exposição HTTP `/api/lembretes` com validação Zod.

## 📝 Descrição

Registrar rotas de lembretes com auth middleware e schemas de entrada.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Rotas |
|---------|-------|
| `routes/reminderRoutes.js` | GET/POST/PATCH/DELETE + POST `/:id/pagar` |
| `controllers/reminderController.js` | Handlers |
| `schemas/reminderSchemas.js` | criar, atualizar, query mes, marcar pago |

Montagem: `app.use('/api/lembretes', reminderRoutes)`

## 📋 Resumo

### ✅ Concluído
- Mapa de rotas definido

### ⏳ Pendente
- Implementar routes, controller e schemas

---
---
card_id: PULSO-TASK-065
title: "Backend — googleCalendarService OAuth"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-031
due_date: null
categories:
  - Backend
  - Integração Externa
  - Segurança
---

# [TASK] Backend — googleCalendarService OAuth

> **Contexto:** Fluxo OAuth Calendar distinto do login; tokens criptografados.

## 📝 Descrição

Implementar conexão, callback, status e desconexão do Google Agenda.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/googleCalendarService.js` | obterStatus, obterUrlConexao, callback, desconectar |
| `utils/googleOAuth.js` | `createOAuthClient` |
| `utils/googleTokenCrypto.js` | `encryptTokens` / `decryptTokens` AES-256-GCM |

**Scopes:** `calendar`, `userinfo.email`

**Env:** `GOOGLE_CALENDAR_CALLBACK_URL`, credenciais Google OAuth

**Desconectar:** limpa tokens; opcionalmente remove calendário Pulso

## 📋 Resumo

### ✅ Concluído
- Fluxo RF-054/RF-057 especificado

### ⏳ Pendente
- Implementar OAuth service e crypto

---
---
card_id: PULSO-TASK-066
title: "Backend — googleCalendarSyncService"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-031
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [TASK] Backend — googleCalendarSyncService

> **Contexto:** Sync de eventos, import bidirecional e resync em lote.

## 📝 Descrição

Implementar serviço de sincronização com calendário "Pulso" e importação RF-058b.

## 🛠️ Implementação

### `googleCalendarSyncService.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `garantirCalendarioPulso` | Cria ou reutiliza calendário "Pulso" |
| `sincronizarLembrete` | insert/update evento; recreate em 404 |
| `buildEventBody` | start/end com `horaLembrete`; reminders por antecedência |
| `importarAlteracoesDoGoogle` | Atualiza titulo/data no Pulso (RF-058b) |
| `sincronizarPendentes` | Escopos futuros/todos |
| `contarPendentesSync` | Contadores para UI resync |
| `removerEventoLembrete` | Delete evento ao desmarcar sync/pagar |

**Token refresh:** `client.on('tokens')` persiste merge criptografado

**Erros:** `mapGoogleError` — scopes, invalid_grant, 403

## 📋 Resumo

### ✅ Concluído
- Contratos RF-056 e RF-058b definidos

### ⏳ Pendente
- Implementar sync service

---
---
card_id: PULSO-TASK-067
title: "Backend — calendarService e rotas calendário"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-032
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — calendarService e rotas calendário

> **Contexto:** Visão agregada mês/dia para calendário financeiro (RN-100).

## 📝 Descrição

Implementar agregação de transações, lembretes e recebimentos fixos por período.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/calendarService.js` | `obterVisaoMes`, `obterDetalheDia` |
| `routes/calendarRoutes.js` | `/calendario/mes`, `/calendario/dia`, rotas Google |
| `controllers/calendarController.js` | Handlers incl. Google OAuth |

**Visão mês:** resumo, variação vs mês anterior, marcadores `dias`, proximosVencimentos

**Detalhe dia:** transações mapeadas, lembretes, totais, recebimentosFixos

**Utils:** `monthUtils`, `fixedIncomeUtils`

## 📋 Resumo

### ✅ Concluído
- Contratos RN-100 especificados

### ⏳ Pendente
- Implementar calendarService e rotas

---
---
card_id: PULSO-TASK-068
title: "Backend — jobs alerta e recorrência"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-033
due_date: null
categories:
  - Backend
  - Cron
  - Notificações
---

# [TASK] Backend — jobs alerta e recorrência

> **Contexto:** Cron diário para notificações e instâncias mensais.

## 📝 Descrição

Implementar jobs e service de alerta integrados ao scheduler da API.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/reminderAlertService.js` | `verificarLembretesENotificar`, dedupe notificação |
| `jobs/reminderAlertJob.js` | Wrapper cron |
| `jobs/reminderRecurrenceJob.js` | `gerarInstanciasMensais`, `avancarRepeticaoPorDias` |

**Alerta:** tipo `LEMBRETE_VENCIMENTO`, link `/calendar`

**Recorrência:** teto `MAX_ITERACOES_AVANCO = 10000`; guard `repetirCadaDias > 0`

Registrar no cron router existente da API

## 📋 Resumo

### ✅ Concluído
- Regras RN-094–095 e RN-098 definidas

### ⏳ Pendente
- Implementar jobs e alert service

---
---
card_id: PULSO-TASK-069
title: "Frontend — CalendarPage e grade mensal"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-034
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — CalendarPage e grade mensal

> **Contexto:** Shell `/calendar` com visão mês, dia selecionado e próximos vencimentos.

## 📝 Descrição

Implementar página principal do calendário financeiro com fetch mês/dia e import Google ao trocar mês.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/CalendarPage.jsx` | Estado período, selectedDate, modais |
| `CalendarMonthNav.jsx` | Navegação mês anterior/próximo |
| `CalendarMonthGrid.jsx` | Grade com marcadores |
| `CalendarDayPanel.jsx` | Detalhe do dia selecionado |
| `CalendarInsightCard.jsx` | Resumo receitas/despesas/saldo |
| `UpcomingReminders.jsx` | Lista próximos vencimentos |
| `services/calendarService.js` | `obterVisaoMes`, `obterDetalheDia`, Google API |

**Rota:** `App.jsx` → `path="calendar"`

**Callback OAuth:** tratar query `google=connected` na URL

## 📋 Resumo

### ✅ Concluído
- Layout e fetch pattern definidos

### ⏳ Pendente
- Implementar CalendarPage e componentes de grade

---
---
card_id: PULSO-TASK-070
title: "Frontend — ReminderFormModal e Google Agenda"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-034
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Integração Externa
---

# [TASK] Frontend — ReminderFormModal e Google Agenda

> **Contexto:** CRUD de lembretes e banner/modal de integração Google.

## 📝 Descrição

Implementar modal de lembrete completo e UI de conexão/resync Google Calendar.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `ReminderFormModal.jsx` | Create/edit; categorias agrupadas; antecedência; hora; recorrência; sync toggle |
| `ReminderDayCard.jsx` | Card lembrete no painel do dia |
| `GoogleCalendarBanner.jsx` | Status conexão; connect/disconnect |
| `GoogleResyncModal.jsx` | Escopos sync pendentes |
| `services/reminderService.js` | CRUD lembretes HTTP |

**Sync toggle:** desabilitado se Google desconectado com mensagem orientativa

**Ações:** marcar pago, excluir (`ConfirmModal`)

## 📋 Resumo

### ✅ Concluído
- Campos e fluxos Google especificados

### ⏳ Pendente
- Implementar modals e banner Google

---
---
card_id: PULSO-TASK-071
title: "Frontend — calendar.css e reminderUtils"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-034
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — calendar.css e reminderUtils

> **Contexto:** Estilos responsivos e helpers de UI para lembretes.

## 📝 Descrição

Implementar folha de estilos do calendário e utilitários de formatação/status.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `styles/calendar.css` | Layout page, grade, painel dia, banner Google, mobile |
| `utils/reminderUtils.js` | `reminderHasPayment`, formatação status |
| `utils/reminderCategories.jsx` | Select agrupado 52 categorias |

Importar CSS na CalendarPage ou bundle global.

## 📋 Resumo

### ✅ Concluído
- Mapa de utils e estilos definido

### ⏳ Pendente
- Implementar calendar.css e utils

---
---
card_id: PULSO-TASK-072
title: "QA — testes unitários de lembretes"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-035
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de lembretes

> **Contexto:** Regressão para CRUD, sync, alertas, recorrência e calendário.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/reminderService.test.js` | CRUD, sync failure RN-097, marcar pago |
| `unit/services/reminderAlertService.test.js` | Alertas por antecedência |
| `unit/services/googleCalendarSyncService.test.js` | Sync, import RF-058b |
| `unit/services/googleCalendarService.test.js` | OAuth status |
| `unit/services/calendarService.test.js` | Visão mês/dia |
| `unit/jobs/reminderAlertJob.test.js` | Job alerta |
| `unit/jobs/reminderRecurrenceJob.test.js` | Recorrência mensal e por dias |
| `unit/utils/reminderMapper.test.js` | DTO |
| `unit/utils/reminderAntecedencia.test.js` | Mapas antecedência |
| `unit/utils/googleTokenCrypto.test.js` | Criptografia tokens |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/reminderService.test.js` | Chamadas HTTP |
| `unit/services/calendarService.test.js` | Visão mês/dia |
| `unit/utils/reminderUtils.test.js` | Helpers UI |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas

---
