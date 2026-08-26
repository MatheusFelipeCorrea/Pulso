---
card_id: PULSO-FEAT-095
title: "Protótipo — planejamento de compra"
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

# [FEATURE] Protótipo — planejamento de compra

> **Contexto:** `/purchase-planning` — desejos, simulação à vista/parcelado, alerta de comprometimento, vínculo com meta, “Comprei!”. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-010` · **Refs:** RF-124–129

## 📖 Histórias

- Como **usuário**, quero listar itens desejados com prioridade e tempo estimado, para a lista de compras planejadas existir no Figma.
- Como **usuário**, quero simular parcelas e marcar como comprado, para o fluxo até a transação aparecer (a transação em si não precisa de tela extra).
- Como **usuário**, quero a página em claro e escuro, para alertas >20%/30% continuarem visíveis.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/purchase-planning` | Lista, resumo, histórico de comprados |
| Modal | CRUD item (valor, prioridade, imagem) |
| UI | Simular à vista vs parcelado |
| UI | Vincular / criar meta |
| UI | Confirmar “Comprei!” |
| Empty | Sem itens |

## ✅ Critérios de Aceite

### Cenário 1 — Lista e painel
**Então** cards com prioridade, meses até comprar, dicas/resumo do epic.

### Cenário 2 — Simulação e compra
**Então** comparação à vista/parcelado; faixas de comprometimento; CTA comprei com confirmação.

### Cenário 3 — Temas e viewport
**Então** página + modais em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não se prototipa upload técnico (Wikimedia/og:image); um campo de imagem no modal basta.

## 📋 Resumo

### ✅ Concluído
- Tela e fluxos do epic 010 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
