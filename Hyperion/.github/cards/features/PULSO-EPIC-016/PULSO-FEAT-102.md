---
card_id: PULSO-FEAT-102
title: "Perguntas em linguagem natural"
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
  - Inteligência Artificial
  - Integração Externa
---

# [FEATURE] Perguntas em linguagem natural

> **Contexto:** RF-058 (lista original RF-050) — perguntas livres sobre transações, saldos, metas e categorias.

**Refs:** RF-058

## 📝 Descrição

Como **usuário**, quero perguntar em texto livre (ex.: "quanto gastei com alimentação este mês?"), para não depender só de filtros da UI.

## ✅ Critérios de Aceite

### Cenário 1 — Domínios
**Então** o endpoint aceita pergunta em linguagem natural e responde sobre transações, saldos, metas e categorias.

### Cenário 2 — API
**Quando** `POST` autenticado de mensagem,  
**Então** retorna texto da resposta (e metadados mínimos); validação Zod da entrada.

### Cenário 3 — Quick-add
**Então** o mesmo parser pode ser reutilizado pelo FAB do dashboard (RF-015) para propor uma transação — a confirmação continua no epic do dashboard.

## 🔗 Sub-issues

- PULSO-TASK-156

## 📋 Resumo

### ✅ Concluído
- Contrato de perguntas NL (RF-058) definido

### ⏳ Pendente
- PULSO-TASK-156 — endpoint e orquestração LLM
