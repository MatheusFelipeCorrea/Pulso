---
card_id: PULSO-FEAT-094
title: "Protótipo — orçamento mensal"
status: Done
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

# [FEATURE] Protótipo — orçamento mensal

> **Contexto:** `/budget` — limites por categoria, progresso, copiar mês, alertas 80%/100%. Claro e escuro na mesma feature. Orçamento **não bloqueia** lançamento: o visual é alerta, não lock.

**Produto:** `PULSO-EPIC-009` · **Refs:** RF-099–105

## 📖 Histórias

- Como **usuário**, quero ver quanto já gastei vs. o limite do mês, para o orçamento ser uma tela de status, não uma planilha crua.
- Como **usuário**, quero editar limites e copiar o mês anterior, para os fluxos do epic existirem no Figma.
- Como **usuário**, quero a página em claro e escuro, para barras 80%/100% continuarem distinguíveis.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/budget` | Status do mês + lista por categoria |
| UI | Edição de limites |
| UI | Copiar mês anterior |
| Empty | Mês sem orçamento |
| Alerta | Warning renda vs. orçamento total (RN-059) |

## ✅ Critérios de Aceite

### Cenário 1 — Status
**Então** filtro de mês, progresso por categoria, resumo do que ainda pode gastar, estados 80% e 100%.

### Cenário 2 — Edição e cópia
**Então** editar limites inline ou modal; copiar mês com feedback se o destino já tiver dados.

### Cenário 3 — Temas e viewport
**Então** página e estados de alerta em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não se prototipa o job de notificação; o alerta visual na tela basta.

## 👤 Responsável

- Maria Clara (`mariaoliveira27`)

## 📋 Resumo

### ✅ Concluído
- Tela e fluxos do epic 009 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
