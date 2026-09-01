---
card_id: PULSO-FEAT-091
title: "Protótipo — viagens e moedas"
status: "In Progress"
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

# [FEATURE] Protótipo — viagens e moedas

> **Contexto:** `/trips` (conversor, favoritas, câmbio, lista) e `/trips/:id` (pretensões, observações, meta). Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-005` · **Refs:** RF-037–047

## 📖 Histórias

- Como **usuário**, quero converter moedas e ver viagens planejadas, para o módulo não ser só uma lista.
- Como **usuário**, quero o detalhe com pretensões por categoria e vínculo com meta, para o planejamento da viagem aparecer completo.
- Como **usuário**, quero lista e detalhe em claro e escuro, para gráfico de câmbio e capas continuarem ok.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/trips` | Conversor, favoritas, gráfico, lista |
| `/trips/:id` | Detalhe (pretensões, observações, meta, transporte) |
| Modal | Nova / editar viagem |
| Modal | Pretensão / observação |
| Empty | Sem viagens |

## ✅ Critérios de Aceite

### Cenário 1 — Lista
**Então** conversor BRL, chips de favoritas, gráfico de cotação e cards de viagem.

### Cenário 2 — Detalhe
**Então** breakdown por categoria de pretensão, observações (checklist/link), card de meta vinculada.

### Cenário 3 — Temas e viewport
**Então** ambas as rotas + modais em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não se prototipa tela de “cache 5 min” nem escolha de provider Duffel; viagem de **grupo** fica na feature de grupos.

## 📋 Resumo

### ✅ Concluído
- Rotas e modais do epic 005 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
