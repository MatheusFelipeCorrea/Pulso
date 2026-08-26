---
card_id: PULSO-TASK-012
title: "QA — testes unitários de autenticação"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-005
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de autenticação

> **Contexto:** Cobertura de testes para fluxos críticos de auth (RNF-015).

## 📝 Descrição

Garantir regressão segura nos services, controllers, middlewares e camada web de autenticação.

## ✅ Critérios de Aceite

**Quando** `npm test` na API,  
**Então** suites auth passam incluindo register, login, refresh replay, OAuth, reset senha.

**Quando** `npm test` no Web,  
**Então** schemas e authService/authSlice validados.

## 🛠️ Implementação

### API — criar em `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/authService.test.js` | register, login, refresh, OAuth, reset |
| `unit/controllers/authController.test.js` | Controller + cookies |
| `unit/middlewares/authMiddleware.test.js` | JWT middleware |
| `unit/middlewares/authRateLimit.test.js` | Rate limit config |
| `unit/utils/googleOAuth.test.js` | OAuth client |
| `helpers/authMocks.js` | Mocks compartilhados |

### Web — criar em `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/authService.test.js` | Chamadas API auth |
| `unit/schemas/authSchemas.test.js` | Validação Zod front |
| `unit/store/authSlice.test.js` | Redux auth |

### Script manual (NOVO — CRIAR)

`Codigo/Pulso/api/scripts/validate-auth-flow.js` — smoke de fluxo auth

## 📋 Resumo

### ✅ Concluído
- Escopo de testes mapeado por camada

### ⏳ Pendente
- Escrever testes unitários API (service, controller, middlewares)
- Escrever testes unitários Web (schemas, service, slice)
- Opcional: suite E2E Playwright dedicada auth
