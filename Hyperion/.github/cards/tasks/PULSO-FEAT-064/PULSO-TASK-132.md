---
card_id: PULSO-TASK-132
title: "Backend — debtService CRUD e rotas"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-064
due_date: null
categories:
  - Backend
  - Regra de Negócio
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

## 👤 Responsável

- Sofia Vasconcelos (`sofiavasconcelosms`) — API


## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP
