---
card_id: PULSO-FEAT-113
title: "Mobile Flutter — planejamento de compra"
status: "In Progress"
type: Feature
priority: High
sprint: "Sprint 4"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-010
due_date: null
categories:
  - Mobile
  - Frontend
  - UX / UI
---

# [FEATURE] Mobile Flutter — planejamento de compra

> **Contexto:** A API e a Web (`/purchase-planning`) cobrem RF-124–129. O Flutter consome `/api/planejamento-compra` com Bearer + `X-Pulso-Client: mobile`.

**Refs:** RF-124–129 · RN-087–093 · RF-140  
**Web:** `PurchasePlanningPage`

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **montar a lista de desejos, simular parcelas, vincular meta e marcar “Comprei!” no telefone**.

## ✅ Critérios de Aceite

### Cenário 1 — Painel
**Quando** abre Planejamento de Compra,  
**Então** `GET /api/planejamento-compra` preenche `resumo`, `itens` (DESEJADO) e `comprados`.

### Cenário 2 — CRUD
**Então** criar/editar/excluir via `POST/PATCH/DELETE`; prioridade ALTA/MEDIA/BAIXA; categoria inferida ou escolhida.

### Cenário 3 — Simulação e alerta
**Então** mostra `mesesParaComprar`, simulações à vista vs parcelado e alerta de comprometimento (>20% atenção, >30% arriscado).

### Cenário 4 — Meta e comprar
**Então** `POST /:id/vincular-meta` e `POST /:id/comprar` (gera DESPESA na API). Histórico de comprados no app.

## 🔗 Sub-issues

- PULSO-TASK-177
- PULSO-TASK-178

## 👤 Responsáveis

- Vinícius Simões (`ViniSimoesV`) — dados e telas

## 📋 Resumo

### ⏳ Pendente
- Implementar repository, telas e item da sidebar
