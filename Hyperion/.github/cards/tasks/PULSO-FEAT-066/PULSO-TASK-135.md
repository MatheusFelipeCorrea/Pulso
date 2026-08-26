---
card_id: PULSO-TASK-135
title: "Backend — resumo consolidado e contadores"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-066
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — resumo consolidado e contadores

> **Contexto:** RF-130 / RN-080 — totais me devem / eu devo.

## 📝 Descrição

Implementar `GET /dividas/resumo` e contadores de abas.

## 🛠️ Implementação

### `calcularResumo` / `montarResumo` (NOVO — CRIAR)

- Somar `valorRestante` por direção nas ativas
- Retornar `{ meDevem: { total, quantidade }, euDevo: { total, quantidade }, contadores }`
- Sync quitação antes de agregar

`contarPorAba` no repository para badges das tabs do frontend.

## 📋 Resumo

### ✅ Concluído
- Fórmula RN-080 definida

### ⏳ Pendente
- Implementar resumo e contadores
