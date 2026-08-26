---
card_id: PULSO-FEAT-005
title: "Proteção de rotas e infraestrutura de segurança"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Cibersegurança
  - QA / Testes
  - Infra / DevOps
---

# [FEATURE] Proteção de rotas e infraestrutura de segurança

> **Contexto:** Camada transversal que deve proteger a API e o SPA: middleware JWT, rate limiting por rota, guardas de rota no front, job de limpeza de contas abandonadas e suíte de testes.

**Refs:** RN-140 · RNF-002 · RNF-004

## 📝 Descrição

`authMiddleware` deve validar JWT do cookie/header em rotas protegidas. `authRateLimit.js` aplica 5 req/min/IP com contadores independentes por rota sensível (9 instâncias). Front usa `ProtectedRoute` / `GuestRoute`. Cron diário remove contas email não verificadas > 30 dias.

## ✅ Critérios de Aceite

### Cenário 1 — Rota protegida sem token
**Quando** request sem JWT válido,  
**Então** retorna `401` "Token não fornecido ou inválido."

### Cenário 2 — Rate limit por rota
**Quando** >5 req/min/IP na mesma rota auth,  
**Então** retorna `429` sem afetar contador de outras rotas auth.

### Cenário 3 — SPA guard
**Quando** usuário não autenticado acessa rota protegida,  
**Então** `ProtectedRoute` redireciona `/login`.

### Cenário 4 — Guest guard
**Quando** usuário autenticado acessa `/login` ou `/register`,  
**Então** `GuestRoute` redireciona `/transactions`.

### Cenário 5 — Cleanup cron
**Quando** job diário executa,  
**Então** remove contas `provedorAuth=EMAIL`, `verificado=false`, `criadoEm` > 30 dias.

## 🔗 Sub-issues

- PULSO-TASK-010
- PULSO-TASK-011
- PULSO-TASK-012

## 📋 Resumo

### ✅ Concluído
- Requisitos de segurança transversal mapeados (middleware, rate limit, guards, cron)
- Escopo de testes definido

### ⏳ Pendente
- PULSO-TASK-010 — middleware + rate limit + job cleanup
- PULSO-TASK-011 — guardas de rota no React Router
- PULSO-TASK-012 — testes unitários API e Web
