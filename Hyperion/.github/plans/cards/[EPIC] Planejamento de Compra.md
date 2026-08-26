# [EPIC] Planejamento de Compra — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-010 | Planejamento de Compra |
| Feature | PULSO-FEAT-052 | Backend — API e painel de planejamento |
| Feature | PULSO-FEAT-053 | Cálculos — sobra, tempo e parcelas |
| Feature | PULSO-FEAT-054 | Vincular meta e marcar comprado |
| Feature | PULSO-FEAT-055 | Imagens do item de compra |
| Feature | PULSO-FEAT-056 | Frontend — página e componentes |
| Feature | PULSO-FEAT-057 | QA — testes de planejamento de compra |
| Task | PULSO-TASK-105–116 | DB, API, cálculos, meta, imagem, frontend, QA |

---

---
card_id: PULSO-EPIC-010
title: "Planejamento de Compra"
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
  - Integração Externa
---

# [EPIC] Planejamento de Compra

> **Contexto:** Lista de desejos com prioridade, estimativa de tempo via sobra mensal, simulação à vista vs parcelado, alerta de comprometimento da renda, vínculo com meta e “Comprei!” gerando transação.

**Refs:** RF-133–138 · RN-087–093

## 🎯 Objetivos

- Registrar item desejado com nome, valor, prioridade e categoria (RF-133)
- Calcular meses para comprar: valor ÷ sobra mensal (RF-134, RN-087)
- Sobra mensal = média (receita − despesa) dos últimos 3 meses (RN-088)
- Simular à vista vs parcelado (nº de parcelas 1–48) (RF-135, RN-089)
- Alertar comprometimento de parcelas vs renda (>20% atenção, >30% arriscado) (RF-136, RN-090–091)
- Vincular item a meta existente ou criar meta no fluxo (RF-137)
- Marcar “Comprei!” → cria despesa + conclui meta vinculada (RF-138, RN-092–093)
- Imagem do item: URL, og:image do link, Wikimedia ou upload
- Painel: resumo, dicas do dia, categorias, histórico de comprados

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/purchase-planning` | Planejamento de Compra | CRUD itens, simular parcelas, vincular meta, comprar, histórico |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `marcarComprado` cria DESPESA (categoria Compras ou informada) |
| Metas | Vincular / criar meta; concluir ao comprar (RN-093) |
| Config. financeira | `obterRendaMensalPlanejada` (`userFinanceUtils`) |
| Imagens | `purchaseItemImageService` + storage local |

## 🔗 Sub-issues

- PULSO-FEAT-052
- PULSO-FEAT-053
- PULSO-FEAT-054
- PULSO-FEAT-055
- PULSO-FEAT-056
- PULSO-FEAT-057

## 📋 Resumo

### ✅ Concluído
- Escopo RF-133–138 e RN-087–093 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend

---
---
card_id: PULSO-FEAT-052
title: "Backend — API e painel de planejamento"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API e painel de planejamento

> **Contexto:** CRUD de itens desejados e painel agregado com resumo financeiro.

**Refs:** RF-133

## 📝 Descrição

Expor endpoints em `/api/planejamento-compra` para listar painel e gerenciar itens.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/planejamento-compra` | Painel: `resumo`, `itens` (DESEJADO), `comprados` |
| POST | `/planejamento-compra` | Criar item (infere categoria se omitida) |
| PATCH | `/planejamento-compra/:id` | Editar (bloqueia se COMPRADO) |
| DELETE | `/planejamento-compra/:id` | Excluir item |

**Campos item:** nome, valorEstimado, prioridade, categoria, observacoes, linkProduto, imagemUrl, simularParcelas, parcelas

**Resumo:** totalValor, totalItens, mediaImpactoRenda, rendaMensal, sobraMensal, categorias, dicas

## 🔗 Sub-issues

- PULSO-TASK-105
- PULSO-TASK-106
- PULSO-TASK-108

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-105–108 — DB, repository e CRUD

---
---
card_id: PULSO-FEAT-053
title: "Cálculos — sobra, tempo e parcelas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Cálculos — sobra, tempo e parcelas

> **Contexto:** Motor de simulação financeira do planejamento de compra.

**Refs:** RF-134–136 · RN-087–091

## 📝 Descrição

Implementar utilitários e contexto financeiro usados no mapper e no painel.

## ✅ Critérios de Aceite

- `calcularSobraMensal` — média de 3 meses (receita − despesa); piso 0 (RN-088)
- `calcMesesParaComprar` — ceil(valorRestante ÷ sobra); `null` se sobra ≤ 0 (RN-087)
- `calcParcela` / `calcComprometimento` — parcela e % da renda (RN-089–090)
- Níveis: `saudavel` (≤20%), `atencao` (≤30%), `arriscado` (>30%) (RN-091)
- Se meta vinculada: usar `valorRestante` da meta no tempo estimado
- `inferirCategoria` por keywords no nome
- Dicas do dia rotativas (`selecionarDicasDoDia`)

