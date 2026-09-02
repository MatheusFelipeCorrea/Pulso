---
card_id: "PULSO-FEAT-046"
title: "Backend — API de orçamentos"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-009"
due_date: null
board_sync_at: "2026-08-26T15:30:19.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API de orçamentos

> **Contexto:** Camada REST autenticada para listar, salvar, remover e copiar limites mensais por categoria.

**Refs:** RF-109 · RF-113 · RN-055

## 📝 Descrição

Expor endpoints em `/api/orcamentos` para ciclo de vida dos limites do mês.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/orcamentos` | Lista orçamentos do mês (`?mes=YYYY-MM`) |
| GET | `/orcamentos/status` | Resumo + categorias com/sem limite + gastos |
| POST | `/orcamentos` | Upsert em lote (`limites[]`); lista vazia zera o mês |
| POST | `/orcamentos/copiar` | Copia origem → destino; 409 se destino já tem; 404 se origem vazia |
| DELETE | `/orcamentos/:id` | Remove limite de uma categoria no mês |

**Validação:** categorias devem ser `DESPESA` do usuário (403 caso contrário)

## 🔗 Sub-issues

- PULSO-TASK-093
- PULSO-TASK-094
- PULSO-TASK-096
- PULSO-TASK-097

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-093–097 — DB, repository, service core e cópia
