# [EPIC] Calendário Financeiro

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M16  
> **Refs:** RF-121–125 · [PO M16](../../Documentacao/03-Auditorias/Product Owner/16-Calendario-Financeiro.md)  
> **Nota:** Lembretes CRUD e Google Calendar são epic [Lembretes e Google Agenda](./[EPIC]%20Lembretes%20e%20Google%20Agenda.md) — este epic agrega **visão financeira mensal/diária** + UI calendário custom.

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Calendário, Transações, Lembretes  
**Relator:**     —  
**Pai:**         [EPIC] Lembretes e Google Agenda  
**Data Limite:** —

---

## 📋 Descrição do Epic

Visão unificada de compromissos financeiros: transações do mês, lembretes, recebimentos fixos (salário/VA/VR/VT da config usuário), marcadores por dia, painel detalhe do dia, KPIs mensais com variação MoM, import Google ao carregar mês.

### 🎯 Objetivos

- ✅ Visão mês (`GET /calendario/mes`) — summary, marcadores, upcoming reminders
- ✅ Detalhe dia (`GET /calendario/dia`) — transações + lembretes + receitas fixas + saldo
- ✅ Grid calendário custom (**não** usa lib FullCalendar)
- ✅ Marcadores coloridos: receita, despesa, lembrete, recebimento fixo, misto
- ✅ Painel lateral dia selecionado
- ✅ Insight card KPIs mês (variação vs mês anterior)
- ✅ Side-effect: import Google ao abrir mês se conectado

### 🎭 Tela `/calendar`

| Área | Componente |
|------|------------|
| Nav mês | `CalendarMonthNav` |
| Grid | `CalendarMonthGrid` — dots por tipo evento |
| KPIs | `CalendarInsightCard` |
| Próximos | `UpcomingReminders` |
| Dia | `CalendarDayPanel` — transações + lembretes + fixos |
| Google | `GoogleCalendarBanner`, `GoogleResyncModal` (epic Lembretes) |
| Lembretes | `ReminderFormModal`, `ReminderDayCard` |

**URL params:** `?mes=YYYY-MM`, `?data=YYYY-MM-DD`, `?google=connected`

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Backend core | ✅ | `calendarService.js`, `calendarController.js`, `calendarRoutes.js`, `fixedIncomeUtils.js` |
| Backend Google | ✅ | `googleCalendarService.js`, `googleCalendarSyncService.js` (compartilhado epic Lembretes) |
| Frontend | ✅ | `CalendarPage.jsx`, 9 componentes `features/calendar/`, `calendarService.js`, `styles/calendar.css` |
| Design System | ✅ | Reusa `design-system/.../calendarUtils.js` (`getCalendarDays`) — **não** FullCalendar |
| Testes API | ✅ | `api/tests/unit/services/calendarService.test.js` |
| Testes Web | ✅ | `web/tests/unit/services/calendarService.test.js` |

**Registro rotas:** `routes/index.js` → `router.use('/calendario', calendarRoutes)`

---

## 🔧 Correções PO

Sem correções críticas M16.

---

## ⏳ Pendências

- [ ] Drag-and-drop reagendar lembrete no grid
- [ ] Vista anual / heatmap gastos
- [ ] Export iCal
- [ ] Testes E2E CalendarPage

---

## 🚀 Critérios Epic

→ Grid exibe mês com marcadores corretos por tipo  
→ Click dia → painel com transações e lembretes  
→ KPIs: receitas, despesas, saldo, variação vs mês anterior  
→ Recebimentos fixos aparecem nos dias configurados (`ConfiguracaoUsuario`)  
→ Deep link notificação `LEMBRETE_VENCIMENTO` → `/calendar?data=`  
→ Import Google silencioso ao carregar mês (falha não bloqueia visão)  

---

# [STORY DATABASE] Calendário Financeiro — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Calendário Financeiro

---

## 📝 Descrição

