---
card_id: PULSO-TASK-154
title: "Frontend — página/painel de chat (Web)"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-101
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — página/painel de chat (Web)

> **Contexto:** RF-057 — superfície web do chatbot.

## 📝 Descrição

Implementar rota `/chatbot` (e painel reutilizável) autenticada.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| página `/chatbot` | Shell da conversa |
| componente de chat | Input, lista de mensagens, estados loading/erro/429 |
| `chatbotService` (client) | `POST` da mensagem |

Reutilizar o painel no FAB do dashboard quando `PULSO-FEAT-011` entrar.

## 📋 Resumo

### ✅ Concluído
- Superfície web especificada

### ⏳ Pendente
- Implementar página e client
