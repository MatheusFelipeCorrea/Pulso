---
card_id: PULSO-TASK-120
title: "Backend — service CRUD e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-058
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — service CRUD e rotas

> **Contexto:** Criar/editar/listar/excluir com `construirParticipantes`.

## 📝 Descrição

Implementar service core, schemas, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/expenseSplitService.js` | `criarDivisao`, `editarDivisao`, listagens, `excluirDivisao` |
| `schemas/expenseSplitSchemas.js` | Zod criar/editar/query/params |
| `controllers/expenseSplitController.js` | Handlers |
| `routes/expenseSplitRoutes.js` | Montar em `/divisoes` |

**construirParticipantes:** inclui “Você”; aplica IGUAL/PERSONALIZADA; resolve `pagoPor`

Editar participantes bloqueado se já houver pagamento manual.

## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP
