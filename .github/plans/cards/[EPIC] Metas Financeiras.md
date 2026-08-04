# [EPIC] Metas Financeiras

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M04  
> **Correções PO:** exclusão de aporte em meta concluída (reabertura), `GoalAportesSection` no modal de edição  
> **Refs:** RF-026–032, RF-142 · [PO M04](../../Documentacao/03-Auditorias/Product Owner/04-Metas-Financeiras.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Metas, Frontend, Backend, Banco de Dados  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Sistema completo de **metas financeiras pessoais**: criar objetivos com valor-alvo e prazo, registrar aportes manuais, acompanhar progresso (barra + percentual), receber sugestão de aporte mensal, pausar/retomar/concluir metas, e vincular opcionalmente a viagens ou itens de planejamento de compra.

### 🎯 Objetivos do Epic

- ✅ CRUD de metas com tipos curto/longo prazo (inferência automática ≤6 meses)
- ✅ Aportes manuais com validação de valor restante e data
- ✅ Conclusão automática ao atingir 100% + notificação `META_ATINGIDA`
- ✅ Dashboard lateral: resumo, donut por categoria, atividade recente
- ✅ Sugestão de reserva de emergência (média 3 meses de despesas × N meses)
- ✅ Integração com viagens (`Viagem.metaId` @unique) e planejamento de compra
- ✅ Badge gamificação na primeira meta criada

### 🎭 Telas e Fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/goals` | Metas Financeiras | Tabs (Todas/Ativas/Pausadas/Concluídas), cards com progresso, sidebar resumo |
| Modal | Criar/Editar meta | Nome, valor-alvo, prazo, prioridade, descrição; sugestão reserva emergência |
| Modal | Registrar aporte | Valor, data, preview do progresso pós-aporte |
| Modal | Editar meta | Histórico de aportes (`GoalAportesSection`) + excluir aporte |

---

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Viagens | `Viagem.metaId` — vínculo 1:1 opcional |
| Planejamento de Compra | `ItemPlanejamentoCompra.metaId`, criar meta inline no link |
| Notificações | `META_ATINGIDA` ao auto-concluir |
| Gamificação | Badge na primeira meta (`gamificationService.processarAposCriarMeta`) |
| Transações | Histórico de despesas usado em `sugerirReservaEmergencia` |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (`Meta`, `AporteMeta`), migration `20260615120000_metas` |
| Backend | ✅ | `metaRoutes.js`, `metaController.js`, `metaService.js`, `metaRepository.js`, `metaSchemas.js`, `metaMapper.js`, `metaBalanceUtils.js` |
| Frontend | ✅ | `GoalsPage.jsx`, 11 componentes em `components/features/goals/`, `metaService.js`, utils, `styles/goals.css` |
| Testes API | ✅ | `metaService.test.js`, `metaBalanceUtils.test.js` |
| Testes Web | ✅ | `goalsPage.test.jsx`, `goalCard.test.jsx`, `metaService.test.js`, `goalIconRules.test.js` |
| Cross-module | ✅ | `LinkGoalModal`, `TripDetailGoalCard`, `PurchaseItemFormModal` |

**Registro rotas:** `Codigo/Pulso/api/src/routes/index.js` → `router.use('/metas', metaRoutes)`

---

## 🔧 Correções pós-auditoria PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RF-NOVO-D1 | Removido guard que bloqueava `excluirAporte` em meta `CONCLUIDA` — reabertura funciona | `metaService.js` |
| RF-NOVO-D2 | Histórico de aportes no modal de edição | `GoalAportesSection.jsx` |
| RN-068 | Alerta meta vencida (`vencida: true` no mapper + `goalStatusUtils.js`) | `metaMapper.js`, `goalStatusUtils.js` |

---

## ⏳ Pendências

- [ ] Meta vinculada a planejamento de compra — parcial (ver epic Planejamento de Compra)
- [ ] Store Redux dedicado (comentado em `store/index.js` — state page-local hoje)
- [ ] React Query hooks (padrão do projeto usa service + useState)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Usuário cria meta com valor-alvo e prazo futuro  
→ Sistema infere curto/longo prazo (corte 6 meses)  
→ Usuário registra aportes; valor não pode exceder restante  
→ Ao atingir 100%, meta vira `CONCLUIDA` e dispara notificação  
→ Usuário pausa/retoma meta ativa  
→ Usuário exclui aporte de meta concluída e meta reabre se saldo < alvo  
→ Sidebar exibe resumo, donut e atividade recente  
→ Sugestão de reserva de emergência baseada em histórico de despesas  

---

# [STORY DATABASE] Metas Financeiras — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Metas Financeiras

---

## 📝 Descrição

**Como sistema**, quero persistir metas e aportes com enums de status/tipo/prioridade, para suportar progresso, conclusão automática e vínculos com viagens/compras.

---

## 🗄️ SQL executado

**Migration:** `Codigo/Pulso/api/prisma/migrations/20260615120000_metas/migration.sql`

```sql
-- Enums (Prisma): StatusMeta, TipoMeta, Prioridade (compartilhado)

CREATE TABLE "metas" (
  "id" TEXT PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "nome" VARCHAR(100) NOT NULL,
  "valor_alvo" DECIMAL(12,2) NOT NULL,
  "valor_atual" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "prazo" TIMESTAMP(3) NOT NULL,
  "tipo" "TipoMeta" NOT NULL,
  "status" "StatusMeta" NOT NULL DEFAULT 'ATIVA',
  "prioridade" "Prioridade",
  "descricao" VARCHAR(500),
  "concluida_em" TIMESTAMP(3),
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "metas_usuario_id_fkey" FOREIGN KEY ("usuario_id")
    REFERENCES "usuarios"("id") ON DELETE CASCADE
);

CREATE TABLE "aportes_meta" (
  "id" TEXT PRIMARY KEY,
  "meta_id" TEXT NOT NULL,
  "valor" DECIMAL(12,2) NOT NULL,
  "data" TIMESTAMP(3) NOT NULL,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "aportes_meta_meta_id_fkey" FOREIGN KEY ("meta_id")
    REFERENCES "metas"("id") ON DELETE CASCADE
);

CREATE INDEX "metas_usuario_id_status_idx" ON "metas"("usuario_id", "status");
CREATE INDEX "metas_usuario_id_prazo_idx" ON "metas"("usuario_id", "prazo");
CREATE INDEX "aportes_meta_meta_id_data_idx" ON "aportes_meta"("meta_id", "data" DESC);
```

---

## 📊 Modelo Prisma (resumo)

| Model | Campos-chave |
|-------|--------------|
| `Meta` | `nome`, `valorAlvo`, `valorAtual`, `prazo`, `tipo`, `status`, `prioridade?`, `descricao?`, `concluidaEm?` |
| `AporteMeta` | `metaId`, `valor`, `data` |

**Enums:** `StatusMeta` (ATIVA, PAUSADA, CONCLUIDA, CANCELADA) · `TipoMeta` (CURTO_PRAZO, LONGO_PRAZO) · `Prioridade` (ALTA, MEDIA, BAIXA)

**Relações:** `Meta` 1:N `AporteMeta` · `Meta` 1:N `Viagem` (via `Viagem.metaId` @unique) · `Meta` 1:N `ItemPlanejamentoCompra`

**Nota:** Metas de grupo usam modelos separados `MetaGrupo` / `AporteMetaGrupo` (ver epic Grupos).

---

## ✅ Critérios de Aceite (Database)

→ Enum `StatusMeta`, `TipoMeta` criados  
→ Tabela `metas` com índices por usuário+status e usuário+prazo  
→ Tabela `aportes_meta` com cascade delete  
→ FK `Viagem.metaId` @unique (migration `20260804130000_viagem_meta_id_unique`)  
→ FK `ItemPlanejamentoCompra.metaId` opcional  

---

# [STORY BACKEND] Metas Financeiras — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Metas Financeiras

---

## 📝 Descrição

**Como sistema backend**, quero fornecer API REST completa para metas financeiras pessoais, incluindo CRUD, aportes, resumo dashboard e sugestão de reserva de emergência.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Criar meta
**Dado** usuário autenticado,  
**Quando** `POST /api/metas` com `{ nome, valorAlvo, prazo }`,  
**Então** retorna `201` com meta `ATIVA`, `tipo` inferido (≤6 meses → CURTO_PRAZO), `valorAtual: 0`, badge gamificação na 1ª meta.  
* Prazo no passado ou hoje → `400` "Prazo da meta deve ser uma data futura"

### Cenário 2 — Registrar aporte
**Dado** meta `ATIVA` com `valorRestante > 0`,  
**Quando** `POST /api/metas/:id/aportes` com `{ valor, data }`,  
**Então** incrementa `valorAtual`; se `valorRestante <= 0` → `CONCLUIDA` + notificação `META_ATINGIDA`.  
* Meta `PAUSADA`/`CONCLUIDA` → `400`  
* Valor > restante → `400`  
* Data futura → `400`

### Cenário 3 — Excluir aporte (correção PO)
**Dado** meta `CONCLUIDA` por aporte recente,  
**Quando** `DELETE /api/metas/:id/aportes/:aporteId`,  
**Então** decrementa `valorAtual`; se abaixo do alvo → reabre para `ATIVA`, limpa `concluidaEm`.

### Cenário 4 — Editar meta
**Dado** meta `ATIVA`,  
**Quando** `PATCH /api/metas/:id` com `{ status: 'PAUSADA' }` ou `{ valorAlvo }`,  
**Então** aplica transição válida.  
* `valorAlvo` < `valorAtual` → `400`  
* Meta `CANCELADA` → `400` (usar DELETE)  
* Meta `CONCLUIDA` → `400` (exceto status CONCLUIDA)

### Cenário 5 — Resumo dashboard
**Quando** `GET /api/metas/resumo`,  
**Então** retorna totais por status, breakdown curto/longo/pausadas/concluídas, `sugestaoMensal`, `atividadeRecente` (aportes + conclusões, max 15).

### Cenário 6 — Reserva de emergência (RF-142)
**Quando** `GET /api/metas/sugestao-reserva-emergencia?meses=6`,  
**Então** retorna `valorSugerido = mediaGastoMensal × meses`, onde média = despesas últimos 3 meses / 3.

### Cenário 7 — Listar com filtros
**Quando** `GET /api/metas?status=ATIVA&busca=viagem&pagina=1&limite=10`,  
**Então** retorna `200` array paginado + headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`.

### Cenário 8 — Excluir meta
**Quando** `DELETE /api/metas/:id`,  
**Então** retorna `204`; cascade remove aportes; FK viagem/compra set null.

---

## 🛠️ Implementação (o que foi feito)

### metaController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/metaController.js`

**Métodos:**

* `listar()` → `GET /api/metas` — headers paginação + JSON array
* `obterResumo()` → `GET /api/metas/resumo`
* `sugerirReservaEmergencia()` → `GET /api/metas/sugestao-reserva-emergencia`
* `criar()` → `POST /api/metas` — `201`
* `editar()` → `PATCH /api/metas/:id`
* `registrarAporte()` → `POST /api/metas/:id/aportes` — `201`
* `excluirAporte()` → `DELETE /api/metas/:id/aportes/:aporteId`
* `excluir()` → `DELETE /api/metas/:id` — `204`

---

### metaService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/metaService.js`

**Lógica de negócio:**

→ `listarMetas(usuarioId, filtros)` — paginação, filtros status/tipo/busca/prazo  
→ `calcularResumo(usuarioId)` — monta dashboard + atividade recente  
→ `sugerirReservaEmergencia(usuarioId, { meses })` — agrega despesas 3 meses via `transactionRepository`  
→ `criarMeta(usuarioId, dados)` — valida prazo futuro, infere tipo, gamificação  
→ `editarMeta(usuarioId, metaId, dados)` — transições status, valida valorAlvo ≥ valorAtual  
→ `registrarAporte(usuarioId, metaId, dados)` — valida valor/data, `sincronizarConclusao`, notificação  
→ `excluirAporte(usuarioId, metaId, aporteId)` — reabre meta se necessário (correção PO)  
→ `excluirMeta(usuarioId, metaId)` — remove meta + aportes  

**Helpers internos:** `validarPrazoFuturo`, `validarDataAporte`, `sincronizarConclusao`, `montarResumo`

---

### metaRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/metaRepository.js`

**Métodos Prisma:**

→ `listarPorUsuario(usuarioId, filtros, { pagina, limite })`  
→ `listarTodasComAportes(usuarioId)`  
→ `contarPorStatus(usuarioId)`  
→ `listarAtividadeRecente(usuarioId, limite)`  
→ `listarConclusoesRecentes(usuarioId, limite)`  
→ `buscarPorId(metaId, usuarioId, { comAportes })`  
→ `criar(dados)` · `atualizar(metaId, usuarioId, dados)` · `excluir(metaId, usuarioId)`  
→ `criarAporte(dados)` · `buscarAporte(aporteId, metaId, usuarioId)` · `excluirAporte(aporteId)`

---

### metaSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/metaSchemas.js`

**Schemas Zod:** `criarMetaSchema`, `editarMetaSchema`, `registrarAporteSchema`, `listarMetasQuerySchema`, `sugestaoReservaEmergenciaQuerySchema`, `metaIdParamSchema`, `aporteIdParamSchema`

---

### metaMapper.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/utils/metaMapper.js`

→ `mapMeta(meta)` — inclui progresso, `valorMensalSugerido`, `mesesRestantes`, `vencida`, `aportes[]`

---

### metaBalanceUtils.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/utils/metaBalanceUtils.js`

→ `inferirTipoMeta(prazo)` — corte 6 meses  
→ `calcProgressoMeta(meta)` — valorRestante, percentual  
→ `calcValorMensalSugerido(meta)`  
→ `calcSugestaoReservaEmergencia(media, meses)`  
→ `metaEstaVencida(meta)` · `podeReceberAporte(meta)`

---

### metaRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/metaRoutes.js`  
**Base URL:** `/api/metas` (registrado em `routes/index.js`)

| Method | Path | Handler |
|--------|------|---------|
| GET | `/resumo` | `obterResumo` |
| GET | `/sugestao-reserva-emergencia` | `sugerirReservaEmergencia` |
| GET | `/` | `listar` |
| POST | `/` | `criar` |
| PATCH | `/:id` | `editar` |
| POST | `/:id/aportes` | `registrarAporte` |
| DELETE | `/:id/aportes/:aporteId` | `excluirAporte` |
| DELETE | `/:id` | `excluir` |

---

## 🚫 Regras de Negócio (Backend)

* Prazo da meta deve ser data futura (timezone app)
* Tipo inferido automaticamente se omitido (≤6 meses = CURTO_PRAZO)
* Aporte só em meta ATIVA; valor ≤ valorRestante; data não futura
* Conclusão automática quando valorAtual ≥ valorAlvo → status CONCLUIDA + notificação
* Excluir aporte de meta concluída reabre para ATIVA se saldo < alvo
* valorAlvo não pode ser menor que valorAtual acumulado
* Pausar: ATIVA → PAUSADA; Retomar: PAUSADA → ATIVA
* Meta CANCELADA não editável; exclusão via DELETE
* Reserva emergência: média despesas 3 meses × N meses (default 6)

---

# [STORY FRONTEND] Metas Financeiras — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Metas Financeiras

---

## 📝 Descrição

**Como usuário**, quero gerenciar metas financeiras na rota `/goals` com tabs, cards de progresso, sidebar analítico e modais de CRUD/aporte.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Listar metas
**Dado** usuário em `/goals`,  
**Quando** página carrega,  
**Então** exibe tabs, lista de cards com barra de progresso, sidebar com resumo e donut por tipo.

### Cenário 2 — Criar meta
**Quando** abre modal e preenche formulário válido,  
**Então** meta aparece na lista; toast de sucesso; sugestão reserva emergência disponível no form.

### Cenário 3 — Contribuir
**Quando** clica "Aportar" em meta ativa,  
**Então** modal valida valor ≤ restante; atualiza card; se 100% → status concluída + insight parabéns.

### Cenário 4 — Corrigir aporte (PO)
**Dado** meta concluída,  
**Quando** edita meta e remove aporte no histórico (`GoalAportesSection`),  
**Então** meta reabre e progresso recalcula.

### Cenário 5 — Pausar/Retomar
**Quando** clica pausar/retomar no card,  
**Então** status atualiza via `pausarMeta`/`retomarMeta` sem reload completo.

### Cenário 6 — Meta vencida
**Dado** meta ATIVA com prazo passado,  
**Então** card exibe alerta "Prazo vencido" via `goalStatusUtils.getGoalInsight`.

---

## 🛠️ Implementação (o que foi feito)

### metaService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/metaService.js`

→ `buscarMetas(filtros, options)` → `GET /api/metas`  
→ `obterResumo(options)` → `GET /api/metas/resumo`  
→ `sugerirReservaEmergencia({ meses }, options)`  
→ `criarMeta(payload)` · `atualizarMeta(id, payload)`  
→ `registrarAporte(id, payload)` · `excluirAporte(id, aporteId)`  
→ `excluirMeta(id)` · `pausarMeta(id)` · `retomarMeta(id)`

---

### GoalsPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/GoalsPage.jsx`  
**Rota:** `/goals` (registrada em `appRoutes.js`, sidebar `sidebarNavigation.js`)

Orquestra: resumo + lista paginada, tabs, modais CRUD/aporte/delete, pausar/retomar, AbortController para cancelamento.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/goals/`

| Componente | Responsabilidade |
|------------|------------------|
| `GoalTabs.jsx` | Filtro por status (Todas/Ativas/Pausadas/Concluídas) |
| `GoalList.jsx` | Lista paginada de cards |
| `GoalCard.jsx` | Card progresso + ações (aportar, editar, pausar, excluir) |
| `GoalSidebar.jsx` | Resumo lateral + donut + atividade |
| `GoalCategoriesDonut.jsx` | Donut curto/longo/concluídas/pausadas |
| `GoalRecentActivity.jsx` | Feed aportes + conclusões |
| `GoalFormModal.jsx` | Criar/editar meta + sugestão reserva emergência |
| `GoalAportesSection.jsx` | Histórico aportes no modal edição (correção PO) |
| `GoalContributionModal.jsx` | Registrar novo aporte |
| `DeleteGoalModal.jsx` | Confirmar exclusão |
| `goalIcons.jsx` | Ícones por tipo/prioridade |

---

### Utils e estilos (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/goalFilters.js` | Tab → filtro API status |
| `web/src/utils/goalBalanceUtils.js` | Progresso client-side, valor mensal sugerido |
| `web/src/utils/goalStatusUtils.js` | Labels prazo, insight, variant progress bar, meta vencida |
| `web/src/utils/goalIconRules.js` | Regras ícone por nome/tipo meta |
| `web/src/styles/goals.css` | Estilos módulo |

---

### Rotas e navegação (EXISTENTE — IMPLEMENTADO)

**`web/src/config/appRoutes.js`:** `/goals` → `GoalsPage`  
**`web/src/config/sidebarNavigation.js`:** `{ id: 'metas', label: 'Metas Financeiras', path: '/goals', icon: 'Target' }`

---

### Reuso cross-module (EXISTENTE — IMPLEMENTADO)

* `PurchaseItemFormModal.jsx` / `LinkGoalModal.jsx` — busca metas ATIVAS
* `TripDetailPage.jsx` / `TripsPage.jsx` — criar/vincular meta em viagem
* `GroupDetailGoalCard.jsx` — metas de grupo (epic Grupos, modelos separados)

---

### Endpoints consumidos

* `GET /api/metas` · `GET /api/metas/resumo` · `GET /api/metas/sugestao-reserva-emergencia`
* `POST /api/metas` · `PATCH /api/metas/:id` · `DELETE /api/metas/:id`
* `POST /api/metas/:id/aportes` · `DELETE /api/metas/:id/aportes/:aporteId`

---

## 📚 Documentação

- [PO M04](../../Documentacao/03-Auditorias/Product Owner/04-Metas-Financeiras.md)
- [Web Readme](../../Documentacao/02-Engenharia/Web/Readme.md)
- [Requisitos RF-026–032](../../Documentacao/01-Produto/Requisitos/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| jun/2026 | Migration `20260615120000_metas` + backend completo |
| jul/2026 | Frontend `/goals` entregue |
| ago/2026 | Auditoria PO M04 + correções D1/D2 (reabertura aporte, histórico modal) |
