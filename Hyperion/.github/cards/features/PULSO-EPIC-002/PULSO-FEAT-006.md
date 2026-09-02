---
card_id: "PULSO-FEAT-006"
title: "Backend — agregação GET /dashboard"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-002"
due_date: null
board_sync_at: "2026-08-26T15:29:40.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Arquitetura"
---


# [FEATURE] Backend — agregação GET /dashboard

> **Contexto:** Endpoint único que compõe todos os blocos do dashboard reutilizando services existentes (transações, orçamento, metas, VT), evitando N+1 requests no frontend.

**Refs:** RF-007–014 (dados)

## 📝 Descrição

`GET /api/dashboard?mes=YYYY-MM` deve retornar payload agregado: saldo total com variação, recursos, série receitas/despesas, gastos por categoria, últimas transações, alertas de orçamento, metas ativas e saúde financeira.

## ✅ Critérios de Aceite

### Cenário 1 — Mês corrente
**Quando** `GET /api/dashboard` sem query,  
**Então** usa mês atual como referência.

### Cenário 2 — Mês histórico
**Quando** `GET /api/dashboard?mes=2026-03`,  
**Então** todos os blocos refletem março/2026.

### Cenário 3 — Autenticação
**Quando** request sem JWT válido,  
**Então** retorna `401`.

### Cenário 4 — Payload completo
**Então** JSON contém: `mes`, `saldoTotal`, `recursos`, `receitasDespesas`, `gastosPorCategoria`, `ultimasTransacoes`, `alertasOrcamento`, `metasAtivas`, `saudeFinanceira`.

## 🔗 Sub-issues

- PULSO-TASK-013
- PULSO-TASK-014

## 📋 Resumo

### ✅ Concluído
- Contrato de resposta e dependências entre services documentados

### ⏳ Pendente
- PULSO-TASK-013 — `dashboardService.obterDashboard`
- PULSO-TASK-014 — controller, routes e mount
