---
card_id: PULSO-FEAT-017
title: "QA — testes de transações"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de transações

> **Contexto:** Cobertura de regressão para service, filtros, recorrência, regras de recurso e utils web.

**Refs:** RNF-015

## 📝 Descrição

Suites unitárias API e Web para fluxos críticos de transações, incluindo exclusão recorrente e validação VA/VR/VT.

## ✅ Critérios de Aceite

**Quando** `npm test` API,  
**Então** passam: `transactionService`, `transactionFilterService`, `recurringTransactions`, `recursoCategoriaRules`, `categorySuggestionService`, `transactionMapper`.

**Quando** `npm test` Web,  
**Então** passam: `transactionFilters`, `transactionValidation`, `transactionRecurrence`, `useTransactionFilterOptions`.

## 🔗 Sub-issues

- PULSO-TASK-036

## 📋 Resumo

### ✅ Concluído
- Escopo de testes mapeado

### ⏳ Pendente
- PULSO-TASK-036 — implementar/expandir suites
