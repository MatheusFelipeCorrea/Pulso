---
card_id: PULSO-EPIC-007
title: "Homepage Pública"
status: Backlog
type: Epic
priority: High
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [EPIC] Homepage Pública

> **Contexto:** Landing page pública em `/` apresentando o Pulso — hero, funcionalidades, público-alvo, benefícios, depoimentos, CTAs e download do app; sem backend dedicado.

**Refs:** RF-084–087

## 🎯 Objetivos

- Homepage pública acessível sem autenticação (RF-084)
- CTAs "Começar Grátis" → `/register` e "Entrar" → `/login` (RF-085)
- Seções dos principais módulos com badges "Em breve"/"Beta" onde aplicável (RF-086)
- Layout responsivo com paleta Vital Purple e dark mode (RF-087)
- Redirect usuário autenticado via `DEFAULT_AUTHENTICATED_ROUTE`
- Navegação por âncoras (`#funcionalidades`, `#para-quem`, etc.) + hash scroll
- Header público compartilhado com login/cadastro
- Páginas legais `/termos` e `/privacidade` linkadas no footer
- Preview ilustrativo do dashboard e mockup mobile na landing

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/` | Landing Page | Scroll seções; CTA cadastro; redirect se logado |
| `/termos` | Termos de uso | Documento legal estático |
| `/privacidade` | Política de privacidade | Documento legal estático |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Autenticação | `GuestRoute`, `LandingPage` redirect, `PublicHeader` em login/register |
| Design System | `Button`, `PulsoBrand`, `useTheme`, tokens Vital Purple |
| App downloads | Arquivos em `public/downloads/` (.apk, .ipa) |

## 🔗 Sub-issues

- PULSO-FEAT-036
- PULSO-FEAT-037
- PULSO-FEAT-038
- PULSO-FEAT-039

## 📋 Resumo

### ✅ Concluído
- Escopo RF-084–087 mapeado
- Hierarquia Epic → 4 Features → 8 Tasks definida

### ⏳ Pendente
- Implementar landing completa frontend
- Alinhar badges de módulos conforme roadmap evoluir
