---
card_id: "PULSO-FEAT-003"
title: "Google OAuth 2.0"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-001"
due_date: null
board_sync_at: "2026-08-26T15:29:37.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "Integração Externa"
  - "Regra de Negócio"
---


# [FEATURE] Google OAuth 2.0

> **Contexto:** Login social via Google (RF-002) com criação de conta nova ou vinculação a conta existente (RN-138/139), sem expor tokens JWT na URL — usar exchange token de curta duração (60s).

**Refs:** RF-002 · RN-138 · RN-139

## 📝 Descrição

Fluxo: botão Google → redirect `GET /auth/google` (Passport) → callback API → redirect front `/auth/callback?exchange=` → `POST /auth/oauth/exchange` → cookies de sessão. Conta Google deve nascer já verificada; conflito email+senha retorna erro claro.

## ✅ Critérios de Aceite

### Cenário 1 — Nova conta Google
**Quando** Google retorna email inexistente,  
**Então** cria `Usuario` com `provedorAuth=GOOGLE`, `verificado=true`, seed categorias.

### Cenário 2 — Conta Google existente
**Quando** `googleId` já cadastrado,  
**Então** autentica usuário existente.

### Cenário 3 — Email já cadastrado com senha
**Quando** email existe com `provedorAuth=EMAIL`,  
**Então** retorna `409` orientando login por senha.

### Cenário 4 — Exchange expirado
**Quando** `exchange` JWT expirado (>60s),  
**Então** retorna `401` e UI redireciona para login.

### Cenário 5 — Erro OAuth
**Quando** callback falha ou usuário cancela,  
**Então** redirect `/auth/callback?error=google_auth_failed&message=...` com UI de recuperação.

## 🔗 Sub-issues

- PULSO-TASK-006
- PULSO-TASK-007

## 📋 Resumo

### ✅ Concluído
- Fluxo OAuth + exchange documentado como spec
- Variáveis de ambiente mapeadas (`GOOGLE_CLIENT_ID`, `GOOGLE_CALLBACK_URL`, etc.)

### ⏳ Pendente
- PULSO-TASK-006 — backend Passport + exchange
- PULSO-TASK-007 — frontend callback e botão Google
