---
card_id: PULSO-TASK-155
title: "Mobile — tela de chat (Flutter)"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-101
due_date: null
categories:
  - Mobile
  - Frontend
  - UX / UI
---

# [TASK] Mobile — tela de chat (Flutter)

> **Contexto:** RF-057 — mesmo contrato REST da Web.

## 📝 Descrição

Tela de chat no app Flutter: mensagens da sessão, envio, erros 503/429.

## 🛠️ Implementação

Consumir o mesmo endpoint da Web. JWT em secure storage (padrão do app). Não duplicar regra de negócio no client.

## 📋 Resumo

### ✅ Concluído
- Tela Flutter no mesmo contrato da API

### ⏳ Pendente
- Implementar screen + client HTTP
