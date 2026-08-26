---
card_id: PULSO-FEAT-092
title: "Protótipo — calendário e lembretes"
status: Backlog
type: Feature
priority: High
sprint: null
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

# [FEATURE] Protótipo — calendário e lembretes

> **Contexto:** `/calendar` — grade do mês, painel do dia, próximos vencimentos, banner Google Agenda. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-006` · **Refs:** RF-062–067

## 📖 Histórias

- Como **usuário**, quero ver o mês com transações e lembretes, para o calendário financeiro não ser só um grid vazio.
- Como **usuário**, quero criar lembrete e ver conectar/desconectar Google, para o opt-in de agenda aparecer no Figma.
- Como **usuário**, quero a grade em claro e escuro, para marcadores do dia continuarem contrastados.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/calendar` | Grade mensal + painel do dia + próximos |
| Banner | Google Agenda conectado / desconectado |
| Modal | CRUD lembrete (categoria, recorrência, sync) |
| Modal | Resync Google (pendentes / todos) |

## ✅ Critérios de Aceite

### Cenário 1 — Calendário
**Então** marcadores distinguem transação vs lembrete; clicar o dia abre o painel.

### Cenário 2 — Google e lembrete
**Então** estados conectado (e-mail) e desconectado; modal de lembrete com antecedência e “pago”.

### Cenário 3 — Temas e viewport
**Então** página + modais em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** tela de OAuth do Google pode ser um estado “redirecionando”, sem mockar o console Google.

## 📋 Resumo

### ✅ Concluído
- Grade, banner e modais do epic 006 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
