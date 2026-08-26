---
card_id: PULSO-TASK-044
title: "Frontend — GoalsPage, tabs, filtros e sidebar"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — GoalsPage, tabs, filtros e sidebar

> **Contexto:** Shell da página `/goals` com fetch paralelo lista + resumo.

## 📝 Descrição

Implementar página principal com tabs por status, busca, filtros de prazo, paginação e sidebar de resumo.

## 🛠️ Implementação

### Páginas e componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/GoalsPage.jsx` | Orquestração estado, modais, fetch |
| `GoalTabs.jsx` | Todas / Ativas / Pausadas / Concluídas |
| `GoalList.jsx` | Lista paginada de metas |
| `GoalSidebar.jsx` | Resumo, donut categorias, atividade recente |
| `GoalCategoriesDonut.jsx` | Distribuição curto/longo/concluídas/pausadas |
| `GoalRecentActivity.jsx` | Feed aportes + conclusões |
| `services/metaService.js` | `buscarMetas`, `obterResumo`, CRUD, aportes |
| `utils/goalFilters.js` | `GOAL_TABS`, `buildApiFiltros`, `DEFAULT_GOAL_FILTROS` |

**Padrão:** `AbortController`; headers paginação; `Promise.all` resumo + lista

**Rota:** `App.jsx` → `path="goals"` sob MainLayout

## 📋 Resumo

### ✅ Concluído
- Spec de estado e layout definida

### ⏳ Pendente
- Implementar página e componentes de listagem/resumo
