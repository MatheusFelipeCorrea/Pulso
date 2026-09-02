---
card_id: "PULSO-TASK-134"
title: "Backend — quitar, reabrir e excluir"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-065"
due_date: null
board_sync_at: "2026-08-26T15:23:57.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — quitar, reabrir e excluir

> **Contexto:** Atalhos de quitação total, reabertura manual e exclusão.

## 📝 Descrição

Implementar endpoints de quitar/reabrir e regras de exclusão.

## 🛠️ Implementação

| Função | Comportamento |
|--------|---------------|
| `quitarDivida` | Se restante > 0 → `registrarPagamento` do saldo; set `dataQuitacao` |
| `reabrirDivida` | Bloqueia se coberta só por pagamentos (remover pagamento antes) |
| `excluirDivida` | Bloqueia quitada (mensagem 180 dias) |

Rotas: PATCH `/:id/quitar`, PATCH `/:id/reabrir`, DELETE `/:id`

## 📋 Resumo

### ✅ Concluído
- Contratos definidos

### ⏳ Pendente
- Implementar quitar/reabrir/excluir
