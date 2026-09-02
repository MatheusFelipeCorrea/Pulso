---
card_id: "PULSO-TASK-077"
title: "Frontend — PublicHeader e LandingFooter"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-038"
due_date: null
board_sync_at: "2026-08-26T15:32:05.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — PublicHeader e LandingFooter

> **Contexto:** Chrome público reutilizado na landing, login e cadastro.

## 📝 Descrição

Implementar header com navegação, tema e CTAs; footer com links e social.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `PublicHeader.jsx` | Nav âncoras; `useTheme` toggle Sun/Moon; Entrar/Começar Grátis |
| `LandingFooter.jsx` | Brand, colunas FOOTER_LINKS, social icons, copyright |

**PublicHeader:**
- Em `/`: botões scroll para seções
- Em outras rotas: `Link` para `/#secao`
- Prop `activeAuth`: `'login' | 'register' | null`

**Footer:** `#roadmap` id para nav

Reutilizar `PulsoBrand` do design system

## 📋 Resumo

### ✅ Concluído
- Comportamento header/footer especificado

### ⏳ Pendente
- Implementar PublicHeader e LandingFooter
