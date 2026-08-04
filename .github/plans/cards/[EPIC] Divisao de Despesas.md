# [EPIC] Divisão de Despesas

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M15  
> **Refs:** RF-115–120 · [PO M15](../../Documentacao/03-Auditorias/Product Owner/15-Divisao-de-Despesas.md)  
> **Nota:** Divisão de viagem em grupo (`modoDivisao`) é parte do epic [Grupos](./[EPIC]%20Grupos.md). Este epic cobre o módulo **standalone** em `/expense-split`.

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Divisão, Lembretes, Frontend, Backend  
**Relator:**     —  
**Pai:**         [EPIC] Lembretes e Google Agenda (lembrete cobrança RF-120)  
**Data Limite:** —

---

## 📋 Descrição do Epic

Divisão de contas entre pessoas (fora de grupos): rateio **igual** ou **personalizado**, participantes com status PENDENTE/PAGO, quem pagou a conta, resumo "me devem" / "eu devo", lembrete de cobrança vinculado (RF-120), histórico quitado com cleanup 180 dias.

### 🎯 Objetivos

- ✅ CRUD divisões (`/expense-split`)
- ✅ Resumo saldo consolidado (meDevem, euDevo, saldo)
- ✅ Marcar participante pago/despago
- ✅ Auto-quitar quando todos pagos; reabrir se despagar
- ✅ Lembrete cobrança → `POST /divisoes/:id/lembrete` (M2M participantes)
- ✅ Job cleanup divisões quitadas >180 dias
- ✅ Histórico paginado

### 🎭 Tela `/expense-split`

| Área | Componente |
|------|------------|
| Resumo | `ExpenseSplitSummaryCards` — Me devem \| Eu devo \| Saldo |
| Tabs | Ativas \| Histórico |
| Lista | `ExpenseSplitCard` — participantes, status, ações |
| Modais | Criar/editar, detalhes, lembrete, excluir |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `Divisao`, `DivisaoParticipante`, M2M `_DivisaoParticipanteToLembrete` |
| Backend | ✅ | `expenseSplitService.js`, `expenseSplitController.js`, `expenseSplitRoutes.js`, `expenseSplitRepository.js`, `expenseSplitSchemas.js`, `expenseSplitUtils.js`, `expenseSplitMapper.js`, `expenseSplitCleanupJob.js` |
| Frontend | ✅ | `ExpenseSplitPage.jsx`, 7 componentes `features/expense-split/`, `expenseSplitService.js`, `expenseSplitUtils.js`, `styles/expense-split.css` |
| Testes API | ✅ | `expenseSplitService.test.js`, `expenseSplitUtils.test.js`, `expenseSplitMapper.test.js`, `expenseSplitCleanupJob.test.js` |
| Testes Web | ✅ | `expenseSplitUtils.test.js` |
| Cross | ✅ | `ExpenseSplitReminderModal` integra `calendarService` + `reminderService` |

**Migrations:** `20260714163000_add_expense_split_module` · `20260715130000_lembrete_divisao_m2m`  
**Registro rotas:** `routes/index.js` → `router.use('/divisoes', expenseSplitRoutes)`

---

## 🔧 Correções PO

Sem correções críticas M15 — módulo OK na auditoria.

---

## ⏳ Pendências

- [ ] Exportar relatório PDF/CSV saldos
- [ ] Link explícito grupo → expense-split (conceitos separados hoje)
- [ ] Desmarcar participante pago na UI (API existe, UX parcial)

---

## 🚀 Critérios Epic

→ Criar divisão igual auto-split entre N+1 participantes (inclui "Você")  
→ Criar divisão personalizada — soma partes = total  
→ Organizador sempre "Você"; ≥1 outro participante  
→ Quem pagou conta marcado PAGO inicialmente  
→ Todos pagos → divisão QUITADA  
→ Não editar participantes após pagamentos manuais  
→ Lembrete cobre participantes pendentes selecionados (1 lembrete → N participantes)  
→ Não excluir/editar divisão quitada  
→ Excluir divisão ativa remove lembretes vinculados  

---

# [STORY DATABASE] Divisão de Despesas — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Divisão de Despesas

---

## 📝 Descrição

**Como sistema**, quero persistir divisões de despesas com participantes, rateio e vínculo M2M a lembretes de cobrança.

---

## 🗄️ SQL executado

**Migration principal:** `Codigo/Pulso/api/prisma/migrations/20260714163000_add_expense_split_module/migration.sql`  
**Migration M2M lembretes:** `Codigo/Pulso/api/prisma/migrations/20260715130000_lembrete_divisao_m2m/migration.sql`

