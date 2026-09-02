---
card_id: "PULSO-FEAT-020"
title: "Aportes e ciclo de vida da meta"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-004"
due_date: null
board_sync_at: "2026-08-26T15:29:53.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Notificações"
---


# [FEATURE] Aportes e ciclo de vida da meta

> **Contexto:** Registrar aportes, auto-conclusão, pausar/retomar, exclusão com reabertura e notificação de meta atingida.

**Refs:** RF-027 · RF-031 · RF-032 · RN-062–066 · RN-063

## 📝 Descrição

Implementar fluxos de aporte e transições de status com validações de domínio e integração a notificações.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/metas/:id/aportes` | Registra aporte; atualiza `valorAtual`; auto-conclui se `valorRestante <= 0` |
| `DELETE` | `/metas/:id/aportes/:aporteId` | Remove aporte; recalcula; reabre meta CONCLUIDA → ATIVA se necessário |

**Regras:**
- Aporte só em meta ATIVA (RN-064, RN-066)
- Valor aporte ≤ valor restante (RN-062)
- Data aporte não futura
- Pausar só ATIVA; retomar só PAUSADA
- Conclusão manual só se `valorRestante <= 0`
- Notificação `META_ATINGIDA` ao concluir via aporte (RF-032)

## 🔗 Sub-issues

- PULSO-TASK-042
- PULSO-TASK-043

## 📋 Resumo

### ✅ Concluído
- Máquina de estados e regras RN-062–066 documentadas

### ⏳ Pendente
- PULSO-TASK-042–043 — aportes, conclusão e transições
