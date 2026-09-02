---
card_id: "PULSO-FEAT-064"
title: "Backend — API core de dívidas"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-012"
due_date: null
board_sync_at: "2026-08-26T15:30:36.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API core de dívidas

> **Contexto:** CRUD autenticado em `/api/dividas` para empréstimos pessoais.

**Refs:** RF-126–128 · RN-075 · RN-079

## 📝 Descrição

Expor criar, editar, listar e excluir dívidas (pessoa por nome livre).

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/dividas` | Lista paginada com filtros (direção, quitada, busca, datas, valor) |
| POST | `/dividas` | Criar ME_DEVEM ou EU_DEVO |
| PATCH | `/dividas/:id` | Editar (bloqueia se quitada; valor ≥ já pago) |
| DELETE | `/dividas/:id` | Só abertas; quitadas → 400 (limpeza 180d) |

Validações: data empréstimo ≤ hoje; prazo > data empréstimo; observação ≤ 250

## 🔗 Sub-issues

- PULSO-TASK-129
- PULSO-TASK-130
- PULSO-TASK-132

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-129–132 — DB, repository e CRUD
