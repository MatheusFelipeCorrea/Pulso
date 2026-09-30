---
card_id: PULSO-TASK-164
title: "Flutter — lista, filtros e resumo de transações"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 3"
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

> **Contexto:** Auth Flutter (FEAT-107) já entrega sessão Bearer. A API de transações está na Sprint-3 (`/api/transacoes`, `/resumo`, `/filtros`).

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

### `Codigo/Pulso/mobile/lib/features/transactions/` (EXISTENTE)

- `data/transaction_repository.dart` — client REST
- `screens/transactions_screen.dart` — lista + resumo
- widgets de filtros, cards e linha da lista

### `app_router.dart` (EXISTENTE — MODIFICAR)

Rota autenticada `/transactions`.

## 📐 Regras de Negócio

- Transferências **não** entram nos totais de receita/despesa do resumo
- Sem segundo backend; mesma base URL da auth

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 📋 Resumo

### ✅ Concluído
- Contrato HTTP da FEAT-012
- Lista, filtros, resumo e pull-to-refresh no Flutter (Sprint-3)

### ⏳ Pendente
- Nenhum
