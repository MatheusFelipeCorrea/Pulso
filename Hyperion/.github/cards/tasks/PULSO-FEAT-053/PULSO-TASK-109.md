---
card_id: PULSO-TASK-109
title: "Backend — sobra mensal e contexto financeiro"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-053
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — sobra mensal e contexto financeiro

> **Contexto:** Contexto de renda/sobra usado em mapper, resumo e alertas.

## 📝 Descrição

Implementar agregação de 3 meses e montagem do resumo do painel.

## 🛠️ Implementação

### `purchasePlanningService.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `agregarReceitasDespesasMes` | groupBy tipo Transacao no mês |
| `calcularSobraMensal` | média 3 meses; `Math.max(0, sobraMedia)` (RN-088) |
| `montarResumo` | totais, mediaImpactoRenda, categorias, dicas |
| Renda | `obterRendaMensalPlanejada`; fallback receitas do mês atual |

Exportar contexto `{ rendaMensal, sobraMensal, receitas, despesas }` para `mapItem`.

## 📋 Resumo

### ✅ Concluído
- RN-088 especificada

### ⏳ Pendente
- Implementar sobra e resumo
