---
card_id: PULSO-TASK-053
title: "Backend — pretensões e observações"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-025
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — pretensões e observações

> **Contexto:** CRUD aninhado de despesas e observações por viagem.

## 📝 Descrição

Implementar endpoints e validações para pretensões (10 categorias) e observações com checklist.

## 🛠️ Implementação

### `viagemService.js` (NOVO — CRIAR)

| Grupo | Endpoints |
|-------|-----------|
| Despesas | POST/PATCH/DELETE `/viagens/:id/despesas[/:despesaId]` |
| Observações | POST/PATCH/DELETE `/viagens/:id/observacoes[/:observacaoId]` |

**Validações:**
- Categoria ∈ `CATEGORIAS_DESPESA` (RN-074)
- `valorEstimado > 0`
- URL válida em `linkUrl`
- Checklist normalizado com UUID por item

Retorno sempre: viagem mapeada atualizada

## 📋 Resumo

### ✅ Concluído
- Payloads e categorias definidos

### ⏳ Pendente
- Implementar CRUD despesas e observações
