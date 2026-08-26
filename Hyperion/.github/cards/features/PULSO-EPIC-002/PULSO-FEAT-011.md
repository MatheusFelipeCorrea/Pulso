---
card_id: PULSO-FEAT-011
title: "Quick-add via chatbot"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - Integração Externa
  - Inteligência Artificial
  - UX / UI
---

# [FEATURE] Quick-add via chatbot

> **Contexto:** Botão de acesso rápido (FAB) no dashboard para registrar transação em linguagem natural via chatbot (RF-139). **Depende do módulo Chatbot/Insights.**

**Refs:** RF-139

## 📝 Descrição

Como **usuário**, quero um atalho no dashboard para abrir o chatbot e registrar uma transação por texto livre (ex.: "gastei 45 reais no almoço"), reutilizando parser Gemini Flash do chatbot.

## ✅ Critérios de Aceite

### Cenário 1 — FAB visível
**Então** botão flutuante fixo no dashboard (mobile-friendly).

### Cenário 2 — Abrir chatbot
**Quando** clico no FAB,  
**Então** abre painel/modal do chatbot focado em quick-add de transação.

### Cenário 3 — Confirmação
**Quando** chatbot propõe transação parseada,  
**Então** usuário confirma e transação é criada; dashboard recarrega.

## 🔗 Sub-issues

- PULSO-TASK-022

## 📋 Resumo

### ✅ Concluído
- RF-139 documentado como extensão do dashboard

### ⏳ Pendente
- PULSO-TASK-022 — FAB + integração chatbot (bloqueado até módulo Chatbot existir)
