---
card_id: PULSO-FEAT-009
title: "Widgets resumo e saúde financeira"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - Backend
  - UX / UI
  - Regra de Negócio
---

# [FEATURE] Widgets resumo e saúde financeira

> **Contexto:** Blocos informativos complementares — transações recentes, alertas de orçamento, metas ativas e score de saúde (RF-011–014).

**Refs:** RF-011 · RF-012 · RF-013 · RF-014

## 📝 Descrição

Compor widgets que consomem dados já agregados em `GET /dashboard`: últimas 25 transações do mês, categorias de orçamento ≥80%, até 4 metas ATIVAS e score 0–100 com checklist.

## ✅ Critérios de Aceite

### Cenário 1 — Últimas transações
**Então** lista com descrição, valor, categoria e link para `/transactions`.

### Cenário 2 — Alertas orçamento
**Então** banner/cards para categorias ≥80% do limite; destaque visual para ≥100%.

### Cenário 3 — Metas ativas
**Então** cards com progresso %, valor atual/meta e link para `/goals`.

### Cenário 4 — Saúde financeira
**Então** score 0–100, label (Atenção/Regular/Bom/Excelente), mensagem e checklist (fluxo, orçamento, metas).

## 🔗 Sub-issues

- PULSO-TASK-018
- PULSO-TASK-019

## 📋 Resumo

### ✅ Concluído
- Algoritmo de score e critérios de alerta especificados

### ⏳ Pendente
- PULSO-TASK-018 — widgets transações, alertas e metas
- PULSO-TASK-019 — `calcularSaudeFinanceira` + componente health
