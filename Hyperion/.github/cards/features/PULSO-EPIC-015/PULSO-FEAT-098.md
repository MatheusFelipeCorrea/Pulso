---
card_id: PULSO-FEAT-098
title: "Protótipo — insights inteligentes"
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

# [FEATURE] Protótipo — insights inteligentes

> **Contexto:** `/insights` — painel do mês (resumo, score, projeções, sugestões, educação). Hoje o produto ainda cita `InDevelopmentPage`; o Figma define o destino. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-013` · **Refs:** RF-048–056

## 📖 Histórias

- Como **usuário**, quero um painel com resumo do meu mês e score, para insights não parecerem um artigo genérico.
- Como **usuário**, quero projeções, sugestões e links educativos, para o epic 013 caber numa tela.
- Como **usuário**, quero o painel em claro e escuro, para gráficos de cenário continuarem legíveis.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/insights` | Painel do mês (resumo, variação, score, projeções) |
| UI | Regenerar insights (cota / loading) |
| UI | Alertas com deep-link (orçamento / meta) |
| UI | Conteúdos educativos |
| Empty / erro | Sem dados no mês; falha da IA |

## ✅ Critérios de Aceite

### Cenário 1 — Painel
**Então** resumo em linguagem natural, variação por categoria, score 0–100, três cenários de projeção, sugestões acionáveis.

### Cenário 2 — Ações
**Então** regenerar com estado de loading/cota; alertas clicáveis; lista de conteúdos (Instagram/YouTube/sites) como cards.

### Cenário 3 — Temas e viewport
**Então** página e estados vazio/erro/loading em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não se prototipa configuração de chave Gemini nem o job de fim de mês.

## 📋 Resumo

### ✅ Concluído
- Blocos do epic 013 mapeados para UI

### ⏳ Pendente
- Frames Figma claro/escuro
