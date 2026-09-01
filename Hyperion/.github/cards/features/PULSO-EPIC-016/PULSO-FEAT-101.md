---
card_id: PULSO-FEAT-101
title: "Interface de chat financeiro"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-016
due_date: null
categories:
  - Frontend
  - Web
  - Mobile
  - UX / UI
---

# [FEATURE] Interface de chat financeiro

> **Contexto:** RF-057 (lista original RF-049) — chatbot acessível via interface de chat na Web e no Flutter.

**Refs:** RF-057

## 📝 Descrição

Como **usuário autenticado**, quero uma tela/painel de chat, para conversar com o Pulso sobre minhas finanças.

## ✅ Critérios de Aceite

### Cenário 1 — Web
**Então** rota autenticada `/chatbot` (ou painel equivalente) com campo de mensagem, envio e área de respostas.

### Cenário 2 — Mobile
**Então** tela Flutter consome a mesma API REST.

### Cenário 3 — Acesso
**Então** o chat é alcançável pela navegação do app; o FAB do dashboard (`PULSO-FEAT-011`) pode reutilizar o mesmo painel.

### Cenário 4 — Estados
**Então** loading, erro (503/429) e vazio da sessão estão cobertos.

## 🔗 Sub-issues

- PULSO-TASK-154
- PULSO-TASK-155

## 📋 Resumo

### ✅ Concluído
- Superfície Web + Flutter mapeada (RF-057)

### ⏳ Pendente
- PULSO-TASK-154–155 — UI web e tela Flutter
