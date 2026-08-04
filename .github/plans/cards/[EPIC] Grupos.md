# [EPIC] Grupos

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M13  
> **Correções PO:** rate limit convites, metas grupo atômicas, `@unique(grupoId)` viagem/meta grupo  
> **Refs:** RF-088–102 · [PO M13](../../Documentacao/03-Auditorias/Product Owner/13-Grupos.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Grupos, Colaboração, Chat, Frontend, Backend  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Grupos financeiros colaborativos: criar grupo, convite por código `PULSO-XXXX`, papéis ADMIN/MEMBRO, chat, metas compartilhadas (`MetaGrupo`), viagem compartilhada (`ViagemGrupo`), modo divisão de pretensões (PRETENSAO/IGUAL), upload de imagem, notificações de atividade.

### 🎯 Objetivos do Epic

- ✅ CRUD grupos + membros + papéis
- ✅ Convite: preview público rate-limited + entrar por código
- ✅ Renovar código convite (admin)
- ✅ Até 5 metas ativas por grupo + aportes + notificação ao atingir
- ✅ Uma viagem por grupo (copiar pessoal ou criar inline)
- ✅ Chat de grupo (mensagens paginadas)
- ✅ `modoDivisao`: pretensão individual vs. split igual na viagem
- ✅ Imagem grupo (upload S3/Vercel Blob ou local via middleware)

### 🎭 Telas e Fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/groups` | Lista grupos | Cards, banner join, criar grupo, deep link `?convite=` |
| `/groups/:id` | Detalhe grupo | Membros, metas, viagem, chat, admin actions |
| `/groups/join/:codigo` | Redirect join | → `/groups?convite=CODE` |

---

## 🗄️ Modelo de Dados (Resumo)

| Model | Descrição |
|-------|-----------|
| `Grupo` | `nome`, `descricao?`, `codigoConvite` @unique, `urlImagem?`, `modoDivisao`, `criadorId` |
| `MembroGrupo` | `usuarioId`, `grupoId`, `papel` (ADMIN/MEMBRO) — unique `(grupoId, usuarioId)` |
| `MetaGrupo` | meta compartilhada (max 5 ativas) |
| `AporteMetaGrupo` | aportes por membro |
| `ViagemGrupo` | `@@unique([grupoId])` — 1 viagem/grupo |
| `DespesaViagemGrupo` | pretensões por membro (estimativas, não transações) |
| `MensagemChatGrupo` | chat paginado |

**Enums:** `PapelGrupo` (ADMIN, MEMBRO) · `ModoDivisaoGrupo` (PRETENSAO, IGUAL) · `CategoriaDespesaViagem` (10, compartilhado com viagens)

---

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Viagens pessoais | Copiar viagem existente via `viagemId` ao criar `ViagemGrupo` |
| Moedas/Passagem | `obterMediaPassagemViagem` reutiliza `tripFlightPriceService` |
| Notificações | `grupoNotificationService` — join, meta, despesa, viagem, delete |
| Storage | Vercel Blob (`BLOB_READ_WRITE_TOKEN`) ou local `uploads/grupos/` |
| Rate limit | `grupoInviteRateLimit` — 20 req/min preview + entrar |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (7 models grupo), 5 migrations |
| Backend | ✅ | `grupoRoutes.js`, `grupoController.js`, `grupoService.js`, `grupoRepository.js`, `grupoSchemas.js`, `grupoMapper.js`, `grupoNotificationService.js`, `grupoImageStorageService.js`, `grupoInviteRateLimit.js` |
| Frontend | ✅ | `GroupsPage.jsx`, `GroupDetailPage.jsx`, `GroupJoinRedirect.jsx`, 24 componentes `features/groups/`, `grupoService.js` |
| E2E | 🟡 | `web/e2e/groups.spec.js` — parcial (sem fluxo convite completo em CI) |
| Testes API | ✅ | `grupoService.test.js`, `grupoImageStorageService.test.js` |
| Testes Web | ✅ | `grupoService.test.js`, `groupInvite.test.js`, `groupDetailUtils.test.js` |

**Registro rotas:** `routes/index.js` → `/grupos`

---

## 🔧 Correções PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| Rate limit convites | 20/min por usuário em preview + entrar | `grupoInviteRateLimit.js` |
| Metas atômicas | Transação Prisma batch create ≤5 | `grupoService.criarMetas` |
| Unicidade viagem | `ViagemGrupo.grupoId` @unique migration | `20260804140000_viagem_grupo_grupo_id_unique` |

---

## ⏳ Pendências

- [ ] Notificações in-app convite aceito (parcial via `grupoNotificationService`)
- [ ] E2E convite fluxo completo em CI
- [ ] Cleanup chat mensagens >180 dias (repository existe, job pendente)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Criar grupo → criador vira ADMIN  
→ Compartilhar link `/groups/join/PULSO-XXXX`  
→ Entrar por código válido → vira MEMBRO  
→ Admin edita/exclui grupo; membro comum não  
→ Último admin não pode sair se há outros membros  
→ Max 5 metas ativas; aporte notifica ao 100%  
→ Uma viagem por grupo; modo divisão altera UI saldos  
→ Chat envia/recebe mensagens paginadas

---

# [STORY DATABASE] Grupos — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Grupos

---

## 📝 Descrição

**Como sistema**, quero persistir grupos colaborativos com membros, metas compartilhadas, viagem de grupo, pretensões e chat.

---

## 🗄️ Migrations Prisma

| Migration | Conteúdo |
|-----------|----------|
| `20260617140000_grupos` | Tabelas `grupos`, `membros_grupo`, `viagens_grupo`, `despesas_viagem_grupo`, `metas_grupo`, `aportes_meta_grupo`, `mensagens_chat_grupo` + enum `PapelGrupo` |
| `20260617150000_grupo_imagem` | `url_imagem` em grupos; `destino_meta` JSONB em viagens_grupo |
| `20260714134549_add_modo_divisao_grupo` | Enum `ModoDivisaoGrupo` + coluna `modo_divisao` |
| `20260804120000_categoria_grupo_beneficio` | Enum `GrupoBeneficioCategoria` em categorias (benefício) |
| `20260804140000_viagem_grupo_grupo_id_unique` | Unique index: uma viagem por grupo |

---

## 📊 Modelo Prisma (resumo)

| Model | Campos-chave |
|-------|--------------|
| `Grupo` | `nome`, `descricao?`, `codigoConvite` @unique, `urlImagem?`, `modoDivisao`, `criadorId` |
| `MembroGrupo` | `grupoId`, `usuarioId`, `papel`, `entrouEm` — @@unique([grupoId, usuarioId]) |
| `ViagemGrupo` | `grupoId` @unique, `destino`, `destinoMeta?`, `moeda`, `dataPrevista` |
| `DespesaViagemGrupo` | `viagemGrupoId`, `adicionadoPorId`, `categoria`, `valorEstimado` |
| `MetaGrupo` | `grupoId`, `valorAlvo`, `valorAtual`, `prazo`, `status`, `descricao?` |
| `AporteMetaGrupo` | `metaGrupoId`, `usuarioId`, `valor`, `data` |
| `MensagemChatGrupo` | `grupoId`, `usuarioId`, `conteudo` — index `(grupoId, criadoEm)` |

**Enums:** `PapelGrupo` (ADMIN, MEMBRO) · `ModoDivisaoGrupo` (PRETENSAO, IGUAL)

---

## ✅ Critérios de Aceite (Database)

→ `codigo_convite` unique com formato `PULSO-XXXX`  
→ Unique `(grupo_id, usuario_id)` em membros  
→ Unique `grupo_id` em viagens_grupo (1 viagem/grupo)  
→ Cascade delete grupo → membros, metas, viagem, mensagens  
→ Índice chat por `(grupo_id, criado_em DESC)` para paginação  

---

# [STORY BACKEND] Grupos — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Grupos

---

## 📝 Descrição

**Como sistema backend**, quero fornecer API REST completa para grupos colaborativos: convites, membros, metas, viagem compartilhada, pretensões, chat e upload de imagem.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Criar grupo
**Dado** usuário autenticado,  
**Quando** `POST /api/grupos` com `{ nome }`,  
**Então** retorna `201` com grupo, criador como ADMIN, código `PULSO-XXXX` gerado.

### Cenário 2 — Preview convite (rate limit)
**Quando** `GET /api/grupos/preview?codigo=PULSO-ABCD`,  
**Então** retorna `200` com nome/descrição/membros count (sem auth).  
* >20 req/min → `429`

### Cenário 3 — Entrar por código
**Quando** `POST /api/grupos/entrar` com `{ codigo }`,  
**Então** retorna `200`; usuário vira MEMBRO; idempotente se já membro.

### Cenário 4 — Metas batch (≤5)
**Dado** grupo com 3 metas ativas,  
**Quando** `POST /api/grupos/:id/metas` com 3 novas,  
**Então** retorna `400` (max 5 ativas).  
**Quando** batch ≤ limite,  
**Então** transação atômica cria todas.

### Cenário 5 — Aporte meta grupo
**Quando** `POST /api/grupos/:id/metas/:metaId/aportes` com `{ valor }`,  
**Então** incrementa `valorAtual`; se ≥ alvo → status CONCLUIDA + notificação.

### Cenário 6 — Viagem grupo (1:1)
**Dado** grupo sem viagem,  
**Quando** `POST /api/grupos/:id/viagem` com destino inline ou `viagemId`,  
**Então** retorna `201` com `ViagemGrupo` + capa via `attachCoverImage`.  
* Segunda viagem → `409`

### Cenário 7 — Admin-only actions
**Dado** membro MEMBRO (não admin),  
**Quando** `DELETE /api/grupos/:id` ou `POST /api/grupos/:id/codigo/renovar`,  
**Então** retorna `403`.

### Cenário 8 — Chat paginado
**Quando** `GET /api/grupos/:id/mensagens?pagina=1&limite=20`,  
**Então** retorna `200` mensagens ordenadas desc + headers paginação.  
**Quando** `POST` com `{ conteudo }` (1–2000 chars),  
**Então** retorna `201`.

---

## 🛠️ Implementação (o que foi feito)

### grupoController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/grupoController.js`

* `preview()` → `GET /api/grupos/preview`
* `entrar()` → `POST /api/grupos/entrar`
* `listar()` → `GET /api/grupos`
* `criar()` → `POST /api/grupos`
* `obter()` → `GET /api/grupos/:id`
* `editar()` → `PATCH /api/grupos/:id`
* `atualizarModoDivisao()` → `PATCH /api/grupos/:id/modo-divisao`
* `enviarImagem()` → `POST /api/grupos/:id/imagem`
* `excluir()` → `DELETE /api/grupos/:id`
* `sair()` → `POST /api/grupos/:id/sair`
* `renovarCodigo()` → `POST /api/grupos/:id/codigo/renovar`
* `removerMembro()` → `DELETE /api/grupos/:id/membros/:usuarioId`
* `alterarPapelMembro()` → `PATCH /api/grupos/:id/membros/:usuarioId`
* `criarViagem()` → `POST /api/grupos/:id/viagem`
* `editarViagem()` → `PATCH /api/grupos/:id/viagem`
* `desvincularViagem()` → `DELETE /api/grupos/:id/viagem`
* `obterMediaPassagemViagem()` → `GET /api/grupos/:id/viagem/media-passagem`
* `criarDespesaViagem()` → `POST /api/grupos/:id/viagem/despesas`
* `editarDespesaViagem()` → `PATCH /api/grupos/:id/viagem/despesas/:despesaId`
* `excluirDespesaViagem()` → `DELETE /api/grupos/:id/viagem/despesas/:despesaId`
* `criarMetas()` → `POST /api/grupos/:id/metas`
* `registrarAporte()` → `POST /api/grupos/:id/metas/:metaId/aportes`
* `listarMensagens()` → `GET /api/grupos/:id/mensagens`
* `enviarMensagem()` → `POST /api/grupos/:id/mensagens`

---

### grupoService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/grupoService.js`

**Lógica de negócio:**

→ `previewGrupo({ codigo })` — valida regex `PULSO-[A-Z0-9]{4}`, retorna resumo público  
→ `entrarGrupo(usuarioId, codigo)` — join idempotente  
→ `listarGrupos(usuarioId)` · `obterGrupo(usuarioId, id)` — membership guard  
→ `criarGrupo(usuarioId, dados)` — gera código único (12 retries), criador ADMIN  
→ `editarGrupo` / `excluirGrupo` — admin-only delete  
→ `sairGrupo` — último admin com membros → erro; último membro → delete grupo  
→ `renovarCodigo` — admin-only novo código  
→ `removerMembro` / `alterarPapelMembro` — admin-only; não rebaixa último admin  
→ `atualizarModoDivisao` — qualquer membro: PRETENSAO | IGUAL  
→ `enviarImagemGrupo` — admin-only upload via `grupoImageStorageService`  
→ `criarViagemGrupo` — max 1 viagem; copy from personal `viagemId` or inline; capa  
→ `editarViagemGrupo` / `desvincularViagemGrupo` — admin edit/delete  
→ `criarDespesaViagemGrupo` — pretensão própria; notificação grupo  
→ `editarDespesaViagemGrupo` / `excluirDespesaViagemGrupo` — só criador da despesa  
→ `criarMetas` — batch ≤5 ativas, transação Prisma atômica  
→ `registrarAporteMetaGrupo` — auto-complete + notificação 100%  
→ `listarMensagens` / `enviarMensagem` — paginação max 50/página  

**Código convite:** charset `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (sem chars ambíguos)

---

### grupoRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/grupoRepository.js`

→ CRUD grupo, membros, viagem, despesas, metas, aportes, mensagens  
→ `excluirMensagensAntigas(dias)` — cleanup >180 dias (não agendado)

---

### grupoNotificationService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/grupoNotificationService.js`

→ Notificações: membro entrou/saiu/removido, meta criada, despesa adicionada, viagem desvinculada, grupo excluído, meta atingida

---

### grupoImageStorageService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/grupoImageStorageService.js`

→ Upload JPG/PNG/WEBP max 2 MB  
→ Vercel Blob se `BLOB_READ_WRITE_TOKEN`, senão local `uploads/grupos/`

---

### grupoInviteRateLimit.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/middlewares/grupoInviteRateLimit.js`

→ 20 tentativas/min por usuário em `preview` + `entrar`

---

### grupoSchemas.js / grupoMapper.js (EXISTENTE — IMPLEMENTADO)

**Schemas:** `Codigo/Pulso/api/src/schemas/grupoSchemas.js` — Zod todos endpoints  
**Mapper:** `Codigo/Pulso/api/src/utils/grupoMapper.js` — `mapGrupoResumo`, `mapGrupoDetalhe`, `mapGrupoPreview`

---

### grupoRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/grupoRoutes.js`  
**Base:** `/api/grupos` — todas rotas com `authMiddleware`; preview/entrar com rate limit

**Middleware adicional:** `grupoImageUploadMiddleware.js` (Multer) em upload imagem

---

## 🧪 Arquivos de teste (Backend)

| Arquivo | Cobertura |
|---------|-----------|
| `api/tests/unit/services/grupoService.test.js` | Normalização código, modo divisão, 404 non-member |
| `api/tests/unit/services/grupoImageStorageService.test.js` | Storage local URL |

---

## 🚫 Regras de Negócio (Backend)

* Código convite regex `PULSO-[A-Z0-9]{4}`; charset sem I/O/0/1
* Admin-only: delete grupo, edit nome/desc (alguns campos), upload imagem, renovar código, remover membro, editar viagem, desvincular viagem
* Qualquer membro: toggle `modoDivisao`, enviar chat, criar pretensão, aportar meta
* Pretensões viagem grupo são **estimativas** — não geram transações
* Despesa: só criador edita/exclui própria pretensão
* Max 5 metas ATIVAS por grupo
* Max 1 viagem por grupo (DB unique + service guard)
* Último admin não pode sair com outros membros presentes
* Chat conteúdo 1–2000 caracteres

---

# [STORY FRONTEND] Grupos — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Grupos

---

## 📝 Descrição

**Como usuário**, quero criar e participar de grupos financeiros em `/groups`, gerenciar metas/viagem/chat no detalhe `/groups/:id`, e entrar via link de convite.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Lista grupos
**Dado** usuário em `/groups`,  
**Quando** página carrega,  
**Então** exibe grid `GroupCard` com thumbnail, membros, ações; banner `GroupsJoinBanner` para código.

### Cenário 2 — Criar grupo
**Quando** abre `CreateGroupModal` com nome + foto opcional (`GroupImagePicker`),  
**Então** grupo aparece na lista; criador vê ações admin.

### Cenário 3 — Join por link
**Quando** acessa `/groups/join/PULSO-ABCD`,  
**Então** `GroupJoinRedirect` → `/groups?convite=ABCD` abre `JoinGroupModal` com preview.

### Cenário 4 — Detalhe viagem modo IGUAL
**Dado** grupo com `modoDivisao: IGUAL`,  
**Quando** visualiza `GroupDetailTripCard`,  
**Então** saldos calculados via `calcularSaldosViagem` (split igual entre membros).

### Cenário 5 — Metas e aporte
**Quando** admin abre `CreateGroupGoalsModal` (até 5) e membro clica aportar,  
**Então** `GroupContributionModal` registra aporte; `GroupDetailGoalCard` atualiza progresso.

### Cenário 6 — Chat
**Quando** envia mensagem em `GroupDetailChatCard`,  
**Então** mensagem aparece no feed; "Carregar anteriores" pagina via `GET mensagens`.

---

## 🛠️ Implementação (o que foi feito)

### grupoService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/grupoService.js`

→ `previewGrupo`, `entrarGrupo`, `listarGrupos`, `obterGrupo`, `criarGrupo`, `editarGrupo`, `excluirGrupo`  
→ `sairGrupo`, `renovarCodigoConvite`, `removerMembro`, `alterarPapelMembro`  
→ `atualizarModoDivisaoGrupo`, `enviarImagemGrupo`  
→ `criarViagemGrupo`, `editarViagemGrupo`, `desvincularViagemGrupo`, `obterMediaPassagemViagemGrupo`  
→ CRUD despesas viagem · `criarMetasGrupo`, `registrarAporteMetaGrupo`  
→ `listarMensagensGrupo`, `enviarMensagemGrupo`

---

### GroupsPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/GroupsPage.jsx`  
**Rota:** `/groups`

→ Lista grupos, modais create/join/invite/delete/leave  
→ Deep link `?convite=` abre `JoinGroupModal`

---

### GroupDetailPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/GroupDetailPage.jsx`  
**Rota:** `/groups/:id`

→ Orquestra header, members, trip, goals, chat, footer admin actions

---

### GroupJoinRedirect.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/GroupJoinRedirect.jsx`  
**Rota:** `/groups/join/:codigo` → redirect `/groups?convite={codigo}`

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/groups/`

| Componente | Responsabilidade |
|------------|------------------|
| `GroupList.jsx` | Grid de `GroupCard` |
| `GroupCard.jsx` | Card lista: thumbnail, membros, invite/copy/delete/leave |
| `GroupThumbnail.jsx` | Avatar com gradient fallback do nome |
| `GroupsJoinBanner.jsx` | Input código convite inline |
| `CreateGroupModal.jsx` | Form criar grupo + foto |
| `JoinGroupModal.jsx` | Preview + entrar por código |
| `InviteGroupModal.jsx` | Copiar link/código; admin regenera |
| `EditGroupModal.jsx` | Editar nome/descrição |
| `ChangeGroupImageModal.jsx` | Admin upload nova foto |
| `GroupImagePicker.jsx` | Picker galeria/arquivo reutilizável |
| `DeleteGroupModal.jsx` | Confirmar exclusão grupo |
| `LeaveGroupModal.jsx` | Confirmar sair |
| `ManageGroupMembersModal.jsx` | Admin: remover, alterar papéis |
| `CreateGroupGoalsModal.jsx` | Criar até 5 metas |
| `GroupContributionModal.jsx` | Registrar aporte meta |
| `GroupSocialIcons.jsx` | Ícones WhatsApp/Instagram share |
| **detail/** | |
| `GroupDetailHeader.jsx` | Hero: back, thumbnail, edit/copy/admin |
| `GroupDetailMembersCard.jsx` | Lista membros + invite/manage |
| `GroupDetailTripCard.jsx` | Viagem, matriz pretensões, toggle modo divisão |
| `GroupDetailGoalCard.jsx` | Progresso metas + aportes por membro |
| `GroupDetailChatCard.jsx` | Feed chat + enviar + paginar |
| `GroupDetailFooter.jsx` | Delete/leave actions |
| `GroupDetailSectionTitle.jsx` | Título seção com ícone |
| `GroupTripTransportChips.jsx` | Chips preço passagem viagem grupo |

---

### Utils (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/groupInvite.js` | Normalizar/validar código, builders link convite, cor accent |
| `web/src/utils/groupDetailUtils.js` | Formatação datas/chat, merge mensagens, `calcularSaldosViagem` (PRETENSAO/IGUAL) |
| `web/src/utils/groupFormat.js` | Nomes membros, timestamps relativos |
| `web/src/utils/groupImage.js` | Resolve imagem exibida (custom vs capa viagem) |

---

### Rotas App.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/App.jsx`

```jsx
<Route path="groups/join/:codigo" element={<GroupJoinRedirect />} />
<Route path="groups" element={<GroupsPage />} />
<Route path="groups/:id" element={<GroupDetailPage />} />
```

Sidebar: `sidebarNavigation.js` → `{ path: '/groups', label: 'Grupos' }`

---

## 🧪 Arquivos de teste (Frontend)

| Arquivo | Cobertura |
|---------|-----------|
| `web/e2e/groups.spec.js` | Redirect unauth, create modal, admin foto |
| `web/tests/unit/services/grupoService.test.js` | `atualizarModoDivisaoGrupo` API call |
| `web/tests/unit/utils/groupInvite.test.js` | Normalização código convite |
| `web/tests/unit/utils/groupDetailUtils.test.js` | `calcularSaldosViagem` modos PRETENSAO/IGUAL |

---

## 📚 Documentação

- [PO M13](../../Documentacao/03-Auditorias/Product Owner/13-Grupos.md)
- [API Readme](../../Documentacao/02-Engenharia/API/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| jun/2026 | Migration `20260617140000_grupos` + backend completo |
| jul/2026 | Frontend `/groups` + chat + metas entregue |
| ago/2026 | Rate limit convites + unique viagem/grupo + metas atômicas |
