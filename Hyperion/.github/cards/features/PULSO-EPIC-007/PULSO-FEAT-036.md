---
card_id: PULSO-FEAT-036
title: "Shell e roteamento público"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Shell e roteamento público

> **Contexto:** Página raiz `/` pública com redirect para usuários autenticados e CTAs de conversão.

**Refs:** RF-084 · RF-085

## 📝 Descrição

Implementar `LandingPage` como rota pública em `App.jsx` com comportamento de guest e navegação por hash.

## ✅ Critérios de Aceite

- Rota `/` renderiza landing sem `MainLayout`
- Se `sessionChecked && isAuthenticated` → `Navigate` para `DEFAULT_AUTHENTICATED_ROUTE`
- Hash na URL (`/#funcionalidades`) faz scroll suave na montagem
- Login/register envolvidos por `GuestRoute` com mesmo redirect
- Estrutura: `PublicHeader` + `<main>` seções + `LandingFooter`

## 🔗 Sub-issues

- PULSO-TASK-073

## 📋 Resumo

### ✅ Concluído
- Fluxos de roteamento e redirect definidos

### ⏳ Pendente
- PULSO-TASK-073 — LandingPage e rotas
