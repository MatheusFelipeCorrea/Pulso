---
card_id: PULSO-TASK-001
title: "Banco de dados — modelos de usuário e verificação"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-001
due_date: null
categories:
  - Banco de Dados
  - Regra de Negócio
---

# [TASK] Banco de dados — modelos de usuário e verificação

> **Contexto:** Persistir usuários, configurações iniciais e campos temporários de verificação de email.

## 📝 Descrição

Como **sistema**, preciso modelar e migrar tabelas de usuário e configuração para suportar cadastro email/senha e OAuth.

## ✅ Critérios de Aceite

**Dado** migration aplicada,  
**Então** schema Prisma contém `Usuario` com `email` @unique, `senhaHash?`, `provedorAuth`, `verificado`, `tokenVerificacaoEmail`, `tokenVerificacaoExpira`; `ConfiguracaoUsuario` 1:1 com cascade delete.

## 🛠️ Implementação

### `Codigo/Pulso/api/prisma/schema.prisma` (NOVO — CRIAR)

Adicionar/criar models:

| Model | Campos-chave |
|-------|--------------|
| `Usuario` | `nome`, `email` @unique, `senhaHash?`, `provedorAuth`, `googleId?` @unique, `verificado`, tokens verificação/reset |
| `ConfiguracaoUsuario` | `usuarioId` @unique, `tema`, `gamificacaoAtiva`, defaults financeiros |
| `Sequencia` | Criada no cadastro (gamificação) |

**Enum:** `ProvedorAuth` (EMAIL, GOOGLE)

**Migration:** `prisma/migrations/20260422195021_init/migration.sql` (ou nova migration incremental)

**Índices:** `token_verificacao_email`, `token_reset_senha`, `email`

## 📐 Regras de Negócio

- Email único por usuário
- Conta email inicia `verificado=false`
- Token verificação expira em 24h

## 📋 Resumo

### ✅ Concluído
- Spec de models e relações definida

### ⏳ Pendente
- Criar migration Prisma
- Validar índices de lookup por token de verificação
