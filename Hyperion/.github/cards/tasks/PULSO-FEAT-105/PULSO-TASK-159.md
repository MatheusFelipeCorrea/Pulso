---
card_id: PULSO-TASK-159
title: "Histórico da sessão no client e no prompt"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-105
due_date: null
categories:
  - Frontend
  - Backend
  - Web
  - Mobile
---

# [TASK] Histórico da sessão no client e no prompt

> **Contexto:** RF-061 — histórico só da sessão atual.

## 📝 Descrição

Manter mensagens da sessão na UI (Web e Flutter) e enviar janela limitada no `POST` para follow-ups.

## 🛠️ Implementação

Estado em memória no client (sem obrigar tabela de histórico). Backend aceita lista curta de turnos anteriores. Recarregar a página zera o histórico — comportamento aceito neste RF.

## 📋 Resumo

### ✅ Concluído
- Histórico de sessão (sem persistência longa) especificado

### ⏳ Pendente
- Estado da UI + janela no request
