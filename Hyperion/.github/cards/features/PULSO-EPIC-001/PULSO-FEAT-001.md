---
card_id: PULSO-FEAT-001
title: "Cadastro e verificação de email"
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
  - Banco de Dados
  - Regra de Negócio
  - Integração Externa
---

# [FEATURE] Cadastro e verificação de email

> **Contexto:** Permitir que novos usuários criem conta com email e senha forte, recebam email de confirmação (RF-003) e só acessem o app após verificação (RN-137). Inclui reenvio de verificação e resiliência quando SMTP falha.

**Refs:** RF-001 · RF-003 · RN-131 · RN-132 · RN-137

## 📝 Descrição

Fluxo ponta a ponta de cadastro: formulário web → `POST /auth/register` → hash bcrypt → token verificação 24h → email SMTP → `GET /auth/verify-email/:token` → conta ativa. Deve incluir seed de categorias padrão e criação de `ConfiguracaoUsuario` + `Sequencia`.

## ✅ Critérios de Aceite

### Cenário 1 — Cadastro bem-sucedido
**Dado** dados válidos (nome ≥3, email único, senha forte, confirmação igual),  
**Quando** `POST /api/auth/register`,  
**Então** retorna `201` com mensagem de sucesso e email; conta criada com `verificado=false`.

### Cenário 2 — Email duplicado
**Quando** email já cadastrado,  
**Então** retorna `409` "Este email já está cadastrado." (inclui corrida P2002→409).

### Cenário 3 — SMTP indisponível
**Quando** envio de verificação falha,  
**Então** conta **permanece** com `emailPendente: true` e mensagem orientando reenvio.

### Cenário 4 — Verificação de email
**Quando** `GET /api/auth/verify-email/:token` com token válido e não expirado,  
**Então** `verificado=true`; tokens de verificação limpos.

### Cenário 5 — Reenvio
**Quando** `POST /api/auth/resend-verification` para conta não verificada EMAIL,  
**Então** novo token gerado e email reenviado.

## 🔗 Sub-issues

- PULSO-TASK-001
- PULSO-TASK-002
- PULSO-TASK-003

## 📋 Resumo

### ✅ Concluído
- Critérios de aceite e contratos de API definidos
- Spec de telas `/register`, `/register/email-sent`, `/verify-email/:token`

### ⏳ Pendente
- PULSO-TASK-001 — modelagem Prisma
- PULSO-TASK-002 — endpoints backend
- PULSO-TASK-003 — telas frontend + indicador de força de senha
