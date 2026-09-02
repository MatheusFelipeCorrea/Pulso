---
card_id: "PULSO-FEAT-040"
title: "Backend — API core de grupos"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-008"
due_date: null
board_sync_at: "2026-08-26T15:30:12.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API core de grupos

> **Contexto:** CRUD, convites, membros e upload de imagem do grupo.

**Refs:** RF-088–091 · RF-099–100 · RN-111–114

## 📝 Descrição

Expor endpoints `/api/grupos` para ciclo de vida do grupo e gestão de membros.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/grupos/preview?codigo=` | Pré-visualizar convite (rate limit) |
| POST | `/grupos/entrar` | Entrar com código PULSO-XXXX |
| GET/POST | `/grupos` | Listar / criar |
| GET/PATCH/DELETE | `/grupos/:id` | Detalhe / editar / excluir (admin) |
| POST | `/grupos/:id/sair` | Sair (RN-113 se único admin) |
| POST | `/grupos/:id/codigo/renovar` | Novo código (admin) |
| DELETE/PATCH | `/grupos/:id/membros/:usuarioId` | Remover / alterar papel |
| POST | `/grupos/:id/imagem` | Upload multipart (admin, 2MB) |

**Criador:** papel ADMIN automático (RN-112)

## 🔗 Sub-issues

- PULSO-TASK-081
- PULSO-TASK-082
- PULSO-TASK-083
- PULSO-TASK-084
- PULSO-TASK-085

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-081–085 — DB, service core e membros
