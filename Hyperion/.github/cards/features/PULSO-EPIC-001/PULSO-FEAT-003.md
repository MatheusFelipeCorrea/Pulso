---
card_id: PULSO-FEAT-003
title: "Google OAuth 2.0"
status: "In Revision"
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-001
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Integração Externa
  - Regra de Negócio
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

## 🔗 Pull Requests

- [#287](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/287) — Google OAuth 2.0 (`feat/16`)

## 👤 Responsável

- Maria Clara (`mariaoliveira27`)

## 📋 Resumo

### ✅ Concluído
- Fluxo OAuth + exchange documentado como spec
- Variáveis de ambiente mapeadas (`GOOGLE_CLIENT_ID`, `GOOGLE_CALLBACK_URL`, etc.)

### ⏳ Pendente
- Nenhum
