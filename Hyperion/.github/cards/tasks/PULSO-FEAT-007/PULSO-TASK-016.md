---
card_id: PULSO-TASK-016
title: "Frontend — saldos e ResourceCard"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — saldos e ResourceCard

> **Contexto:** Seção de saldo total e cards por recurso (RF-007, RF-008).

## 📝 Descrição

Renderizar saldo total com badge de variação e carousel horizontal de recursos financeiros, responsivo em mobile.

## ✅ Critérios de Aceite

### Cenário 1 — Saldo total
**Então** valor formatado BRL + `VariacaoBadge` (% vs. mês anterior quando `tipo: percentual`).

### Cenário 2 — Resource cards
**Então** um card por `recursos[]` (DINHEIRO, VA, VR, VT) com ícone/cor de `resourceConfig.js`.

### Cenário 3 — Sugestão VR
**Quando** recurso VR com `sugestaoDiaria`,  
**Então** exibir hint "≈ R$ X/dia útil restante".

### Cenário 4 — Mobile
**Então** carousel com scroll horizontal + botões prev/next quando overflow.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `components/features/dashboard/DashboardBalanceSection.jsx` | Saldo total + track de cards |
| `components/features/dashboard/ResourceCard/ResourceCard.jsx` | Card individual por recurso |
| `components/features/dashboard/ResourceCard/resourceConfig.js` | Ícones, labels, cores por tipo |
| `styles/dashboard.css` | Layout balance + carousel mobile |
| `styles/pulso-components.css` | Estilos ResourceCard compartilhados |

### Backend util relacionado (NOVO — CRIAR)

`Codigo/Pulso/api/src/utils/resourceBalanceUtils.js` — `RECURSOS_DASHBOARD`, `calcularSaldosPorRecurso`

## 📋 Resumo

### ✅ Concluído
- Spec visual e comportamento mobile definidos

### ⏳ Pendente
- Implementar BalanceSection + ResourceCard
- Estilos responsivos em `dashboard.css`
