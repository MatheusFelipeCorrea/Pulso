---
card_id: "PULSO-TASK-040"
title: "Backend — metaRoutes, controller e schemas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-018"
due_date: null
board_sync_at: "2026-08-26T15:31:27.000Z"
categories:
  - "api"
  - "Backend"
---


# [TASK] Backend — metaRoutes, controller e schemas

> **Contexto:** Exposição HTTP com auth, validação Zod e headers de paginação.

## 📝 Descrição

Registrar rotas `/metas` no app Express com middleware de autenticação e schemas de entrada.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Conteúdo |
|---------|----------|
| `api/src/routes/metaRoutes.js` | Rotas GET/POST/PATCH/DELETE |
| `api/src/controllers/metaController.js` | Handlers + headers paginação |
| `api/src/schemas/metaSchemas.js` | Zod: criar, editar, aporte, listagem, sugestão reserva |

**Montagem:** `app.use('/api/metas', metaRoutes)` (ou prefixo equivalente do projeto)

## 📋 Resumo

### ✅ Concluído
- Mapa de rotas e schemas definido

### ⏳ Pendente
- Implementar routes, controller e schemas
