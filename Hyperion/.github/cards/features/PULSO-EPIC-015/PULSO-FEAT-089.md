---
card_id: PULSO-FEAT-089
title: "Protótipo — transações"
status: Backlog
type: Feature
priority: High
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-015
due_date: null
categories:
  - Protótipo
  - UX / UI
  - Web
  - Mobile
---

# [FEATURE] Protótipo — transações

> **Contexto:** Núcleo de lançamentos em `/transactions`. Claro e escuro na mesma feature. Validação visual recurso × categoria (VA/VR).

**Produto:** `PULSO-EPIC-003` · **Refs:** RF-016–028

## 📖 Histórias

- Como **usuário**, quero listar, filtrar e lançar receita/despesa/transferência, para o dia a dia financeiro caber no protótipo.
- Como **usuário**, quero categorias, tags, recorrência e exclusão “esta e futuras”, para os modais do epic existirem no Figma.
- Como **usuário**, quero o formulário em claro e escuro, para erros de incompatibilidade VA/VR continuarem visíveis nos dois temas.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/transactions` | Lista agrupada por data + resumo + filtros |
| Modal | Nova / editar (tipo, recurso, categoria, tags, recorrência) |
| Modal | Excluir simples ou recorrente |
| Modal | Categorias custom |
| Modal | Tags |
| Empty | Sem lançamentos no período |

## ✅ Critérios de Aceite

### Cenário 1 — Lista
**Então** filtros (período, categoria, tipo, recurso, busca) e cards de resumo sincronizados visualmente.

### Cenário 2 — Formulário
**Então** toggle receita/despesa/transferência; transferência não parece receita; estado de erro quando categoria não combina com VA/VR.

### Cenário 3 — Temas e viewport
**Então** página + modais em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não se prototipa a tela de “job diário” de recorrência.

## 📋 Resumo

### ✅ Concluído
- Lista e modais do epic 003 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
