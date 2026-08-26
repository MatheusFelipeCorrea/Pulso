---
card_id: PULSO-FEAT-088
title: "Protótipo — dashboard e importação"
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

# [FEATURE] Protótipo — dashboard e importação

> **Contexto:** Painel autenticado em `/dashboard` dentro do `MainLayout` (não redesenhar a sidebar aqui). Recursos **DINHEIRO, VA, VR**. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-002` · **Refs:** RF-007–014 · RF-134–137 · RF-139

## 📖 Histórias

- Como **usuário autenticado**, quero ver saldo total, cards por recurso, gráficos, últimas transações, alertas e metas, para o mês caber numa tela.
- Como **usuário**, quero o fluxo de importar extrato (escolher arquivo → mapear CSV → preview → confirmar), para o modal não ser um “anexo” genérico.
- Como **usuário**, quero o mesmo dashboard em claro e escuro, para gráficos e cards continuarem legíveis.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/dashboard` | Dashboard (saldos, gráficos, widgets) |
| Modal | Importação: arquivo → mapping → preview → confirmar |
| Empty / erro | Mês sem dados; falha ao carregar |

## ✅ Critérios de Aceite

### Cenário 1 — Conteúdo
**Então** há saudação, seletor de mês, `ResourceCard` VA/VR/DINHEIRO, receitas vs despesas, donut de categorias, lista curta de transações, alertas ≥80%, metas ativas, score de saúde.

### Cenário 2 — Importação
**Então** o modal cobre origens CONTA/VA/VR (não VT) e os passos do epic.

### Cenário 3 — Temas e viewport
**Então** dashboard + cada passo do modal em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** RF-015 (chatbot quick-add) pode ficar como indicação “em breve”, sem fluxo completo, salvo se o time quiser incluir depois.

## 📋 Resumo

### ✅ Concluído
- Blocos do dashboard e passos de importação mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
