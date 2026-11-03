---
card_id: PULSO-EPIC-007
title: "Homepage Pública"
status: "In Revision"
type: Epic
priority: High
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
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

**Refs:** RF-080–083

## 🎯 Objetivos

- Homepage pública acessível sem autenticação (RF-080)
- CTAs "Começar Grátis" → `/register` e "Entrar" → `/login` (RF-081)
- Seções dos principais módulos com badges "Em breve"/"Beta" onde aplicável (RF-082)
- Layout responsivo com paleta Vital Purple e dark mode (RF-083)
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

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`) — landing freemium web


## 🔗 Pull Requests

- [#382](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/382) — homepage freemium em reais (Free R$ 0 / Premium R$ 50/mês)

## 📋 Resumo

### ✅ Concluído
- Landing pública com seções, CTAs e planos freemium demonstráveis (sem gateway)
- Hierarquia Epic → Features → Tasks em In Revision (Sprint 5)

### ⏳ Pendente
- Ajustes finos de copy/badges conforme roadmap (insights/chatbot)
