# [EPIC] Grupos — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-008 | Grupos |
| Feature | PULSO-FEAT-040 | Backend — API core de grupos |
| Feature | PULSO-FEAT-041 | Viagem compartilhada e divisão RF-095 |
| Feature | PULSO-FEAT-042 | Metas compartilhadas e aportes |
| Feature | PULSO-FEAT-043 | Chat e notificações de grupo |
| Feature | PULSO-FEAT-044 | Frontend — grupos lista e detalhe |
| Feature | PULSO-FEAT-045 | QA — testes de grupos |
| Task | PULSO-TASK-081–092 | DB, core, viagem, metas, chat, frontend, QA |

---

---
card_id: PULSO-EPIC-008
title: "Grupos"
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
---

# [EPIC] Grupos

> **Contexto:** Espaços compartilhados para viagens e metas em grupo — convites PULSO-XXXX, papéis admin/membro, viagem compartilhada com pretensões, metas com aportes, chat com polling e notificações de atividade.

**Refs:** RF-088–102 · RN-111–120

## 🎯 Objetivos

- CRUD de grupos com nome, descrição e imagem (URL ou upload) (RF-088)
- Código convite `PULSO-XXXX`, preview e entrar via código (RF-089, RF-090, RN-111)
- Papéis ADMIN/MEMBRO; admin remove membro e altera papel (RF-091, RF-100, RN-114)
- Viagem compartilhada 1:1 por grupo; pretensões por membro; total agregado (RF-092–094)
- Toggle divisão *Por pretensão* / *Divisão igual* persistido (`modoDivisao`) (RF-095)
- Até 5 metas compartilhadas; aportes rastreados por membro (RF-096–097, RN-118–119)
- Finanças pessoais isoladas dos dados do grupo (RF-098)
- Sair do grupo; admin exclui grupo com notificação (RF-099, RN-120)
- Painel detalhe com 4 cards: viagem, metas, membros, chat (RF-101)
- Chat paginado + polling ~3s (pausa tab oculta) (RF-102)
- Rate limit 20 req/min em preview/entrar
- Notificações `GRUPO_ATIVIDADE` e `META_ATINGIDA` (escopo GRUPO)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/groups` | Lista grupos | Criar, entrar, convidar, excluir/sair |
| `/groups/:id` | Detalhe | Viagem, metas, membros, chat, RF-095 |
| `/groups/join/:codigo` | Redirect entrar | Deep link convite |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Viagens | `TripFormModal` vincular viagem pessoal → grupo |
| Notificações | `grupoNotificationService` |
| Divisão de Despesas | RF-115–120 standalone — integração RF-095 pendente |
| tripFlightPriceService | `GET /grupos/:id/viagem/media-passagem` |

## 🔗 Sub-issues

- PULSO-FEAT-040
- PULSO-FEAT-041
- PULSO-FEAT-042
- PULSO-FEAT-043
- PULSO-FEAT-044
- PULSO-FEAT-045

## 📋 Resumo

### ✅ Concluído
- Escopo RF-088–102 e RN-111–120 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Integração toggle RF-095 ↔ `/expense-split` — evolução futura

---
---
card_id: PULSO-FEAT-040
title: "Backend — API core de grupos"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-008
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API core de grupos

> **Contexto:** CRUD, convites, membros e upload de imagem do grupo.

**Refs:** RF-088–091 · RF-099–100 · RN-111–114

## 📝 Descrição

Expor endpoints `/api/grupos` para ciclo de vida do grupo e gestão de membros.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/grupos/preview?codigo=` | Pré-visualizar convite (rate limit) |
| POST | `/grupos/entrar` | Entrar com código PULSO-XXXX |
| GET/POST | `/grupos` | Listar / criar |
| GET/PATCH/DELETE | `/grupos/:id` | Detalhe / editar / excluir (admin) |
| POST | `/grupos/:id/sair` | Sair (RN-113 se único admin) |
| POST | `/grupos/:id/codigo/renovar` | Novo código (admin) |
| DELETE/PATCH | `/grupos/:id/membros/:usuarioId` | Remover / alterar papel |
| POST | `/grupos/:id/imagem` | Upload multipart (admin, 2MB) |

**Criador:** papel ADMIN automático (RN-112)

## 🔗 Sub-issues

