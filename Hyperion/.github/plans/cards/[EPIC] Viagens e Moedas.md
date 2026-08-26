# [EPIC] Viagens e Moedas — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-005 | Viagens e Moedas |
| Feature | PULSO-FEAT-023 | Backend — API de moedas |
| Feature | PULSO-FEAT-024 | Backend — API de viagens |
| Feature | PULSO-FEAT-025 | Pretensões e observações de viagem |
| Feature | PULSO-FEAT-026 | Destinos, capas e estimativa de passagem |
| Feature | PULSO-FEAT-027 | Frontend — página viagens e moedas |
| Feature | PULSO-FEAT-028 | Frontend — detalhe da viagem |
| Feature | PULSO-FEAT-029 | QA — testes de viagens e moedas |
| Task | PULSO-TASK-049–060 | DB, moedas, viagens, frontend, QA |

---

---
card_id: PULSO-EPIC-005
title: "Viagens e Moedas"
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

# [EPIC] Viagens e Moedas

> **Contexto:** Planejamento de viagens com pretensões de gasto por categoria, conversor e cotações de moedas, histórico de câmbio, favoritas, busca de destinos (GeoNames + catálogo), capas de destino e estimativas de passagem; vínculo 1:1 com meta financeira.

**Refs:** RF-033–043 · RN-069–074

## 🎯 Objetivos

- Cotações atualizadas via AwesomeAPI/Frankfurter com cache 5 min (RF-033, RN-071)
- Conversor BRL ↔ moedas suportadas, inclusive par cruzado (RF-034)
- Gráfico de histórico de cotação com ponto ao vivo de hoje (RF-035)
- Moedas favoritas (até 8) com seed padrão USD/EUR/GBP (RF-036)
- CRUD de viagens pessoais: destino, moeda, data prevista, múltiplas simultâneas (RF-037, RF-042)
- Pretensões por 10 categorias (RN-074); total somado (RN-069); conversão BRL na UI (RF-039–040, RN-070)
- Observações com checklist, links e tipos (GERAL, CHECKLIST, LINK, DICA, DOCUMENTOS)
- Resolução de destino: GeoNames, catálogo BR/internacional, aeroportos IATA
- Capa de destino via Wikipedia/Commons no criar/editar (não no GET list)
- Estimativa de passagem avião/ônibus/trem com ajuste sazonal (Duffel/Amadeus opcionais + fallback)
- Vínculo viagem ↔ meta 1:1 com `@unique` em `metaId` (RF-043, RN-072, RN-073)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/trips` | Viagens e Moedas | Conversor rápido, favoritas, gráfico câmbio, lista viagens |
| `/trips/:id` | Detalhe viagem | Pretensões, observações, meta vinculada, insights transporte |
| Modal | Nova/Editar viagem | DestinationSearchPicker, moeda, data, meta opcional |
| Modal | Pretensão / Observação | CRUD por categoria ou checklist/link |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Metas | `metaId` 1:1; `TripDetailGoalCard`; criar meta inline na página |
| Grupos | `ViagemGrupo` — epic Grupos (viagem compartilhada) |
| AwesomeAPI | Cotações, conversão, histórico |
| GeoNames | Busca de destinos (`GEONAMES_USERNAME`) |
| Duffel / Amadeus | Preços reais de passagem (opcional, env) |
| Wikipedia/Commons | Capa do destino (`tripDestinationImageService`) |

## 🔗 Sub-issues

- PULSO-FEAT-023
- PULSO-FEAT-024
- PULSO-FEAT-025
- PULSO-FEAT-026
- PULSO-FEAT-027
- PULSO-FEAT-028
- PULSO-FEAT-029

## 📋 Resumo

### ✅ Concluído
- Escopo RF-033–043 e RN-069–074 mapeado
- Hierarquia Epic → 7 Features → 12 Tasks definida
- Contratos API, providers e fluxos UI documentados como spec

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Cache compartilhado de cotações (Redis) — evolução futura T5
- Capa assíncrona na criação — melhoria de performance

---
---
card_id: PULSO-FEAT-023
title: "Backend — API de moedas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Integração Externa
  - Regra de Negócio
---

# [FEATURE] Backend — API de moedas

> **Contexto:** Cotações, conversão, histórico e moedas favoritas via AwesomeAPI.

**Refs:** RF-033 · RF-034 · RF-035 · RF-036 · RN-070 · RN-071

## 📝 Descrição

Expor endpoints autenticados em `/api/moedas` para catálogo, cotações, conversão, histórico e favoritas.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/moedas/catalogo` | Lista moedas suportadas |
| `GET` | `/moedas/cotacoes?codigos=USD,EUR` | Cotações com `bid`, `pctChange`, `updatedAt` |
| `GET` | `/moedas/converter?valor=&de=&para=` | Conversão via BRL ou par cruzado |
| `GET` | `/moedas/historico?codigo=USD&dias=30` | Pontos + resumo min/max/variação |
| `GET` | `/moedas/favoritas` | Favoritas com cotações embutidas |
| `POST` | `/moedas/favoritas` | Adiciona (limite 8, P2002 → 409) |
| `DELETE` | `/moedas/favoritas/:codigo` | Remove favorita |

