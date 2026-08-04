# [EPIC] Planejamento de Compra

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M18  
> **Correções PO:** validação converter sem itens; doc fluxo planejamento→meta (RN-062)  
> **Refs:** RF-133–138 · [PO M18](../../Documentacao/03-Auditorias/Product Owner/18-Planejamento-de-Compra.md)  
> **Pai lógico:** [Metas Financeiras](./[EPIC]%20Metas%20Financeiras.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Compras, Metas, Transações, Frontend, Backend  
**Relator:**     —  
**Pai:**         [EPIC] Metas Financeiras  
**Data Limite:** —

---

## 📋 Descrição do Epic

Lista de desejos de compra com valor estimado, prioridade, categoria inferida, simulação parcelas (1–48x), impacto % renda, vínculo opcional a meta financeira (criar ou linkar), marcar como comprado → gera transação DESPESA, imagem produto (URL/upload/auto-resolve).

### 🎯 Objetivos

- ✅ Painel `/purchase-planning` — itens + sidebar resumo
- ✅ CRUD itens (`ItemPlanejamentoCompra`)
- ✅ Vincular meta existente ou criar inline
- ✅ Comprar → transação + opcional concluir meta vinculada
- ✅ Gauge comprometimento parcelas vs renda
- ✅ Donut por categoria, dicas diárias, compras recentes
- ✅ Resolver/upload imagem produto

### 🎭 Tela `/purchase-planning`

| Área | Conteúdo |
|------|----------|
| Lista | `PurchaseItemCard` por prioridade (ALTA→BAIXA) |
| Sidebar | `PurchasePlanningSidebar` — sobra renda, gauge parcelas, donut categorias |
| Modais | Criar/editar item, link meta, confirmar compra, delete, histórico |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `ItemPlanejamentoCompra`, enums `StatusItemCompra`, `CategoriaItemCompra` |
| Backend | ✅ | `purchasePlanningService.js`, `purchasePlanningController.js`, `purchasePlanningRoutes.js`, `purchasePlanningRepository.js`, `purchasePlanningSchemas.js`, `purchasePlanningUtils.js`, `purchasePlanningMapper.js`, `purchaseItemImageService.js`, `purchaseItemImageStorageService.js`, `purchaseItemImageUploadMiddleware.js` |
| Frontend | ✅ | `PurchasePlanningPage.jsx`, 11 componentes `features/purchase-planning/`, `purchasePlanningService.js`, `styles/purchase-planning.css` |
| Testes API | ✅ | `purchasePlanningService.test.js`, `purchasePlanningUtils.test.js` |
| Testes Web | ✅ | `purchasePlanningUtils.test.js` |
| Cross | ✅ | `LinkGoalModal`, `GoalLinkModeToggle`, integração `metaService` |

**Migrations:** `20260620140000_planejamento_compra` · `20260620160000_item_compra_imagem` · `20260707220214_reorganiza_categorias_item_compra`  
**Registro rotas:** `routes/index.js` → `router.use('/planejamento-compra', purchasePlanningRoutes)`

---

## 🔧 Correções PO (ago/2026)

| Correção | Detalhe |
|----------|---------|
| RN-062 | Fluxo item→meta documentado (criar inline ou vincular existente) |
| Validar vazio | Bloqueio vincular meta sem `metaId`/`criarMeta` válidos |

---

## ⏳ Pendências

- [ ] Comparador preços externo
- [ ] Compartilhar planejamento em grupo
- [ ] Wishlist import URL marketplace
- [ ] Testes E2E PurchasePlanningPage

---

## 🚀 Critérios Epic

→ Criar item com valor, prioridade; categoria inferida do nome se omitida  
→ Simular parcelas 1–48; gauge mostra % renda comprometida (saudável ≤20%, atenção ≤30%, arriscado >30%)  
→ Vincular meta ATIVA/PAUSADA ou criar nova no link  
→ Comprar: status COMPRADO, cria DESPESA categoria Compras, item imutável  
→ Opcional concluir meta vinculada ao comprar  
→ Resolver imagem via link, auto-busca ou upload multipart  

---

# [STORY DATABASE] Planejamento de Compra — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Planejamento de Compra

---

## 📝 Descrição

**Como sistema**, quero persistir itens de planejamento de compra com status, categoria, parcelas simuladas e vínculos opcionais a meta e transação.

---

## 🗄️ SQL executado

**Migration principal:** `Codigo/Pulso/api/prisma/migrations/20260620140000_planejamento_compra/migration.sql`  
**Imagem:** `20260620160000_item_compra_imagem/migration.sql`  
**Categorias:** `20260707220214_reorganiza_categorias_item_compra/migration.sql`

```sql
CREATE TYPE "StatusItemCompra" AS ENUM ('DESEJADO', 'COMPRADO');

CREATE TYPE "CategoriaItemCompra" AS ENUM (
  'ELETRONICOS', 'CASA_ELETRODOMESTICOS', 'VESTUARIO',
  'VEICULO', 'ACESSORIOS', 'OUTROS'
);

CREATE TABLE "itens_planejamento_compra" (
  "id" TEXT PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "nome" VARCHAR(120) NOT NULL,
  "valor_estimado" DECIMAL(12,2) NOT NULL,
  "prioridade" "Prioridade" NOT NULL DEFAULT 'MEDIA',
  "categoria" "CategoriaItemCompra" NOT NULL DEFAULT 'OUTROS',
  "observacoes" VARCHAR(300),
  "link_produto" VARCHAR(500),
  "imagem_url" VARCHAR(2048),
  "simular_parcelas" BOOLEAN NOT NULL DEFAULT true,
  "parcelas" INTEGER NOT NULL DEFAULT 12,
  "meta_id" TEXT,
  "status" "StatusItemCompra" NOT NULL DEFAULT 'DESEJADO',
  "comprado_em" TIMESTAMP(3),
  "transacao_id" TEXT UNIQUE,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL
);

-- FKs
ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY ("meta_id") REFERENCES "metas"("id") ON DELETE SET NULL;
ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY ("transacao_id") REFERENCES "transacoes"("id") ON DELETE SET NULL;
```

**Índices:** `[usuarioId, status]`, `[usuarioId, criadoEm DESC]`, unique `[transacaoId]`

---

## 📊 Modelo Prisma (resumo)

| Campo | Tipo | Notas |
|-------|------|-------|
| `nome` | VARCHAR(120) | Capitalizado no service |
| `valorEstimado` | DECIMAL(12,2) | > 0 |
| `prioridade` | Prioridade | ALTA, MEDIA, BAIXA |
| `categoria` | CategoriaItemCompra | Inferida se omitida |
| `simularParcelas` | Boolean | default true |
| `parcelas` | Int | clamp 1–48 |
| `metaId` | FK Meta? | ON DELETE SET NULL |
| `transacaoId` | FK Transacao? @unique | Preenchido ao comprar |
| `status` | StatusItemCompra | DESEJADO → COMPRADO irreversível |

---

## ✅ Critérios de Aceite (Database)

→ Enum status e categoria criados  
→ FK meta opcional + FK transação única pós-compra  
→ Cascade delete usuário → itens  
→ Coluna imagem_url VARCHAR(2048)  

---

# [STORY BACKEND] Planejamento de Compra — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Planejamento de Compra

---

## 📝 Descrição

**Como sistema backend**, quero API para painel de planejamento de compras com analytics de renda, vínculo meta e geração de transação ao comprar.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Painel dashboard
**Dado** usuário autenticado,  
**Quando** `GET /api/planejamento-compra`,  
**Então** retorna `{ resumo, itens, comprados }` — itens ordenados prioridade ALTA→BAIXA, resumo com sobraMensal, mediaImpactoRenda, categorias, dicas.

### Cenário 2 — Criar item
**Quando** `POST /api/planejamento-compra` com `{ nome, valorEstimado, prioridade }`,  
**Então** retorna `201` com categoria inferida (`inferirCategoria`), parcelas default 12, imagem auto-resolvida se `buscarImagemAuto: true`.

### Cenário 3 — Criar com meta inline
**Quando** `{ vincularMeta: true, criarMeta: { prazo, valorAlvo } }`,  
**Então** cria meta via `metaRepository.criar` e vincula `metaId`.

### Cenário 4 — Vincular meta existente
**Quando** `POST /api/planejamento-compra/:id/vincular-meta` com `{ metaId }`,  
**Então** vincula se meta ATIVA/PAUSADA; opcional `ajustarMetaValor` alinha valorAlvo ao item.

### Cenário 5 — Marcar comprado
**Quando** `POST /api/planejamento-compra/:id/comprar`,  
**Então** status COMPRADO, cria transação DESPESA categoria "Compras", vincula `transacaoId`; se meta vinculada → CONCLUIDA.  
* Item já comprado → `400`  
* Item comprado não editável

### Cenário 6 — Editar item desejado
**Quando** `PATCH /api/planejamento-compra/:id` com `{ parcelas: 24 }`,  
**Então** recalcula comprometimento no response.  
* Item COMPRADO → `400`

### Cenário 7 — Resolver imagem preview
**Quando** `POST /api/planejamento-compra/resolver-imagem` com `{ nome, linkProduto }`,  
**Então** retorna URL resolvida via `purchaseItemImageService` (OG tags / busca).

### Cenário 8 — Upload imagem
**Quando** `POST /api/planejamento-compra/:id/imagem` multipart,  
**Então** armazena via `purchaseItemImageStorageService`, atualiza `imagemUrl`.

---

## 🛠️ Implementação (o que foi feito)

### purchasePlanningController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/purchasePlanningController.js`

* `listar()` → `GET /api/planejamento-compra`
* `criar()` → `POST /api/planejamento-compra`
* `editar()` → `PATCH /api/planejamento-compra/:id`
* `excluir()` → `DELETE /api/planejamento-compra/:id`
* `vincularMeta()` → `POST /api/planejamento-compra/:id/vincular-meta`
* `desvincularMeta()` → `DELETE /api/planejamento-compra/:id/vincular-meta`
* `comprar()` → `POST /api/planejamento-compra/:id/comprar`
* `resolverImagem()` → `POST /api/planejamento-compra/resolver-imagem`
* `enviarImagem()` → `POST /api/planejamento-compra/:id/imagem`

---

### purchasePlanningService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/purchasePlanningService.js`

→ `listarPainel(usuarioId)` — itens desejados + comprados recentes + resumo  
→ `montarContexto(usuarioId)` / `calcularSobraMensal` — média sobra 3 meses + renda planejada  
→ `montarResumo` — totalValor, mediaImpactoRenda, categorias, dicas do dia  
→ `criarItem`, `editarItem`, `excluirItem`  
→ `resolverMeta(usuarioId, dados)` — link metaId ou criarMeta inline  
→ `vincularMeta`, `desvincularMeta`  
→ `marcarComprado` — transação DESPESA + concluir meta vinculada  
→ `obterImagemUrl` / `resolverImagemPreview` / `enviarImagemItem`  
→ `inferirCategoria(nome)` via regex em `purchasePlanningUtils`  

---

### purchasePlanningRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/purchasePlanningRepository.js`

→ `listarDesejados`, `listarComprados(usuarioId, limite)`  
→ `contarPorCategoria(usuarioId)`  
→ `buscarPorId`, `criar`, `atualizar`, `excluir`

---

### purchasePlanningSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/purchasePlanningSchemas.js`

→ `criarItemSchema`, `editarItemSchema`, `itemIdParamSchema`  
→ `vincularMetaSchema` (metaId | criarMeta | ajustarMetaValor)  
→ `comprarItemSchema` (categoriaId?, recurso?)  
→ `resolverImagemSchema`

---

### purchasePlanningUtils.js / purchasePlanningMapper.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/utils/purchasePlanningUtils.js`, `purchasePlanningMapper.js`

→ `calcComprometimento(valor, parcelas, renda)` — parcela, percentual, nivel (saudavel/atencao/arriscado)  
→ `inferirCategoria(nome)` — ELETRONICOS, VEICULO, VESTUARIO, etc.  
→ `CATEGORIA_LABELS`, `DICAS`, `selecionarDicasDoDia`  
→ `mapItem(item, contexto)` — inclui comprometimento, mesesParaComprar  
→ `mapItemComprado(item)`

---

### purchaseItemImageService.js / purchaseItemImageStorageService.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/services/purchaseItemImageService.js`, `purchaseItemImageStorageService.js`

→ `resolvePurchaseItemImage({ nome, imagemUrl, linkProduto, buscarNaInternet })`  
→ `storePurchaseItemImage(itemId, file)` — storage local/uploads

---

### purchaseItemImageUploadMiddleware.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/middlewares/purchaseItemImageUploadMiddleware.js`

→ `handlePurchaseItemImageUpload` — multer validação tipo/tamanho

---

### purchasePlanningRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/purchasePlanningRoutes.js`  
**Base URL:** `/api/planejamento-compra`

| Method | Path | Handler |
|--------|------|---------|
| GET | `/` | `listar` |
| POST | `/resolver-imagem` | `resolverImagem` |
| POST | `/` | `criar` |
| PATCH | `/:id` | `editar` |
| DELETE | `/:id` | `excluir` |
| POST | `/:id/vincular-meta` | `vincularMeta` |
| DELETE | `/:id/vincular-meta` | `desvincularMeta` |
| POST | `/:id/comprar` | `comprar` |
| POST | `/:id/imagem` | `enviarImagem` |

---

## 🚫 Regras de Negócio (Backend)

* Nome obrigatório, max 120 chars, capitalizado
* Valor estimado > 0
* Parcelas clamp 1–48
* Categoria inferida por regex no nome se omitida
* Item COMPRADO: imutável (não editar, não upload imagem)
* Comprar: cria DESPESA categoria "Compras" (busca por nome) ou categoriaId informado
* Meta vinculável: status ATIVA ou PAUSADA
* Criar meta inline: prazo obrigatório, valorAlvo default = valorEstimado
* Comprar com meta: auto-conclui meta (status CONCLUIDA)
* Sobra mensal: média (receitas - despesas) últimos 3 meses
* Comprometimento: parcela/renda — saudável ≤20%, atenção ≤30%, arriscado >30%

---

# [STORY FRONTEND] Planejamento de Compra — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Planejamento de Compra

---

## 📝 Descrição

**Como usuário**, quero planejar compras desejadas em `/purchase-planning` com simulação financeira e vínculo opcional a metas.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Painel inicial
**Dado** usuário em `/purchase-planning`,  
**Quando** página carrega,  
**Então** exibe cards itens por prioridade, sidebar com sobra renda, gauge parcelas e donut categorias.

### Cenário 2 — Criar item
**Quando** abre `PurchaseItemFormModal` e salva item válido,  
**Então** item aparece na lista; imagem resolvida se link/auto-busca; toast sucesso.

### Cenário 3 — Vincular meta
**Quando** abre `LinkGoalModal` e escolhe meta existente ou cria nova (`GoalLinkModeToggle`),  
**Então** item exibe badge meta vinculada.

### Cenário 4 — Simular parcelas
**Quando** altera parcelas no form (1–48),  
**Então** gauge sidebar e card atualizam % renda comprometida.

### Cenário 5 — Marcar comprado
**Quando** confirma compra em modal,  
**Então** item vai para histórico recente; transação criada; meta concluída se vinculada.

### Cenário 6 — Upload imagem
**Quando** seleciona arquivo em `PurchaseItemImagePicker`,  
**Então** envia multipart após save; preview atualizado.

---

## 🛠️ Implementação (o que foi feito)

### purchasePlanningService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/purchasePlanningService.js`

→ `listarPainel()` · `criarItem(payload)` · `editarItem(id, payload)` · `excluirItem(id)`  
→ `vincularMeta(id, payload)` · `desvincularMeta(id)` · `marcarComprado(id, payload)`  
→ `resolverImagem(payload)` · `enviarImagemItem(id, file)`

---

### PurchasePlanningPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/PurchasePlanningPage.jsx`  
**Rota:** `/purchase-planning`

Orquestra: painel load, CRUD modals, link meta, comprar, delete, upload imagem pós-save.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/purchase-planning/`

| Componente | Responsabilidade |
|------------|------------------|
| `PurchaseItemCard.jsx` | Card item — prioridade, gauge, ações |
| `PurchaseItemFormModal.jsx` | Criar/editar — parcelas, imagem, meta inline |
| `PurchasePlanningSidebar.jsx` | Sobra renda, alertas, resumo |
| `PurchaseInstallmentGauge.jsx` | Gauge % renda comprometida |
| `PurchaseCategoryDonut.jsx` | Donut distribuição categorias |
| `PurchasePlanningAlert.jsx` | Alertas financeiros contextuais |
| `LinkGoalModal.jsx` | Vincular meta existente |
| `GoalLinkModeToggle.jsx` | Toggle link existente / criar nova |
| `PurchaseItemImagePicker.jsx` | URL / upload / preview imagem |
| `PurchaseHistoryModal.jsx` | Histórico compras recentes |
| `PurchaseRecentTable.jsx` | Tabela comprados recentes |

---

### Utils e estilos (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/purchasePlanningUtils.js` | Helpers client-side (labels, formatação) |
| `web/src/styles/purchase-planning.css` | Estilos módulo |

---

### Rotas e navegação (EXISTENTE — IMPLEMENTADO)

**`web/src/config/appRoutes.js`:** `/purchase-planning` → `PurchasePlanningPage`  
**`web/src/config/sidebarNavigation.js`:** `{ id: 'compra', label: 'Planejamento de Compra', path: '/purchase-planning', icon: 'ShoppingCart' }`

---

### Cross-module (EXISTENTE — IMPLEMENTADO)

* `PurchaseItemFormModal.jsx` — importa `metaService.buscarMetas` para seleção meta
* Epic Metas — `LinkGoalModal` compartilhado; comprar conclui meta vinculada

---

### Endpoints consumidos

* `GET /api/planejamento-compra`
* `POST /api/planejamento-compra` · `PATCH /:id` · `DELETE /:id`
* `POST /:id/vincular-meta` · `DELETE /:id/vincular-meta`
* `POST /:id/comprar` · `POST /resolver-imagem` · `POST /:id/imagem`

---

## 📚 Documentação · Histórico

- [PO M18](../../Documentacao/03-Auditorias/Product Owner/18-Planejamento-de-Compra.md)

| Data | Evento |
|------|--------|
| jun/2026 | Migration `20260620140000_planejamento_compra` |
| jul/2026 | Frontend `/purchase-planning` + imagem produto |
| jul/2026 | Reorganização categorias `20260707220214` |
| ago/2026 | Auditoria PO M18 + doc fluxo item→meta (RN-062) |
