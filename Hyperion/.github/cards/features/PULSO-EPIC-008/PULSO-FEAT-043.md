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
