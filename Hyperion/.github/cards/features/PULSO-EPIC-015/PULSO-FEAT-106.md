---
card_id: PULSO-FEAT-106
title: "Protótipo — chatbot"
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

# [FEATURE] Protótipo — chatbot

> **Contexto:** Tela/painel de chat financeiro. O Figma define o destino; a implementação é `PULSO-EPIC-016`. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-016` · **Refs:** RF-057–061

## 📖 Histórias

- Como **usuário**, quero uma conversa visível (campo, balões, recusa), para o chatbot não parecer um modal vazio.
- Como **usuário**, quero o histórico da sessão na tela, para acompanhar o que já perguntei.
- Como **usuário**, quero o chat em claro e escuro, desktop e mobile.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/chatbot` | Chat (mensagens, input, recusa fora de escopo) |
| UI | Painel/drawer reutilizável (FAB dashboard) |
| Empty / erro | Sessão vazia; falha da IA; rate limit |

## ✅ Critérios de Aceite

### Cenário 1 — Conversa
**Então** frames de pergunta, resposta financeira e recusa educada.

### Cenário 2 — Sessão
**Então** lista de mensagens da sessão; estado vazio inicial.

### Cenário 3 — Temas e viewport
**Então** desktop e mobile, claro e escuro.

### Cenário 4 — Fora de escopo
**Então** não se prototipa chave Gemini, rate limit de infra nem o miolo do prompt.

## 📋 Resumo

### ✅ Concluído
- Blocos do epic 016 mapeados para UI

### ⏳ Pendente
- Frames Figma claro/escuro