- PULSO-TASK-081
- PULSO-TASK-082
- PULSO-TASK-083
- PULSO-TASK-084
- PULSO-TASK-085

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-081–085 — DB, service core e membros

---
---
card_id: PULSO-FEAT-041
title: "Viagem compartilhada e divisão RF-095"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-008
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Viagem compartilhada e divisão RF-095

> **Contexto:** Uma viagem por grupo, pretensões por membro e toggle de divisão.

**Refs:** RF-092–095 · RN-115–117

## 📝 Descrição

Implementar CRUD de viagem do grupo, pretensões compartilhadas e persistência de `modoDivisao`.

## ✅ Critérios de Aceite

| Rota | Comportamento |
|------|---------------|
| POST/PATCH/DELETE | `/grupos/:id/viagem` — vincular/editar/desvincular |
| POST/PATCH/DELETE | `/grupos/:id/viagem/despesas[/:despesaId]` — pretensões por autor |
| PATCH | `/grupos/:id/modo-divisao` — `PRETENSAO` \| `DIVISAO_IGUAL` |
| GET | `/grupos/:id/viagem/media-passagem` — estimativas transporte |

**RF-095:** `calcularSaldosViagem` — pretensão vs parte igual

**Constraint:** `@unique` em `ViagemGrupo.grupoId` (1 viagem/grupo)

Pretensões permanecem ao membro sair (RN-115–117)

## 🔗 Sub-issues

- PULSO-TASK-086

## 📋 Resumo

### ✅ Concluído
- Regras viagem e RF-095 especificadas

### ⏳ Pendente
- PULSO-TASK-086 — viagem grupo backend

---
---
card_id: PULSO-FEAT-042
title: "Metas compartilhadas e aportes"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-008
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Metas compartilhadas e aportes

> **Contexto:** Até 5 metas ativas por grupo; aportes individuais com auto-conclusão.

**Refs:** RF-096–097 · RN-118–119

## 📝 Descrição

Implementar criação de metas em lote e registro de aportes por membro.

## ✅ Critérios de Aceite

| Rota | Comportamento |
|------|---------------|
| POST | `/grupos/:id/metas` | Criar até 5 metas (transação Serializable) |
| POST | `/grupos/:id/metas/:metaId/aportes` | Aporte rastreado por `usuarioId` |

**Auto-conclusão:** meta atinge valor → status CONCLUIDA + notificação `META_ATINGIDA` escopo GRUPO

**Limite:** recontagem atômica de metas ativas ≤ 5

## 🔗 Sub-issues

- PULSO-TASK-087

## 📋 Resumo

### ✅ Concluído
- Regras RN-118–119 definidas

### ⏳ Pendente
- PULSO-TASK-087 — metas grupo backend

---
---
card_id: PULSO-FEAT-043
title: "Chat e notificações de grupo"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-008
due_date: null
categories:
  - Backend
  - Notificações
---

# [FEATURE] Chat e notificações de grupo

> **Contexto:** Mensagens paginadas no grupo e eventos notificados aos membros.

**Refs:** RF-102 · RN-120

## 📝 Descrição

Implementar chat do grupo e serviço de notificações de atividade.

## ✅ Critérios de Aceite

| Rota | Comportamento |
|------|---------------|
| GET | `/grupos/:id/mensagens?pagina=&limite=` | Lista paginada (20/página) |
| POST | `/grupos/:id/mensagens` | Enviar mensagem |

**Notificações** (`grupoNotificationService`):
- Entrar/sair/removido, pretensão, meta criada, meta atingida, excluir grupo
- Tipos: `GRUPO_ATIVIDADE`, `META_ATINGIDA`

**Frontend:** polling ~3s; merge por id; pausa `visibilityState`

## 🔗 Sub-issues

- PULSO-TASK-088

## 📋 Resumo

### ✅ Concluído
- Eventos e chat RF-102 especificados

### ⏳ Pendente
- PULSO-TASK-088 — chat e notificações

---
---
card_id: PULSO-FEAT-044
title: "Frontend — grupos lista e detalhe"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-008
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — grupos lista e detalhe

> **Contexto:** UI completa `/groups` e `/groups/:id` com modais e cards RF-101.

**Refs:** RF-088–102 · RF-095 · RF-101