**Cache:** 5 min por instância em `awesomeApiProvider`

## 🔗 Sub-issues

- PULSO-TASK-049
- PULSO-TASK-050

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e limites definidos

### ⏳ Pendente
- PULSO-TASK-049–050 — persistência favoritas e service/rotas

---
---
card_id: PULSO-FEAT-024
title: "Backend — API de viagens"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de viagens

> **Contexto:** CRUD de viagens pessoais com resolução de destino e vínculo opcional a meta.

**Refs:** RF-037 · RF-042 · RF-043 · RN-072 · RN-073

## 📝 Descrição

Expor endpoints em `/api/viagens` para listar, criar, editar, excluir e obter resumo da página.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/viagens` | Lista viagens do usuário com despesas/observações/meta |
| `GET` | `/viagens/resumo` | `quantidadeViagens`, `totalPlanejadoBrl` |
| `GET` | `/viagens/:id` | Detalhe mapeado |
| `GET` | `/viagens/destinos?q=` | Busca GeoNames ou catálogo local |
| `GET` | `/viagens/origens` | Catálogo de origens BR |
| `POST` | `/viagens` | Cria com data futura, moeda válida, destino resolvido |
| `PATCH` | `/viagens/:id` | Edita parcialmente |
| `DELETE` | `/viagens/:id` | Exclui viagem (204) |

**Meta:** `metaId` único por viagem; conflito → 409

## 🔗 Sub-issues

- PULSO-TASK-049
- PULSO-TASK-051
- PULSO-TASK-052

## 📋 Resumo

### ✅ Concluído
- Contratos e validações de domínio definidos

### ⏳ Pendente
- PULSO-TASK-049–052 — DB, repository, service e rotas

---
---
card_id: PULSO-FEAT-025
title: "Pretensões e observações de viagem"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Pretensões e observações de viagem

> **Contexto:** Gastos estimados por categoria e notas/checklists dentro de cada viagem.

**Refs:** RF-038 · RF-039 · RF-041 · RN-069 · RN-074

## 📝 Descrição

Implementar CRUD de pretensões (despesas) e observações aninhadas em viagens, com total agregado no mapper.

## ✅ Critérios de Aceite

**Pretensões** (`/viagens/:id/despesas`):
- 10 categorias: TRANSPORTE, HOSPEDAGEM, ALIMENTACAO, PASSEIOS, COMPRAS, DOCUMENTACAO, SAUDE, EMERGENCIAS, ENTRETENIMENTO, OUTROS
- `valorEstimado > 0`; retorna viagem atualizada com `totalBrl` (soma RN-069)

**Observações** (`/viagens/:id/observacoes`):
- Título obrigatório; conteúdo opcional; URL validada; checklist JSON normalizado
- Tipo inferido: CHECKLIST, LINK ou GERAL

## 🔗 Sub-issues

- PULSO-TASK-053

## 📋 Resumo

### ✅ Concluído
- Categorias e payloads definidos

### ⏳ Pendente
- PULSO-TASK-053 — despesas e observações backend

---
---
card_id: PULSO-FEAT-026
title: "Destinos, capas e estimativa de passagem"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [FEATURE] Destinos, capas e estimativa de passagem

> **Contexto:** Resolução inteligente de destino, imagem de capa e insights de preço de transporte.

## 📝 Descrição

Implementar pipeline de destino (GeoNames + catálogo + aeroportos), capa Wikipedia/Commons e endpoint de média de passagem.

## ✅ Critérios de Aceite

| Componente | Comportamento |
|------------|---------------|
| `tripDestinationResolver` | Normaliza place GeoNames → `destino` + `destinoMeta` |
| `tripDestinationsCatalog` | Fallback BR/internacional quando GeoNames indisponível |
| `attachCoverImage` | Resolve `coverImageUrl` no criar/editar |
| `GET /viagens/:id/media-passagem?origemId=` | Avião (Duffel/Amadeus/fallback), ônibus, trem + ajuste sazonal |

**Nota:** Listagem GET não hidrata capa (evitar timeout serverless)

## 🔗 Sub-issues

- PULSO-TASK-054

## 📋 Resumo

### ✅ Concluído
- Pipeline de destino e providers documentados

### ⏳ Pendente
- PULSO-TASK-054 — resolver, capas e flight price service

---
---
card_id: PULSO-FEAT-027
title: "Frontend — página viagens e moedas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend — página viagens e moedas

> **Contexto:** Hub `/trips` com conversor, favoritas, gráfico de câmbio e lista de viagens.

**Refs:** RF-033–036 · RF-037 · RF-042

## 📝 Descrição

Implementar página principal integrando widgets de moeda e gestão de viagens com modais de CRUD.

## ✅ Critérios de Aceite

- Rota `/trips` em `App.jsx`
- `TripQuickConverter` — conversão BRL ↔ moeda selecionada
- `TripFavoriteCurrencies` + `AddFavoriteCurrencyModal` (até 8)
- `TripExchangeChart` — histórico RF-035
- `TripList` + `TripCard` com navegação para detalhe
- `TripFormModal` + `DeleteTripModal`
- Criar meta inline via `GoalFormModal` quando necessário
- Timestamp "Atualizado há X min" (RN-071)

## 🔗 Sub-issues

- PULSO-TASK-055
- PULSO-TASK-056

## 📋 Resumo

### ✅ Concluído
- Layout e componentes da página definidos

### ⏳ Pendente
- PULSO-TASK-055–056 — página, conversor e modais de viagem

---
---
card_id: PULSO-FEAT-028
title: "Frontend — detalhe da viagem"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — detalhe da viagem

> **Contexto:** Página `/trips/:id` com pretensões, observações, meta, totais em moeda/BRL e insights de transporte.

**Refs:** RF-038–041 · RF-040 · RF-043 · RN-070

## 📝 Descrição

Implementar detalhe completo com sidebar de resumo, breakdown por categoria, seções de pretensões/observações e estimativas de passagem.

## ✅ Critérios de Aceite

- Rota `/trips/:id` com fetch viagem + cotação moeda destino
- `TripDetailSummarySidebar` — total moeda + equivalente BRL (RN-070)
- `TripDetailExpensesSection` + `TripExpenseFormModal` + delete
- `TripDetailObservationsSection` + checklist/links
- `TripDetailGoalCard` — vínculo meta RF-043
- `TripTransportPriceInsights` + `TripOriginPicker` (origem persistida local)
- `DestinationSearchPicker`, `CurrencySearchPicker`, `CurrencyFlag`

## 🔗 Sub-issues

- PULSO-TASK-057
- PULSO-TASK-058
- PULSO-TASK-059

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes de detalhe definido

### ⏳ Pendente
- PULSO-TASK-057–059 — detalhe, modais e estilos

---
---
card_id: PULSO-FEAT-029
title: "QA — testes de viagens e moedas"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-005
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de viagens e moedas

> **Contexto:** Regressão para cotações, conversão, destinos, pretensões e UI principal.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🔗 Sub-issues

- PULSO-TASK-060

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-060 — implementar/expandir suites

---
---
card_id: PULSO-TASK-049
title: "Banco de dados — viagens, despesas, observações e favoritas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-024
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — viagens, despesas, observações e favoritas

> **Contexto:** Modelagem persistente para viagens pessoais e moedas favoritas.

## 📝 Descrição

Criar models Prisma e migrations para viagens, pretensões, observações e favoritas.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Viagem` | destino, destinoMeta (Json), moeda, dataPrevista, metaId? `@unique` |
| `DespesaViagem` | categoria (enum 10 valores), valorEstimado, descricao? |
| `ObservacaoViagem` | titulo, conteudo?, tipo?, linkUrl?, checklist (Json) |
| `MoedaFavorita` | codigo; `@@unique([usuarioId, codigo])` |

