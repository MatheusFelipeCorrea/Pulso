---
card_id: "PULSO-FEAT-024"
title: "Backend — API de viagens"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-005"
due_date: null
board_sync_at: "2026-08-26T15:29:57.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API de viagens

> **Contexto:** CRUD de viagens pessoais com resolução de destino e vínculo opcional a meta.

**Refs:** RF-037 · RF-042 · RF-043 · RN-072 · RN-073

## 📝 Descrição

Expor endpoints em `/api/viagens` para listar, criar, editar, excluir e obter resumo da página.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/viagens` | Lista viagens do usuário com despesas/observações/meta |
| `GET` | `/viagens/resumo` | `quantidadeViagens`, `totalPlanejadoBrl` |
| `GET` | `/viagens/:id` | Detalhe mapeado |
| `GET` | `/viagens/destinos?q=` | Busca GeoNames ou catálogo local |
| `GET` | `/viagens/origens` | Catálogo de origens BR |
| `POST` | `/viagens` | Cria com data futura, moeda válida, destino resolvido |
| `PATCH` | `/viagens/:id` | Edita parcialmente |
| `DELETE` | `/viagens/:id` | Exclui viagem (204) |

**Meta:** `metaId` único por viagem; conflito → 409

## 🔗 Sub-issues

- PULSO-TASK-049
- PULSO-TASK-051
- PULSO-TASK-052

## 📋 Resumo

### ✅ Concluído
- Contratos e validações de domínio definidos

### ⏳ Pendente
- PULSO-TASK-049–052 — DB, repository, service e rotas
