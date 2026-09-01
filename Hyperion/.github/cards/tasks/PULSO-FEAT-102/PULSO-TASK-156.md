---
card_id: PULSO-TASK-156
title: "Backend — endpoint de mensagem em linguagem natural"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-102
due_date: null
categories:
  - Backend
  - Inteligência Artificial
---

# [TASK] Backend — endpoint de mensagem em linguagem natural

> **Contexto:** RF-058 — perguntas sobre transações, saldos, metas e categorias.

## 📝 Descrição

Expor `POST` autenticado que recebe o texto da pergunta e devolve a resposta do chatbot.

## 🛠️ Implementação

Camadas: controller → service (orquestra contexto + guardrail + Gemini) → provider.

Validar body (texto não vazio). Não inventar path/método além do contrato REST autenticado.

## 📋 Resumo

### ✅ Concluído
- Contrato de mensagem NL definido

### ⏳ Pendente
- Implementar rota, service e validação
