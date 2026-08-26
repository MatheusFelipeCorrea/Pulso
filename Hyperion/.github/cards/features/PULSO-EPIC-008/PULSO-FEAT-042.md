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
