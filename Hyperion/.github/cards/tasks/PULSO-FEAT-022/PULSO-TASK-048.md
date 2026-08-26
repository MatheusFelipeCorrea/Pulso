---
card_id: PULSO-TASK-048
title: "QA — testes unitários de metas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-022
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes unitários de metas

> **Contexto:** Regressão para CRUD, aportes, conclusão, reabertura e cálculos.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/metaService.test.js` | CRUD, aportes, conclusão, excluirAporte reabertura |
| `unit/utils/metaBalanceUtils.test.js` | Progresso, sugestão mensal, vencimento, reserva |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/pages/goalsPage.test.jsx` | Render página, tabs |
| `unit/components/goalCard.test.jsx` | Progresso e labels |
| `unit/utils/goalIconRules.test.js` | Regras de ícone |
| `unit/services/metaService.test.js` | Chamadas HTTP |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas
