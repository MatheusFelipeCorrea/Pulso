---
card_id: PULSO-TASK-130
title: "Backend — debtRepository e mappers"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-064
due_date: null
categories:
  - Backend
  - Banco de Dados
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

## 👤 Responsável

- Sofia Vasconcelos (`sofiavasconcelosms`) — API


## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mappers
