---
card_id: PULSO-TASK-026
title: "Backend — transactionService e repository"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
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
- `incrementarStreak`, `gamificationService`, `notificationService`, `insightService`

## 🛠️ Implementação

### `transactionService.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/services/transactionService.js`

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

## 📋 Resumo

### ✅ Concluído
- Assinaturas e side-effects documentados

### ⏳ Pendente
- Implementar service + repository + filter service