```sql
CREATE TYPE "TipoRateioDivisao" AS ENUM ('IGUAL', 'PERSONALIZADA');
CREATE TYPE "StatusDivisao" AS ENUM ('ATIVA', 'QUITADA');
CREATE TYPE "StatusParticipanteDivisao" AS ENUM ('PENDENTE', 'PAGO');

CREATE TABLE "divisoes" (
  "id" TEXT PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "titulo" VARCHAR(120) NOT NULL,
  "valor_total" DECIMAL(12,2) NOT NULL,
  "tipo" "TipoRateioDivisao" NOT NULL DEFAULT 'IGUAL',
  "status" "StatusDivisao" NOT NULL DEFAULT 'ATIVA',
  "data" DATE NOT NULL,
  "icone" VARCHAR(40), "cor" VARCHAR(20),
  "observacao" VARCHAR(250),
  "quitada_em" TIMESTAMP(3),
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "divisao_participantes" (
  "id" TEXT PRIMARY KEY,
  "divisao_id" TEXT NOT NULL,
  "nome" VARCHAR(120) NOT NULL,
  "valor" DECIMAL(12,2) NOT NULL,
  "eh_organizador" BOOLEAN NOT NULL DEFAULT false,
  "pagou_a_conta" BOOLEAN NOT NULL DEFAULT false,
  "status" "StatusParticipanteDivisao" NOT NULL DEFAULT 'PENDENTE',
  "data_pagamento" TIMESTAMP(3),
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL
);

-- M2M lembrete ↔ participantes (substituiu FK simples)
CREATE TABLE "_DivisaoParticipanteToLembrete" (
  "A" TEXT NOT NULL REFERENCES "divisao_participantes"("id") ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES "lembretes"("id") ON DELETE CASCADE
);
```

**Índices:** `[usuarioId]`, `[usuarioId, status]`, `[status, quitadaEm]`, `[divisaoId]`, `[divisaoId, status]`

---

## 📊 Modelo Prisma (resumo)

| Model | Campos-chave |
|-------|--------------|
| `Divisao` | `titulo`, `valorTotal`, `tipo`, `status`, `data`, `icone?`, `cor?`, `observacao?`, `quitadaEm?` |
| `DivisaoParticipante` | `nome`, `valor`, `ehOrganizador`, `pagouAConta`, `status`, `dataPagamento?` |

**Relação M2M:** `DivisaoParticipante` ↔ `Lembrete` (cobrança RF-120/RN-086)

---

## ✅ Critérios de Aceite (Database)

→ Enums rateio e status criados  
→ Participante organizador (`ehOrganizador: true`, nome "Você")  
→ Cascade delete divisão → participantes  
→ M2M lembretes permite 1 lembrete cobrindo N participantes  
→ Índice cleanup `[status, quitadaEm]` para job 180 dias  

---

# [STORY BACKEND] Divisão de Despesas — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Divisão de Despesas

---

## 📝 Descrição

**Como sistema backend**, quero API para divisão de despesas standalone com rateio, resumo de saldos, quitação automática e lembretes de cobrança.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Criar divisão igual
**Dado** usuário autenticado,  
**Quando** `POST /api/divisoes` com `{ titulo, valorTotal, tipo: 'IGUAL', participantes: [{ nome: 'João' }], pagoPor: 'VOCE', data }`,  
**Então** retorna `201` com divisão ATIVA, 2 participantes (João + Você), valores split igual, organizador PAGO se pagou conta.

### Cenário 2 — Criar divisão personalizada
**Quando** `tipo: 'PERSONALIZADA'` com valores por participante + `valorOrganizador`,  
**Então** soma das partes = valorTotal; senão → `400`.

### Cenário 3 — Resumo saldos
**Quando** `GET /api/divisoes/resumo`,  
**Então** retorna `{ meDevem, euDevo, saldo, possuiDivisoes }`.  
* Se organizador pagou → pendentes somam em meDevem  
* Se outro pagou → parte organizador pendente soma em euDevo

### Cenário 4 — Marcar participante pago
**Quando** `PATCH /api/divisoes/:id/participantes/:participanteId/pagar`,  
**Então** participante → PAGO; se todos pagos → divisão QUITADA; cancela lembretes se todos cobertos quitaram.

### Cenário 5 — Desmarcar pagamento
**Quando** `PATCH .../despagar`,  
**Então** participante → PENDENTE; divisão QUITADA reabre para ATIVA.  
* Quem pagou a conta → `400` (não pode despagar)

### Cenário 6 — Editar divisão
**Quando** `PATCH /api/divisoes/:id` alterando participantes,  
**Então** recalcula rateio.  
* Divisão quitada → `400`  
* Pagamento manual já registrado → `400`  
* Alterar valorTotal sem reenviar participantes → `400`

