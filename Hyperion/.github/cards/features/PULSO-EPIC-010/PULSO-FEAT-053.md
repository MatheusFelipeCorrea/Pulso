---
card_id: "PULSO-FEAT-053"
title: "Cálculos — sobra, tempo e parcelas"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-010"
due_date: null
board_sync_at: "2026-08-26T15:30:26.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Cálculos — sobra, tempo e parcelas

> **Contexto:** Motor de simulação financeira do planejamento de compra.

**Refs:** RF-134–136 · RN-087–091

## 📝 Descrição

Implementar utilitários e contexto financeiro usados no mapper e no painel.

## ✅ Critérios de Aceite

- `calcularSobraMensal` — média de 3 meses (receita − despesa); piso 0 (RN-088)
- `calcMesesParaComprar` — ceil(valorRestante ÷ sobra); `null` se sobra ≤ 0 (RN-087)
- `calcParcela` / `calcComprometimento` — parcela e % da renda (RN-089–090)
- Níveis: `saudavel` (≤20%), `atencao` (≤30%), `arriscado` (>30%) (RN-091)
- Se meta vinculada: usar `valorRestante` da meta no tempo estimado
- `inferirCategoria` por keywords no nome
- Dicas do dia rotativas (`selecionarDicasDoDia`)

## 🔗 Sub-issues

- PULSO-TASK-107
- PULSO-TASK-109

## 📋 Resumo

### ✅ Concluído
- Fórmulas RN-087–091 mapeadas

### ⏳ Pendente
- PULSO-TASK-107 / 109 — utils e sobra mensal
