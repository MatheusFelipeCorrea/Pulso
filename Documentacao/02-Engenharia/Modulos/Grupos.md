# 👥 Módulo Grupos — estado e gaps

> **Julho/2026** — alinhado ao código em `Codigo/Pulso/web` e `Codigo/Pulso/api`.  
> **Correções ago/2026 (auditoria PO):** rate limit 20 req/min por usuário em `GET /preview` e `POST /entrar`; `@unique` em `ViagemGrupo.grupoId` (1 viagem por grupo); criação de metas em transação Serializable com recontagem atômica do limite de 5.

## O que está entregue

### API (`/api/grupos`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/preview?codigo=` | Pré-visualizar grupo pelo código |
| POST | `/entrar` | Entrar com código de convite |
| GET | `/` | Listar grupos do usuário |
| POST | `/` | Criar grupo (nome, descrição, `urlImagem` opcional) |
| GET | `/:id` | Detalhe (membros, viagem, metas, mensagens recentes) |
| PATCH | `/:id` | Editar nome, descrição, imagem URL (admin) |
| POST | `/:id/imagem` | Upload de foto (multipart, campo `imagem`, admin) |
| DELETE | `/:id` | Excluir grupo (admin) |
| POST | `/:id/sair` | Sair do grupo |
| POST | `/:id/codigo/renovar` | Gerar novo código de convite (admin) |
| DELETE | `/:id/membros/:usuarioId` | Remover membro (admin) |
| PATCH | `/:id/membros/:usuarioId` | Alterar papel (ADMIN/MEMBRO) |
| POST | `/:id/viagem` | Vincular/criar viagem do grupo |
| PATCH | `/:id/viagem` | Editar viagem do grupo (admin) |
| DELETE | `/:id/viagem` | Desvincular viagem (admin) |
| GET | `/:id/viagem/media-passagem` | Estimativas avião/ônibus/trem |
| POST/PATCH/DELETE | `/:id/viagem/despesas[/:despesaId]` | CRUD pretensões (autor) |
| POST | `/:id/metas` | Criar até 5 metas (respeita limite ativas) |
| POST | `/:id/metas/:metaId/aportes` | Registrar aporte |
| GET | `/:id/mensagens` | Listar mensagens paginadas |
| POST | `/:id/mensagens` | Enviar mensagem no chat |

### Imagem do grupo (fallback)

Ordem de exibição (`imagemExibicao`):

1. `urlImagem` definida pelo admin (URL https)
2. Capa da viagem vinculada (`destinoMeta.coverImageUrl`)
3. Gradiente + ícone `Users`

Ao vincular viagem **sem** foto customizada, a capa do destino passa a aparecer automaticamente no card e no header.

### Notificações disparadas

| Evento | Tipo | Destinatários |
|--------|------|---------------|
| Entrar no grupo | `GRUPO_ATIVIDADE` | Demais membros |
| Sair / removido | `GRUPO_ATIVIDADE` | Demais membros |
| Excluir grupo | `GRUPO_ATIVIDADE` | Todos exceto admin |
| Pretensão criada | `GRUPO_ATIVIDADE` | Demais membros |
| Meta(s) criada(s) | `GRUPO_ATIVIDADE` | Demais membros |
| Meta do grupo atingida | `META_ATINGIDA` | Todos os membros |
| Desvincular viagem | `GRUPO_ATIVIDADE` | Demais membros |

### Frontend

| Rota | Tela |
|------|------|
| `/groups` | Lista — criar, entrar, convidar; admin **Excluir** / membro **Sair** |
| `/groups/:id` | Detalhe — 4 cards com ícones + header |
| `/groups/join/:codigo` | Redirect para entrar |

**Modais:** convite (link + WhatsApp + Instagram + **QR code**), editar grupo, gerenciar membros, viagem, pretensão, metas (múltiplas), aporte, imagem (upload de arquivo), excluir, sair.

**Chat:** **Socket.IO** em tempo real (`web/src/services/groupChatSocket.js`, path `/api/socket.io`) + REST para histórico (`GET /mensagens`). Requer API **long-running** — ver [TI5-Hospedagem.md](../Deploy/TI5-Hospedagem.md).

> **Premium:** rotas de grupos protegidas por `requirePremium`. Plano Free recebe 403.

**Viagem pessoal → grupo:** `TripFormModal` em `/trips` — toggle opcional para vincular a um grupo após criar.

---

## RF-091 — Divisão na viagem do grupo

Toggle no rodapé do card **Viagem do grupo**, persistido no servidor (`grupos.modo_divisao`, `PATCH /grupos/:id/modo-divisao` — qualquer membro pode alterar):