## 📝 Descrição

Implementar páginas de lista e detalhe com todos os modais e cards integrados.

## ✅ Critérios de Aceite

**Lista (`/groups`):**
- `GroupList`, `GroupCard`, `CreateGroupModal`, `JoinGroupModal`
- `InviteGroupModal` (link, WhatsApp, QR), `GroupsJoinBanner`
- Admin: excluir; membro: sair

**Detalhe (`/groups/:id`):**
- `GroupDetailHeader` — imagem, editar, convite
- `GroupDetailTripCard` — viagem, pretensões, toggle RF-095, saldos
- `GroupDetailGoalCard` — metas, aportes
- `GroupDetailMembersCard` — gerenciar membros
- `GroupDetailChatCard` — chat + load more
- Polling detalhe ~30s; chat ~3s

**Redirect:** `/groups/join/:codigo`

## 🔗 Sub-issues

- PULSO-TASK-089
- PULSO-TASK-090
- PULSO-TASK-091

## 📋 Resumo

### ✅ Concluído
- Mapa de componentes RF-101 definido

### ⏳ Pendente
- PULSO-TASK-089–091 — páginas, modais e estilos

---
---
card_id: PULSO-FEAT-045
title: "QA — testes de grupos"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-008
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de grupos

> **Contexto:** Regressão unitária e E2E para convites, membros, viagem e metas.

## 📝 Descrição

Implementar suites API, Web e Playwright cobrindo fluxos críticos.

## 🔗 Sub-issues

- PULSO-TASK-092

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-092 — implementar suites

---
---
card_id: PULSO-TASK-081
title: "Banco de dados — Grupo e MembroGrupo"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-040
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — Grupo e MembroGrupo

> **Contexto:** Modelagem persistente para grupos, membros e enums de papel/divisão.

## 📝 Descrição

Criar models Prisma e migrations para núcleo de grupos.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Grupo` | nome, descricao, codigoConvite `@unique`, urlImagem, modoDivisao, criadorId |
| `MembroGrupo` | grupoId, usuarioId, papel; `@@unique([grupoId, usuarioId])` |

**Enums:** `PapelGrupo` (ADMIN, MEMBRO), `ModoDivisaoGrupo` (PRETENSAO, DIVISAO_IGUAL)

**Migration:** `20260617140000_grupos`, `20260714134549_add_modo_divisao_grupo`

## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations

---
---
card_id: PULSO-TASK-082
title: "Backend — grupoRepository e grupoMapper"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-040
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — grupoRepository e grupoMapper

> **Contexto:** Persistência Prisma e DTOs resumo/detalhe/preview.

## 📝 Descrição

Implementar repository com includes de membros, viagem, metas, mensagens; mappers de resposta.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/grupoRepository.js` | CRUD, membros, codigoConviteExiste, listarPorUsuario |
| `utils/grupoMapper.js` | `mapGrupoResumo`, `mapGrupoDetalhe`, `mapGrupoPreview`, `imagemExibicao` |

**imagemExibicao:** urlImagem → capa viagem → gradiente fallback

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper

---
---
card_id: PULSO-TASK-083
title: "Backend — grupoService core e convites"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-040
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — grupoService core e convites

> **Contexto:** CRUD, preview/entrar com código PULSO-XXXX e rate limit.

## 📝 Descrição

Implementar service principal e middleware de rate limit para convites.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/grupoService.js` | criar, listar, obter, editar, excluir, preview, entrar, renovarCodigo |
| `middlewares/grupoInviteRateLimit.js` | 20 req/min preview + entrar |
| `routes/grupoRoutes.js` | Rotas base |
| `controllers/grupoController.js` | Handlers |
| `schemas/grupoSchemas.js` | Zod validation |

**Código:** regex `PULSO-[A-Z0-9]{4}`; geração sem ambíguos (RN-111)

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-088–090 especificados

### ⏳ Pendente
- Implementar service core e rotas

---
---
card_id: PULSO-TASK-084
title: "Backend — membros, sair e papéis"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-040
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — membros, sair e papéis

> **Contexto:** Gestão de membership e restrições de admin único.

## 📝 Descrição

Implementar sair do grupo, remover membro e alterar papel ADMIN/MEMBRO.

## 🛠️ Implementação

### `grupoService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `sairGrupo` | Membro sai; bloqueio se único admin (RN-113) |
| `removerMembro` | Apenas admin (RN-114) |
| `alterarPapelMembro` | Promoção/rebaixamento admin |

