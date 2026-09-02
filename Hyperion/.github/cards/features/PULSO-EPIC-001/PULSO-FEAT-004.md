---
card_id: "PULSO-FEAT-004"
title: "Recuperação de senha"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-001"
due_date: null
board_sync_at: "2026-08-26T15:29:38.000Z"
categories:
  - "web"
  - "Backend"
  - "Cibersegurança"
  - "Frontend"
  - "Integração Externa"
  - "Regra de Negócio"
---


# [FEATURE] Recuperação de senha

> **Contexto:** Permitir que usuários com conta email/senha redefinam a senha via link enviado por email (RF-004), com anti-enumeração e invalidação de todas as sessões após reset (RN-136).

**Refs:** RF-004 · RN-136 · RN-141

## 📝 Descrição

Fluxo: `/forgot-password` → `POST /auth/forgot-password` → email com token 1h → `/reset-password/:token` valida token → `POST /auth/reset-password/:token` → nova senha forte → revoga todos refresh tokens. Contas Google devem receber resposta genérica sem revelar provedor.

## ✅ Critérios de Aceite

### Cenário 1 — Solicitar reset
**Quando** email válido de conta EMAIL com senha,  
**Então** token reset gerado (1h) e email enviado; resposta sempre genérica (anti-enumeração).

### Cenário 2 — Conta Google ou inexistente
**Quando** email não existe ou é conta Google-only,  
**Então** mesma mensagem de sucesso sem enviar email.

### Cenário 3 — Validar token
**Quando** `GET /api/auth/reset-password/:token` com token válido,  
**Então** retorna `{ valid: true, email }`.

### Cenário 4 — Redefinir senha
**Quando** `POST /api/auth/reset-password/:token` com senha forte,  
**Então** senha atualizada, tokens reset limpos, **todas** sessões revogadas, cookies limpos.

### Cenário 5 — Token expirado
**Quando** token > 1h,  
**Então** retorna `400` "Token inválido ou expirado."

## 🔗 Sub-issues

- PULSO-TASK-008
- PULSO-TASK-009

## 📋 Resumo

### ✅ Concluído
- Critérios de aceite e rotas de reset definidos
- Spec de anti-enumeração e revogação de sessões documentada

### ⏳ Pendente
- PULSO-TASK-008 — backend forgot/reset + email
- PULSO-TASK-009 — telas frontend do fluxo de reset
