---
card_id: PULSO-TASK-019
title: "Saúde financeira — algoritmo e widget"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-009
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Saúde financeira — algoritmo e widget

> **Contexto:** RF-014 — score composto e checklist explicativo.

## 📝 Descrição

Calcular score 0–100 no backend e exibir widget visual no dashboard com label, mensagem motivacional e checklist de 3 itens.

## ✅ Critérios de Aceite

**Então** payload `saudeFinanceira: { score, label, mensagem, checklist[] }`

**Labels:** Atenção (≤40), Regular, Bom (≥61), Excelente (≥81)

**Checklist items:** fluxo (receitas ≥ despesas), orçamento (0 estourados), metas (progresso médio ou incentivo a criar)

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

Em `dashboardService.js`:

```javascript
// calcularSaudeFinanceira({ resumoMes, alertasOrcamento, metasAtivas })
```

Pontuação base 45 + bônus/penalidades documentados na feature PULSO-FEAT-009.

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `DashboardFinancialHealth.jsx` | Score circular/barra + checklist |

## 📋 Resumo

### ✅ Concluído
- Fórmula de score e critérios de checklist especificados

### ⏳ Pendente
- Implementar `calcularSaudeFinanceira` no service
- Implementar widget `DashboardFinancialHealth`
