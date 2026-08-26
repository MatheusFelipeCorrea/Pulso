---
card_id: PULSO-FEAT-066
title: "Saldo consolidado e contadores"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Saldo consolidado e contadores

> **Contexto:** Resumo me devem / eu devo para cards e tabs (RF-130).

**Refs:** RF-130 · RF-131 · RN-080

## 📝 Descrição

Implementar `GET /dividas/resumo` com totais e contadores por aba.

## ✅ Critérios de Aceite

- `meDevem` / `euDevo`: `{ total, quantidade }` sobre valor restante de ativas
- `contadores` por aba (me devem, eu devo, quitadas)
- Somente dívidas não quitadas entram no saldo consolidado
- Listagem sincroniza quitação antes de filtrar

## 🔗 Sub-issues

- PULSO-TASK-135

## 📋 Resumo

### ✅ Concluído
- Contrato de resumo definido

### ⏳ Pendente
- PULSO-TASK-135 — calcularResumo e contadores
