# 👥 Módulo Grupos — estado e gaps

> **Junho/2026** — alinhado ao código em `Codigo/Pulso/web` e `Codigo/Pulso/api`.

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

**Modais:** convite, editar grupo, gerenciar membros, viagem, pretensão, metas (múltiplas), aporte, imagem (URL), excluir, sair.

**Chat:** sync ~10s + “Carregar mensagens anteriores” (`GET /mensagens`, 20 por página). Detalhe do grupo também faz polling geral ~30s.

**Viagem pessoal → grupo:** `TripFormModal` em `/trips` — toggle opcional para vincular a um grupo após criar.

---

## RF-095 — Divisão na viagem do grupo (MVP)

Toggle no rodapé do card **Viagem do grupo** (estado salvo no `localStorage` por grupo):

| Modo | Comportamento |
|------|----------------|
| **Por pretensão** | Exibe o total que cada membro **declarou** que pretende gastar (“deve”). |
| **Divisão igual** | `parteIgual = totalGrupo ÷ membros`. Para cada um: `pretensão − parteIgual` → **crédito** (verde) ou **deve**. |

**Limitações do MVP (não confundir com `/expense-split`):**

- Cálculo **só na UI** — não persiste no servidor (preferência local).
- Não gera “quem paga quem” (acerto de contas).
- Não há % customizada por membro.

**Roadmap:** o módulo **Divisão de Despesas** (`/expense-split`, RF-115–120) trará split bill completo; depois de codado, fará sentido **vincular** ou substituir este toggle no detalhe do grupo. Até lá, o toggle cobre o planejamento rápido da viagem compartilhada.

Implementação: `web/src/utils/groupDetailUtils.js` → `calcularSaldosViagem`.

---

## Requisitos (RF-088–RF-102)

| RF | Status | Observação |
|----|--------|------------|
| RF-088 | ✅ | Criar grupo |
| RF-089 | ✅ | Código + link + renovar código |
| RF-090 | ✅ | Entrar por código |
| RF-091 | ✅ | Papéis ADMIN/MEMBRO + promoção/rebaixamento |
| RF-092 | ✅ | Vincular viagem (+ viagem pessoal → grupo em `/trips`) |
| RF-093 | ✅ | Pretensões por membro |
| RF-094 | ✅ | Total do grupo |
| RF-095 | 🟡 | MVP: pretensão + divisão igual (UI). Split custom → `/expense-split` |
| RF-096 | ✅ | Metas compartilhadas (até 5) |
| RF-097 | ✅ | Aportes + seletor de meta |
| RF-098 | ✅ | Dados pessoais isolados |
| RF-099 | ✅ | Sair (lista + detalhe) |
| RF-100 | ✅ | Admin remover / gerenciar membros |
| RF-101 | ✅ | Painel 4 cards + ícones |
| RF-102 | 🟡 | Chat com polling + paginação (sem WebSocket) |

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
| **Chat tempo real** | WebSocket ou SSE (hoje polling) |
| **RF-095 completo** | Delegar ao módulo `/expense-split` quando existir |
| **Modo divisão no servidor** | Opcional: salvar preferência no perfil ou no grupo |
| **Testes E2E grupos** | Playwright em `web/e2e/groups.spec.js` (login demo + modal criar) |

### Baixa / depois

| Gap | Detalhe |
|-----|---------|
| **Página `/achievements`** | Notificações STREAK/CONQUISTA já disparam; UI pendente |
| **Transferir admin único** | RN-113 parcialmente coberta por mensagens de erro |

### Fora de escopo imediato

- **Vincular toggle do grupo → `/expense-split`:** só após o módulo global existir (sidebar hoje é placeholder).

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
