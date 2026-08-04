# [EPIC] Viagens e Moedas

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M05  
> **Correções PO:** `@unique(metaId)` viagem↔meta, doc 10 categorias pretensão (RN-074)  
> **Refs:** RF-033–043 · [PO M05](../../Documentacao/03-Auditorias/Product Owner/05-Viagens-e-Moedas.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Viagens, Moedas, Integrações, Frontend, Backend  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Planejamento de viagens pessoais com destino (GeoNames + catálogo interno), moeda do destino, **pretensões** por categoria (10 tipos), conversão BRL, cotações em tempo real, moedas favoritas, capas Wikimedia, estimativas de passagem (Duffel → Amadeus → heurística), observações/checklists, e vínculo opcional com meta financeira.

### 🎯 Objetivos do Epic

- ✅ CRUD viagens pessoais (`/trips`, `/trips/:id`)
- ✅ Busca de destinos + origens brasileiras
- ✅ Pretensões (despesas estimadas) e observações por viagem
- ✅ Módulo moedas: catálogo, cotações, conversor, histórico, favoritas (max 8)
- ✅ Estimativa passagem round-trip (7 dias) com bus/trem insights
- ✅ Vínculo 1:1 com meta (`Viagem.metaId` @unique)
- ✅ Extensão grupo via `ViagemGrupo` (epic Grupos)

### 🎭 Telas e Fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/trips` | Lista de viagens | Cards com total BRL, conversor rápido, favoritas, gráfico câmbio |
| `/trips/:id` | Detalhe da viagem | Capa, pretensões CRUD, observações, meta vinculada, insights passagem |

---

## 🗄️ Modelo de Dados (Resumo)

| Model | Campos-chave |
|-------|--------------|
| `Viagem` | `destino`, `destinoMeta` (JSON capa/coords), `moeda`, `dataPrevista`, `metaId?` @unique |
| `DespesaViagem` | `categoria` (enum 10), `valorEstimado`, `descricao?`, `categoriaId?` |
| `ObservacaoViagem` | `titulo`, `conteudo?`, `tipo`, `linkUrl?`, `checklist` (JSON) |
| `MoedaFavorita` | `usuarioId` + `codigo` @unique |

**Enum `CategoriaDespesaViagem`:** TRANSPORTE, HOSPEDAGEM, ALIMENTACAO, PASSEIOS, COMPRAS, DOCUMENTACAO, SAUDE, EMERGENCIAS, ENTRETENIMENTO, OUTROS

**Enum `TipoObservacaoViagem`:** GERAL, CHECKLIST, LINK, DICA, DOCUMENTOS

---

## 🔗 Integrações externas

| Provider | Uso | Cache |
|----------|-----|-------|
| AwesomeAPI | Cotações + histórico | 5 min memória |
| GeoNames | Busca destinos | 15 min |
| Duffel | Preços voo (primário) | 6 h |
| Amadeus | Preços voo (fallback) | 6 h + OAuth |
| Wikimedia/Wikipedia | Capa destino | Persistido em `destinoMeta` |

**Cross-module:** `Meta.metaId` ← `Viagem.metaId` (1:1) · `ViagemGrupo` no epic Grupos

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (`Viagem`, `DespesaViagem`, `ObservacaoViagem`, `MoedaFavorita`), 5 migrations |
| Backend viagens | ✅ | `viagemRoutes.js`, `viagemController.js`, `viagemService.js`, `viagemRepository.js`, `viagemSchemas.js`, `viagemMapper.js`, `tripFlightPriceService.js`, `tripDestinationResolver.js`, `tripDestinationImageService.js` |
| Backend moedas | ✅ | `moedaRoutes.js`, `moedaController.js`, `moedaService.js`, `moedaFavoritaRepository.js`, `moedaSchemas.js`, `awesomeApiProvider.js`, `currencyCatalog.js` |
| Frontend | ✅ | `TripsPage.jsx`, `TripDetailPage.jsx`, 24 componentes em `features/trips/`, `viagemService.js`, `moedaService.js`, `styles/trips.css` |
| Testes API | 🟡 | `moedaService.test.js`, `tripFlightPriceService.test.js`, `tripDestinationResolver.test.js`, `tripDestinationImageService.test.js`, providers/constants — **sem** `viagemService.test.js` |
| Testes Web | 🟡 | `tripsPage.test.jsx`, utils de destino — **sem** `viagemService.test.js` / `moedaService.test.js` |

**Registro rotas:** `Codigo/Pulso/api/src/routes/index.js` → `/viagens`, `/moedas`

---

## 🔧 Correções PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RN-074 | 10 categorias pretensão documentadas | `web/src/utils/tripExpenseCategories.js`, `api/src/constants/` |
| Unicidade meta↔viagem | Migration `20260804130000` — P2002 → 409 | `viagemService.validarMetaVinculo` |

---

## ⏳ Pendências

- [ ] `viagemService.test.js` dedicado (CRUD + meta link + pretensões)
- [ ] Cache cotações compartilhado (Redis/Upstash) — hoje memória por instância
- [ ] Capa síncrona no create — considerar async/background job
- [ ] `TripDetailModal.jsx` legado (detail em página dedicada `/trips/:id`)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Criar viagem com destino da lista, moeda suportada, data futura  
→ Adicionar pretensões por categoria; total BRL calculado  
→ Converter valores BRL ↔ moeda estrangeira  
→ Favoritar até 8 moedas; defaults seed USD/EUR/GBP/ARS  
→ Obter estimativa passagem com origem persistida (localStorage)  
→ Vincular meta existente (1:1); duplicata → 409  
→ Capa destino via Wikimedia persistida em `destinoMeta`

---

# [STORY DATABASE] Viagens e Moedas — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Viagens e Moedas

---

## 📝 Descrição

**Como sistema**, quero persistir viagens, pretensões, observações e moedas favoritas, para suportar planejamento de viagem com conversão cambial e vínculo opcional com meta financeira.

---

## 🗄️ Migrations Prisma

| Migration | Conteúdo |
|-----------|----------|
| `20260616120000_viagens` | Tabelas `viagens`, `despesas_viagem`, `moedas_favoritas` |
| `20260609180000_trip_expense_categories` | Enum `CategoriaDespesaViagem` (10 valores) |
| `20260609190000_viagem_observacoes` | Tabela `observacoes_viagem` + enum `TipoObservacaoViagem` |
| `20260617130000_viagem_destino_meta` | Coluna JSONB `destino_meta` em viagens |
| `20260804130000_viagem_meta_id_unique` | FK `meta_id` + `@@unique([metaId])` |

---

## 📊 Modelo Prisma (resumo)

| Model | Campos-chave |
|-------|--------------|
| `Viagem` | `usuarioId`, `destino`, `destinoMeta?`, `moeda`, `dataPrevista`, `metaId?` @unique |
| `DespesaViagem` | `viagemId`, `categoria`, `valorEstimado`, `descricao?` |
| `ObservacaoViagem` | `viagemId`, `titulo`, `conteudo?`, `tipo`, `linkUrl?`, `checklist?` (JSON) |
| `MoedaFavorita` | `usuarioId`, `codigo` — unique `(usuarioId, codigo)` |

**Relações:** `Usuario` 1:N `Viagem` · `Viagem` 1:N `DespesaViagem` · `Viagem` 1:N `ObservacaoViagem` · `Meta` 1:1 `Viagem` (via `metaId`)

---

## ✅ Critérios de Aceite (Database)

→ Enum `CategoriaDespesaViagem` com 10 categorias (RN-074)  
→ Enum `TipoObservacaoViagem` com 5 tipos  
→ Tabela `viagens` com índice `(usuario_id, data_prevista)`  
→ `destino_meta` JSONB para capa Wikimedia + coords/hub IATA  
→ `meta_id` unique — uma meta vinculada a no máximo uma viagem  
→ Tabela `moedas_favoritas` com unique por usuário+código  

---

# [STORY BACKEND] Viagens e Moedas — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Viagens e Moedas

---

## 📝 Descrição

**Como sistema backend**, quero fornecer APIs REST para CRUD de viagens (pretensões, observações), cotações/conversão de moedas, busca de destinos e estimativa de passagem, integrando AwesomeAPI, GeoNames, Duffel, Amadeus e Wikimedia.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Criar viagem
**Dado** usuário autenticado,  
**Quando** `POST /api/viagens` com `{ destino, moeda, dataPrevista }`,  
**Então** retorna `201` com viagem criada, destino resolvido (GeoNames/catálogo), capa em `destinoMeta`, data futura validada.  
* Moeda fora do catálogo → `400` · Data passada → `400` · Meta já vinculada → `409`

### Cenário 2 — Vincular meta (1:1)
**Dado** meta ATIVA do usuário sem viagem vinculada,  
**Quando** `PATCH /api/viagens/:id` com `{ metaId }`,  
**Então** retorna `200` com `metaId` preenchido.  
* Meta de outro usuário → `403` · Meta já em outra viagem → `409`

### Cenário 3 — CRUD pretensão
**Dado** viagem existente,  
**Quando** `POST /api/viagens/:id/despesas` com `{ categoria, valorEstimado }`,  
**Então** retorna `200` com viagem atualizada e `totalBrl` recalculado.  
* Categoria inválida → `400` · Valor ≤ 0 → `400` · Viagem de outro usuário → `403`

### Cenário 4 — Listar cotações e converter
**Quando** `GET /api/moedas/cotacoes?codigos=USD,EUR`,  
**Então** retorna `200` com taxas BRL hub via AwesomeAPI (cache 5 min).  
**Quando** `GET /api/moedas/converter?valor=100&de=BRL&para=USD`,  
**Então** retorna `200` com valor convertido.  
* Provider indisponível → `502`

### Cenário 5 — Favoritas (max 8)
**Dado** usuário com 8 favoritas,  
**Quando** `POST /api/moedas/favoritas` com nova moeda,  
**Então** retorna `400` limite atingido.  
**Quando** `GET /api/moedas/favoritas` e lista vazia,  
**Então** seed automático USD/EUR/GBP/ARS via `garantirFavoritasPadrao`.

### Cenário 6 — Estimativa passagem
**Dado** viagem com destino resolvido,  
**Quando** `GET /api/viagens/:id/media-passagem?origemId=GRU`,  
**Então** retorna `200` com cascade Duffel → Amadeus → heurística + ajuste sazonal + insights ônibus/trem.

### Cenário 7 — Busca destinos
**Quando** `GET /api/viagens/destinos?q=Paris&limite=10`,  
**Então** retorna `200` com resultados GeoNames (ou catálogo fallback se sem credenciais).

### Cenário 8 — Excluir viagem
**Quando** `DELETE /api/viagens/:id`,  
**Então** retorna `204`; cascade remove despesas e observações; `metaId` set null.

---

## 🛠️ Implementação (o que foi feito)

### viagemController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/viagemController.js`

**Métodos:**

* `listar()` → `GET /api/viagens`
* `obterResumo()` → `GET /api/viagens/resumo`
* `listarOrigensViagem()` → `GET /api/viagens/origens`
* `listarDestinosViagem()` → `GET /api/viagens/destinos`
* `obter()` → `GET /api/viagens/:id`
* `obterMediaPassagem()` → `GET /api/viagens/:id/media-passagem`
* `criar()` → `POST /api/viagens` — `201`
* `editar()` → `PATCH /api/viagens/:id`
* `excluir()` → `DELETE /api/viagens/:id` — `204`
* `criarDespesa()` → `POST /api/viagens/:id/despesas`
* `editarDespesa()` → `PATCH /api/viagens/:id/despesas/:despesaId`
* `excluirDespesa()` → `DELETE /api/viagens/:id/despesas/:despesaId`
* `criarObservacao()` → `POST /api/viagens/:id/observacoes`
* `editarObservacao()` → `PATCH /api/viagens/:id/observacoes/:observacaoId`
* `excluirObservacao()` → `DELETE /api/viagens/:id/observacoes/:observacaoId`

---

### viagemService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/viagemService.js`

**Lógica de negócio:**

→ `listarViagens(usuarioId)` — lista + hydrate capa ausente + `mapViagem`  
→ `obterViagem(usuarioId, id)` — 404 guard + hydrate capa  
→ `obterResumoPagina(usuarioId)` — count + soma `totalBrl`  
→ `criarViagem(usuarioId, dados)` — resolve destino, valida moeda/data/meta, attach capa  
→ `editarViagem(usuarioId, id, dados)` — update parcial com revalidação  
→ `excluirViagem(usuarioId, id)` — delete cascade  
→ `criarDespesa` / `editarDespesa` / `excluirDespesa` — enum 10 categorias, valor > 0  
→ `criarObservacao` / `editarObservacao` / `excluirObservacao` — título obrigatório, URL validada, checklist JSON  
→ `obterMediaPassagem(usuarioId, id, { origemId })` — delega `tripFlightPriceService`  
→ `listarOrigensViagem()` — catálogo estático `tripOrigins`  
→ `listarDestinosViagem({ q, limite })` — GeoNames ou catálogo interno  
→ `obterCotacaoMoeda(codigo)` — taxa única via AwesomeAPI  

**Export:** `CATEGORIAS_DESPESA` (array enum)

**Helpers internos:** `validarMetaVinculo`, `validarDataFutura`, `validarMoeda`, `resolverDestinoPayload`, `hydrateCoverImage`

---

### viagemRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/viagemRepository.js`

→ `listarPorUsuario` · `buscarPorId` · `buscarPorMetaId` · `criar` · `atualizar` · `excluir`  
→ `criarDespesa` · `buscarDespesa` · `atualizarDespesa` · `excluirDespesa`  
→ `criarObservacao` · `buscarObservacao` · `atualizarObservacao` · `excluirObservacao`

---

### moedaController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/moedaController.js`

* `obterCatalogo()` → `GET /api/moedas/catalogo`
* `listarCotacoes()` → `GET /api/moedas/cotacoes`
* `converter()` → `GET /api/moedas/converter`
* `obterHistorico()` → `GET /api/moedas/historico`
* `listarFavoritas()` → `GET /api/moedas/favoritas`
* `adicionarFavorita()` → `POST /api/moedas/favoritas`
* `removerFavorita()` → `DELETE /api/moedas/favoritas/:codigo`

---

### moedaService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/moedaService.js`

→ `listarCotacoes({ codigos })` — catálogo + AwesomeAPI  
→ `converter({ valor, de, para })` — hub BRL, shortcut mesma moeda  
→ `obterHistorico({ codigo, dias })` — 7–90 dias, merge taxa live hoje  
→ `listarFavoritas(usuarioId)` — favoritas + cotações live  
→ `adicionarFavorita(usuarioId, codigo)` — max 8, 409 duplicata  
→ `removerFavorita(usuarioId, codigo)` — delete + re-list  
→ `garantirFavoritasPadrao(usuarioId)` — seed USD/EUR/GBP/ARS  
→ `obterCatalogo()` — lista moedas suportadas

---

### tripFlightPriceService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/tripFlightPriceService.js`

→ `obterMediaPassagem({ origemId, destinoMeta, dataPrevista })` — Duffel → Amadeus → heurística + sazonal + bus/trem  
→ `obterMediaPassagemPorViagem(viagem, { origemId })` — wrapper com campos da viagem

---

### tripDestinationResolver.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/tripDestinationResolver.js`

→ `resolveFromGeoNamesPlace` · `resolveFromCatalogId` · `buildAirportEntryFromResolved`  
→ `formatDestinoLabel` · `formatDestinationSubtitle` · `shouldIncludeRegion`

---

### tripDestinationImageService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/tripDestinationImageService.js`

→ `resolveTripCoverImage` — Wikipedia + Wikimedia Commons  
→ `attachCoverImage` — enriquece `destinoMeta.coverImageUrl`

---

### viagemSchemas.js / moedaSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/schemas/viagemSchemas.js`, `moedaSchemas.js`

**Viagem:** `criarViagemSchema`, `editarViagemSchema`, `viagemIdParamSchema`, `despesaBodySchema`, `editarDespesaSchema`, `despesaIdParamSchema`, `observacaoBodySchema`, `editarObservacaoSchema`, `observacaoIdParamSchema`, `mediaPassagemQuerySchema`, `destinosQuerySchema`

**Moeda:** `converterQuerySchema`, `historicoQuerySchema`, `cotacoesQuerySchema`, `favoritaBodySchema`, `favoritaParamSchema`

---

### viagemMapper.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/utils/viagemMapper.js`

→ `mapViagem` · `mapDespesa` · `mapObservacao` · `calcTotalDespesas`

---

### Providers e constants (EXISTENTE — IMPLEMENTADO)

| Arquivo | Exports principais |
|---------|-------------------|
| `providers/awesomeApiProvider.js` | `fetchPairs`, `fetchHistory`, `getRatesForCodes`, `CACHE_TTL_MS` (5 min) |
| `providers/geonamesProvider.js` | `hasCredentials`, `searchPlaces`, `getPlace` |
| `providers/duffelProvider.js` | `hasCredentials`, `fetchAverageRoundTripPrice` |
| `providers/amadeusProvider.js` | `hasCredentials`, `fetchAverageRoundTripPrice` |
| `constants/currencyCatalog.js` | `getSupportedCurrencies`, `isSupportedCurrency`, `DEFAULT_FAVORITES` |
| `constants/tripOrigins.js` | `TRIP_ORIGINS`, `resolveTripOrigin`, `listTripOrigins` |
| `constants/tripDestinationsCatalog.js` | `searchTripDestinations`, `getCatalogEntry`, `buildDestinoMetaFromCatalog` |
| `constants/tripTransportRoutes.js` | `getFlightFallback`, `getBusRouteEstimate`, `getTrainRouteEstimate` |
| `constants/tripSeasonalPricing.js` | `getSeasonalAdjustment`, `applySeasonalPrice` |
| `repositories/moedaFavoritaRepository.js` | `listarPorUsuario`, `criar`, `excluir`, `contarPorUsuario` |

---

### viagemRoutes.js / moedaRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivos:** `Codigo/Pulso/api/src/routes/viagemRoutes.js`, `moedaRoutes.js`  
**Registro:** `routes/index.js` → `/viagens`, `/moedas` (auth middleware)

---

## 🧪 Arquivos de teste (Backend)

| Arquivo | Cobertura |
|---------|-----------|
| `api/tests/unit/services/moedaService.test.js` | Conversão, favoritas, catálogo |
| `api/tests/unit/services/tripFlightPriceService.test.js` | Cascade pricing, fallbacks |
| `api/tests/unit/services/tripDestinationResolver.test.js` | GeoNames → destinoMeta |
| `api/tests/unit/services/tripDestinationImageService.test.js` | Wikimedia lookup |
| `api/tests/unit/providers/geonamesProvider.test.js` | Search places |
| `api/tests/unit/providers/duffelProvider.test.js` | Duffel API mock |
| `api/tests/unit/constants/tripDestinationsCatalog.test.js` | Catálogo destinos |
| `api/tests/unit/constants/tripSeasonalPricing.test.js` | Ajuste sazonal |
| `api/tests/unit/constants/tripTransportRoutes.test.js` | Heurísticas bus/trem |

**Gap:** `viagemService.test.js`, `viagemController.test.js`, `awesomeApiProvider.test.js`

---

## 🚫 Regras de Negócio (Backend)

* Data prevista deve ser futura
* Moeda deve estar no catálogo suportado (`currencyCatalog`)
* Meta vínculo 1:1 — P2002 → 409 "Meta já vinculada a outra viagem"
* Pretensão: categoria enum 10 tipos, `valorEstimado > 0`
* Observação: `titulo` obrigatório; `linkUrl` http/https; tipo inferido (GERAL/CHECKLIST/LINK)
* Favoritas: máximo 8 por usuário; seed USD/EUR/GBP/ARS na 1ª listagem
* Cotações: hub BRL; cache memória 5 min (AwesomeAPI)
* Passagem: round-trip 7 dias; cascade Duffel → Amadeus → heurística regional

---

# [STORY FRONTEND] Viagens e Moedas — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Viagens e Moedas

---

## 📝 Descrição

**Como usuário**, quero planejar viagens em `/trips` com conversor cambial, favoritas e gráfico histórico, e gerenciar pretensões/observações no detalhe `/trips/:id`.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Lista de viagens
**Dado** usuário em `/trips`,  
**Quando** página carrega,  
**Então** exibe cards com destino, data, total BRL, progresso meta (se vinculada), conversor rápido, favoritas e gráfico câmbio.

### Cenário 2 — Criar viagem
**Quando** abre `TripFormModal` e seleciona destino + moeda + data + meta opcional,  
**Então** viagem aparece na lista; capa lazy-hydrate no card.

### Cenário 3 — Detalhe pretensões
**Dado** usuário em `/trips/:id`,  
**Quando** adiciona pretensão via `TripExpenseFormModal`,  
**Então** tabela atualiza com badge categoria colorido e total BRL recalculado.

### Cenário 4 — Observações checklist/link
**Quando** cria observação tipo checklist ou link,  
**Então** `TripDetailObservationsSection` exibe badges e itens interativos.

### Cenário 5 — Conversor e favoritas
**Quando** usa `TripQuickConverter` BRL ↔ moeda,  
**Então** chama `GET /api/moedas/converter` e exibe resultado formatado.  
**Quando** adiciona favorita via `AddFavoriteCurrencyModal`,  
**Então** carousel `TripFavoriteCurrencies` atualiza (max 8).

### Cenário 6 — Insights passagem
**Quando** seleciona origem em `TripOriginPicker` (persiste `tripOriginStorage`),  
**Então** `TripTransportPriceInsights` exibe voo/ônibus/trem com chips sazonais.

---

## 🛠️ Implementação (o que foi feito)

### viagemService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/viagemService.js`

→ `listarViagens` · `buscarViagem` · `obterResumo` · `criarViagem` · `editarViagem` · `excluirViagem`  
→ `listarOrigensViagem` · `listarDestinosViagem` · `obterMediaPassagem`  
→ `criarDespesa` · `editarDespesa` · `excluirDespesa`  
→ `criarObservacao` · `editarObservacao` · `excluirObservacao`

---

### moedaService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/moedaService.js`

→ `obterCatalogo` · `listarCotacoes` · `converterMoeda` · `obterHistorico`  
→ `listarFavoritas` · `adicionarFavorita` · `removerFavorita`

---

### TripsPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/TripsPage.jsx`  
**Rota:** `/trips` (ProtectedRoute + MainLayout)

Orquestra: `TripList`, `TripQuickConverter`, `TripFavoriteCurrencies`, `TripExchangeChart`, `TripFormModal`, resumo API.

---

### TripDetailPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/TripDetailPage.jsx`  
**Rota:** `/trips/:id`

Orquestra: `TripDetailExpensesSection`, `TripDetailObservationsSection`, `TripDetailSummarySidebar`, `TripDetailGoalCard`, modais CRUD/delete.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/trips/`

| Componente | Responsabilidade |
|------------|------------------|
| `TripList.jsx` | Lista cards ou empty/loading |
| `TripCard.jsx` | Card resumo: data, total BRL, meta, ações |
| `TripFormModal.jsx` | Criar/editar viagem (destino, moeda, data, meta) |
| `TripDetailModal.jsx` | Modal legado (não usado — detail em página) |
| `TripExpenseFormModal.jsx` | CRUD pretensão por categoria |
| `TripObservationFormModal.jsx` | CRUD observação (checklist/link) |
| `DeleteTripModal.jsx` | Confirmar exclusão viagem |
| `DeleteTripExpenseModal.jsx` | Confirmar exclusão pretensão |
| `DeleteTripObservationModal.jsx` | Confirmar exclusão observação |
| `TripQuickConverter.jsx` | Widget conversor BRL ↔ moeda |
| `TripFavoriteCurrencies.jsx` | Carousel taxas favoritas |
| `TripExchangeChart.jsx` | Gráfico histórico câmbio (area chart) |
| `AddFavoriteCurrencyModal.jsx` | Adicionar moeda favorita |
| `CurrencyFlag.jsx` | Bandeira + option builder select |
| `CurrencySearchPicker.jsx` | Picker moeda com busca |
| `DestinationSearchPicker.jsx` | Autocomplete destino (API GeoNames/catálogo) |
| `TripDestinationTitle.jsx` | Título formatado cidade + país |
| **detail/** | |
| `TripDetailExpensesSection.jsx` | Tabela pretensões CRUD |
| `TripDetailObservationsSection.jsx` | Lista observações com badges |
| `TripDetailSummarySidebar.jsx` | Totais, breakdown categoria, origem, insights |
| `TripDetailGoalCard.jsx` | Progresso meta vinculada |
| `TripDetailCategoryBadge.jsx` | Badge ícone/cor categoria |
| `TripOriginPicker.jsx` | Seletor cidade origem (passagem) |
| `TripTransportPriceInsights.jsx` | Cards preço voo/ônibus/trem |

**Estilos:** `Codigo/Pulso/web/src/styles/trips.css`

---

### Utils (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/tripDetailUtils.js` | `formatTripDetailDate`, `buildCategoryBreakdown`, `calcTripTotalInCurrency` |
| `web/src/utils/tripExpenseCategories.js` | `TRIP_EXPENSE_CATEGORIES` (10), cores, ícones (RN-074) |
| `web/src/utils/tripOriginStorage.js` | `getSavedTripOriginId`, `saveTripOriginId` (localStorage) |
| `web/src/utils/tripDestinationDisplay.js` | Labels destino para UI |
| `web/src/utils/tripObservationTypes.js` | Labels tipos observação |

---

### Rotas App.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/App.jsx`

```jsx
<Route path="trips" element={<TripsPage />} />
<Route path="trips/:id" element={<TripDetailPage />} />
```

Sidebar: `web/src/config/sidebarNavigation.js` → `{ path: '/trips', label: 'Viagens' }`

---

## 🧪 Arquivos de teste (Frontend)

| Arquivo | Cobertura |
|---------|-----------|
| `web/tests/unit/pages/tripsPage.test.jsx` | Render lista, modais |
| `web/tests/unit/utils/tripDestinationDisplay.test.js` | Labels destino |
| `web/tests/unit/utils/tripDestinationImages.test.js` | URLs capa |

**Gap:** `viagemService.test.js`, `moedaService.test.js`, `TripDetailPage` tests

---

## 📚 Documentação

- [PO M05](../../Documentacao/03-Auditorias/Product Owner/05-Viagens-e-Moedas.md)
- [API Readme](../../Documentacao/02-Engenharia/API/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| jun/2026 | Migrations viagens + observações + destinoMeta |
| jul/2026 | Frontend `/trips` + módulo moedas entregue |
| ago/2026 | Constraint `@unique(metaId)` + auditoria PO M05 |
