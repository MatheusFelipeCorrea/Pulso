---
card_id: PULSO-FEAT-043
title: "Chat e notificações de grupo"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-008
due_date: null
categories:
  - Backend
  - Notificações
---

# [FEATURE] Chat e notificações de grupo

> **Contexto:** Mensagens paginadas no grupo e eventos notificados aos membros.

**Refs:** RF-098 · RN-120

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

**Frontend:** Socket.IO em tempo real + REST para histórico; reconnect com fallback

## 🔗 Sub-issues

- PULSO-TASK-088

## 📋 Resumo

### ✅ Concluído
- Eventos e chat RF-098 especificados

### ⏳ Pendente
- PULSO-TASK-088 — chat e notificações
