---
card_id: PULSO-TASK-026
title: "Backend — transactionService e repository"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-012
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — transactionService e repository

> **Contexto:** Regras de negócio centrais para CRUD, resumo e side-effects.

## 📝 Descrição

Implementar service e repository com listagem filtrada, agregados, validações e integrações pós-criação.

## ✅ Critérios de Aceite

**Então** métodos:
- `listarTransacoes`, `calcularResumo` (modos fluxo/benefício/carteira)
- `criarTransacao`, `editarTransacao`, `excluirTransacao`

**Side-effects em criar:**
- `notificationService`, `insightService` (hooks pós-transação)

## 🛠️ Implementação

### `transactionService.js` (NOVO — CRIAR)

Criar em: `Codigo/api/src/services/transactionService.js`

### `transactionRepository.js` (NOVO — CRIAR)

- `listarPorUsuario`, `calcularAgregados`, `criar`, `atualizar`, `excluir`
- `vincularTags`, `desvincularTags`, `listarRecorrentesMae`
- `excluirRecorrentesFilhasAPartirDe`, `encerrarRecorrencia`

### `transactionFilterService.js` (NOVO — CRIAR)

Montagem de `where` Prisma a partir de query (período, categoria, tipo, recurso, busca)

### Utils (NOVO — CRIAR)

- `transactionMapper.js` — DTO API
- `resourceBalanceUtils.js` — saldos por recurso

## 📐 Regras de Negócio

- Data futura bloqueada exceto recorrentes
- TRANSFERENCIA: origem ≠ destino, sem categoria
- Resumo exclui TRANSFERENCIA dos totais receita/despesa


## 👤 Responsável

Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 🔗 Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) — `transactionService` / repository / filtros (`FEAT-012`) → issue [#114](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/114)
## 📋 Resumo

### ✅ Concluído
- Assinaturas e side-effects documentados

### ⏳ Pendente
- Implementar service + repository + filter service
