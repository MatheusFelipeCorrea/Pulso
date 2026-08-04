# [EPIC] Gerenciamento de Transações

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M03  
> **Correções PO:** exclusão recorrente preserva histórico (RF-NOVO-C1), validação VA/VR/VT por `grupoBeneficio` (RF-NOVO-C2/C3)  
> **Refs:** RF-015–025, RF-140–141 · [PO M03](../../Documentacao/03-Auditorias/Product%20Owner/03-Transacoes.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Transações, Frontend, Backend, Banco de Dados  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Sistema completo de **gerenciamento de transações financeiras pessoais**: registrar receitas, despesas e transferências entre recursos; aplicar filtros avançados e resumo por período; vincular categorias, tags e recorrências; validar compatibilidade recurso×categoria (VA/VR/VT); sugerir categoria por histórico; e gerar ocorrências recorrentes automaticamente via job diário.

### 🎯 Objetivos do Epic

- ✅ CRUD de transações (receita, despesa, transferência) com validações de domínio
- ✅ Filtros por período, categoria, tipo, recurso e busca por descrição/tag
- ✅ Cards de resumo (receitas, despesas, saldo) sincronizados com filtros ativos
- ✅ Tags livres com criação inline no formulário
- ✅ Recorrência configurável (semanal, quinzenal, mensal, anual) + job cron
- ✅ Transferências entre recursos (`TRANSFERENCIA`, `recursoDestino`, `POUPANCA`) fora dos totais
- ✅ Sugestão automática de categoria (RF-141) ao digitar descrição
- ✅ Validação recurso×categoria desacoplada do nome literal (`grupoBeneficio`)
- ✅ Streak de gamificação + notificações ao registrar transação
- ✅ Exclusão recorrente “esta e futuras” preserva histórico passado

### 🎭 Telas e Fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/transactions` | Transações | Cards resumo, filtros (aplicar/limpar), lista agrupada por data, paginação |
| Modal | Nova/Editar transação | Toggle receita/despesa/transferência, valor, data, categoria, recurso, tags, recorrência |
| Modal | Excluir transação | Confirmação simples ou opções recorrentes (só esta / esta e futuras) |
| Modal | Categorias | CRUD categorias personalizadas com preset `grupoBeneficio` (VA/VR/VT) |
| Modal | Tags | CRUD tags com ícone e cor |

---

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Categorias | Seed no registro (`categoryService.seedCategoriasPadrao`); `grupoBeneficio` para VA/VR/VT |
| Tags | `tagRepository`, `tagService`; vínculo M:N via `TransacaoTag` |
| Gamificação | `incrementarStreak` + `gamificationService.processarAposTransacao` |
| Notificações | `RECEITA_REGISTRADA`, `DESPESA_REGISTRADA`, `TRANSFERENCIA_REGISTRADA` |
| Insights | `insightService.tentarGerarInsightAposTransacao` após criar |
| Metas | Histórico de despesas usado em `metaService.sugerirReservaEmergencia` |
| Calendário | Transferências excluídas dos marcadores de receita/despesa |
| Planejamento de Compra | `ItemPlanejamentoCompra.transacaoId` opcional |
| Job cron | `recurringTransactions.js` — gera filhas diariamente às 00:05 |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (`Transacao`, `Tag`, `TransacaoTag`, `GrupoBeneficioCategoria`); migrations `20260422195021_init`, `20260708100000_add_transferencia_poupanca`, `20260804120000_categoria_grupo_beneficio` |
| Backend | ✅ | `transactionRoutes.js`, `transactionController.js`, `transactionService.js`, `transactionRepository.js`, `transactionFilterService.js`, `transactionSchemas.js`, `transactionMapper.js`, `recursoCategoriaRules.js`, `categorySuggestionService.js`, `categorySuggestionUtils.js`, `recurrenceUtils.js`, `recurringTransactions.js`, `transactionOptions.js` |
| Frontend | ✅ | `TransactionsPage.jsx`, 5 componentes em `components/features/transactions/`, `transactionService.js`, utils (`transactionFilters`, `transactionValidation`, `transactionRecurrence`), `useTransactionFilterOptions.js`, `styles/transactions.css` |
| Testes API | ✅ | `transactionService.test.js`, `transactionMapper.test.js`, `transactionFilterService.test.js`, `recursoCategoriaRules.test.js`, `categorySuggestionService.test.js`, `recurringTransactions.test.js` |
| Testes Web | ✅ | `transactionService.test.js`, `transactionFilters.test.js`, `transactionValidation.test.js`, `transactionRecurrence.test.js`, `useTransactionFilterOptions.test.js` |
| Cross-module | ✅ | `CategoryManageModal`, `TagManageModal`, consumo em Metas/Calendário/Planejamento |

**Registro rotas:** `Codigo/Pulso/api/src/routes/index.js` → `router.use('/transacoes', transactionRoutes)`

---

## 🔧 Correções pós-auditoria PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RF-NOVO-C1 | "Excluir esta e futuras" preserva ocorrências com `data < corte`; aplica `UNTIL` na mãe | `transactionService.excluirTransacao`, `transactionRepository.excluirRecorrentesFilhasAPartirDe`, `recurrenceUtils` |
| RF-NOVO-C2 | Campo `grupoBeneficio` em `Categoria` + presets no form de categoria custom | migration `20260804120000`, `recursoCategoriaRules.js`, `CategoryFormModal` |
| RF-NOVO-C3 | Mensagens de erro VA/VR/VT explicam grupo e sugerem editar categoria | `recursoCategoriaRules.buildMensagemIncompativel` |
| RNF-NOVO-C1 | Testes de regressão exclusão recorrente + regras recurso×categoria | `transactionService.test.js`, `recursoCategoriaRules.test.js` |

---

## ⏳ Pendências

- [ ] Concorrência otimista em edição (`atualizadoEm` / If-Match) — aceito no MVP (RNF-NOVO-C2)
- [ ] Precisão/algoritmo RF-141 — auditoria superficial; validar Dice bigramas em produção
- [ ] Import de extratos (RF futuro) — reaproveitar motor de sugestão RF-141
- [ ] TanStack Query — padrão atual usa service + `useState`/`useEffect` com `AbortController`
- [ ] Indicador visual de recorrência na lista — deliberadamente omitido (protótipo tinha bug)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Usuário registra receita/despesa com valor, data, categoria e recurso  
→ Usuário registra transferência entre recursos sem impactar totais de receita/despesa  
→ Sistema bloqueia combinações inválidas VA/VR/VT×categoria (por `grupoBeneficio`)  
→ Usuário filtra por período, categoria, tipo, recurso e busca por descrição/tag  
→ Cards de resumo refletem os mesmos filtros da listagem  
→ Usuário cria transação recorrente; job gera filhas no dia programado  
→ Ao excluir recorrente "esta e futuras", histórico passado permanece intacto  
→ Sugestão de categoria preenche campo ao digitar descrição (somente criação)  
→ Streak de gamificação incrementa no máximo 1× por dia ao registrar transação  

---

# [STORY DATABASE] Gerenciamento de Transações — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Gerenciamento de Transações

---

## 📝 Descrição

**Como sistema**, quero persistir transações, tags e vínculos com enums de tipo/recurso, suportando recorrência (RRULE), transferências e validação estrutural de benefícios.

---

## 🗄️ SQL executado

**Migration inicial:** `Codigo/Pulso/api/prisma/migrations/20260422195021_init/migration.sql`  
**Evoluções relevantes:** `20260708100000_add_transferencia_poupanca`, `20260804120000_categoria_grupo_beneficio`

```sql
-- Enums (Prisma): TipoTransacao, TipoRecurso, GrupoBeneficioCategoria

CREATE TABLE "transacoes" (
  "id" TEXT PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "categoria_id" TEXT,                    -- nula em TRANSFERENCIA (RF-140)
  "tipo" "TipoTransacao" NOT NULL,        -- RECEITA | DESPESA | TRANSFERENCIA
  "recurso" "TipoRecurso" NOT NULL,       -- DINHEIRO | VA | VR | VT | POUPANCA
  "recurso_destino" "TipoRecurso",        -- só TRANSFERENCIA
  "valor" DECIMAL(12,2) NOT NULL,
  "descricao" VARCHAR(255),
  "data" TIMESTAMP(3) NOT NULL,
  "recorrente" BOOLEAN NOT NULL DEFAULT false,
  "regra_recorrencia" TEXT,               -- RFC 5545 RRULE
  "pai_id" TEXT,                          -- filha → mãe recorrente
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "transacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id")
    REFERENCES "usuarios"("id") ON DELETE CASCADE,
  CONSTRAINT "transacoes_categoria_id_fkey" FOREIGN KEY ("categoria_id")
    REFERENCES "categorias"("id"),
  CONSTRAINT "transacoes_pai_id_fkey" FOREIGN KEY ("pai_id")
    REFERENCES "transacoes"("id") ON DELETE SET NULL
);

CREATE TABLE "tags" (
  "id" TEXT PRIMARY KEY,
  "nome" VARCHAR(40) NOT NULL,
  "icone" VARCHAR(40),
  "cor" VARCHAR(7) NOT NULL DEFAULT '#71717A',
  "usuario_id" TEXT NOT NULL,
  CONSTRAINT "tags_usuario_id_fkey" FOREIGN KEY ("usuario_id")
    REFERENCES "usuarios"("id") ON DELETE CASCADE,
  UNIQUE ("usuario_id", "nome")
);

CREATE TABLE "transacoes_tags" (
  "transacao_id" TEXT NOT NULL,
  "tag_id" TEXT NOT NULL,
  PRIMARY KEY ("transacao_id", "tag_id"),
  CONSTRAINT "transacoes_tags_transacao_id_fkey" FOREIGN KEY ("transacao_id")
    REFERENCES "transacoes"("id") ON DELETE CASCADE,
  CONSTRAINT "transacoes_tags_tag_id_fkey" FOREIGN KEY ("tag_id")
    REFERENCES "tags"("id") ON DELETE CASCADE
);

-- Categorias: grupo lógico para VA/VR/VT (correção PO RF-NOVO-C2)
ALTER TABLE "categorias" ADD COLUMN "grupo_beneficio" "GrupoBeneficioCategoria";
-- valores: ALIMENTACAO | COMPRAS | TRANSPORTE

CREATE INDEX "transacoes_usuario_id_data_idx" ON "transacoes"("usuario_id", "data" DESC);
CREATE INDEX "transacoes_usuario_id_categoria_id_idx" ON "transacoes"("usuario_id", "categoria_id");
CREATE INDEX "transacoes_usuario_id_tipo_idx" ON "transacoes"("usuario_id", "tipo");
CREATE INDEX "transacoes_usuario_id_recurso_idx" ON "transacoes"("usuario_id", "recurso");
CREATE INDEX "transacoes_usuario_id_recorrente_idx" ON "transacoes"("usuario_id", "recorrente");
CREATE INDEX "transacoes_tags_tag_id_idx" ON "transacoes_tags"("tag_id");
```

---

## 📊 Modelo Prisma (resumo)

| Model | Campos-chave |
|-------|--------------|
| `Transacao` | `tipo`, `recurso`, `recursoDestino?`, `valor`, `descricao?`, `data`, `recorrente`, `regraRecorrencia?`, `paiId?`, `categoriaId?` |
| `Tag` | `nome`, `icone?`, `cor`, `usuarioId` |
| `TransacaoTag` | PK composta `(transacaoId, tagId)` |
| `Categoria` | `grupoBeneficio?` (`GrupoBeneficioCategoria`) |

**Enums:** `TipoTransacao` (RECEITA, DESPESA, TRANSFERENCIA) · `TipoRecurso` (DINHEIRO, VA, VR, VT, POUPANCA) · `GrupoBeneficioCategoria` (ALIMENTACAO, COMPRAS, TRANSPORTE)

**Relações:** `Transacao` N:1 `Categoria?` · `Transacao` 1:N `TransacaoTag` · `Transacao` self-ref `pai`/`filhas` · `ItemPlanejamentoCompra.transacaoId` opcional

---

## ✅ Critérios de Aceite (Database)

→ Tabela `transacoes` com índices por usuário+data, tipo, recurso, categoria  
→ `categoria_id` nullable para transferências  
→ `recurso_destino` preenchido apenas em `TRANSFERENCIA`  
→ Tabela `transacoes_tags` com cascade delete  
→ Campo `grupo_beneficio` em categorias com backfill das padrão  
→ Enum `POUPANCA` e valor `TRANSFERENCIA` adicionados  

---

# [STORY BACKEND] Gerenciamento de Transações — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Gerenciamento de Transações

---

## 📝 Descrição

**Como sistema backend**, quero fornecer API REST completa para transações financeiras, incluindo CRUD, resumo, filtros, sugestão de categoria, recorrência e validações recurso×categoria.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Listar transações com filtros
**Dado** usuário autenticado com transações,  
**Quando** `GET /api/transacoes?periodo=2025-05&categoria=id&tipo=DESPESA&recurso=VT&busca=almoço&pagina=1&limite=10`,  
**Então** retorna `200` com array mapeado + headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`.  
* Ordenação: `data DESC`, desempate `criadoEm DESC`, `id DESC`  
* Busca: `descricao ILIKE` OU tag cujo nome contém o termo  
* Suporta também `dataInicio`/`dataFim` e `categoriaNome`

### Cenário 2 — Calcular resumo do período
**Quando** `GET /api/transacoes/resumo` com mesmos filtros da listagem,  
**Então** retorna `{ receitas: { total, quantidade }, despesas: { total, quantidade }, saldo }`.  
* `TRANSFERENCIA` **não** entra nos totais (RF-140)

### Cenário 3 — Criar receita/despesa
**Quando** `POST /api/transacoes` com `{ tipo, categoriaId, recurso, valor, data, tags?, recorrente?, regraRecorrencia? }`,  
**Então** retorna `201` com transação mapeada; incrementa streak; dispara notificação e gamificação.  
* Categoria inexistente → `404`  
* Tag inexistente → `404`  
* Data futura (não recorrente) → `400` "Transação não pode ter data futura"  
* Recorrente sem `regraRecorrencia` → `400`  
* Recurso×categoria inválido → `400` com mensagem explicativa (RF-NOVO-C3)

### Cenário 4 — Criar transferência (RF-140)
**Quando** `POST /api/transacoes` com `{ tipo: 'TRANSFERENCIA', recurso, recursoDestino, valor, data }`,  
**Então** retorna `201`; `categoriaId` nulo; notificação `TRANSFERENCIA_REGISTRADA`.  
* `recursoDestino === recurso` → `400`

### Cenário 5 — Editar transação
**Quando** `PATCH /api/transacoes/:id` com campos parciais,  
**Então** retorna `200` com transação atualizada.  
* Troca de `TRANSFERENCIA` → receita/despesa zera `recursoDestino`  
* Revalida recurso×categoria se categoria ou recurso mudarem

### Cenário 6 — Excluir transação simples
**Quando** `DELETE /api/transacoes/:id`,  
**Então** retorna `204`; remove instância e vínculos de tags.

### Cenário 7 — Excluir recorrente (correção PO RF-NOVO-C1)
**Dado** transação mãe ou filha de série recorrente,  
**Quando** `DELETE /api/transacoes/:id?excluirFuturas=true&dataCorte=...`,  
**Então** remove filhas com `data >= corte`; aplica `UNTIL` na mãe via `encerrarRecorrencia`; **preserva** histórico anterior ao corte.

### Cenário 8 — Opções de filtro/formulário
**Quando** `GET /api/transacoes/filtros`,  
**Então** retorna categorias, tags, tipos, recursos e metadados de recorrência do usuário.

### Cenário 9 — Sugestão de categoria (RF-141)
**Quando** `GET /api/transacoes/sugestao-categoria?tipo=DESPESA&descricao=almoço%20ru`,  
**Então** retorna `{ categoriaId }` ou `{ categoriaId: null }` via similaridade Dice bigramas no histórico do usuário.

### Cenário 10 — Job de recorrência (RF-021)
**Dado** transação mãe com RRULE válida,  
**Quando** job `runRecurringTransactions` executa no dia de ocorrência,  
**Então** cria filha com `paiId`, mesmos dados e tags; não duplica se já existe filha no dia.

---

## 🛠️ Implementação (o que foi feito)

### transactionController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/transactionController.js`

**Métodos:**

* `listarTransacoes()` → `GET /api/transacoes` — headers paginação + JSON array
* `obterResumo()` → `GET /api/transacoes/resumo`
* `obterOpcoesFiltro()` → `GET /api/transacoes/filtros`
* `sugerirCategoria()` → `GET /api/transacoes/sugestao-categoria`
* `criarTransacao()` → `POST /api/transacoes` — `201`
* `editarTransacao()` → `PATCH /api/transacoes/:id`
* `excluirTransacao()` → `DELETE /api/transacoes/:id` — `204`; repassa `excluirFuturas`, `dataCorte`

---

### transactionService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/transactionService.js`

**Lógica de negócio:**

→ `listarTransacoes(usuarioId, filtros)` — paginação + `mapTransacao`  
→ `calcularResumo(usuarioId, filtros)` — agrega só RECEITA/DESPESA via `montarResumo`  
→ `criarTransacao(usuarioId, dados)` — valida transferência, categoria, data, tags, recorrência, recurso×categoria, streak, notificação, gamificação, insight  
→ `editarTransacao(usuarioId, transacaoId, dados)` — revalidações + tags  
→ `excluirTransacao(usuarioId, transacaoId, excluirFuturas, dataCorte)` — lógica RF-NOVO-C1  

**Helpers internos:** `validarData`, `validarTags`, `buscarCategoriaDoUsuario`, `incrementarStreak`, `notificarTransacaoRegistrada`, `montarResumo`

---

### transactionRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/transactionRepository.js`

**Métodos Prisma:**

→ `buildWhere(usuarioId, filtros)` — período, categoria, tipo, recurso, busca OR tags  
→ `listarPorUsuario(usuarioId, filtros, { pagina, limite })`  
→ `calcularAgregados(usuarioId, filtros)` — `groupBy tipo`  
→ `criar(dados)` · `atualizar(transacaoId, dados)` · `excluir(transacaoId)`  
→ `vincularTags(transacaoId, tagIds)` · `desvincularTags(transacaoId)`  
→ `buscarPorId(transacaoId, usuarioId)`  
→ `excluirRecorrentesFilhasAPartirDe(paiId, dataCorte)` — correção PO  
→ `encerrarRecorrencia(transacaoId, regraRecorrencia)` — aplica UNTIL  
→ `listarRecorrentesMae()` — usado pelo job  
→ `listarDescricoesPorTipo(usuarioId, tipo)` — usado por RF-141  

---

### transactionFilterService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/transactionFilterService.js`

→ `obterOpcoesFiltro(usuarioId)` — categorias, tags, tipos, recursos, frequências de recorrência

---

### categorySuggestionService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/categorySuggestionService.js`

→ `sugerirCategoria(usuarioId, { tipo, descricao })` — delega a `categorySuggestionUtils.sugerirCategoriaId`

---

### transactionSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/transactionSchemas.js`

**Schemas Zod:** `criarTransacaoSchema`, `editarTransacaoSchema`, `listarTransacoesQuerySchema`, `excluirTransacaoSchema`, `sugerirCategoriaQuerySchema`

---

### transactionMapper.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/utils/transactionMapper.js`

→ `mapTransacao(transacao)` — inclui `categoria` (com `grupoBeneficio`), `tags[]`, `recursoDestino`, `paiId`  
→ `mapCategoria(categoria)`

---

### recursoCategoriaRules.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/utils/recursoCategoriaRules.js`

→ `validarRecursoCategoria(recurso, categoria, tipo)` — RN-032/035/038/039 via `grupoBeneficio` + fallback por nome  
→ `resolverGrupoBeneficio(categoria)` · `buildMensagemIncompativel(recurso, categoriaNome)`

---

### recurrenceUtils.js + recurringTransactions.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/utils/recurrenceUtils.js`, `Codigo/Pulso/api/src/jobs/recurringTransactions.js`

→ `calcularUntilAPartirDoCorte`, `aplicarUntilNaRegra` — encerramento de série  
→ `runRecurringTransactions()` — cron diário; proteção anti-duplicata no mesmo dia

---

### transactionRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/transactionRoutes.js`  
**Base URL:** `/api/transacoes` (registrado em `routes/index.js`)

| Method | Path | Handler |
|--------|------|---------|
| GET | `/filtros` | `obterOpcoesFiltro` |
| GET | `/sugestao-categoria` | `sugerirCategoria` |
| GET | `/resumo` | `obterResumo` |
| GET | `/` | `listarTransacoes` |
| POST | `/` | `criarTransacao` |
| PATCH | `/:id` | `editarTransacao` |
| DELETE | `/:id` | `excluirTransacao` |

---

## 🚫 Regras de Negócio (Backend)

* Valor positivo obrigatório; recurso obrigatório; categoria obrigatória exceto transferência
* Data futura bloqueada para transações não recorrentes (RN-054)
* VA → categorias com grupo ALIMENTACAO ou COMPRAS (RN-032)
* VR → ALIMENTACAO (RN-035)
* VT → TRANSPORTE; VT nunca ALIMENTACAO (RN-038/039)
* Recorrência exige `regraRecorrencia` RFC 5545; filhas geradas pelo job (RN-050/051)
* Exclusão "futuras": preserva passado + UNTIL na mãe (RN-052, correção PO)
* Transferência: `recursoDestino ≠ recurso`; excluída de totais receita/despesa (RF-140)
* Streak: no máximo 1 incremento por dia (RN-053)
* Valores monetários com 2 casas decimais (RN-159)

---

# [STORY FRONTEND] Gerenciamento de Transações — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Gerenciamento de Transações

---

## 📝 Descrição

**Como usuário**, quero gerenciar transações na rota `/transactions` com resumo, filtros aplicáveis, lista paginada e modais de CRUD/exclusão, incluindo transferências, recorrência e sugestão de categoria.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Carregar página
**Dado** usuário autenticado em `/transactions`,  
**Quando** página carrega,  
**Então** exibe cards de resumo, filtros (mês atual), lista agrupada por data e paginação se >10 itens.

### Cenário 2 — Filtros pendentes vs aplicados
**Quando** usuário altera filtro sem clicar "Filtrar",  
**Então** botão "Filtrar" habilita; dados na tela **não** mudam até aplicar.

### Cenário 3 — Aplicar e limpar filtros
**Quando** clica "Filtrar",  
**Então** recarrega lista + resumo com `buildTransactionApiFiltros`; botão vira "Limpar filtros".  
**Quando** clica "Limpar filtros",  
**Então** reseta para `DEFAULT_TRANSACTION_FILTROS()` e recarrega.

### Cenário 4 — Criar transação
**Quando** preenche modal e salva,  
**Então** `POST /api/transacoes`; toast de sucesso; lista e resumo atualizam.

### Cenário 5 — Sugestão de categoria (RF-141)
**Dado** modal de criação, descrição ≥3 caracteres,  
**Quando** usuário digita descrição (debounce 400ms),  
**Então** chama `sugerirCategoria`; preenche categoria se usuário não escolheu manualmente.

### Cenário 6 — Validação recurso×categoria (client + server)
**Quando** combinação inválida (ex.: VT + Alimentação),  
**Então** erro inline via `validarRecursoCategoria` antes do submit; backend reforça se bypass.

### Cenário 7 — Transferência
**Quando** seleciona tipo transferência no modal,  
**Então** exibe origem + destino; oculta categoria; valida via `validarTransferencia`.

### Cenário 8 — Recorrência
**Quando** marca "Repetir automaticamente" e escolhe frequência/até quando,  
**Então** envia `regraRecorrencia` montada por `buildRecurrenceRule`.

### Cenário 9 — Excluir recorrente (correção PO)
**Dado** transação recorrente (mãe ou filha),  
**Quando** confirma "Excluir esta e futuras",  
**Então** `DELETE` com `excluirFuturas=true` e `dataCorte=transacao.data`; toast informa histórico mantido.

### Cenário 10 — Gerenciar categorias e tags
**Quando** clica "Categorias" ou "Tags" no header,  
**Então** abre `CategoryManageModal` ou `TagManageModal`; ao salvar, recarrega opções de filtro.

---

## 🛠️ Implementação (o que foi feito)

### transactionService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/transactionService.js`

→ `buscarTransacoes(filtros, options)` → `GET /api/transacoes`  
→ `obterResumo(filtros, options)` → `GET /api/transacoes/resumo`  
→ `obterOpcoesFiltro(options)` → `GET /api/transacoes/filtros`  
→ `sugerirCategoria({ tipo, descricao }, options)` → RF-141  
→ `criarTransacao(payload)` · `atualizarTransacao(id, payload)`  
→ `excluirTransacao(id, excluirFuturas, dataCorte)`

---

### TransactionsPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/TransactionsPage.jsx`  
**Rota:** `/transactions` (sidebar `sidebarNavigation.js`, rota padrão pós-login `defaultAuthenticatedRoute.js`)

Orquestra: resumo + lista paginada, filtros pendentes/aplicados, modais CRUD/delete/categorias/tags, `AbortController` para cancelamento, criação de tags inline via `tagService.criarTag`.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/transactions/`

| Componente | Responsabilidade |
|------------|------------------|
| `TransactionSummaryCards.jsx` | Cards receitas, despesas, saldo com loading |
| `TransactionFilters.jsx` | Busca, período, categoria, tipo, recurso; botão Filtrar/Limpar |
| `TransactionList.jsx` | Lista agrupada por data, empty state, ações editar/excluir |
| `TransactionFormModal.jsx` | CRUD modal: receita/despesa/transferência, recorrência, sugestão categoria |
| `DeleteTransactionModal.jsx` | Confirmação simples ou recorrente com `dataCorte` (RF-NOVO-C1) |

---

### Utils e hooks (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/transactionFilters.js` | `DEFAULT_TRANSACTION_FILTROS`, `buildTransactionApiFiltros`, comparação de filtros |
| `web/src/utils/transactionValidation.js` | `validarRecursoCategoria`, `validarTransferencia` (espelha backend) |
| `web/src/utils/transactionRecurrence.js` | `buildRecurrenceRule` — monta RRULE para API |
| `web/src/hooks/useTransactionFilterOptions.js` | Cache local de opções de filtro/formulário |
| `web/src/styles/transactions.css` | Estilos módulo `.tx-page` |

---

### Rotas e navegação (EXISTENTE — IMPLEMENTADO)

**`web/src/config/sidebarNavigation.js`:** `{ id: 'transacoes', label: 'Transações', path: '/transactions', icon: 'ArrowLeftRight' }`  
**`web/src/config/defaultAuthenticatedRoute.js`:** `DEFAULT_AUTHENTICATED_ROUTE = '/transactions'`

---

### Reuso cross-module (EXISTENTE — IMPLEMENTADO)

* `CategoryManageModal.jsx` — CRUD categorias com preset `grupoBeneficio`
* `TagManageModal.jsx` — CRUD tags
* Consumido indiretamente por Metas, Calendário, Planejamento de Compra

---

### Endpoints consumidos

* `GET /api/transacoes` · `GET /api/transacoes/resumo` · `GET /api/transacoes/filtros`
* `GET /api/transacoes/sugestao-categoria`
* `POST /api/transacoes` · `PATCH /api/transacoes/:id` · `DELETE /api/transacoes/:id`

---

## 📚 Documentação

- [PO M03](../../Documentacao/03-Auditorias/Product%20Owner/03-Transacoes.md)
- [Web Readme](../../Documentacao/02-Engenharia/Web/Readme.md)
- [Requisitos RF-015–025, RF-140–141](../../Documentacao/01-Produto/Requisitos/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| abr/2026 | Migration init + modelos `Transacao`, `Tag`, `TransacaoTag` |
| jul/2026 | Backend e frontend `/transactions` entregues |
| jul/2026 | RF-140 transferências + recurso `POUPANCA` |
| ago/2026 | Auditoria PO M03 + correções C1/C2/C3 (recorrência, grupoBeneficio, mensagens) |
| ago/2026 | Testes de regressão RNF-NOVO-C1 |
