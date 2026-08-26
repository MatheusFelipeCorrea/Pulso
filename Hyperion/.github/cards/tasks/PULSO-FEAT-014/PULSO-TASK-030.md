---
card_id: PULSO-TASK-030
title: "Transferências — backend e formulário"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-014
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Transferências — backend e formulário

> **Contexto:** RF-140 — tipo TRANSFERENCIA ponta a ponta.

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

## 📋 Resumo

### ✅ Concluído
- Spec RF-140 documentada

### ⏳ Pendente
- Implementar branch transferência API + UI
