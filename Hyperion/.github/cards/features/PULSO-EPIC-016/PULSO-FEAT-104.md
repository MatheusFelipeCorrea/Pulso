---
card_id: PULSO-FEAT-104
title: "Guardrail — só finanças"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-016
due_date: null
categories:
  - Backend
  - Inteligência Artificial
  - Regra de Negócio
---

# [FEATURE] Guardrail — só finanças

> **Contexto:** RF-060 (lista original RF-052) — recusar perguntas fora do escopo financeiro.

**Refs:** RF-060

## 📝 Descrição

Como **produto**, o chatbot só fala de finanças pessoais do Pulso. Fora disso, recusa com mensagem clara e não dispara ferramenta de dados.

## ✅ Critérios de Aceite

### Cenário 1 — Dentro do escopo
**Quando** a pergunta é sobre gastos, saldo, meta ou categoria,  
**Então** segue o fluxo normal (contexto + Gemini).

### Cenário 2 — Fora do escopo
**Quando** a pergunta é irrelevante (ex.: receita de bolo, política, código),  
**Então** responde recusa educada, sem inventar dado financeiro.

### Cenário 3 — Prompt
**Então** o system prompt deixa o limite explícito; testes cobrem pelo menos um caso de recusa.

## 🔗 Sub-issues

- PULSO-TASK-158

## 📋 Resumo

### ✅ Concluído
- Política de recusa (RF-060) definida

### ⏳ Pendente
- PULSO-TASK-158 — prompt e testes de guardrail
