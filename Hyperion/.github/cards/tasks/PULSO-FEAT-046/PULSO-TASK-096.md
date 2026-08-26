---
card_id: PULSO-TASK-096
title: "Backend — budgetService core e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-046
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — budgetService core e rotas

> **Contexto:** Listar, status, salvar e remover orçamentos do mês.

## 📝 Descrição

Implementar service principal, schemas Zod, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/budgetService.js` | `listarOrcamentos`, `obterStatusOrcamento`, `salvarOrcamentos`, `removerOrcamento` |
| `schemas/budgetSchemas.js` | queryMes, salvarOrcamentos, remover |
| `controllers/budgetController.js` | Handlers autenticados |
| `routes/budgetRoutes.js` | Montar em `/orcamentos` |

**Status:** categorias com gasto/%, `categoriasSemOrcamento`, resumo + `orcamentoExcedeRenda` (RN-059)

**Salvar:** upsert por categoria; lista vazia remove todos do mês; valida DESPESA do usuário

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-109/113/114 especificados

### ⏳ Pendente
- Implementar service core e HTTP
