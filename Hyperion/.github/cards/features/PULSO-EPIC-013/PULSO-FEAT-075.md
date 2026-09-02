---
card_id: "PULSO-FEAT-075"
title: "Frontend — página Insights"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-013"
due_date: null
board_sync_at: "2026-08-26T15:30:47.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Frontend — página Insights

> **Contexto:** Substituir `InDevelopmentPage` em `/insights` por painel completo.

**Refs:** RF-044–048 · RF-107–108 · RF-143 · RF-NOVO-I1

## 📝 Descrição

Implementar UI do painel personalizado e ações de regenerar.

## ✅ Critérios de Aceite

- Rota `/insights` autenticada (já no sidebar)
- Seções: resumo, variação categorias, gauge de score, projeções (3 cenários), sugestões, alertas, educação
- Seletor de mês; empty state se poucos dados
- Botão Regenerar (loading + toast cota/erro 503)
- Cards educativos com deep-link externo (`rel="noopener noreferrer"`)
- Client `insightsService.js` + `insights.css`
- Estados: loading, erro Gemini, sem chave, sucesso

## 🔗 Sub-issues

- PULSO-TASK-150
- PULSO-TASK-151

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-150–151 — página e componentes
