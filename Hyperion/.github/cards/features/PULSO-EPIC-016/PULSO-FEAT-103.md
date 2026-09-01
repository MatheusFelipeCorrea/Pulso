---
card_id: PULSO-FEAT-103
title: "Contexto com dados reais do usuário"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-016
due_date: null
categories:
  - Backend
  - Regra de Negócio
  - Inteligência Artificial
---

# [FEATURE] Contexto com dados reais do usuário

> **Contexto:** RF-059 (lista original RF-051) — respostas ancoradas nos dados do usuário autenticado.

**Refs:** RF-059

## 📝 Descrição

Agregar transações, saldos, metas e categorias **somente** da conta logada e injetar esse contexto no prompt. Sem dados de outros usuários.

## ✅ Critérios de Aceite

### Cenário 1 — Isolamento
**Dado** usuário A autenticado,  
**Então** o payload enviado ao Gemini não contém registros do usuário B.

### Cenário 2 — Fidelidade
**Quando** a pergunta depende de saldo/meta/categoria,  
**Então** a resposta usa os números do backend, não um chute genérico.

### Cenário 3 — Sem dados
**Então** o bot admite falta de histórico em vez de inventar lançamentos.

## 🔗 Sub-issues

- PULSO-TASK-157

## 📋 Resumo

### ✅ Concluído
- Isolamento por usuário (RF-059) definido

### ⏳ Pendente
- PULSO-TASK-157 — agregação de contexto