Notificar demais membros via `grupoNotificationService`

## 📋 Resumo

### ✅ Concluído
- Regras RN-113–114 documentadas

### ⏳ Pendente
- Implementar fluxos de membership

---
---
card_id: PULSO-TASK-085
title: "Backend — upload imagem do grupo"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-040
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [TASK] Backend — upload imagem do grupo

> **Contexto:** Foto customizada do grupo via multipart ou URL https.

## 📝 Descrição

Implementar storage de imagem e middleware de upload para admin.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/grupoImageStorageService.js` | `storeGrupoImage` — jpg/png/webp, max 2MB |
| `middlewares/grupoImageUploadMiddleware.js` | `handleGrupoImageUpload` campo `imagem` |
| `grupoService.enviarImagem` | Admin only; atualiza `urlImagem` |

**Migration:** `20260617150000_grupo_imagem`

Fallback: capa viagem vinculada quando sem foto custom

## 📋 Resumo

### ✅ Concluído
- Limites upload definidos

### ⏳ Pendente
- Implementar storage e endpoint imagem

---
---
card_id: PULSO-TASK-086
title: "Backend — viagem grupo, pretensões e RF-095"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-041
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — viagem grupo, pretensões e RF-095

> **Contexto:** Viagem compartilhada 1:1, despesas por membro e modo divisão.

## 📝 Descrição

Implementar CRUD viagem do grupo, pretensões e `atualizarModoDivisao`.

## 🛠️ Implementação

### Models (NOVO — CRIAR)

`ViagemGrupo`, `DespesaViagemGrupo` — reutilizar resolver destino de `viagemService`

### Endpoints

- POST/PATCH/DELETE `/grupos/:id/viagem`
- CRUD `/grupos/:id/viagem/despesas`
- PATCH `/grupos/:id/modo-divisao`
- GET media-passagem via `tripFlightPriceService`

**Constraint:** `@@unique([grupoId])` em ViagemGrupo

Pretensões vinculadas a `adicionadoPorId`; permanecem ao sair (RN-115–117)

## 📋 Resumo

### ✅ Concluído
- Spec RF-092–095 definida

### ⏳ Pendente
- Implementar viagem grupo backend

---
---
card_id: PULSO-TASK-087
title: "Backend — metas grupo e aportes"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-042
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — metas grupo e aportes

> **Contexto:** Até 5 metas ativas; aportes com auto-conclusão e notificação.

## 📝 Descrição

Implementar criação de metas em lote e registro de aportes por membro.

## 🛠️ Implementação

### Models (NOVO — CRIAR)

`MetaGrupo`, `AporteMetaGrupo`

### Endpoints

- POST `/grupos/:id/metas` — array de metas; transação Serializable; limite 5
- POST `/grupos/:id/metas/:metaId/aportes` — incrementa valorAtual

**RN-119:** auto-conclusão + `notificarMetaGrupoAtingida`

**RN-118:** aporte sempre com `usuarioId` do membro

## 📋 Resumo

### ✅ Concluído
- Regras metas grupo definidas

### ⏳ Pendente
- Implementar metas e aportes backend

---
---
card_id: PULSO-TASK-088
title: "Backend — chat e grupoNotificationService"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-043
due_date: null
categories:
  - Backend
  - Notificações
---

# [TASK] Backend — chat e grupoNotificationService

> **Contexto:** Mensagens paginadas e notificações de atividade do grupo.

## 📝 Descrição

Implementar chat do grupo e serviço centralizado de notificações.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `MensagemChatGrupo` model | grupoId, usuarioId, conteudo |
| `grupoService.listarMensagens` | Paginação 20, order desc |
| `grupoService.enviarMensagem` | Validar membro |
| `services/grupoNotificationService.js` | GRUPO_ATIVIDADE, META_ATINGIDA, exclusão |

Eventos notificados: entrar, sair, removido, pretensão, meta criada, meta atingida, excluir grupo (RN-120)

## 📋 Resumo

### ✅ Concluído
- Eventos RF-102 e RN-120 mapeados

### ⏳ Pendente
- Implementar chat e notification service

---
---
card_id: PULSO-TASK-089
title: "Frontend — GroupsPage e modais lista"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-044
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — GroupsPage e modais lista

> **Contexto:** Lista de grupos com criar, entrar e convidar.

## 📝 Descrição

Implementar página `/groups` e modais de lista.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/GroupsPage.jsx` | Fetch lista; modais |
| `GroupList.jsx` / `GroupCard.jsx` | Cards com imagemExibicao |
| `CreateGroupModal.jsx` + `GroupImagePicker` | Criar com foto opcional |
| `JoinGroupModal.jsx` | Entrar por código |
| `InviteGroupModal.jsx` | Link, WhatsApp, QR code |
| `DeleteGroupModal.jsx` / `LeaveGroupModal.jsx` | Confirmar ações |
| `GroupsJoinBanner.jsx` | CTA entrar |
| `pages/GroupJoinRedirect.jsx` | `/groups/join/:codigo` |
| `services/grupoService.js` | Client HTTP |

