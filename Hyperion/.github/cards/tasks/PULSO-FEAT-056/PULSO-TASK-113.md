---
card_id: PULSO-TASK-113
title: "Frontend — PurchasePlanningPage e client"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-056
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — PurchasePlanningPage e client

> **Contexto:** Página `/purchase-planning` orquestrando painel e modais.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/PurchasePlanningPage.jsx` | Load painel; CRUD; comprar; vincular; histórico |
| `services/purchasePlanningService.js` | listarPainel, criar, editar, excluir, comprar, vincular, imagem |
| Rota | `App.jsx` → `/purchase-planning`; sidebar + `appRoutes.js` |

Estados: form, link meta, delete confirm, buy confirm, history.

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client