## 🔗 Sub-issues

- PULSO-TASK-107
- PULSO-TASK-109

## 📋 Resumo

### ✅ Concluído
- Fórmulas RN-087–091 mapeadas

### ⏳ Pendente
- PULSO-TASK-107 / 109 — utils e sobra mensal

---
---
card_id: PULSO-FEAT-054
title: "Vincular meta e marcar comprado"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Vincular meta e marcar comprado

> **Contexto:** Integração com metas e geração automática de transação ao comprar.

**Refs:** RF-137 · RF-138 · RN-092 · RN-093

## 📝 Descrição

Permitir vínculo/desvínculo de meta e fluxo “Comprei!” com efeitos colaterais.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/:id/vincular-meta` | Meta existente ou `criarMeta`; opcional `ajustarMetaValor` |
| DELETE | `/:id/vincular-meta` | Remove `metaId` |
| POST | `/:id/comprar` | Cria DESPESA; status COMPRADO; conclui meta (RN-093) |

**Comprar:** categoria Compras (default) ou `categoriaId`; recurso default `DINHEIRO`

**Bloqueios:** meta CANCELADA/CONCLUIDA no vínculo; item já COMPRADO na edição/compra

## 🔗 Sub-issues

- PULSO-TASK-110
- PULSO-TASK-111

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-137/138 definidos

### ⏳ Pendente
- PULSO-TASK-110–111 — meta e comprar

---
---
card_id: PULSO-FEAT-055
title: "Imagens do item de compra"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [FEATURE] Imagens do item de compra

> **Contexto:** Resolução automática e upload de imagem do produto.

## 📝 Descrição

Resolver URL de imagem (direta, og:image, Wikimedia) e permitir upload multipart.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/resolver-imagem` | Preview de imagem por nome/URL/link |
| POST | `/:id/imagem` | Upload multipart; atualiza `imagemUrl` |

**Ordem resolve:** URL imagem → og/twitter:image do link → Wikimedia/Wikipedia pelo nome

Flag `buscarImagemAuto` no criar/editar (default true)

## 🔗 Sub-issues

- PULSO-TASK-112

## 📋 Resumo

### ✅ Concluído
- Pipeline de imagem definido

### ⏳ Pendente
- PULSO-TASK-112 — resolve + storage + upload

---
---
card_id: PULSO-FEAT-056
title: "Frontend — página e componentes"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/purchase-planning` com cards, sidebar, alertas e modais.

**Refs:** RF-133–138

## 📝 Descrição

Implementar página, componentes visuais e fluxos de CRUD/comprar/vincular.

## ✅ Critérios de Aceite

- Rota autenticada `/purchase-planning`
- Cards de itens desejados com meses, parcelas e gauge de comprometimento
- Alerta global se impacto médio > 30% (`PurchasePlanningAlert`)
- Sidebar: resumo, donut categorias, dicas
- Modais: formulário item, vincular meta, histórico, confirmar compra/exclusão
- Client `purchasePlanningService.js` + `purchase-planning.css`

## 🔗 Sub-issues

- PULSO-TASK-113
- PULSO-TASK-114
- PULSO-TASK-115

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-113–115 — página, componentes e CSS

---
---
card_id: PULSO-FEAT-057
title: "QA — testes de planejamento de compra"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de planejamento de compra

> **Contexto:** Regressão para sobra, parcelas, comprar e utils web.

## 📝 Descrição

Implementar suites unitárias API e Web do módulo.

## 🔗 Sub-issues

- PULSO-TASK-116

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-116 — implementar suites

---
---
card_id: PULSO-TASK-105
title: "Banco de dados — ItemPlanejamentoCompra"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-052
due_date: null
categories:
  - Banco de Dados
---

# [TASK] Banco de dados — ItemPlanejamentoCompra

> **Contexto:** Persistência de itens desejados/comprados com vínculo a meta e transação.

## 📝 Descrição

Criar model Prisma, enums e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Campo | Notas |
|-------|-------|
| nome, valorEstimado, prioridade | Core RF-133 |
| categoria | Enum CategoriaItemCompra |
| simularParcelas, parcelas | 1–48; default 12 |
| metaId, status, compradoEm, transacaoId | Ciclo de vida |
| imagemUrl, linkProduto, observacoes | Opcionais |

**Enums:** `StatusItemCompra` (DESEJADO, COMPRADO), `CategoriaItemCompra`

**Migrations:** `20260620140000_planejamento_compra`, imagem, reorganiza categorias

## 📋 Resumo

### ✅ Concluído
- Spec do model definida

### ⏳ Pendente
- Criar/aplicar migrations

---
---
card_id: PULSO-TASK-106
title: "Backend — repository e mapper"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-052
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — repository e mapper

> **Contexto:** Persistência Prisma e DTOs com simulações e progresso de meta.

## 📝 Descrição

Implementar repository e mappers de item desejado/comprado.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/purchasePlanningRepository.js` | listarDesejados, listarComprados, CRUD, contarPorCategoria |
| `utils/purchasePlanningMapper.js` | `mapItem`, `mapItemComprado`, `mapSimulacaoParcelas` |

