---
card_id: PULSO-FEAT-090
title: "Protótipo — metas financeiras"
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

# [FEATURE] Protótipo — metas financeiras

> **Contexto:** `/goals` com tabs, sidebar de resumo e modais de meta/aporte. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-004` · **Refs:** RF-029–036

## 📖 Histórias

- Como **usuário**, quero ver metas por status e progresso, para decidir o que aportar.
- Como **usuário**, quero criar meta (incluindo atalho de reserva de emergência) e registrar aporte, para o ciclo de vida aparecer no Figma.
- Como **usuário**, quero a página em claro e escuro, para barras e donut continuarem legíveis.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/goals` | Lista + tabs + filtros + sidebar |
| Modal | Nova / editar meta |
| Modal | Registrar aporte |
| Modal | Excluir meta |
| Empty | Sem metas |

## ✅ Critérios de Aceite

### Cenário 1 — Lista
**Então** tabs todas/ativas/pausadas/concluídas; busca e prazo; alerta visual de meta vencida.

### Cenário 2 — Modais
**Então** criação com atalho reserva de emergência; aporte com valor/data; confirmação de exclusão.

### Cenário 3 — Temas e viewport
**Então** página + modais em claro **e** escuro, desktop **e** mobile (sidebar abaixo da lista no mobile, como o card de produto).

### Cenário 4 — Fora de escopo
**Então** metas de **grupo** ficam na feature de grupos, não aqui.

## 📋 Resumo

### ✅ Concluído
- Telas do epic 004 mapeadas

### ⏳ Pendente
- Frames Figma claro/escuro
