---
card_id: "PULSO-FEAT-038"
title: "Header, footer, mobile e estilos"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-007"
due_date: null
board_sync_at: "2026-08-26T15:30:10.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
  - "Mobile"
---


# [FEATURE] Header, footer, mobile e estilos

> **Contexto:** Chrome público reutilizável, download mobile, páginas legais e CSS responsivo.

**Refs:** RF-085 · RF-087

## 📝 Descrição

Implementar header/footer compartilhados, seção mobile, termos/privacidade e folha de estilos Vital Purple.

## ✅ Critérios de Aceite

- `PublicHeader`: nav âncoras, toggle tema claro/escuro, CTAs Entrar/Cadastrar; prop `activeAuth` para login/register
- `LandingFooter`: colunas navegação/recursos/comunidade; `#roadmap` anchor
- `LandingMobile`: botões download APK/IPA de `APP_DOWNLOADS`
- `LandingPhoneHomeMockup`: showcase visual mobile
- `/termos` e `/privacidade` via `LegalDocumentLayout`
- `landing.css`: breakpoints mobile/tablet/desktop; gradientes purple

## 🔗 Sub-issues

- PULSO-TASK-077
- PULSO-TASK-078
- PULSO-TASK-079
- PULSO-TASK-080

## 📋 Resumo

### ✅ Concluído
- Componentes chrome e legal spec definidos

### ⏳ Pendente
- PULSO-TASK-077–080 — header, mobile, CSS e legal
