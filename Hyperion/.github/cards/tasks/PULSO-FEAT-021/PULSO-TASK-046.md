---
card_id: "PULSO-TASK-046"
title: "Frontend — aportes, exclusão e GoalAportesSection"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-021"
due_date: null
board_sync_at: "2026-08-26T15:31:34.000Z"
categories:
  - "web"
  - "Frontend"
  - "Regra de Negócio"
  - "UX / UI"
---


# [TASK] Frontend — aportes, exclusão e GoalAportesSection

> **Contexto:** Modais de aporte e exclusão; histórico editável no edit (RF-NOVO-D2).

## 📝 Descrição

Implementar fluxos de contribuição, confirmação de delete e seção de histórico de aportes com exclusão individual.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `GoalContributionModal.jsx` | Registrar aporte (valor + data) |
| `DeleteGoalModal.jsx` | Confirmar exclusão irreversível |
| `GoalAportesSection.jsx` | Lista aportes no edit; excluir com reabertura |

**Regras UI:**
- Botão aporte desabilitado se PAUSADA/CONCLUIDA (RN-064, RN-066)
- Valor máximo = valorRestante
- Loading states `deletingAporteId`

## 📋 Resumo

### ✅ Concluído
- Fluxos de aporte e correção pós-conclusão especificados

### ⏳ Pendente
- Implementar modais e GoalAportesSection
