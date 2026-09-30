---
card_id: PULSO-FEAT-020
title: "Aportes e ciclo de vida da meta"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Notificações
---

# [FEATURE] Aportes e ciclo de vida da meta

> **Contexto:** Registrar aportes, auto-conclusão, pausar/retomar, exclusão com reabertura e notificação de meta atingida.

**Refs:** RF-030 · RF-034 · RF-035 · RN-062–066 · RN-063

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
- Notificação `META_ATINGIDA` ao concluir via aporte (RF-035)

## 🔗 Sub-issues

- PULSO-TASK-042
- PULSO-TASK-043

## 🔗 Pull Requests

- [#314](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/314) — aportes e ciclo de vida na API

## 📋 Resumo

### ✅ Concluído
- Aportes, conclusão e transições mergeados na Sprint-3 (In Revision)
