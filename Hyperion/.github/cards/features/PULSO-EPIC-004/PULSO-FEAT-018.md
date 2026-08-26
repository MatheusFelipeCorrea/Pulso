---
card_id: PULSO-FEAT-018
title: "Backend — API de metas"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de metas

> **Contexto:** Camada REST autenticada para CRUD, listagem paginada e resumo agregado de metas pessoais.

**Refs:** RF-026 · RF-031

## 📝 Descrição

Expor endpoints em `/api/metas` para criar, editar, excluir, listar com filtros e obter resumo consolidado.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/metas` | Lista paginada; headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page` |
| `GET` | `/metas/resumo` | Totais, progresso médio, categorias, contadores, atividade recente |
| `POST` | `/metas` | Cria meta com prazo futuro (RN-061) |
| `PATCH` | `/metas/:id` | Edita parcialmente; transições de status |
| `DELETE` | `/metas/:id` | Exclui meta (204) |

**Filtros query:** `status`, `tipo`, `busca`, `prazoInicio`, `prazoFim`, `pagina`, `limite`

## 🔗 Sub-issues

- PULSO-TASK-037
- PULSO-TASK-039
- PULSO-TASK-040

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e payloads definidos

### ⏳ Pendente
- PULSO-TASK-037–040 — persistência, service e rotas