### Cenário 7 — Lembrete cobrança (RF-120)
**Quando** `POST /api/divisoes/:id/lembrete` com `{ participanteIds: [...] }`,  
**Então** cria lembrete via `reminderService`, vincula M2M, título default "Cobrar {nomes} — {titulo}", vencimento +2 dias.  
* Participante já pago → `400`  
* Lembrete duplicado ativo → `400`

### Cenário 8 — Job cleanup
**Dado** divisões QUITADAS há >180 dias,  
**Quando** `runExpenseSplitCleanupJob` executa (via `/api/cron/daily`),  
**Então** remove do banco; log `"🧹 Job limpeza divisões de despesas: X divisão(ões) removida(s)"`.

---

## 🛠️ Implementação (o que foi feito)

### expenseSplitController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/expenseSplitController.js`

* `listarAtivas()` → `GET /api/divisoes/ativas`
* `listarHistorico()` → `GET /api/divisoes/historico` — headers paginação
* `obterResumo()` → `GET /api/divisoes/resumo`
* `criar()` → `POST /api/divisoes`
* `editar()` → `PATCH /api/divisoes/:id`
* `marcarPago()` → `PATCH /api/divisoes/:id/participantes/:participanteId/pagar`
* `desmarcarPago()` → `PATCH .../despagar`
* `criarLembrete()` → `POST /api/divisoes/:id/lembrete`
* `excluir()` → `DELETE /api/divisoes/:id`

---

### expenseSplitService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/expenseSplitService.js`

→ `construirParticipantes({ tipo, valorTotal, participantes, pagoPor, valorOrganizador })` — RN-081/084  
→ `splitEqual` / `validarSomaPersonalizada` via `expenseSplitUtils`  
→ `sincronizarStatusDivisao(divisao)` — auto-quitar/reabrir  
→ `calcularResumo(usuarioId)` — meDevem/euDevo por regra organizador pagou ou não  
→ `criarDivisao`, `editarDivisao`, `marcarParticipantePago`, `desmarcarParticipantePago`  
→ `excluirDivisao` — remove lembretes órfãos antes de deletar  
→ `criarLembreteCobranca` — RF-120/RN-086, M2M participantes  
→ `cancelarLembretesQuitados` — marca lembrete pago quando todos cobertos quitaram  

---

### expenseSplitRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/expenseSplitRepository.js`

→ `listarAtivas`, `listarAtivasComParticipantes`, `listarHistorico`  
→ `contarTodasCriadas`, `buscarPorId`, `criar`, `atualizar`, `quitar`, `reabrir`, `excluir`  
→ `substituirParticipantes`, `atualizarParticipante`  
→ `excluirQuitadasAntigas(diasLimite)`  
→ `listarLembretesDaDivisao`, `listarLembretesAtivosDeParticipantes`, `vincularLembreteAParticipantes`

---

### expenseSplitSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/expenseSplitSchemas.js`

→ `criarDivisaoSchema`, `editarDivisaoSchema`, `listarHistoricoQuerySchema`  
→ `divisaoIdParamSchema`, `participanteIdParamSchema`, `criarLembreteCobrancaSchema`

---

### expenseSplitUtils.js / expenseSplitMapper.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/utils/expenseSplitUtils.js`, `expenseSplitMapper.js`

→ `splitEqual`, `validarSomaPersonalizada` · `mapDivisao` (inclui pagador, participantes visíveis)

---

### expenseSplitCleanupJob.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/jobs/expenseSplitCleanupJob.js`

→ `runExpenseSplitCleanupJob()` — retenção 180 dias (`DIAS_RETENCAO_QUITADAS`)

---

### expenseSplitRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/expenseSplitRoutes.js`  
**Base URL:** `/api/divisoes`

| Method | Path | Handler |
|--------|------|---------|
| GET | `/resumo` | `obterResumo` |
| GET | `/ativas` | `listarAtivas` |
| GET | `/historico` | `listarHistorico` |
| POST | `/` | `criar` |
| PATCH | `/:id` | `editar` |
| PATCH | `/:id/participantes/:participanteId/pagar` | `marcarPago` |
| PATCH | `/:id/participantes/:participanteId/despagar` | `desmarcarPago` |
| POST | `/:id/lembrete` | `criarLembrete` |
| DELETE | `/:id` | `excluir` |

---

## 🚫 Regras de Negócio (Backend)

