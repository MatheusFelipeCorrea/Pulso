---
card_id: PULSO-FEAT-112
title: "Mobile Flutter — orçamento mensal"
status: "In Progress"
type: Feature
priority: High
sprint: "Sprint 4"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-009
due_date: null
categories:
  - Mobile
  - Frontend
  - UX / UI
---

# [FEATURE] Mobile Flutter — orçamento mensal

> **Contexto:** A API e a Web (`/budget`) cobrem RF-099–105. O Flutter consome `/api/orcamentos` com Bearer + `X-Pulso-Client: mobile`.

**Refs:** RF-099–105 · RN-055–060 · RN-170 · RF-140  
**Web:** `BudgetPage`

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **ver limites por categoria, progresso e editar o mês no telefone**, para o orçamento existir no mobile sem segundo backend.

## ✅ Critérios de Aceite

### Cenário 1 — Status do mês
**Quando** abre Orçamento Mensal,  
**Então** `GET /api/orcamentos/status?mes=YYYY-MM` preenche resumo, categorias com limite e categorias sem orçamento.

### Cenário 2 — Editar limites
**Quando** salva,  
**Então** `POST /api/orcamentos` com `mesReferencia` `YYYY-MM-01` e `limites[]` (`categoriaId`, `limiteValor`, `rolloverAtivo`). Lista vazia limpa o mês.

### Cenário 3 — Copiar mês
**Então** `POST /api/orcamentos/copiar` com origem/destino; trata 404 (origem vazia) e 409 (destino já tem orçamento).

### Cenário 4 — Alertas visuais
**Então** badges em 80%/100%; aviso se orçamento total > renda planejada; categorias sem limite não geram alerta.

## 🔗 Sub-issues

- PULSO-TASK-175
- PULSO-TASK-176

## 👤 Responsáveis

- Sofia Vasconcelos (`sofiavasconcelosms`) — camada de dados
- Maria Clara (`mariaoliveira27`) — telas

## 📋 Resumo

### ⏳ Pendente
- Implementar repository, telas e item da sidebar