**Enums:** `CategoriaDespesaViagem`, `TipoObservacaoViagem`

**Migrations:** `20260609180000_trip_expense_categories`, `20260609190000_viagem_observacoes`, `20260617130000_viagem_destino_meta`, `20260804130000_viagem_meta_id_unique`

## 📋 Resumo

### ✅ Concluído
- Spec de models e constraints definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma

---
---
card_id: PULSO-TASK-050
title: "Backend — moedaService, provider e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-023
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [TASK] Backend — moedaService, provider e rotas

> **Contexto:** Cotações AwesomeAPI, conversão, histórico e favoritas.

## 📝 Descrição

Implementar camada de moedas com catálogo, cache e CRUD de favoritas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Responsabilidade |
|---------|------------------|
| `constants/currencyCatalog.js` | Moedas suportadas, `DEFAULT_FAVORITES` |
| `providers/awesomeApiProvider.js` | Cache 5 min, rates, histórico Frankfurter |
| `repositories/moedaFavoritaRepository.js` | CRUD favoritas |
| `services/moedaService.js` | listarCotacoes, converter, obterHistorico, favoritas |
| `routes/moedaRoutes.js` | Rotas `/moedas/*` |
| `controllers/moedaController.js` | Handlers |
| `schemas/moedaSchemas.js` | Zod query/body |

**Limite:** `MAX_FAVORITES = 8`; seed padrão na primeira listagem

## 📋 Resumo

### ✅ Concluído
- Contratos RF-033–036 especificados

### ⏳ Pendente
- Implementar provider, service e rotas

---
---
card_id: PULSO-TASK-051
title: "Backend — viagemRepository e viagemMapper"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-024
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — viagemRepository e viagemMapper

> **Contexto:** Persistência Prisma e DTO de viagem com totais e meta resumida.

## 📝 Descrição

Implementar repository com includes de despesas, observações e meta; mapper com agregações.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Funções |
|---------|---------|
| `repositories/viagemRepository.js` | listar, buscar, criar, atualizar, excluir; despesas/observações; `buscarPorMetaId` |
| `utils/viagemMapper.js` | `mapViagem`, `mapDespesa`, `mapObservacao`, `calcTotalDespesas` |

**DTO:** `totalBrl`, `quantidadeDespesas`, `meta` resumida via `calcProgressoMeta`

## 📋 Resumo

### ✅ Concluído
- Shape de resposta definido

### ⏳ Pendente
- Implementar repository e mapper

---
---
card_id: PULSO-TASK-052
title: "Backend — viagemService CRUD e resolução de destino"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-024
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — viagemService CRUD e resolução de destino

> **Contexto:** Criar/editar viagem com destino validado, moeda, data futura e meta 1:1.

## 📝 Descrição

Implementar service principal com `resolverDestinoPayload`, validações e endpoints auxiliares.

## 🛠️ Implementação

### `viagemService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `criarViagem` / `editarViagem` | Data futura; moeda em catálogo; destino da lista |
| `validarMetaVinculo` | Meta existe; não duplicada → 409 |
| `listarDestinosViagem` | GeoNames ou catálogo fallback |
| `listarOrigensViagem` | `tripOrigins` |
| `obterResumoPagina` | Soma totais planejados |

### Rotas (NOVO — CRIAR)

`routes/viagemRoutes.js`, `controllers/viagemController.js`, `schemas/viagemSchemas.js`

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-037, RF-042, RF-043 documentados

### ⏳ Pendente
- Implementar service CRUD e rotas base

---
---
card_id: PULSO-TASK-053
title: "Backend — pretensões e observações"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-025
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — pretensões e observações

> **Contexto:** CRUD aninhado de despesas e observações por viagem.

## 📝 Descrição

Implementar endpoints e validações para pretensões (10 categorias) e observações com checklist.

## 🛠️ Implementação

### `viagemService.js` (NOVO — CRIAR)

| Grupo | Endpoints |
|-------|-----------|
| Despesas | POST/PATCH/DELETE `/viagens/:id/despesas[/:despesaId]` |
| Observações | POST/PATCH/DELETE `/viagens/:id/observacoes[/:observacaoId]` |

**Validações:**
- Categoria ∈ `CATEGORIAS_DESPESA` (RN-074)
- `valorEstimado > 0`
- URL válida em `linkUrl`
- Checklist normalizado com UUID por item

Retorno sempre: viagem mapeada atualizada

## 📋 Resumo

### ✅ Concluído
- Payloads e categorias definidos

### ⏳ Pendente
- Implementar CRUD despesas e observações

---
---
card_id: PULSO-TASK-054
title: "Backend — destinos, capas e media-passagem"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-026
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [TASK] Backend — destinos, capas e media-passagem

> **Contexto:** Pipeline GeoNames/catálogo, imagem de capa e estimativas de transporte.

## 📝 Descrição

Implementar resolvers de destino, serviço de capa e preços de passagem com fallbacks.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/tripDestinationResolver.js` | GeoNames place → destino normalizado |
| `constants/tripDestinationsCatalog.js` | Catálogo BR + internacional |
| `constants/tripDestinationAirports.js` | IATA, ônibus, trem |
| `providers/geonamesProvider.js` | searchPlaces, getPlace |
| `services/tripDestinationImageService.js` | `attachCoverImage` Wikipedia/Commons |
| `services/tripFlightPriceService.js` | Duffel/Amadeus + fallback + sazonal |
| `constants/tripSeasonalPricing.js` | Ajuste por mês |

**Endpoint:** `GET /viagens/:id/media-passagem?origemId=`

## 📋 Resumo

### ✅ Concluído
- Pipeline e providers documentados

### ⏳ Pendente
- Implementar resolver, capas e flight price

---
---
card_id: PULSO-TASK-055
title: "Frontend — TripsPage, conversor e favoritas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-027
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — TripsPage, conversor e favoritas

> **Contexto:** Página hub `/trips` com widgets de câmbio e carga paralela de dados.

## 📝 Descrição

Implementar shell da página com conversor rápido, favoritas, gráfico histórico e lista de viagens.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TripsPage.jsx` | Orquestração; fetch paralelo moedas + viagens + metas |
| `TripQuickConverter.jsx` | Conversão interativa RF-034 |
| `TripFavoriteCurrencies.jsx` | Cards favoritas com variação % |
| `TripExchangeChart.jsx` | Gráfico histórico RF-035 |
| `AddFavoriteCurrencyModal.jsx` | Adicionar favorita |
| `services/moedaService.js` | Client HTTP moedas |
| `services/viagemService.js` | Client HTTP viagens |

**UX:** status "Atualizado há X min" (RN-071)

## 📋 Resumo

### ✅ Concluído
- Layout e fetch pattern definidos

### ⏳ Pendente
- Implementar TripsPage e widgets de moeda

---
---
card_id: PULSO-TASK-056
title: "Frontend — TripFormModal, TripList e TripCard"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-027
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — TripFormModal, TripList e TripCard

> **Contexto:** CRUD de viagens na página principal com busca de destino e seleção de moeda.

## 📝 Descrição

Implementar lista de viagens, cards resumidos e modal criar/editar com pickers integrados.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `TripList.jsx` | Grid/lista de viagens |
| `TripCard.jsx` | Capa, destino, data, total, moeda |
| `TripFormModal.jsx` | Create/edit; meta opcional; link grupo |
| `DeleteTripModal.jsx` | Confirmação exclusão |
| `DestinationSearchPicker.jsx` | Autocomplete destinos API |
| `CurrencySearchPicker.jsx` | Seleção moeda catálogo |
| `TripDestinationTitle.jsx` | Título formatado destino |

Integração: seleção de meta ativa; criar meta via `GoalFormModal`

## 📋 Resumo

### ✅ Concluído
- Campos e pickers especificados

### ⏳ Pendente
- Implementar lista, cards e modal de viagem

---
---
card_id: PULSO-TASK-057
title: "Frontend — TripDetailPage e sidebar"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-028
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — TripDetailPage e sidebar

> **Contexto:** Página de detalhe com resumo financeiro e meta vinculada.