**Como sistema**, quero agregar dados de transações, lembretes e configuração de recebimentos fixos sem tabela dedicada de calendário — visão computada em runtime.

---

## 🗄️ Fontes de dados (sem tabela `calendario`)

| Fonte | Model/Tabela | Uso no calendário |
|-------|--------------|-------------------|
| Transações | `Transacao` | Receitas/despesas por `data` — marcadores verde/vermelho |
| Lembretes | `Lembrete` | Vencimentos por `dataVencimento` — marcador azul |
| Config usuário | `ConfiguracaoUsuario` | Dias/valores salário, VA, VR, VT — marcador roxo |
| Google | `ConfiguracaoUsuario.googleCalendar*` | OAuth tokens, sync (migration `20260610150000_google_calendar_email`) |

**Utils agregação:** `fixedIncomeUtils.js` — `obterRecebimentosFixosConfig`, `recebimentosFixosNoDia`, `aplicarMarcadoresRecebimentoFixo`

**Nota:** Não há migration específica "calendário" — módulo consome models existentes.

---

## ✅ Critérios de Aceite (Database)

→ Queries groupBy transações por mês performáticas (índices `Transacao.usuarioId + data`)  
→ Lembretes filtrados por intervalo via `reminderRepository`  
→ Config recebimentos fixos nullable (dias 1–31, valores DECIMAL)  
→ Google calendar email/token em `ConfiguracaoUsuario`  

---

# [STORY BACKEND] Calendário Financeiro — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Calendário Financeiro

---

## 📝 Descrição

**Como sistema backend**, quero endpoints de agregação mensal/diária que consolidem transações, lembretes e recebimentos fixos, com KPIs e variação MoM.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Visão do mês
**Dado** usuário autenticado,  
**Quando** `GET /api/calendario/mes?mes=2026-07`,  
**Então** retorna `{ mes, resumo, dias, proximosVencimentos, recebimentosFixos }`.  
* `resumo`: receitasTotal, despesasTotal, saldo, totalTransacoes + variações MoM  
* `dias`: mapa `YYYY-MM-DD` → marcadores (temReceita, temDespesa, temLembrete, temRecebimentoFixo)  
* Se Google conectado: tenta `importarAlteracoesDoGoogle` (falha silenciosa)

### Cenário 2 — Detalhe do dia
**Quando** `GET /api/calendario/dia?data=2026-07-15`,  
**Então** retorna transações do dia (com categoria/tags), lembretes, recebimentosFixos, totais `{ receitas, despesas, saldo }`.

### Cenário 3 — Formato data inválido
**Quando** `GET /api/calendario/dia?data=15-07-2026`,  
**Então** retorna `400` "Formato de data inválido. Use YYYY-MM-DD".

### Cenário 4 — Variação MoM receitas
**Dado** mês anterior com receitas R$ 1000 e atual R$ 1200,  
**Quando** visão mês carregada,  
**Então** `variacaoReceitas.tipo = 'percentual'`, `valor = 20`.

### Cenário 5 — Variação sem base
**Dado** mês anterior receitas = 0 e atual > 0,  
**Então** `variacaoReceitas.tipo = 'valor_novo'`.

### Cenário 6 — Marcadores mistos
**Dado** dia com receita + despesa + lembrete,  
**Então** marcador dia tem `temReceita`, `temDespesa`, `temLembrete` true (multi-dot no frontend).

### Cenário 7 — Recebimentos fixos
**Dado** config salário dia 5,  
**Quando** visão mês inclui dia 5,  
**Então** `dias['YYYY-MM-05'].temRecebimentoFixo = true` + array `recebimentosFixos`.

### Cenário 8 — Próximos vencimentos
**Quando** visão mês,  
**Então** `proximosVencimentos` (max 10) inclui `diasAteVencimento` calculado.

---

## 🛠️ Implementação (o que foi feito)

### calendarController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/calendarController.js`