| Modo | Comportamento |
|------|----------------|
| **Por pretensão** | Exibe o total que cada membro **declarou** que pretende gastar (“deve”). |
| **Divisão igual** | `parteIgual = totalGrupo ÷ membros`. Para cada um: `pretensão − parteIgual` → **crédito** (verde) ou **deve**. |

**Limitações (não confundir com `/expense-split`):**

- Não gera “quem paga quem” (acerto de contas).
- Não há % customizada por membro.

**Roadmap:** o módulo **Divisão de Despesas** (`/expense-split`, API `/api/divisoes`, RF-106–120) já está implementado como módulo standalone, com split bill completo (rateio igual/personalizado, "quem paga quem", lembrete de cobrança). Falta apenas **vincular** ou substituir este toggle no detalhe do grupo por ele. Até lá, o toggle cobre o planejamento rápido da viagem compartilhada.

Implementação: `api/src/services/grupoService.js` → `atualizarModoDivisao`; `web/src/utils/groupDetailUtils.js` → `calcularSaldosViagem`.

---

## Requisitos (RF-084–098)

| RF | Status | Observação |
|----|--------|------------|
| RF-084 | ✅ | Criar grupo |
| RF-085 | ✅ | Código + link + renovar código |
| RF-086 | ✅ | Entrar por código |
| RF-087 | ✅ | Papéis ADMIN/MEMBRO + promoção/rebaixamento |
| RF-088 | ✅ | Vincular viagem (+ viagem pessoal → grupo em `/trips`) |
| RF-089 | ✅ | Pretensões por membro |
| RF-090 | ✅ | Total do grupo |
| RF-091 | ✅ | Pretensão + divisão igual, persistido no servidor. Split custom (quem paga quem) já existe em `/expense-split` (standalone) — integração com este toggle pendente |
| RF-092 | ✅ | Metas compartilhadas (até 5) |
| RF-093 | ✅ | Aportes + seletor de meta |
| RF-094 | ✅ | Dados pessoais isolados |
| RF-095 | ✅ | Sair (lista + detalhe) |
| RF-096 | ✅ | Admin remover / gerenciar membros |
| RF-097 | ✅ | Painel 4 cards + ícones |
| RF-098 | ✅ | Chat Socket.IO em tempo real + histórico REST. API long-running (TI5) |

---

## Gaps reais (prioridade)

### Alta — UX produto

| Gap | Detalhe |
|-----|---------|
| ~~**Upload de arquivo**~~ | ✅ `POST /grupos/:id/imagem` (jpg/png/webp, 2 MB) + picker na criação e edição |
| ~~**Foto no criar grupo**~~ | ✅ `GroupImagePicker` no modal criar; viagem continua como fallback automático |
| ~~**Descoberta “alterar foto”**~~ | ✅ Botão “Alterar foto” no header + ícone câmera sempre visível no hover |

### Média — produto

| Gap | Detalhe |
|-----|---------|
| **RF-091 completo (split custom)** | "Quem paga quem" já existe em `/expense-split` (standalone) — falta vincular/delegar a partir do detalhe do grupo |
| **Testes E2E grupos** | Playwright em `web/e2e/groups.spec.js` (login demo + modal criar) |

### Baixa / depois

| Gap | Detalhe |
|-----|---------|
| **Transferir admin único** | RN-113 parcialmente coberta por mensagens de erro |

### Fora de escopo imediato

- **Vincular toggle do grupo → `/expense-split`:** o módulo global já existe e está na sidebar; falta o trabalho de integração em si (ligar participantes do grupo aos participantes da divisão).
- **Chat em tempo real:** entregue via Socket.IO; exige hospedagem de API contínua (não serverless puro).

---

## Regras de negócio — aderência

| Regra | Status |
|-------|--------|
| RN-111 Código PULSO-XXXX | ✅ |
| RN-112 Criador = ADMIN | ✅ |
| RN-113 Único admin — restrições ao sair | ✅ |
| RN-114 Admin remove membros | ✅ |
| RN-115–117 Pretensões permanecem ao sair | ✅ |
| RN-118 Aportes rastreados por membro | ✅ |
| RN-119 Meta concluída automaticamente | ✅ |
| RN-120 Notificar ao excluir grupo | ✅ |

---

*Arquivos principais:* `api/src/services/grupoService.js`, `grupoNotificationService.js`, `web/src/pages/GroupDetailPage.jsx`, `web/src/components/features/groups/detail/GroupDetailTripCard.jsx`, `web/src/utils/groupDetailUtils.js`.