**Rota:** `App.jsx` → `/groups`, `/groups/join/:codigo`

## 📋 Resumo

### ✅ Concluído
- Fluxos lista especificados

### ⏳ Pendente
- Implementar GroupsPage e modais

---
---
card_id: PULSO-TASK-090
title: "Frontend — GroupDetailPage e cards"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-044
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — GroupDetailPage e cards

> **Contexto:** Painel RF-101 com 4 cards e modais integrados.

## 📝 Descrição

Implementar detalhe do grupo com viagem, metas, membros e chat.

## 🛠️ Implementação

### Página e cards (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/GroupDetailPage.jsx` | Orquestração; polling 30s |
| `detail/GroupDetailHeader.jsx` | Imagem, editar, convite |
| `detail/GroupDetailTripCard.jsx` | Viagem, RF-095 toggle, saldos |
| `detail/GroupDetailGoalCard.jsx` | Metas, aportes |
| `detail/GroupDetailMembersCard.jsx` | Lista membros |
| `detail/GroupDetailChatCard.jsx` | Chat polling 3s, load more |
| `GroupTripTransportChips.jsx` | Insights passagem |

### Modais reutilizados

`EditGroupModal`, `ManageGroupMembersModal`, `CreateGroupGoalsModal`, `GroupContributionModal`, `TripFormModal`, `TripExpenseFormModal`, `ChangeGroupImageModal`

**Utils:** `groupDetailUtils.js` → `calcularSaldosViagem`, `mesclarMensagensChat`

## 📋 Resumo

### ✅ Concluído
- Mapa RF-101 definido

### ⏳ Pendente
- Implementar GroupDetailPage e cards

---
---
card_id: PULSO-TASK-091
title: "Frontend — groups.css e utilitários"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-044
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — groups.css e utilitários

> **Contexto:** Estilos responsivos e helpers de convite/formato.

## 📝 Descrição

Implementar folha de estilos e utilitários compartilhados do módulo grupos.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `styles/groups.css` | Lista, detalhe, cards, chat, modais, mobile |
| `utils/groupInvite.js` | Build link convite, QR payload |
| `utils/groupFormat.js` | Formatação labels |
| `utils/groupImage.js` | Resolve URL exibição |
| `GroupThumbnail.jsx` / `GroupSocialIcons.jsx` | Componentes visuais |

Importar CSS nas páginas de grupos.

## 📋 Resumo

### ✅ Concluído
- Mapa utils definido

### ⏳ Pendente
- Implementar groups.css e utils

---
---
card_id: PULSO-TASK-092
title: "QA — testes unitários e E2E de grupos"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-045
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários e E2E de grupos

> **Contexto:** Regressão para convites, membros, viagem, metas e RF-095.

## 📝 Descrição

Implementar suites API, Web e Playwright.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/grupoService.test.js` | CRUD, entrar, membros, metas |
| `unit/services/grupoImageStorageService.test.js` | Upload |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/grupoService.test.js` | HTTP client |
| `unit/utils/groupDetailUtils.test.js` | `calcularSaldosViagem` RF-095 |
| `unit/utils/groupInvite.test.js` | Link convite |

### E2E — `web/e2e/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `groups.spec.js` | Login demo + modal criar grupo |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites

---
