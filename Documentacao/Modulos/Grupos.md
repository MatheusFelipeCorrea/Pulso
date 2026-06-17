# 👥 Módulo Grupos — estado e gaps

> **Junho/2026** — alinhado ao código em `Codigo/Pulso/web` e `Codigo/Pulso/api`.

## O que está entregue

### API (`/api/grupos`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/preview?codigo=` | Pré-visualizar grupo pelo código |
| POST | `/entrar` | Entrar com código de convite |
| GET | `/` | Listar grupos do usuário |
| POST | `/` | Criar grupo |
| GET | `/:id` | Detalhe (membros, viagem, metas, mensagens) |
| PATCH | `/:id` | Editar nome, descrição, imagem (admin) |
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
| POST | `/:id/mensagens` | Enviar mensagem no chat |

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
| Meta pessoal atingida | `META_ATINGIDA` | Dono da meta (`metaService`) |

**Preview UI:** `/design-system#notificacoes` — 13 tipos com dados demo.

### Frontend

| Rota | Tela |
|------|------|
| `/groups` | Lista, criar, entrar, convidar, sair, excluir |
| `/groups/:id` | Detalhe em 4 cards + header |
| `/groups/join/:codigo` | Redirect para entrar |

**Modais:** convite (+ renovar código), editar grupo, gerenciar membros, viagem, pretensão, metas (múltiplas), aporte (seletor de meta), imagem, excluir, sair.

**Chat:** polling a cada 30s no detalhe.

---

## Requisitos (RF-088–RF-102)

| RF | Status | Observação |
|----|--------|------------|
| RF-088 | ✅ | Criar grupo |
| RF-089 | ✅ | Código + link + renovar código |
| RF-090 | ✅ | Entrar por código |
| RF-091 | ✅ | Papéis ADMIN/MEMBRO com promoção |
| RF-092 | ✅ | Vincular viagem |
| RF-093 | ✅ | Pretensões por membro |
| RF-094 | ✅ | Total do grupo |
| RF-095 | 🟡 | Total por pretensões (“deve”), sem divisão customizada |
| RF-096 | ✅ | Metas compartilhadas (múltiplas até 5) |
| RF-097 | ✅ | Aportes individuais + seletor de meta |
| RF-098 | ✅ | Dados pessoais isolados |
| RF-099 | ✅ | Sair (detalhe + lista) |
| RF-100 | ✅ | Admin remover membro |
| RF-101 | ✅ | Painel resumo (4 cards) |
| RF-102 | 🟡 | Chat com polling 30s (sem WebSocket) |

---

## Gaps restantes (baixa prioridade)

1. **Chat tempo real** — WebSocket ou SSE.
2. **Paginação de mensagens** — hoje últimas 100 no `GET /:id`.
3. **Viagem pessoal → grupo** — seletor no `TripFormModal` ainda desabilitado.
4. **Testes automatizados** — cobertura mínima em grupos.

---

## Regras de negócio — aderência

| Regra | Status |
|-------|--------|
| RN-111 Código PULSO-XXXX | ✅ |
| RN-112 Criador = ADMIN | ✅ |
| RN-113 Único admin não pode sair se houver outros | ✅ |
| RN-114 Admin remove membros | ✅ |
| RN-115–117 Pretensões permanecem ao sair | ✅ |
| RN-118 Aportes rastreados por membro | ✅ |
| RN-119 Meta concluída automaticamente | ✅ |
| RN-120 Notificar ao excluir grupo | ✅ |

---

*Arquivos principais:* `api/src/services/grupoService.js`, `grupoNotificationService.js`, `web/src/pages/GroupDetailPage.jsx`, `web/src/styles/groups.css`.
