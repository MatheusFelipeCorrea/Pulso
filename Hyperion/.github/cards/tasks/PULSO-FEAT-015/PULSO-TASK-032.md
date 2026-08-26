---
card_id: PULSO-TASK-032
title: "Exclusão recorrente com preservação de histórico"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-015
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Exclusão recorrente com preservação de histórico

> **Contexto:** RF-NOVO-C1 — "excluir esta e futuras" sem apagar passado.

## 📝 Descrição

Implementar `excluirTransacao` com flag `excluirFuturas` e UI de opções no DeleteTransactionModal.

## ✅ Critérios de Aceite

**Quando** DELETE com `excluirFuturas=true`,  
**Então** remove filhas ≥ dataCorte; aplica UNTIL na mãe; mantém filhas anteriores.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

Em `transactionService.excluirTransacao`:
- Detectar mãe vs. filha recorrente
- `transactionRepository.excluirRecorrentesFilhasAPartirDe`
- `encerrarRecorrencia(paiId, novaRegra)`

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DeleteTransactionModal.jsx` | Opções: só esta / esta e futuras |
| `transactionService.excluirTransacao` | Query params delete |

## 📋 Resumo

### ✅ Concluído
- Comportamento RF-NOVO-C1 especificado

### ⏳ Pendente
- Implementar backend + modal de exclusão
