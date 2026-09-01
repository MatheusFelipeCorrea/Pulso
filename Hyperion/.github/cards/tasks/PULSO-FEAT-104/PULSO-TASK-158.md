---
card_id: PULSO-TASK-158
title: "Backend — system prompt e recusa fora de finanças"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-104
due_date: null
categories:
  - Backend
  - Inteligência Artificial
  - QA / Testes
---

# [TASK] Backend — system prompt e recusa fora de finanças

> **Contexto:** RF-060 — chatbot só responde sobre finanças.

## 📝 Descrição

Definir system prompt de escopo e garantir recusa quando a pergunta sair do domínio.

## 🛠️ Implementação

Prompt: papel (assistente financeiro do Pulso), fontes (contexto injetado), proibições (outros assuntos, inventar lançamentos). Teste unitário/fixture com pelo menos uma pergunta fora de escopo.

## 📋 Resumo

### ✅ Concluído
- Política de recusa especificada

### ⏳ Pendente
- Prompt + teste de guardrail
