---
card_id: "PULSO-FEAT-072"
title: "Score, projeções e alertas preditivos"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-013"
due_date: null
board_sync_at: "2026-08-26T15:30:44.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Score, projeções e alertas preditivos

> **Contexto:** Camada determinística (regras) que a IA interpreta e enriquece em linguagem natural.

**Refs:** RF-048 · RF-107 · RF-108 · RF-047 · RN-127 · RN-128

## 📝 Descrição

Calcular score 0–100, cenários de projeção e alertas estruturados antes/depois do LLM.

## ✅ Critérios de Aceite

### Score (RF-048 / RN-127)
- Fórmula documentada (base: fluxo, orçamento, metas — alinhar a `calcularSaudeFinanceira` do dashboard)
- Persistir em `HistoricoScore` (`score` + `detalhes` JSON)
- Job/recalc diário opcional; sempre recalcular na geração de insights

### Projeções (RF-107 / RN-128)
- Base: média 3 meses receitas/despesas
- Cenários: **otimista**, **atual**, **pessimista** em horizontes 3, 6 e 12 meses
- RF-108: `diasAteNegativo` no ritmo atual (ou `null` se não aplicável)

### Alertas (RF-047)
- Cobertura de recurso/orçamento (ex.: VA no ritmo atual)
- Meta dentro/fora do prazo
- Estrutura: `{ tipo, severidade, mensagem, entidadeId? }`

## 🔗 Sub-issues

- PULSO-TASK-144
- PULSO-TASK-145

## 📋 Resumo

### ✅ Concluído
- Regras de score/projeção/alerta mapeadas

### ⏳ Pendente
- PULSO-TASK-144–145 — engines determinísticos
