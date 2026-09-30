---
card_id: PULSO-TASK-030
title: "Transferências — backend e formulário"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-014
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Transferências — backend e formulário

> **Contexto:** RF-027 — tipo TRANSFERENCIA ponta a ponta.

## 📝 Descrição

Implementar fluxo completo de transferência entre recursos no service e no TransactionFormModal.

## ✅ Critérios de Aceite

**Então** criar/editar transferência valida origem≠destino; UI oculta categoria; notificação específica.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

Em `transactionService.criarTransacao` / `editarTransacao`:
- Branch `tipo === 'TRANSFERENCIA'`
- `notificarTransferenciaRegistrada`

Agregados em `calcularAgregados`: filtrar apenas RECEITA/DESPESA

### Frontend (NOVO — CRIAR)

Em `TransactionFormModal.jsx`:
- Toggle tipo inclui `TRANSFERENCIA`
- Campos `recurso` + `recursoDestino`
- `validarTransferencia()` em `transactionValidation.js`


## 👤 Responsável

Sofia Vasconcelos (`sofiavasconcelosms`)

## 🔗 Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) — Testes de transferência (`FEAT-014` + `FEAT-017`) → issue [#152](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/152)
- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) — `TRANSFERENCIA` no service (`FEAT-012`)
- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) — Toggle no formulário (`FEAT-016`)
## 📋 Resumo

### ✅ Concluído
- Spec RF-027 documentada

### ⏳ Pendente
- Nenhum
