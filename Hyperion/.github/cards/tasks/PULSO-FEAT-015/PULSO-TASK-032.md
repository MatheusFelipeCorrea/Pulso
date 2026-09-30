---
card_id: PULSO-TASK-032
title: "Exclusão recorrente com preservação de histórico"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
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


## 👤 Responsável

Vinícius Simões (`ViniSimoesV`)

## 🔗 Pull Requests

- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) — Exclusão recorrente (`FEAT-015`) → issue [#155](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/155)
- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) — `DeleteTransactionModal` (`FEAT-016`)
## 📋 Resumo

### ✅ Concluído
- Comportamento RF-NOVO-C1 especificado

### ⏳ Pendente
- Implementar backend + modal de exclusão
