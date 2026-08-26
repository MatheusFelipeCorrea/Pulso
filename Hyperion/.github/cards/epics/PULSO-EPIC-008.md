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

> **Contexto:** Espaços compartilhados para viagens e metas em grupo — convites PULSO-XXXX, papéis admin/membro, viagem compartilhada com pretensões, metas com aportes, chat em tempo real (Socket.IO) e notificações de atividade. **Premium** no escopo TI5.

**Refs:** RF-084–098 · RN-111–120

## 🎯 Objetivos

- CRUD de grupos com nome, descrição e imagem (URL ou upload) (RF-084)
- Código convite `PULSO-XXXX`, preview e entrar via código (RF-085, RF-086, RN-111)
- Papéis ADMIN/MEMBRO; admin remove membro e altera papel (RF-087, RF-096, RN-114)
- Viagem compartilhada 1:1 por grupo; pretensões por membro; total agregado (RF-088–090)
- Toggle divisão *Por pretensão* / *Divisão igual* persistido (`modoDivisao`) (RF-091)
- Até 5 metas compartilhadas; aportes rastreados por membro (RF-092–093, RN-118–119)
- Finanças pessoais isoladas dos dados do grupo (RF-094)
- Sair do grupo; admin exclui grupo com notificação (RF-095, RN-120)
- Painel detalhe com 4 cards: viagem, metas, membros, chat (RF-097)
- Chat em tempo real via **Socket.IO** (`/api/socket.io`) + histórico REST (RF-098); exige API long-running
- Gate **Premium** (`requirePremium`) nas rotas de grupos
- Rate limit 20 req/min em preview/entrar
- Notificações `GRUPO_ATIVIDADE` e `META_ATINGIDA` (escopo GRUPO)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/groups` | Lista grupos | Criar, entrar, convidar, excluir/sair |
| `/groups/:id` | Detalhe | Viagem, metas, membros, chat, RF-091 |
| `/groups/join/:codigo` | Redirect entrar | Deep link convite |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Viagens | `TripFormModal` vincular viagem pessoal → grupo |
| Notificações | `grupoNotificationService` |
| Divisão de Despesas | RF-106–111 standalone — integração RF-091 pendente |
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
- Escopo RF-084–098 e RN-111–120 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Integração toggle RF-091 ↔ `/expense-split` — evolução futura
