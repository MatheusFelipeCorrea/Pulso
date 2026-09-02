---
card_id: "PULSO-TASK-133"
title: "Backend — pagamentos e sincronizarQuitacao"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-065"
due_date: null
board_sync_at: "2026-08-26T15:23:56.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — pagamentos e sincronizarQuitacao

> **Contexto:** Pagamentos parciais e reabertura automática (RF-NOVO-O1).

## 📝 Descrição

Implementar registrar/excluir pagamento com sync de status.

## 🛠️ Implementação

### Funções (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `registrarPagamento` | valor ≤ restante; data ≤ hoje; chama sync |
| `excluirPagamento` | Remove; sync reabre se necessário |
| `sincronizarQuitacao` | restante 0 → quitar; quitada sem pago efetivo → reabrir |

Rotas: POST `/:id/pagamentos`, DELETE `/:id/pagamentos/:pagamentoId`

## 📋 Resumo

### ✅ Concluído
- Regras RF-129 / RF-NOVO-O1 documentadas

### ⏳ Pendente
- Implementar pagamentos e sync