## 📝 Descrição

Implementar rota `/trips/:id` com layout principal, sidebar e card de meta.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TripDetailPage.jsx` | Fetch viagem + cotação; estado modais |
| `detail/TripDetailSummarySidebar.jsx` | Totais moeda/BRL, breakdown categorias |
| `detail/TripDetailGoalCard.jsx` | Progresso meta RF-043 |
| `detail/TripDetailCategoryBadge.jsx` | Badge categoria despesa |
| `utils/tripDetailUtils.js` | `buildCategoryBreakdown`, `calcTripTotalInCurrency` |
| `utils/tripOriginStorage.js` | Origem persistida para passagens |

**Rota:** `App.jsx` → `path="trips/:id"`

Conversão BRL: fetch cotação moeda destino (RN-070)

## 📋 Resumo

### ✅ Concluído
- Layout detalhe e utils definidos

### ⏳ Pendente
- Implementar TripDetailPage e sidebar

---
---
card_id: PULSO-TASK-058
title: "Frontend — pretensões, observações e transporte"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-028
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — pretensões, observações e transporte

> **Contexto:** Seções editáveis de gastos estimados, notas e insights de passagem.

## 📝 Descrição

Implementar modais e seções de pretensões/observações plus widget de preços de transporte.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `detail/TripDetailExpensesSection.jsx` | Tabela pretensões por categoria |
| `TripExpenseFormModal.jsx` | Create/edit despesa |
| `DeleteTripExpenseModal.jsx` | Confirmar exclusão |
| `detail/TripDetailObservationsSection.jsx` | Lista observações/checklists |
| `TripObservationFormModal.jsx` | Create/edit observação |
| `DeleteTripObservationModal.jsx` | Confirmar exclusão |
| `detail/TripTransportPriceInsights.jsx` | Avião/ônibus/trem |
| `detail/TripOriginPicker.jsx` | Seleção origem BR |
| `utils/tripExpenseCategories.js` | Labels 10 categorias RN-074 |

## 📋 Resumo

### ✅ Concluído
- Modais e seções especificados

### ⏳ Pendente
- Implementar seções de detalhe e modais

---
---
card_id: PULSO-TASK-059
title: "Frontend — trips.css e utilitários visuais"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-028
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — trips.css e utilitários visuais

> **Contexto:** Estilos responsivos, bandeiras de moeda e imagens de destino.

## 📝 Descrição

Implementar folha de estilos da página de viagens e helpers visuais compartilhados.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `styles/trips.css` | Layout page, cards, detalhe, modais, mobile |
| `CurrencyFlag.jsx` | Bandeira por código ISO |
| `utils/tripFlagImages.js` | URLs bandeiras |
| `utils/tripDestinationDisplay.js` | Label destino formatado |
| `utils/tripDestinationImages.js` | Fallback capa destino |
| `utils/tripCountryImages.js` | Imagens país |
| `utils/tripWikipediaImage.js` | Helper capa Wikipedia |

Importar CSS em TripsPage/TripDetailPage ou bundle global.

## 📋 Resumo

### ✅ Concluído
- Mapa de assets visuais definido

### ⏳ Pendente
- Implementar trips.css e utilitários visuais

---
---
card_id: PULSO-TASK-060
title: "QA — testes unitários viagens e moedas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-029
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários viagens e moedas

> **Contexto:** Regressão para cotações, destinos, resolver, flight price e UI.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/moedaService.test.js` | Cotações, conversão, favoritas |
| `unit/services/tripDestinationResolver.test.js` | GeoNames → destino |
| `unit/services/tripDestinationImageService.test.js` | Capa destino |
| `unit/services/tripFlightPriceService.test.js` | Media passagem, fallbacks |
| `unit/constants/tripDestinationsCatalog.test.js` | Catálogo destinos |
| `unit/constants/tripSeasonalPricing.test.js` | Ajuste sazonal |
| `unit/constants/tripTransportRoutes.test.js` | Rotas transporte |
| `unit/providers/geonamesProvider.test.js` | Provider GeoNames |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/pages/tripsPage.test.jsx` | Render página principal |
| `unit/utils/tripDestinationDisplay.test.js` | Labels destino |
| `unit/utils/tripDestinationImages.test.js` | Fallback imagens |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas

---
