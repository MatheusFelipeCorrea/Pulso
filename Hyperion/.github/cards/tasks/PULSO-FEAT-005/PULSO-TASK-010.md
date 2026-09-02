---
card_id: "PULSO-TASK-010"
title: "Backend — middleware, rate limit e job de limpeza"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-005"
due_date: null
board_sync_at: "2026-08-26T15:31:00.000Z"
categories:
  - "Backend"
  - "Cibersegurança"
  - "Infra / DevOps"
---


# [TASK] Backend — middleware, rate limit e job de limpeza

> **Contexto:** Proteções transversais da API de autenticação.

## 📝 Descrição

Implementar validação JWT em rotas protegidas, limitar abuso por IP e limpar contas/sessões obsoletas.

## ✅ Critérios de Aceite

**Dado** request autenticada,  
**Quando** access token válido em cookie ou `Authorization: Bearer`,  
**Então** `req.user = { id, email, nome }` sem query extra ao banco.

**Dado** >5 req/min/IP em rota auth,  
**Então** `429` com mensagem padronizada.

**Dado** cron diário,  
**Então** remove contas email não verificadas > 30 dias.

## 🛠️ Implementação

### `authMiddleware.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/middlewares/authMiddleware.js`

- `getAccessTokenFromRequest` — cookie ou Bearer
- `jwt.verify` → claims em `req.user`

### `authRateLimit.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/middlewares/authRateLimit.js`

9 instâncias independentes (`express-rate-limit`, 5/min/IP):
`register`, `login`, `oauth/exchange`, `refresh`, `logout`, `forgot-password`, `reset-password`, `verify-email`, `resend-verification`

### `unverifiedAccountCleanupJob.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/jobs/unverifiedAccountCleanupJob.js`

- `authRepository.deleteUnverifiedEmailAccountsOlderThan`
- Invocar via `cronController.daily` e `server.js` (cron local)

### Registro (NOVO — CRIAR)

`routes/index.js` → `router.use('/auth', authRoutes)`

## 📐 Regras de Negócio

- Rate limit IP 5/min por rota (RN-140)

## 📋 Resumo

### ✅ Concluído
- Spec de middleware, rate limits e cron definida

### ⏳ Pendente
- Implementar authMiddleware e authRateLimit
- Criar job de cleanup de contas não verificadas
- Montar rotas em `routes/index.js`
