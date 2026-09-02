---
card_id: "PULSO-TASK-130"
title: "Backend — debtRepository e mappers"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-064"
due_date: null
board_sync_at: "2026-08-26T15:23:53.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
---


# [TASK] Backend — debtRepository e mappers

> **Contexto:** Persistência Prisma e DTOs com saldo calculado.

## 📝 Descrição

Implementar repository e mappers de dívida/pagamento.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/debtRepository.js` | CRUD, listar, pagamentos, alertas, cleanup, contarPorAba |
| `utils/debtMapper.js` | `mapDivida` — valorPago/Restante + pagamentos |
| `utils/debtPaymentMapper.js` | `mapPagamento` |

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mappers
