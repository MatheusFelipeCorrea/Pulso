---
card_id: "PULSO-TASK-080"
title: "Frontend — páginas legais e QA"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-039"
due_date: null
board_sync_at: "2026-08-26T15:32:08.000Z"
categories:
  - "web"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] Frontend — páginas legais e QA

> **Contexto:** Termos/privacidade linkados no footer e testes de regressão da landing.

## 📝 Descrição

Implementar páginas legais estáticas e suites de teste da homepage.

## 🛠️ Implementação

### Páginas legais (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TermsOfUse.jsx` | Termos de uso |
| `pages/PrivacyPolicy.jsx` | Política de privacidade |
| `pages/LegalDocumentLayout.jsx` | Layout compartilhado |
| `content/legal/termsOfUse.js` | Seções termos |
| `content/legal/privacyPolicy.js` | Seções privacidade |

### Web tests — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/pages/landingPage.test.jsx` | Render seções, CTAs `/register` |
| `unit/pages/landingPage.redirect.test.jsx` | Redirect se autenticado |
| `unit/components/publicHeader.test.jsx` | Nav links, theme toggle |

## 📋 Resumo

### ✅ Concluído
- Matriz legal + QA definida

### ⏳ Pendente
- Implementar páginas legais e testes
