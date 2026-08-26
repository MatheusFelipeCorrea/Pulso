---
card_id: PULSO-FEAT-007
title: "Página dashboard, saldos e recursos"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-002
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [FEATURE] Página dashboard, saldos e recursos

> **Contexto:** Shell da página principal pós-login com saldo total destacado e cards por recurso financeiro (RF-007, RF-008).

**Refs:** RF-007 · RF-008

## 📝 Descrição

Como **usuário autenticado**, quero ver meu saldo total e saldos separados por DINHEIRO, VA, VR e VT (com sugestão diária de VR), para entender minha disponibilidade financeira do mês.

## ✅ Critérios de Aceite

### Cenário 1 — Carregamento
**Quando** acesso `/dashboard`,  
**Então** exibe loading e chama `GET /dashboard?mes=YYYY-MM`.

### Cenário 2 — Saldo total
**Então** card principal mostra saldo formatado + badge de variação % vs. mês anterior (quando aplicável).

### Cenário 3 — Recursos
**Então** carousel/grid de `ResourceCard` por tipo (DINHEIRO, VA, VR, VT) com scroll horizontal em mobile.

### Cenário 4 — Destino pós-login
**Quando** login/OAuth concluído,  
**Então** redirect para `/dashboard` (`DEFAULT_AUTHENTICATED_ROUTE`).

## 🔗 Sub-issues

- PULSO-TASK-015
- PULSO-TASK-016

## 📋 Resumo

### ✅ Concluído
- Spec de layout header + seção de saldos definida

### ⏳ Pendente
- PULSO-TASK-015 — DashboardPage + routing
- PULSO-TASK-016 — BalanceSection + ResourceCard
