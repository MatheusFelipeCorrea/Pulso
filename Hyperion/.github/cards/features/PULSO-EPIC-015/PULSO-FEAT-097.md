---
card_id: PULSO-FEAT-097
title: "Protótipo — dívidas pessoais"
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

# [FEATURE] Protótipo — dívidas pessoais

> **Contexto:** `/debts` — me devem / eu devo / quitadas, pagamentos parciais, badge vencida. Claro e escuro na mesma feature. Dívida **não** gera transação na UI.

**Produto:** `PULSO-EPIC-012` · **Refs:** RF-117–123

## 📖 Histórias

- Como **usuário**, quero registrar o que me devem e o que eu devo, para empréstimos pessoais terem uma tela só.
- Como **usuário**, quero pagar parcialmente, quitar e ver histórico, para o ciclo de vida caber no Figma.
- Como **usuário**, quero a página em claro e escuro, para tabs e badge “Vencida” continuarem óbvios.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/debts` | Tabs Me devem / Eu devo / Quitadas + saldo |
| Modal | Nova / editar dívida |
| UI | Pagamento parcial / quitar / reabrir |
| Empty | Sem dívidas na tab |
| Badge | Vencida |

## ✅ Critérios de Aceite

### Cenário 1 — Lista
**Então** tabs do epic, saldo consolidado, prazo visível.

### Cenário 2 — Pagamentos
**Então** fluxo de parcial e quitar; reabrir se desfizer pagamento.

### Cenário 3 — Temas e viewport
**Então** página + modais em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não há tela de “criar transação a partir da dívida”; o card de produto proíbe isso.

## 📋 Resumo

### ✅ Concluído
- Tela e fluxos do epic 012 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
