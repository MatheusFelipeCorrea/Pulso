---
card_id: PULSO-FEAT-065
title: "Pagamentos parciais, quitar e reabrir"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-012
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Pagamentos parciais, quitar e reabrir

> **Contexto:** Ciclo de pagamento e sincronização de quitação.

**Refs:** RF-120 · RN-076 · RF-NOVO-O1

## 📝 Descrição

Registrar/excluir pagamentos, quitar saldo restante e reabrir dívida.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/:id/pagamentos` | Parcial; valor ≤ restante; auto-quita se zerar |
| DELETE | `/:id/pagamentos/:pagamentoId` | Remove; reabre se quitada sem saldo pago |
| PATCH | `/:id/quitar` | Registra pagamento do restante + dataQuitacao |
| PATCH | `/:id/reabrir` | Reabre se não estiver coberta só por pagamentos |

**sincronizarQuitacao:** totalmente paga → quitar; pagamentos removidos → reabrir

## 🔗 Sub-issues

- PULSO-TASK-131
- PULSO-TASK-133
- PULSO-TASK-134

## 👤 Responsável

- Sofia Vasconcelos (`sofiavasconcelosms`) — pagamentos


## 📋 Resumo

### ✅ Concluído
- Fluxos de pagamento mapeados

### ⏳ Pendente
- PULSO-TASK-131–134 — saldo, pagamentos e quitação
