---
card_id: PULSO-TASK-043
title: "Backend — transições de status e excluirAporte com reabertura"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-020
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — transições de status e excluirAporte com reabertura

> **Contexto:** Pausar/retomar/concluir via PATCH e correção de aportes em meta concluída.

## 📝 Descrição

Completar `editarMeta` com máquina de estados e `excluirAporte` que recalcula valor e reabre meta quando necessário.

## 🛠️ Implementação

### `editarMeta` — transições (NOVO — CRIAR)

| De | Para | Condição |
|----|------|----------|
| ATIVA | PAUSADA | Sempre |
| PAUSADA | ATIVA | Retomar |
| * | CONCLUIDA | `valorRestante <= 0` |
| CONCLUIDA | * | Bloqueado (exceto manter CONCLUIDA) |
| * | CANCELADA | Bloqueado — usar DELETE |

### `excluirAporte` (NOVO — CRIAR)

- Recalcular `valorAtual`
- Se meta CONCLUIDA e `valorRestante > 0` → status ATIVA, limpar `concluidaEm`
- Sem guard bloqueando exclusão em meta concluída

**Rota:** `DELETE /metas/:id/aportes/:aporteId`

## 📋 Resumo

### ✅ Concluído
- Máquina de estados e reabertura documentadas

### ⏳ Pendente
- Implementar editarMeta (status) e excluirAporte
