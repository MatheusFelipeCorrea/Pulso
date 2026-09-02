---
card_id: "PULSO-EPIC-008"
title: "Grupos"
status: "Backlog"
type: "Epic"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
board_sync_at: "2026-08-26T15:29:28.000Z"
categories:
  - "web"
  - "Backend"
  - "Banco de Dados"
  - "Frontend"
  - "Regra de Negócio"
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