**mapItem:** mesesParaComprar, simulacoes, comprometimentoPrincipal, meta vinculada

**mapItemComprado:** diasNaLista, transacao resumo

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper

---
---
card_id: PULSO-TASK-107
title: "Backend — purchasePlanningUtils"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-053
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — purchasePlanningUtils

> **Contexto:** Fórmulas de parcela, comprometimento, tempo e inferência de categoria.

## 📝 Descrição

Implementar utilitários puros do domínio.

## 🛠️ Implementação

### `utils/purchasePlanningUtils.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `calcParcela` | valor ÷ parcelas (RN-089) |
| `calcComprometimento` | % renda + nível saudavel/atencao/arriscado (RN-090–091) |
| `calcMesesParaComprar` | ceil(restante ÷ sobra) (RN-087) |
| `inferirCategoria` | keywords → enum |
| `selecionarDicasDoDia` | rotação por dia do ano |
| `CATEGORIA_LABELS` / `DICAS` | Constantes UI |

## 📋 Resumo

### ✅ Concluído
- Fórmulas documentadas

### ⏳ Pendente
- Implementar utils

---
---
card_id: PULSO-TASK-108
title: "Backend — service CRUD e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-052
due_date: null
categories:
  - Backend
---

# [TASK] Backend — service CRUD e rotas

> **Contexto:** Listar painel, criar, editar e excluir itens desejados.

## 📝 Descrição

Implementar service core, schemas, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/purchasePlanningService.js` | `listarPainel`, `criarItem`, `editarItem`, `excluirItem` |
| `schemas/purchasePlanningSchemas.js` | Zod criar/editar/params |
| `controllers/purchasePlanningController.js` | Handlers |
| `routes/purchasePlanningRoutes.js` | Montar em `/planejamento-compra` |

Ordenar desejados por prioridade ALTA → MEDIA → BAIXA. Bloquear edição se COMPRADO.

## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP

---
---
card_id: PULSO-TASK-109
title: "Backend — sobra mensal e contexto financeiro"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-053
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — sobra mensal e contexto financeiro

> **Contexto:** Contexto de renda/sobra usado em mapper, resumo e alertas.

## 📝 Descrição

Implementar agregação de 3 meses e montagem do resumo do painel.

## 🛠️ Implementação

### `purchasePlanningService.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `agregarReceitasDespesasMes` | groupBy tipo Transacao no mês |
| `calcularSobraMensal` | média 3 meses; `Math.max(0, sobraMedia)` (RN-088) |
| `montarResumo` | totais, mediaImpactoRenda, categorias, dicas |
| Renda | `obterRendaMensalPlanejada`; fallback receitas do mês atual |

Exportar contexto `{ rendaMensal, sobraMensal, receitas, despesas }` para `mapItem`.

## 📋 Resumo

### ✅ Concluído
- RN-088 especificada

### ⏳ Pendente
- Implementar sobra e resumo

---
---
card_id: PULSO-TASK-110
title: "Backend — vincular e desvincular meta"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-054
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — vincular e desvincular meta

> **Contexto:** RF-137 — associação item ↔ meta financeira.

## 📝 Descrição

Implementar vínculo com meta existente ou criação inline.

## 🛠️ Implementação

### Endpoints / funções (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `resolverMeta` | `metaId` (ATIVA/PAUSADA) ou `criarMeta` com prazo |
| `vincularMeta` | POST `/:id/vincular-meta`; opcional `ajustarMetaValor` |
| `desvincularMeta` | DELETE `/:id/vincular-meta` |
| Criar item | Flag `vincularMeta` no POST |

Nome default da meta criada: `Comprar: {nomeItem}`

## 📋 Resumo

### ✅ Concluído
- Contratos vínculo definidos

### ⏳ Pendente
- Implementar fluxos de meta

---
---
card_id: PULSO-TASK-111
title: "Backend — marcar comprado e transação"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-054
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — marcar comprado e transação

> **Contexto:** RF-138 / RN-092–093 — “Comprei!” com despesa e conclusão de meta.

## 📝 Descrição

Implementar `POST /:id/comprar` com efeitos colaterais.

## 🛠️ Implementação

### `marcarComprado` (NOVO — CRIAR)

