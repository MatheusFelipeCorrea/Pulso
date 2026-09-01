---
card_id: PULSO-EPIC-016
title: "Chatbot"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Mobile
  - Integração Externa
  - Inteligência Artificial
  - UX / UI
  - Regra de Negócio
---

# [EPIC] Chatbot

> **Contexto:** Chat financeiro (Web React e Flutter) na mesma API. O usuário pergunta em linguagem natural sobre as próprias finanças; o modelo só responde com dados dele e recusa o que estiver fora de escopo. Insights (painel, resumo mensal, score) continuam no `PULSO-EPIC-013`.

**Refs:** RF-057–061 · RF-015 (quick-add no dashboard, `PULSO-FEAT-011`)  
Na lista original do módulo Chatbot estes itens eram RF-049–053; na apostila (`docs/3.requisitos.md`) e no epic de Insights a numeração canônica é **RF-057–061**.

## 🎯 Objetivos

- Disponibilizar chatbot acessível via interface de chat (RF-057)
- Perguntas em linguagem natural sobre transações, saldos, metas e categorias (RF-058)
- Contextualizar respostas com os dados reais do usuário autenticado — nunca de outra conta (RF-059)
- Limitar o bot a finanças; recusar o restante (RF-060)
- Exibir o histórico da conversa na sessão atual (RF-061)
- IA via **Gemini Flash** (free tier), com **rate limit por usuário**
- Resumos mensais cacheados 1×/mês ficam no epic de Insights; insights simples continuam **rule-based** (fora do LLM) sempre que possível

## 🎭 Telas e fluxos

| Rota / UI | Tela | Fluxos principais |
|-----------|------|-------------------|
| `/chatbot` | Chat financeiro | Abrir conversa, enviar pergunta, ver recusa, histórico da sessão |
| UI | Painel/drawer | Mesmo contrato da página; reutilizado pelo FAB do dashboard (RF-015) |
| Mobile | Tela Chat | Mesma API REST |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Gemini Flash | Chave **Chatbot** distinta de PDF e de Insights |
| Transações / Saldos / Metas / Categorias | Contexto agregado só do usuário autenticado |
| Dashboard | FAB quick-add (`PULSO-FEAT-011`) reutiliza este chat |
| Insights | Não gera resumo mensal aqui; não substitui `/insights` |

## 🚫 Fora de escopo

- Painel de Insights, score, projeções e resumo mensal (`PULSO-EPIC-013`)
- Persistência de histórico além da sessão atual (RF-061)
- Bot WhatsApp / canais externos

## 🔗 Sub-issues

- PULSO-FEAT-100
- PULSO-FEAT-101
- PULSO-FEAT-102
- PULSO-FEAT-103
- PULSO-FEAT-104
- PULSO-FEAT-105

## 📋 Resumo

### ✅ Concluído
- Escopo RF-057–061 mapeado (lista original RF-049–053)
- Hierarquia Epic → 6 Features → 7 Tasks
- Custo: Gemini Flash + rate limit; Insights rule-based fora deste epic

### ⏳ Pendente
- Implementar provider, API, guardrail, UI web e Flutter
