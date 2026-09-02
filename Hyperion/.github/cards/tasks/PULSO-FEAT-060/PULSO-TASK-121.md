---
card_id: "PULSO-TASK-121"
title: "Backend — marcar/desmarcar pago e quitação"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-060"
due_date: null
board_sync_at: "2026-08-26T15:23:44.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — marcar/desmarcar pago e quitação

> **Contexto:** RF-118 / RN-085 — ciclo de pagamento e status da divisão.

## 📝 Descrição

Implementar pagar/despagar e `sincronizarStatusDivisao`.

## 🛠️ Implementação

### Funções (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `marcarParticipantePago` | Status PAGO + dataPagamento; cancela lembretes se todos cobertos quitados |
| `desmarcarParticipantePago` | Volta PENDENTE; não aplica a `pagouAConta` |
| `sincronizarStatusDivisao` | Todos PAGO → QUITADA; senão reabre ATIVA |

Rotas PATCH `.../pagar` e `.../despagar`.

## 📋 Resumo

### ✅ Concluído
- Regras RN-085 documentadas

### ⏳ Pendente
- Implementar pagamentos e sync
