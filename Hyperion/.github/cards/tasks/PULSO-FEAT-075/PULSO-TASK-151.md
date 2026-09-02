---
card_id: "PULSO-TASK-151"
title: "Frontend — seções do painel e CSS"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-075"
due_date: null
board_sync_at: "2026-08-26T15:29:14.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [TASK] Frontend — seções do painel e CSS

> **Contexto:** Componentes visuais do insight personalizado.

## 📝 Descrição

Implementar cards/seções e estilos responsivos.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR) em `features/insights/`

| Componente | Função |
|------------|--------|
| `InsightSummaryCard` | Resumo mensal |
| `InsightCategoryVariance` | MoM por categoria |
| `InsightScoreGauge` | Score 0–100 (reusar ideia do dashboard health) |
| `InsightProjectionCharts` | Otimista / atual / pessimista |
| `InsightSuggestionsList` | Sugestões de economia |
| `InsightAlertsList` | Alertas cobertura/metas |
| `InsightEducationList` | Links Instagram/YouTube/artigos |
| `InsightRegenerateButton` | CTA + cota restante |

`styles/insights.css` — layout mobile-first.

## 📋 Resumo

### ✅ Concluído
- Mapa de seções definido

### ⏳ Pendente
- Implementar componentes e CSS
