---
card_id: PULSO-TASK-083
title: "Backend — grupoService core e convites"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-040
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — grupoService core e convites

> **Contexto:** CRUD, preview/entrar com código PULSO-XXXX e rate limit.

## 📝 Descrição

Implementar service principal e middleware de rate limit para convites.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/grupoService.js` | criar, listar, obter, editar, excluir, preview, entrar, renovarCodigo |
| `middlewares/grupoInviteRateLimit.js` | 20 req/min preview + entrar |
| `routes/grupoRoutes.js` | Rotas base |
| `controllers/grupoController.js` | Handlers |
| `schemas/grupoSchemas.js` | Zod validation |

**Código:** regex `PULSO-[A-Z0-9]{4}`; geração sem ambíguos (RN-111)

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-088–090 especificados

### ⏳ Pendente
- Implementar service core e rotas