* Mínimo 1 participante além do organizador "Você"
* Nomes únicos; "Você" reservado ao organizador
* Rateio IGUAL: split com arredondamento centavos (`splitEqual`)
* Rateio PERSONALIZADA: soma exata = valorTotal
* Quem pagou a conta nasce PAGO; não pode ser marcado pendente
* Pagamento manual bloqueia edição de participantes/valores
* Todos PAGO → divisão QUITADA; despagar reabre
* Divisão quitada: não editar, não excluir (cleanup automático)
* Excluir divisão ativa: remove lembretes vinculados
* 1 lembrete pode cobrir N participantes; cancela quando todos pagos

---

# [STORY FRONTEND] Divisão de Despesas — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Divisão de Despesas

---

## 📝 Descrição

**Como usuário**, quero dividir despesas com amigos na rota `/expense-split`, ver saldos consolidados e criar lembretes de cobrança.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Visão inicial
**Dado** usuário em `/expense-split`,  
**Quando** página carrega,  
**Então** exibe cards resumo (Me devem, Eu devo, Saldo) e tab Ativas com divisões.

### Cenário 2 — Criar divisão
**Quando** abre modal, preenche título, valor, participantes, quem pagou,  
**Então** divisão aparece na lista ativa; rateio calculado (igual ou personalizado).

### Cenário 3 — Marcar pago
**Quando** clica marcar pago em participante pendente,  
**Então** status atualiza; se todos pagos → divisão vai para histórico.

### Cenário 4 — Lembrete cobrança
**Quando** abre modal lembrete e seleciona participantes pendentes,  
**Então** cria lembrete no calendário; integração Google opcional via `calendarService`.

### Cenário 5 — Histórico
**Quando** tab Histórico selecionada,  
**Então** lista paginada de divisões quitadas via `listarHistorico`.

### Cenário 6 — Excluir divisão ativa
**Quando** confirma exclusão em divisão ATIVA,  
**Então** remove da lista; lembretes associados removidos no backend.

---

## 🛠️ Implementação (o que foi feito)

### expenseSplitService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/expenseSplitService.js`

→ `listarAtivas()` · `listarHistorico({ pagina, limite })` · `obterResumo()`  
→ `criarDivisao(payload)` · `atualizarDivisao(id, payload)`  
→ `marcarParticipantePago(id, participanteId)` · `desmarcarParticipantePago(id, participanteId)`  
→ `criarLembreteCobranca(id, payload)` · `excluirDivisao(id)`

---

### ExpenseSplitPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/ExpenseSplitPage.jsx`  
**Rota:** `/expense-split`

Orquestra: resumo, tabs Ativas/Histórico, CRUD modals, marcar pago, lembrete, paginação histórico.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/expense-split/`

| Componente | Responsabilidade |
|------------|------------------|
| `ExpenseSplitSummaryCards.jsx` | Cards Me devem / Eu devo / Saldo |
| `ExpenseSplitCard.jsx` | Card divisão com participantes e ações |
| `ExpenseSplitFormModal.jsx` | Criar/editar — rateio igual/personalizado, quem pagou |
| `ExpenseSplitDetailsModal.jsx` | Detalhes completos da divisão |
| `ExpenseSplitReminderModal.jsx` | Seleção participantes + campos lembrete + Google sync |
| `ExpenseSplitHistoryRow.jsx` | Linha histórico paginado |
| `DeleteExpenseSplitModal.jsx` | Confirmar exclusão |

---

### Utils e estilos (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/expenseSplitUtils.js` | `splitEqual`, `validarSomaPersonalizada`, `getParticipantesVisiveis`, `getPagador` |
| `web/src/styles/expense-split.css` | Estilos módulo |

---

### Rotas e navegação (EXISTENTE — IMPLEMENTADO)

**`web/src/config/appRoutes.js`:** `/expense-split` → `ExpenseSplitPage`  
**`web/src/config/sidebarNavigation.js`:** `{ id: 'divisao', label: 'Divisão de Despesas', path: '/expense-split', icon: 'Split' }`

---

### Endpoints consumidos

* `GET /api/divisoes/resumo` · `GET /api/divisoes/ativas` · `GET /api/divisoes/historico`
* `POST /api/divisoes` · `PATCH /api/divisoes/:id` · `DELETE /api/divisoes/:id`
* `PATCH /api/divisoes/:id/participantes/:pid/pagar` · `.../despagar`
* `POST /api/divisoes/:id/lembrete`

---

## 📚 Documentação · Histórico

- [PO M15](../../Documentacao/03-Auditorias/Product Owner/15-Divisao-de-Despesas.md)

| Data | Evento |
|------|--------|
| jul/2026 | Migration + backend + frontend `/expense-split` |
| jul/2026 | Migration M2M lembretes `20260715130000` |
| ago/2026 | Auditoria PO M15 — sem correções críticas |