* `obterMes()` → `GET /api/calendario/mes` — side-effect Google import se conectado
* `obterDia()` → `GET /api/calendario/dia`
* `obterStatusGoogle()` → `GET /api/calendario/google/status`
* `obterUrlGoogle()` → `GET /api/calendario/google/url`
* `callbackGoogle()` → `GET /api/calendario/google/callback`
* `desconectarGoogle()` → `POST /api/calendario/google/desconectar`
* `obterPendentesSyncGoogle()` → `GET /api/calendario/google/sync/pendentes`
* `sincronizarPendentesGoogle()` → `POST /api/calendario/google/sync`

---

### calendarService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/calendarService.js`

→ `obterResumoMes(usuarioId, inicio, fim)` — groupBy transações por tipo  
→ `obterMarcadoresDias(usuarioId, inicio, fim)` — merge transações + lembretes  
→ `obterVisaoMes(usuarioId, query)` — resumo + resumoAnterior + dias + proximos + recebimentosFixos + variações MoM  
→ `obterDetalheDia(usuarioId, query)` — transações detalhadas + lembretes + fixos + totais  
→ `buildVariacao(atual, anterior, modo)` — percentual | contagem | igual | sem_base | valor_novo  

**Dependências:** `reminderRepository`, `fixedIncomeUtils`, `monthUtils`, `transactionMapper`, `reminderMapper`

---

### fixedIncomeUtils.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/utils/fixedIncomeUtils.js`

→ `obterRecebimentosFixosConfig(config)` — salário, VA, VR, VT  
→ `recebimentosFixosNoDia(config, ano, mes, dia)`  
→ `aplicarMarcadoresRecebimentoFixo(dias, config, ano, mes)`

---

### calendarRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/calendarRoutes.js`  
**Schemas:** `queryMesSchema`, `queryDataSchema`, `googleSyncSchema` (de `reminderSchemas.js`)

| Method | Path | Handler |
|--------|------|---------|
| GET | `/mes` | `obterMes` |
| GET | `/dia` | `obterDia` |
| GET | `/google/status` | `obterStatusGoogle` |
| GET | `/google/url` | `obterUrlGoogle` |
| GET | `/google/callback` | `callbackGoogle` |
| POST | `/google/desconectar` | `desconectarGoogle` |
| GET | `/google/sync/pendentes` | `obterPendentesSyncGoogle` |
| POST | `/google/sync` | `sincronizarPendentesGoogle` |

---

### googleCalendarService.js / googleCalendarSyncService.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/services/googleCalendarService.js`, `googleCalendarSyncService.js`

Compartilhados com epic Lembretes — OAuth, sync bidirecional, status conexão.

---

## 🚫 Regras de Negócio (Backend)

* `mes` query formato `YYYY-MM` (via `mesReferenciaFromQuery`)
* `data` query formato `YYYY-MM-DD` estrito
* Marcadores por dia: acumula receitas/despesas/lembretes separadamente
* Recebimentos fixos injetados nos dias configurados (mesmo sem transação)
* Variação MoM: percentual se base > 0; contagem para totalTransacoes
* Import Google no `obterMes`: best-effort, não propaga erro ao client
* Próximos vencimentos: ordenados por data, limite 10

---

# [STORY FRONTEND] Calendário Financeiro — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Calendário Financeiro

---

## 📝 Descrição

**Como usuário**, quero visualizar meu calendário financeiro em `/calendar` com grid mensal, KPIs e painel de detalhe do dia.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Carregar mês
**Dado** usuário em `/calendar`,  
**Quando** página carrega mês corrente,  
**Então** exibe grid, insight KPIs, upcoming reminders e banner Google (se aplicável).

### Cenário 2 — Selecionar dia
**Quando** clica dia no grid,  
**Então** `CalendarDayPanel` carrega transações, lembretes e recebimentos fixos via `obterDetalheDia`.

### Cenário 3 — Navegar mês
**Quando** usa `CalendarMonthNav` prev/next,  
**Então** recarrega `obterVisaoMes` com novo `mes` param; URL atualiza `?mes=`.

