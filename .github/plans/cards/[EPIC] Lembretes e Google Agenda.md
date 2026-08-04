# [EPIC] Lembretes e Google Agenda

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M07  
> **Correção PO:** falha sync Google na **criação** preserva lembrete (`sincronizado: false`) — RF-NOVO-G1  
> **Refs:** RF-054–058, RF-058b · [PO M07](../../Documentacao/03-Auditorias/Product Owner/07-Lembretes-e-Google-Agenda.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Lembretes, Calendário, Integrações Google  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Lembretes financeiros recorrentes ou avulsos com categorias (52), antecedência configurável, flag **pago**, sync bidirecional com **Google Calendar** (calendário dedicado "Pulso"), tokens OAuth criptografados (AES-256-GCM), import de alterações Google→Pulso, jobs de alerta e recorrência.

### 🎯 Objetivos do Epic

- ✅ CRUD lembretes (`/api/lembretes`)
- ✅ OAuth Google Calendar + calendário "Pulso" dedicado
- ✅ Sync create/update/delete/pagar ↔ evento Google
- ✅ Bulk sync pós-conexão (`escopo`: futuros, futuros_nao_pagos, todos)
- ✅ Import alterações do Google ao abrir visão mensal
- ✅ Notificações in-app `LEMBRETE_VENCIMENTO` (job diário 10h BRT)
- ✅ Recorrência mensal, por dia do mês, ou a cada N dias
- ✅ Vínculo M2M com participantes de divisão de despesas (RF-120)

### 🎭 Telas e Fluxos (integrado ao `/calendar`)

| Componente | Fluxo |
|------------|-------|
| `ReminderFormModal` | Criar/editar lembrete com toggle sync Google |
| `GoogleCalendarBanner` | Conectar/desconectar/resync |
| `GoogleResyncModal` | Sync em massa após OAuth (`?google=connected`) |
| `UpcomingReminders` | Próximos 10 vencimentos na sidebar |
| `ReminderDayCard` | Card no painel do dia selecionado |
| `CalendarMonthGrid` | Grade mensal com marcadores de vencimento |

---

## 🗄️ Modelo de Dados (Resumo)

### `Lembrete`
- Core: `titulo`, `valor?`, `dataVencimento`, `horaLembrete`, `antecedencia`, `categoria`, `pago`
- Google: `googleEventId?`, `sincronizado`
- Recorrência: `repetirMensal`, `diaRecorrencia?`, `repetirCadaDias?`, `lembreteTemplateId?` (self-FK)
- M2M: `divisaoParticipantes` ↔ `DivisaoParticipante`

### `ConfiguracaoUsuario` (Google)
- `googleCalendarAtivo`, `googleCalendarId?`, `googleCalendarEmail?`, `tokensGoogle?` (encrypted JSON)

**Enums:** `CategoriaLembrete` (52 valores) · `AntecedenciaLembrete` (NO_DIA, UM_DIA, TRES_DIAS, CINCO_DIAS, UMA_SEMANA)

---

## 🔗 Integrações

| Sistema | Integração |
|---------|------------|
| Google Calendar API | OAuth2, calendário "Pulso", eventos com popup conforme antecedência |
| Calendário financeiro | `calendarService.obterVisaoMes` / `obterDetalheDia` agrega transações + lembretes |
| Divisão de despesas | `POST /api/divisoes/:id/lembrete` — cobrança participantes pendentes |
| Notificações | Job `reminderAlertJob` → `Notificacao` tipo `LEMBRETE_VENCIMENTO` |

**Env:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_TOKENS_ENCRYPTION_KEY` (64 hex), `GOOGLE_CALENDAR_CALLBACK_URL`

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (`Lembrete`, enums), 7 migrations |
| Backend lembretes | ✅ | `reminderRoutes.js`, `reminderController.js`, `reminderService.js`, `reminderRepository.js`, `reminderSchemas.js`, `reminderMapper.js`, `reminderAntecedencia.js` |
| Backend Google | ✅ | `calendarRoutes.js`, `calendarController.js`, `googleCalendarService.js`, `googleCalendarSyncService.js`, `googleTokenCrypto.js`, `googleOAuth.js` |
| Backend calendário | ✅ | `calendarService.js` — visão mês/dia |
| Jobs | ✅ | `reminderAlertJob.js` (10h BRT), `reminderRecurrenceJob.js` (00:05) |
| Frontend | ✅ | `CalendarPage.jsx`, 9 componentes `features/calendar/`, `reminderService.js`, `calendarService.js` |
| Testes API | ✅ | `reminderService.test.js`, `googleCalendarSyncService.test.js`, `googleTokenCrypto.test.js`, jobs, mapper |
| Testes Web | ✅ | `reminderService.test.js`, `calendarService.test.js`, `reminderUtils.test.js` |

**Registro rotas:** `routes/index.js` → `/lembretes`, `/calendario` (Google em `/calendario/google/*`)

---

## 🔧 Correções PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RF-NOVO-G1 | Create lembrete: falha Google **não** faz rollback — persiste com `sincronizado: false` | `reminderService.aplicarSyncGoogle` |

---

## ⏳ Pendências

- [ ] Tela dedicada config Google no Perfil (M10)
- [ ] Validar `GOOGLE_TOKENS_ENCRYPTION_KEY` em produção
- [ ] Drag-and-drop reagendar lembrete (futuro)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Criar lembrete com categoria, valor, vencimento, antecedência  
→ Conectar Google → cria calendário "Pulso"  
→ Lembrete sync → evento Google com popup conforme antecedência  
→ Marcar pago → remove evento Google + flag local  
→ Job alerta → notificação `LEMBRETE_VENCIMENTO`  
→ Recorrência gera próximo lembrete automaticamente  
→ Import Google atualiza lembrete existente por `googleEventId`

---

# [STORY DATABASE] Lembretes — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Lembretes e Google Agenda

---

## 📝 Descrição

**Como sistema**, quero persistir lembretes financeiros com recorrência, campos Google Calendar e vínculo M2M com divisão de despesas.

---

## 🗄️ Migrations Prisma

| Migration | Conteúdo |
|-----------|----------|
| `20260422195021_init` | Tabela `reminders` inicial + `google_calendar_on` em settings |
| `20260609120000_lembrete_recorrencia` | `repetir_mensal`, `dia_recorrencia`, self-FK template |
| `20260610150000_google_calendar_email` | `google_calendar_email` em configurações |
| `20260707165414_add_hora_lembrete` | `hora_lembrete` (default "10:00") |
| `20260714163000_add_expense_split_module` | FK inicial divisão em lembretes |
| `20260715130000_lembrete_divisao_m2m` | Tabela `_DivisaoParticipanteToLembrete`, `repetir_cada_dias` |
| `20260715160000_lembrete_repetir_cada_dias_check` | CHECK `repetir_cada_dias > 0` |

**Script manual:** `api/scripts/migrate-reminder-categoria.sql` — migra coluna legada `tipo` → `categoria`

---

## 📊 Modelo Prisma (resumo)

### `Lembrete`
`id`, `usuarioId`, `titulo`, `valor?`, `dataVencimento`, `horaLembrete`, `antecedencia`, `categoria`, `pago`, `googleEventId?`, `sincronizado`, `repetirMensal`, `diaRecorrencia?`, `repetirCadaDias?`, `lembreteTemplateId?`, timestamps

**Índices:** `(usuarioId, dataVencimento)`, `(sincronizado)`

### `enum CategoriaLembrete` (52 valores)
ALUGUEL, CONDOMINIO, IPTU, SEGURO_RESIDENCIAL, LUZ, AGUA, GAS, INTERNET, TELEFONE, TV_ASSINATURA, FATURA_CARTAO, EMPRESTIMO, FINANCIAMENTO, INVESTIMENTO, IMPOSTO, DECLARACAO_IR, IPVA, SEGURO_VEICULO, LICENCIAMENTO, REVISAO_VEICULO, MULTA, PLANO_SAUDE, CONSULTA, EXAME, MEDICAMENTO, ACADEMIA, MENSALIDADE_ESCOLA, MENSALIDADE_FACULDADE, CURSO, MATERIAL_ESCOLAR, STREAMING, SOFTWARE, DOMINIO, HOSPEDAGEM, NUVEM, VACINA_PET, CONSULTA_PET, RACAO_PET, NOTA_FISCAL, FOLHA_PAGAMENTO, CONTRATO, RENOVACAO_CONTRATO, CERTIDAO, ALVARA, ANIVERSARIO, REUNIAO, COMPROMISSO, VIAGEM, RENOVACAO_DOCUMENTO, RECORRENTE, PARCELAMENTO, OUTRO

### `enum AntecedenciaLembrete` (5 valores)
NO_DIA, UM_DIA, TRES_DIAS, CINCO_DIAS, UMA_SEMANA

### `ConfiguracaoUsuario` (campos Google)
`googleCalendarAtivo`, `googleCalendarId?`, `googleCalendarEmail?`, `tokensGoogle?` (AES-256-GCM envelope)

---

## ✅ Critérios de Aceite (Database)

→ Enum `CategoriaLembrete` com 52 categorias  
→ Enum `AntecedenciaLembrete` com 5 opções  
→ Self-relation `lembreteTemplateId` para instâncias recorrentes  
→ M2M `_DivisaoParticipanteToLembrete` para cobranças divisão  
→ Índice `(sincronizado)` para bulk sync pendentes  

---

# [STORY BACKEND] Lembretes — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Lembretes e Google Agenda

---

## 📝 Descrição

**Como sistema backend**, quero fornecer CRUD de lembretes, integração OAuth Google Calendar com sync bidirecional, jobs de alerta/recorrência e endpoint de cobrança via divisão de despesas.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Criar lembrete
**Dado** usuário autenticado,  
**Quando** `POST /api/lembretes` com `{ titulo, dataVencimento, categoria }`,  
**Então** retorna `201` com lembrete mapeado (`mapLembrete`).  
* Título vazio → `400` · Categoria inválida → `400`

### Cenário 2 — Criar com Google conectado (RF-NOVO-G1)
**Dado** Google Calendar ativo,  
**Quando** `POST /api/lembretes` com sync habilitado e API Google falha,  
**Então** retorna `201` com lembrete persistido, `sincronizado: false` (sem rollback).

### Cenário 3 — Marcar pago
**Dado** lembrete com `googleEventId`,  
**Quando** `POST /api/lembretes/:id/pagar`,  
**Então** retorna `200` com `pago: true`; evento Google removido via `removerEventoLembrete`.

### Cenário 4 — OAuth Google
**Quando** `GET /api/calendario/google/url`,  
**Então** retorna `200` com URL OAuth.  
**Quando** callback `GET /api/calendario/google/callback`,  
**Então** redirect `/calendar?google=connected`; cria calendário "Pulso".

### Cenário 5 — Bulk sync
**Quando** `POST /api/calendario/google/sync` com `{ escopo: 'futuros_nao_pagos' }`,  
**Então** retorna `200` com contadores `{ sincronizados, falhas, total }`.

### Cenário 6 — Job alerta
**Dado** lembrete vencendo conforme antecedência,  
**Quando** `runReminderAlertJob` executa (10h BRT),  
**Então** cria `Notificacao` tipo `LEMBRETE_VENCIMENTO` (sem duplicata no dia).

### Cenário 7 — Job recorrência
**Dado** lembrete template com `repetirMensal: true`,  
**Quando** `runReminderRecurrenceJob` executa (00:05),  
**Então** clona próxima instância com data avançada.

### Cenário 8 — Cobrança divisão
**Quando** `POST /api/divisoes/:id/lembrete` com participantes pendentes,  
**Então** retorna `201` com lembrete vinculado M2M aos participantes (`expenseSplitService.criarLembreteCobranca`).

---

## 🛠️ Implementação (o que foi feito)

### reminderController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/reminderController.js`

* `listar()` → `GET /api/lembretes` — query `?mes=YYYY-MM`
* `criar()` → `POST /api/lembretes` — `201`
* `atualizar()` → `PATCH /api/lembretes/:id`
* `marcarPago()` → `POST /api/lembretes/:id/pagar`
* `remover()` → `DELETE /api/lembretes/:id` — `204`

---

### reminderService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/reminderService.js`

→ `listarLembretes(usuarioId, { mes })` — filtra mês, `mapLembreteComContagem`  
→ `criarLembrete(usuarioId, dados)` — normaliza recorrência, `aplicarSyncGoogle` (RF-NOVO-G1)  
→ `atualizarLembrete(usuarioId, id, dados)` — re-sync se campos afetam Google  
→ `removerLembrete(usuarioId, id)` — remove evento Google + delete  
→ `marcarComoPago(usuarioId, id)` — `pago: true` + remove evento  
→ `listarProximosVencimentos(usuarioId, limite)` — próximos N dias  

**Helpers exportados:** `startOfDay`, `endOfDay`, `diasAteVencimento`

**Internos:** `camposAfetamSync`, `normalizarRecorrencia`, `aplicarSyncGoogle`

---

### googleCalendarService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/googleCalendarService.js`

→ `obterStatus(usuarioId)` — conexão + email  
→ `obterUrlConexao(usuarioId)` — URL OAuth  
→ `processarCallback(code, usuarioId)` — troca tokens, encrypt, salva config  
→ `desconectar(usuarioId)` — revoke + limpa tokens  
→ `buildRedirectUri()` — callback URL

---

### googleCalendarSyncService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/googleCalendarSyncService.js`

→ `estaConectado(usuarioId)`  
→ `garantirCalendarioPulso(usuarioId)` — cria calendário "Pulso" se ausente  
→ `sincronizarLembrete(lembrete)` — create/update evento Google  
→ `contarPendentesSync(usuarioId)` · `sincronizarPendentes(usuarioId, escopo)`  
→ `importarAlteracoesDoGoogle(usuarioId)` — Google → Pulso por `googleEventId`  
→ `removerEventoLembrete(lembrete)` · `removerCalendarioPulso(usuarioId)`

---

### reminderAlertService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/reminderAlertService.js`

→ `verificarLembretesENotificar()` — busca vencimentos por antecedência, cria notificações  
→ `obterDataAlerta(lembrete)` — calcula data do alerta

---

### calendarController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/calendarController.js`

* `obterMes()` → `GET /api/calendario/mes?mes=YYYY-MM`
* `obterDia()` → `GET /api/calendario/dia?data=YYYY-MM-DD`
* `obterStatusGoogle()` → `GET /api/calendario/google/status`
* `obterUrlGoogle()` → `GET /api/calendario/google/url`
* `callbackGoogle()` → `GET /api/calendario/google/callback`
* `desconectarGoogle()` → `POST /api/calendario/google/desconectar`
* `obterPendentesSyncGoogle()` → `GET /api/calendario/google/sync/pendentes`
* `sincronizarPendentesGoogle()` → `POST /api/calendario/google/sync`

---

### calendarService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/calendarService.js`

→ `obterVisaoMes(usuarioId, mes)` — agrega transações + lembretes + import Google  
→ `obterDetalheDia(usuarioId, data)` — detalhe dia com lembretes e transações

---

### reminderRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/reminderRepository.js`

→ `criar` · `atualizar` · `deletar` · `buscarPorId` · `listarPorUsuario` · `listarProximos`

---

### Utils (EXISTENTE — IMPLEMENTADO)

| Arquivo | Exports |
|---------|---------|
| `utils/googleTokenCrypto.js` | `encryptTokens`, `decryptTokens` (AES-256-GCM) |
| `utils/googleOAuth.js` | `createOAuthClient` |
| `utils/reminderMapper.js` | `mapLembrete` — DTO com labels antecedência |
| `utils/reminderAntecedencia.js` | `ANTECEDENCIA_LABELS`, `ANTECEDENCIA_DIAS`, `ANTECEDENCIA_MINUTOS`, `HORA_PADRAO_LEMBRETE` |

---

### Schemas e constants (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/reminderSchemas.js` — Zod create/update/query  
**Arquivo:** `Codigo/Pulso/api/src/constants/reminderCategories.js` — lista categorias

---

### Jobs (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função | Schedule |
|---------|--------|----------|
| `jobs/reminderAlertJob.js` | `runReminderAlertJob` | Diário 10h BRT (via `cronController`) |
| `jobs/reminderRecurrenceJob.js` | `runReminderRecurrenceJob`, `gerarInstanciasMensais`, `avancarRepeticaoPorDias` | Diário 00:05 |

---

### Divisão → lembrete (EXISTENTE — IMPLEMENTADO)

**Rota:** `POST /api/divisoes/:id/lembrete` (`expenseSplitRoutes.js`)  
**Controller:** `expenseSplitController.criarLembrete`  
**Service:** `expenseSplitService.criarLembreteCobranca`

---

## 🧪 Arquivos de teste (Backend)

| Arquivo | Cobertura |
|---------|-----------|
| `api/tests/unit/services/reminderService.test.js` | CRUD, sync, recorrência |
| `api/tests/unit/services/reminderAlertService.test.js` | Alertas antecedência |
| `api/tests/unit/services/googleCalendarService.test.js` | OAuth flow |
| `api/tests/unit/services/googleCalendarSyncService.test.js` | Sync create/update/delete |
| `api/tests/unit/services/calendarService.test.js` | Visão mês/dia |
| `api/tests/unit/services/expenseSplitService.test.js` | Cobrança lembrete divisão |
| `api/tests/unit/jobs/reminderAlertJob.test.js` | Job alerta |
| `api/tests/unit/jobs/reminderRecurrenceJob.test.js` | Job recorrência |
| `api/tests/unit/utils/reminderMapper.test.js` | Mapper DTO |
| `api/tests/unit/utils/reminderAntecedencia.test.js` | Labels/dias |
| `api/tests/unit/utils/googleTokenCrypto.test.js` | Encrypt/decrypt |
| `api/tests/unit/utils/googleOAuth.test.js` | OAuth client |

---

## 🚫 Regras de Negócio (Backend)

* Lembrete pertence exclusivamente ao usuário autenticado
* Sync Google opcional — falha na criação **não** rollback (RF-NOVO-G1)
* Marcar pago remove evento Google e impede re-sync
* Recorrência: mensal (dia fixo), ou a cada N dias (> 0 CHECK)
* Antecedência mapeia para popup Google Calendar (minutos antes)
* Tokens OAuth criptografados AES-256-GCM em `tokensGoogle`
* Bulk sync escopos: `futuros`, `futuros_nao_pagos`, `todos`
* Import Google match por `googleEventId`

---

# [STORY FRONTEND] Lembretes — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Lembretes e Google Agenda

---

## 📝 Descrição

**Como usuário**, quero gerenciar lembretes financeiros integrados ao Calendário Financeiro (`/calendar`), com conexão Google Calendar e lista de próximos vencimentos.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Visão mensal
**Dado** usuário em `/calendar`,  
**Quando** página carrega,  
**Então** exibe `CalendarMonthGrid` com marcadores, `CalendarInsightCard` (resumo financeiro), sidebar `UpcomingReminders`.

### Cenário 2 — Criar lembrete
**Quando** abre `ReminderFormModal` e preenche título, valor, categoria, vencimento, antecedência,  
**Então** lembrete aparece no dia selecionado; toggle sync Google visível se conectado.

### Cenário 3 — Conectar Google
**Quando** clica "Conectar" em `GoogleCalendarBanner`,  
**Então** redirect OAuth; retorno `?google=connected` abre `GoogleResyncModal`.

### Cenário 4 — Resync pendentes
**Quando** confirma sync em `GoogleResyncModal` (escopo futuros/todos),  
**Então** chama `POST /api/calendario/google/sync` e exibe contadores.

### Cenário 5 — Marcar pago inline
**Quando** clica "Pago" em `ReminderDayCard`,  
**Então** chama `POST /api/lembretes/:id/pagar`; card atualiza visual.

### Cenário 6 — Painel do dia
**Quando** seleciona dia no grid,  
**Então** `CalendarDayPanel` exibe transações + lembretes do dia via `GET /api/calendario/dia`.

---

## 🛠️ Implementação (o que foi feito)

### reminderService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/reminderService.js`

→ `listarLembretes({ mes })` → `GET /api/lembretes`  
→ `criarLembrete(payload)` → `POST /api/lembretes`  
→ `atualizarLembrete(id, payload)` → `PATCH /api/lembretes/:id`  
→ `excluirLembrete(id)` → `DELETE /api/lembretes/:id`  
→ `marcarComoPago(id)` → `POST /api/lembretes/:id/pagar`

---

### calendarService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/calendarService.js`

→ `obterVisaoMes({ mes })` → `GET /api/calendario/mes`  
→ `obterDetalheDia({ data })` → `GET /api/calendario/dia`  
→ `obterStatusGoogle()` → `GET /api/calendario/google/status`  
→ `obterUrlGoogle()` → `GET /api/calendario/google/url`  
→ `desconectarGoogle()` → `POST /api/calendario/google/desconectar`  
→ `obterPendentesSyncGoogle()` → `GET /api/calendario/google/sync/pendentes`  
→ `sincronizarPendentesGoogle({ escopo })` → `POST /api/calendario/google/sync`

---

### CalendarPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/CalendarPage.jsx`  
**Rota:** `/calendar` (ProtectedRoute + MainLayout)

Orquestra: `carregarMes`, `carregarDia`, handlers CRUD lembrete, OAuth callback `?google=connected`, Google banner/resync.

**Handlers:** `handleSalvarLembrete`, `handleConfirmExcluirLembrete`, `handleMarcarPago`, `handleGoogleStatusChange`, `confirmarConexaoGoogle`

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/calendar/`

| Componente | Responsabilidade |
|------------|------------------|
| `CalendarInsightCard.jsx` | Resumo mensal: receitas, despesas, saldo, variação |
| `CalendarMonthNav.jsx` | Navegação prev/next + seletor mês |
| `CalendarMonthGrid.jsx` | Grade mensal com marcadores e seleção |
| `CalendarDayPanel.jsx` | Painel dia: transações + lembretes |
| `ReminderDayCard.jsx` | Card lembrete com edit/delete/marcar pago |
| `ReminderFormModal.jsx` | Modal criar/editar (categoria, recorrência, sync Google) |
| `UpcomingReminders.jsx` | Sidebar próximos 10 vencimentos + countdown |
| `GoogleCalendarBanner.jsx` | Banner conectar/desconectar Google |
| `GoogleResyncModal.jsx` | Modal bulk sync pós-OAuth |

**Cross-module:** `ExpenseSplitReminderModal.jsx` — cobrança divisão (`features/expense-split/`)

---

### Utils (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/reminderUtils.js` | `reminderHasPayment`, `deleteReminderMessage`, formatação |
| `web/src/utils/reminderCategories.jsx` | Labels/ícones 52 categorias |

---

### Rotas App.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/App.jsx`

```jsx
<Route path="calendar" element={<CalendarPage />} />
```

Nav: `web/src/config/appRoutes.js` → `'/calendar': 'Calendário Financeiro'`

---

## 🧪 Arquivos de teste (Frontend)

| Arquivo | Cobertura |
|---------|-----------|
| `web/tests/unit/services/reminderService.test.js` | API wrapper lembretes |
| `web/tests/unit/services/calendarService.test.js` | API wrapper calendário/Google |
| `web/tests/unit/utils/reminderUtils.test.js` | Helpers UI |

---

## 📚 Documentação

- [PO M07](../../Documentacao/03-Auditorias/Product Owner/07-Lembretes-e-Google-Agenda.md)
- [Database tokens](../../Documentacao/02-Engenharia/API/Database.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| abr/2026 | Init lembretes + flag Google |
| jun/2026 | Recorrência + email Google |
| jul/2026 | Frontend `/calendar` + hora lembrete |
| ago/2026 | Fix RF-NOVO-G1 (create sem rollback) + M2M divisão |
