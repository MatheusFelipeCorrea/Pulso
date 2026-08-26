---
card_id: PULSO-TASK-094
title: "Backend — budgetRepository e gastos do mês"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-046
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — budgetRepository e gastos do mês

> **Contexto:** Persistência Prisma e agregação de despesas por categoria no mês.

## 📝 Descrição

Implementar repository de orçamentos e cálculo de gastos.

## 🛠️ Implementação

### `repositories/budgetRepository.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `buscarPorUsuarioEMes` | Include categoria; order nome |
| `upsert` | Unique usuario+categoria+mês |
| `deletar` / `deletarForaDaLista` | Remoção unitária ou sync da lista |
| `copiarParaMes` | Clona limites origem → destino com rollover |
| `calcularGastosPorCategoria` | `groupBy` Transacao DESPESA no intervalo do mês |
| `buscarUsuariosComOrcamentoNoMes` | Distinct para job de alertas |

Usar `intervaloDoMes` de `monthUtils`.

## 📋 Resumo

### ✅ Concluído
- Contratos do repository definidos

### ⏳ Pendente
- Implementar budgetRepository
