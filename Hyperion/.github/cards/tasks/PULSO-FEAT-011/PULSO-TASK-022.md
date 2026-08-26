---
card_id: PULSO-TASK-022
title: "Frontend — FAB quick-add chatbot"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-011
due_date: null
categories:
  - Frontend
  - Web
  - Integração Externa
  - Inteligência Artificial
  - UX / UI
---

# [TASK] Frontend — FAB quick-add chatbot

> **Contexto:** RF-139 — atalho no dashboard para lançamento via linguagem natural.

## 📝 Descrição

Adicionar FAB (floating action button) no dashboard que abre o chatbot em modo quick-add de transação.

## ✅ Critérios de Aceite

### Cenário 1 — Visibilidade
**Então** FAB fixo canto inferior direito, visível apenas em `/dashboard`, acessível por teclado.

### Cenário 2 — Integração
**Quando** chatbot module disponível,  
**Então** abre painel com contexto `quick-add-transaction`.

### Cenário 3 — Pós-confirmação
**Então** dashboard recarrega dados após transação criada.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `components/features/dashboard/DashboardQuickAddFab.jsx` | FAB + handler open chatbot |
| Integração com módulo Chatbot (a criar) | Parser NL → `POST /transacoes` |

**Dependência externa:** módulo Chatbot/Insights (RF-139 bloqueado até existir)

## 📋 Resumo

### ✅ Concluído
- RF-139 especificado como extensão do dashboard

### ⏳ Pendente
- Implementar FAB e hook de abertura do chatbot
- Aguardar API/surface do módulo Chatbot
