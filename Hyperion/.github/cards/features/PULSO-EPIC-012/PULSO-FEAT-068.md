---
card_id: PULSO-FEAT-068
title: "Frontend — página e componentes"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-012
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/debts` com tabs, filtros, cards e modais.

**Refs:** RF-117–123 · RN-078

## 📝 Descrição

Implementar página de dívidas com fluxo completo de CRUD e pagamentos.

## ✅ Critérios de Aceite

- Rota autenticada `/debts`
- Tabs: Me devem / Eu devo / Quitadas
- Summary cards + filtros (busca, valor, datas)
- Badges: vencida, parcial, sem prazo, quitada (`debtStatusUtils`)
- Modais: form, pagamento, quitar, reabrir, detalhes, delete
- Client `debtService.js` + `debts.css`

## 🔗 Sub-issues

- PULSO-TASK-138
- PULSO-TASK-139

## 👤 Responsáveis

- Sofia Vasconcelos (`sofiavasconcelosms`) — web + mobile
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — parity visual


## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-138–139 — página e componentes
