---
card_id: PULSO-FEAT-002
title: "Login, sessão JWT e logout"
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
  - Regra de Negócio
---

# [FEATURE] Login, sessão JWT e logout

> **Contexto:** Autenticação com email/senha (ou nome), emissão de sessão JWT com refresh rotativo (RF-005), cookies httpOnly (RN-135) e logout com invalidação de refresh token (RF-006).

**Refs:** RF-005 · RF-006 · RN-133 · RN-134 · RN-135 · RN-137

## 📝 Descrição

Login deve validar credenciais e exigir email verificado; emitir access JWT (15min) + refresh token (7d ou 30d com "Lembrar-me"). Sessão transportada em cookies `pulso_access` / `pulso_refresh`. Refresh rotativo single-use com proteção anti-replay. Front deve restaurar sessão via `GET /auth/me` e deduplicar refresh no interceptor.

## ✅ Critérios de Aceite

### Cenário 1 — Login bem-sucedido
**Quando** credenciais corretas e conta verificada,  
**Então** cookies httpOnly setados + payload `{ user }`; redirect para `/transactions`.

### Cenário 2 — Email não verificado
**Quando** login com `verificado=false`,  
**Então** retorna `403` com CTA de reenviar verificação na UI.

### Cenário 3 — Refresh rotativo
**Quando** `POST /api/auth/refresh` com refresh válido,  
**Então** novo par de tokens; refresh anterior revogado (single-use).

### Cenário 4 — Replay de refresh
**Quando** refresh já revogado é reapresentado,  
**Então** revoga **toda** sessão do usuário e retorna `401`.

### Cenário 5 — Logout
**Quando** `POST /api/auth/logout`,  
**Então** refresh revogado e cookies limpos.

### Cenário 6 — Bootstrap de sessão
**Quando** app carrega com cookies válidos,  
**Então** `AuthBootstrap` chama `GET /auth/me` e popula Redux sem loop F5.

## 🔗 Sub-issues

- PULSO-TASK-004
- PULSO-TASK-005

## 📋 Resumo

### ✅ Concluído
- Arquitetura de sessão definida (cookies httpOnly + refresh rotativo)
- Critérios de aceite para login, refresh, logout e bootstrap

### ⏳ Pendente
- PULSO-TASK-004 — backend login/refresh/logout/cookies
- PULSO-TASK-005 — frontend login, interceptor e Redux
