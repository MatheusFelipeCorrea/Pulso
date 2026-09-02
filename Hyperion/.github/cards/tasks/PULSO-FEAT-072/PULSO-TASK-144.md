---
card_id: "PULSO-TASK-144"
title: "Backend — score de saúde e HistoricoScore"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-072"
due_date: null
board_sync_at: "2026-08-26T15:29:08.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — score de saúde e HistoricoScore

> **Contexto:** RF-048 / RN-127 — score 0–100 persistido.

## 📝 Descrição

Extrair/evoluir cálculo de saúde financeira e gravar histórico.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR / REUSAR)

| Item | Função |
|------|--------|
| `services/financialHealthService.js` | `calcularScore(usuarioId, mes)` — documentar pesos |
| Base | Alinhar a `dashboardService.calcularSaudeFinanceira` (fluxo, orçamento, metas) |
| Persistência | `HistoricoScore.create({ score, detalhes })` |
| Job opcional | Recalc diário (RN-127) via cron |

`detalhes`: checklist, fatores, label (Excelente/Bom/Regular/Atenção).

## 📋 Resumo

### ✅ Concluído
- Faixas de score alinhadas ao dashboard UI

### ⏳ Pendente
- Implementar service + persistência