### Cenário 4 — Marcadores visuais
**Dado** dia com receita e despesa,  
**Então** grid exibe multi-dot (verde + vermelho) via `CalendarMonthGrid`.

### Cenário 5 — Deep link data
**Quando** acessa `/calendar?data=2026-07-15`,  
**Então** seleciona dia 15 automaticamente e abre painel.

### Cenário 6 — Google connected callback
**Quando** retorna OAuth com `?google=connected`,  
**Então** banner confirma conexão; modal resync oferecido se pendentes.

---

## 🛠️ Implementação (o que foi feito)

### calendarService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/calendarService.js`

→ `obterVisaoMes(mes, options)` → `GET /api/calendario/mes`  
→ `obterDetalheDia(data, options)` → `GET /api/calendario/dia`  
→ `obterStatusGoogle()` · `obterUrlGoogle()` · `desconectarGoogle()`  
→ `obterPendentesSyncGoogle()` · `sincronizarPendentesGoogle(escopo)`

---

### CalendarPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/CalendarPage.jsx`  
**Rota:** `/calendar`

Orquestra: load mês → grid + insights; select dia → detail panel; CRUD lembretes inline; Google banner/resync; URL sync `mes`/`data`/`google`.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/calendar/`

| Componente | Responsabilidade |
|------------|------------------|
| `CalendarMonthNav.jsx` | Navegação prev/next mês |
| `CalendarMonthGrid.jsx` | Grid 7 colunas + dots marcadores |
| `CalendarInsightCard.jsx` | KPIs receitas/despesas/saldo + variação MoM |
| `CalendarDayPanel.jsx` | Painel lateral dia — transações, lembretes, fixos |
| `UpcomingReminders.jsx` | Lista próximos vencimentos |
| `ReminderDayCard.jsx` | Card lembrete no painel dia |
| `ReminderFormModal.jsx` | Criar/editar lembrete |
| `GoogleCalendarBanner.jsx` | Status conexão Google + connect/disconnect |
| `GoogleResyncModal.jsx` | Sync pendentes (escopo futuros/todos) |

---

### Design System reutilizado (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/design-system/components/pickers/shared/calendarUtils.js` | `getCalendarDays` — gera células mês |
| `web/src/design-system/components/pickers/shared/CalendarGrid.jsx` | Grid base (picker) |
| `web/src/design-system/components/pickers/shared/CalendarHeader.jsx` | Header mês |

---

### Utils e estilos (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/styles/calendar.css` | Estilos módulo calendário |

**Marcadores (`CalendarMonthGrid`):** dot verde receita, vermelho despesa, azul lembrete, roxo fixo, multi-dot misto.

---

### Rotas e navegação (EXISTENTE — IMPLEMENTADO)

**`web/src/config/appRoutes.js`:** `/calendar` → `CalendarPage`  
**`web/src/config/sidebarNavigation.js`:** `{ id: 'calendario', label: 'Calendário Financeiro', path: '/calendar', icon: 'CalendarDays' }`

---

### Cross-module (EXISTENTE — IMPLEMENTADO)

* `ExpenseSplitReminderModal.jsx` — usa `calendarService` para sync Google no lembrete cobrança
* Epic Lembretes — CRUD lembretes compartilha `ReminderFormModal` nesta página

---

### Endpoints consumidos

* `GET /api/calendario/mes` · `GET /api/calendario/dia`
* `GET /api/calendario/google/status` · `/google/url` · `POST /google/desconectar`
* `GET /api/calendario/google/sync/pendentes` · `POST /google/sync`

---

## 📚 Documentação · Histórico

- [PO M16](../../Documentacao/03-Auditorias/Product Owner/16-Calendario-Financeiro.md)

| Data | Evento |
|------|--------|
| jul/2026 | `calendarService` + `CalendarPage` entregues |
| jul/2026 | Grid custom (sem FullCalendar) |
| ago/2026 | Auditoria PO M16 — sem correções críticas |
