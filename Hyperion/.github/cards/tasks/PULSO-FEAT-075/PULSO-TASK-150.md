---
card_id: "PULSO-TASK-150"
title: "Frontend — InsightsPage e client"
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
---


# [TASK] Frontend — InsightsPage e client

> **Contexto:** Página `/insights` orquestrando o painel.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/InsightsPage.jsx` | Load snapshot; mês; regenerar |
| `services/insightsService.js` | GET painel, GET score, POST regenerar |
| Rota | `App.jsx` → `/insights` (trocar `InDevelopmentPage`) |

Estados: loading, empty (poucos dados), 503 Gemini, erro genérico, sucesso.

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client
