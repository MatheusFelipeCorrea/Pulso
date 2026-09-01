---
card_id: PULSO-FEAT-105
title: "Histórico da conversa na sessão"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-016
due_date: null
categories:
  - Frontend
  - Backend
  - Web
  - Mobile
  - UX / UI
---

# [FEATURE] Histórico da conversa na sessão

> **Contexto:** RF-061 (lista original RF-053, desejável) — histórico só da sessão atual.

**Refs:** RF-061

## 📝 Descrição

Como **usuário**, quero ver as mensagens já trocadas nesta sessão, para continuar o papo sem perder o contexto imediato.

## ✅ Critérios de Aceite

### Cenário 1 — Na sessão
**Então** a UI lista perguntas e respostas da sessão corrente, em ordem.

### Cenário 2 — Nova sessão
**Quando** o usuário recarrega/fecha a sessão,  
**Então** o histórico anterior não é exigido (sem persistência além da sessão).

### Cenário 3 — Contexto do modelo
**Então** as mensagens da sessão podem ir no prompt (janela limitada) para follow-ups.

## 🔗 Sub-issues

- PULSO-TASK-159

## 📋 Resumo

### ✅ Concluído
- Histórico de sessão (RF-061) definido; persistência longa fora de escopo

### ⏳ Pendente
- PULSO-TASK-159 — estado da sessão Web/API/Flutter