1. Validar item DESEJADO
2. Resolver categoria DESPESA (`categoriaId` ou nome “Compras”)
3. Criar transação DESPESA (`descricao: Compra: {nome}`)
4. Atualizar item: status COMPRADO, `compradoEm`, `transacaoId`
5. Se `metaId` e meta não CONCLUIDA/CANCELADA → `status: CONCLUIDA` (RN-093)

Body opcional: `{ categoriaId, recurso }` — recurso default `DINHEIRO`

## 📋 Resumo

### ✅ Concluído
- Fluxo RN-092–093 documentado

### ⏳ Pendente
- Implementar marcarComprado

---
---
card_id: PULSO-TASK-112
title: "Backend — imagem do item (resolve e upload)"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-055
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [TASK] Backend — imagem do item (resolve e upload)

> **Contexto:** Obter capa do produto automaticamente ou via upload.

## 📝 Descrição

Implementar resolução de URL e storage de imagem.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/purchaseItemImageService.js` | `resolvePurchaseItemImage` — URL / og:image / Wikimedia |
| `services/purchaseItemImageStorageService.js` | `storePurchaseItemImage` |
| `middlewares/purchaseItemImageUploadMiddleware.js` | Multipart campo imagem |
| Rotas | POST `/resolver-imagem`, POST `/:id/imagem` |

Integrar em criar/editar via `obterImagemUrl` + flag `buscarImagemAuto`.

**Migration:** `20260620160000_item_compra_imagem`

## 📋 Resumo

### ✅ Concluído
- Pipeline de imagem definido

### ⏳ Pendente
- Implementar resolve, storage e rotas

---
---
card_id: PULSO-TASK-113
title: "Frontend — PurchasePlanningPage e client"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-056
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — PurchasePlanningPage e client

> **Contexto:** Página `/purchase-planning` orquestrando painel e modais.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/PurchasePlanningPage.jsx` | Load painel; CRUD; comprar; vincular; histórico |
| `services/purchasePlanningService.js` | listarPainel, criar, editar, excluir, comprar, vincular, imagem |
| Rota | `App.jsx` → `/purchase-planning`; sidebar + `appRoutes.js` |

Estados: form, link meta, delete confirm, buy confirm, history.

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client

---
---
card_id: PULSO-TASK-114
title: "Frontend — cards, sidebar e alertas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-056
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — cards, sidebar e alertas

> **Contexto:** Componentes visuais do painel de desejos e resumo.

## 📝 Descrição

Implementar lista de itens, sidebar e alerta de comprometimento.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `PurchaseItemCard.jsx` | Prioridade, meses, parcelas, ações |
| `PurchaseInstallmentGauge.jsx` | Nível saudavel/atencao/arriscado |
| `PurchasePlanningAlert.jsx` | Alerta se impacto > 30% |
| `PurchasePlanningSidebar.jsx` | Resumo + dicas |
| `PurchaseCategoryDonut.jsx` | Distribuição por categoria |
| `PurchaseRecentTable.jsx` | Comprados recentes |

Utils web: `shouldShowImpactAlert` em `purchasePlanningUtils.js`

## 📋 Resumo

### ✅ Concluído
- Componentes RF-134–136 mapeados

### ⏳ Pendente
- Implementar cards e sidebar

---
---
card_id: PULSO-TASK-115
title: "Frontend — modais, imagem e CSS"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-056
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — modais, imagem e CSS

> **Contexto:** Formulários de item/meta e estilos responsivos.

## 📝 Descrição

Implementar modais de edição, vínculo e histórico + CSS.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `PurchaseItemFormModal.jsx` | Criar/editar; parcelas; prioridade |
| `PurchaseItemImagePicker.jsx` | URL, auto-resolve, upload |
| `LinkGoalModal.jsx` | Meta existente ou criar |
| `GoalLinkModeToggle.jsx` | Modo vínculo |
| `PurchaseHistoryModal.jsx` | Detalhe item comprado |
| `styles/purchase-planning.css` | Layout, cards, sidebar, mobile |

## 📋 Resumo

### ✅ Concluído
- Mapa de modais definido

### ⏳ Pendente
- Implementar modais e CSS

---
---
card_id: PULSO-TASK-116
title: "QA — testes de planejamento de compra"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-057
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de planejamento de compra

> **Contexto:** Regressão para utils, service e fluxo comprar/meta.

## 📝 Descrição

Implementar suites unitárias API e Web.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/purchasePlanningUtils.test.js` | parcela, comprometimento, meses, inferirCategoria |
| `unit/services/purchasePlanningService.test.js` | painel, CRUD, comprar, RN-093, sobra 3 meses |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/purchasePlanningUtils.test.js` | `shouldShowImpactAlert` e helpers |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites

---
