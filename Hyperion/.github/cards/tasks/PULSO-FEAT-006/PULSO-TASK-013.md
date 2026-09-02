---
card_id: "PULSO-TASK-013"
title: "Backend — dashboardService.obterDashboard"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-006"
due_date: null
board_sync_at: "2026-08-26T15:31:03.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Arquitetura"
---


# [TASK] Backend — dashboardService.obterDashboard

> **Contexto:** Service de agregação que compõe todos os blocos do dashboard em uma única chamada paralela.

## 📝 Descrição

Implementar `obterDashboard(usuarioId, query)` orchestrando resumo mensal, série diária, categorias, saldos, metas, orçamento e saúde financeira.

## ✅ Critérios de Aceite

**Quando** `obterDashboard(userId, { mes: '2026-08' })`,  
**Então** retorna objeto com todas as chaves do contrato documentado na feature PULSO-FEAT-006.

## 🛠️ Implementação

### `dashboardService.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/services/dashboardService.js`

```javascript
// obterDashboard(usuarioId, query)
// obterSerieReceitasDespesas(usuarioId, inicio, fim)
// obterGastosPorCategoria(usuarioId, inicio, fim)
// obterSaldosRecursos(usuarioId, mesReferencia)
// calcularSaudeFinanceira({ resumoMes, alertasOrcamento, metasAtivas })
// buildVariacaoPercentual(atual, anterior)
```

**Dependências (reutilizar, não duplicar lógica):**

| Service/Util | Uso |
|--------------|-----|
| `transactionService.calcularResumo` | Resumo mês atual e anterior |
| `transactionRepository.listarPorUsuario` | Últimas transações (limite 25) |
| `budgetService.obterStatusOrcamento` | Alertas ≥80% |
| `metaRepository.listarPorUsuario` | Metas ATIVAS (limite 4) |
| `transportService.obterSaldoVt` | Saldo VT real-time |
| `resourceBalanceUtils` | `calcularSaldosPorRecurso`, `saldoTotalDisponivel`, `diasUteisRestantesNoMes` |
| `monthUtils` | `mesReferenciaFromQuery`, `intervaloDoMes`, `mesAnterior` |

**Filtros:** excluir ajustes de saldo de importação via `whereExcluiAjusteSaldoImportacao`

## 📐 Regras de Negócio

- Saldo total = soma DINHEIRO + VA + VR + VT
- Sugestão diária VR = saldo VR / dias úteis restantes no mês
- Alertas orçamento: categorias com `percentualUsado >= 80`
- Score saúde: 0–100 baseado em fluxo, orçamento estourado e progresso de metas

## 📋 Resumo

### ✅ Concluído
- Contrato de agregação e mapa de dependências definidos

### ⏳ Pendente
- Implementar service e helpers internos
- Garantir `Promise.all` para performance
