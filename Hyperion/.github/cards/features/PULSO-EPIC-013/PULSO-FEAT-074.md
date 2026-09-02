---
card_id: "PULSO-FEAT-074"
title: "API, cache, job e regenerar"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-013"
due_date: null
board_sync_at: "2026-08-26T15:30:46.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Notificações"
---


# [FEATURE] API, cache, job e regenerar

> **Contexto:** Expor insights via HTTP, controlar custo e disparar geração mensal.

**Refs:** RN-125 · RN-126

## 📝 Descrição

Endpoints autenticados, cache mensal, regeneração com cota e job de fim de mês.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/insights` | Retorna snapshot do mês (`?mes=YYYY-MM`); se ausente, gera ou 404 conforme política |
| GET | `/insights/score` | Score atual + histórico recente |
| POST | `/insights/regenerar` | Força nova geração (cota N/mês); invalida cache |

- Auto: job mensal (RN-125) independente de registrar transação
- Regenerar: permitido sob demanda com limite (ex.: 3/mês) — **não** bloquear após 1 geração automática (corrige `jaGerouInsightNoMes` atual)
- Notificação `INSIGHT_IA` com `geradoPor: 'gemini'`, `linkAcao: '/insights'`
- Sem chave Insights → endpoints degradam com 503 (ou fallback só score/regras, documentado)
- Substituir/encurtar efeito colateral em `transactionService` (não depender só dele)

## 🔗 Sub-issues

- PULSO-TASK-148
- PULSO-TASK-149

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e política de cota definidos

### ⏳ Pendente
- PULSO-TASK-148–149 — API e job
