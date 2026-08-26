---
card_id: PULSO-FEAT-096
title: "Protótipo — divisão de despesas"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-015
due_date: null
categories:
  - Protótipo
  - UX / UI
  - Web
  - Mobile
---

# [FEATURE] Protótipo — divisão de despesas

> **Contexto:** `/expense-split` — split com nomes livres, rateio igual ou personalizado, saldo me devem/eu devo, lembrete. Claro e escuro na mesma feature. Não é o módulo Grupos.

**Produto:** `PULSO-EPIC-011` · **Refs:** RF-106–111

## 📖 Histórias

- Como **usuário**, quero registrar uma conta compartilhada e ver quem deve o quê, para o split bill existir no Figma.
- Como **usuário**, quero marcar partes pagas e ver histórico, para quitação/reabertura aparecerem.
- Como **usuário**, quero a página em claro e escuro, para saldos positivos/negativos continuarem claros.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/expense-split` | Lista + saldo consolidado |
| Modal | Criar / editar divisão (participantes, rateio) |
| UI | Marcar pago / quitar |
| UI | Lembrete de cobrança |
| Empty | Sem divisões |
| Histórico | Itens quitados |

## ✅ Critérios de Aceite

### Cenário 1 — Lista
**Então** saldo consolidado (me devem vs eu devo) e lista paginada.

### Cenário 2 — Rateio
**Então** igual vs personalizado; “Você” já incluso; valores em reais visíveis.

### Cenário 3 — Temas e viewport
**Então** página + modais em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** o lembrete pode ser um CTA que “abre” o visual de lembrete; não duplicar o calendário inteiro.

## 📋 Resumo

### ✅ Concluído
- Tela e fluxos do epic 011 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
