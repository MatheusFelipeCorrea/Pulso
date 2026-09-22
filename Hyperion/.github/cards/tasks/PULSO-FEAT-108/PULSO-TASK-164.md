---
card_id: PULSO-TASK-164
title: "Flutter — lista, filtros e resumo de transações"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-108
due_date: null
categories:
  - Mobile
  - Frontend
  - UX / UI
---

# [TASK] Flutter — lista, filtros e resumo de transações

> **Contexto:** Auth Flutter (FEAT-107) já entrega sessão Bearer. `/home` é stub. A API de transações está nas PRs da Sprint-3 (`/api/transacoes`, `/resumo`, `/filtros`).

## 📝 Descrição

Criar o módulo `features/transactions` no app: rota autenticada, listagem agrupada por data, cards de resumo e filtros, consumindo a mesma API Node.

## ✅ Critérios de Aceite

**Dado** usuário autenticado,  
**Quando** abre Transações,  
**Então** `GET /api/transacoes` e `GET /api/transacoes/resumo` em paralelo (Dio + `X-Pulso-Client: mobile`).

**Então** lista paginada agrupada por data; cards receita/despesa/saldo refletem os filtros ativos.

**Então** filtros: período, categoria, tipo, recurso, busca; opções via `GET /api/transacoes/filtros`.

**Então** estados loading, vazio e erro; pull-to-refresh.

## 🛠️ Implementação

### `Codigo/Pulso/mobile/lib/features/transactions/` (NOVO — CRIAR)

- `data/transaction_repository.dart` — client REST
- `screens/transactions_screen.dart` — lista + resumo
- widgets de filtros, cards e linha da lista

### `app_router.dart` (EXISTENTE — MODIFICAR)

Rota autenticada `/transactions` (sair do stub `/home` ou navegar a partir dele).

## 📐 Regras de Negócio

- Transferências **não** entram nos totais de receita/despesa do resumo
- Sem segundo backend; mesma base URL da auth

## 📋 Resumo

### ✅ Concluído
- Contrato HTTP já definido em FEAT-012

### ⏳ Pendente
- Implementar tela e repository no Flutter
