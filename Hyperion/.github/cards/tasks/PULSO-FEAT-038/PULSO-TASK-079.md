---
card_id: PULSO-TASK-079
title: "Frontend — landing.css responsivo"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-038
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — landing.css responsivo

> **Contexto:** Estilos da landing com paleta Vital Purple e suporte dark mode (RF-087).

## 📝 Descrição

Implementar folha de estilos completa para todas as seções da homepage.

## 🛠️ Implementação

### `styles/landing.css` (NOVO — CRIAR)

**Seções estilizadas:**
- `.landing-page`, `.landing-container`
- Hero: grid 2 colunas → stack mobile; gradient title
- Features: cards coloridos por `tone` (purple, green, blue, etc.)
- Header: nav collapse/hamburger em mobile
- Theme toggle, footer grid, testimonials, CTA banner
- Download buttons Android/iOS

**Tokens:** CSS variables do design system (Vital Purple)

Importar em `LandingPage.jsx` ou entry global

## 📋 Resumo

### ✅ Concluído
- Mapa de classes e breakpoints definido

### ⏳ Pendente
- Implementar landing.css
