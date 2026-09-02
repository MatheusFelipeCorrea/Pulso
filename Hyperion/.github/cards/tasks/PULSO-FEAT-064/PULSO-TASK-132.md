---
card_id: "PULSO-TASK-132"
title: "Backend — debtService CRUD e rotas"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-064"
due_date: null
board_sync_at: "2026-08-26T15:23:54.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — debtService CRUD e rotas

> **Contexto:** Criar, editar, listar e excluir dívidas.

## 📝 Descrição

Implementar service core, schemas, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/debtService.js` | `criarDivida`, `editarDivida`, `listarDividas`, `excluirDivida` |
| `schemas/debtSchemas.js` | Zod criar/editar/query/params |
| `controllers/debtController.js` | Handlers |
| `routes/debtRoutes.js` | Montar em `/dividas` |

Bloquear edição/exclusão de quitadas; valor editado ≥ valorPago.

## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP
