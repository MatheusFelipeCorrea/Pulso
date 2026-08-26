---
card_id: PULSO-TASK-108
title: "Backend — service CRUD e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-052
due_date: null
categories:
  - Backend
---

# [TASK] Backend — service CRUD e rotas

> **Contexto:** Listar painel, criar, editar e excluir itens desejados.

## 📝 Descrição

Implementar service core, schemas, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/purchasePlanningService.js` | `listarPainel`, `criarItem`, `editarItem`, `excluirItem` |
| `schemas/purchasePlanningSchemas.js` | Zod criar/editar/params |
| `controllers/purchasePlanningController.js` | Handlers |
| `routes/purchasePlanningRoutes.js` | Montar em `/planejamento-compra` |

Ordenar desejados por prioridade ALTA → MEDIA → BAIXA. Bloquear edição se COMPRADO.

## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP
