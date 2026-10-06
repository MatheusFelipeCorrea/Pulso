---
card_id: PULSO-FEAT-111
title: "Mobile Flutter — calendário financeiro e lembretes"
status: "In Progress"
type: Feature
priority: High
sprint: "Sprint 4"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-006
due_date: null
categories:
  - Mobile
  - Frontend
  - UX / UI
---

# [FEATURE] Mobile Flutter — calendário financeiro e lembretes

> **Contexto:** A API (`PULSO-FEAT-030`+) e a Web (`/calendar`) cobrem RF-062–067. O Flutter consome `/api/calendario` e `/api/lembretes` com Bearer + `X-Pulso-Client: mobile`.

**Refs:** RF-062–067 · RN-094–100 · RN-169 · RF-140  
**API:** lembretes + calendário · **Web:** `CalendarPage`

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **ver o mês, o detalhe do dia e gerenciar lembretes no telefone**, para o calendário financeiro existir no mobile sem segundo backend.

## ✅ Critérios de Aceite

### Cenário 1 — Visão do mês
**Dado** sessão autenticada,  
**Quando** abre Calendário Financeiro,  
**Então** chama `GET /api/calendario/mes?mes=YYYY-MM`; grade mensal com marcadores de receita/despesa/lembrete; KPIs do mês.

### Cenário 2 — Dia e próximos vencimentos
**Quando** seleciona um dia,  
**Então** `GET /api/calendario/dia?data=YYYY-MM-DD` preenche transações, lembretes e totais; lista “próximos vencimentos” do mês.

### Cenário 3 — CRUD de lembrete
**Então** `POST/PATCH/DELETE /api/lembretes` e `POST /api/lembretes/:id/pagar`; formulário com título, valor opcional, data, hora, categoria, antecedência e recorrência mensal (dia 1–28).

### Cenário 4 — Google Agenda
**Então** Premium vê status `GET /api/calendario/google/status`. Conectar no app abre a URL de OAuth da API; o callback continua no web. Não há backend paralelo.

## 🔗 Sub-issues

- PULSO-TASK-173
- PULSO-TASK-174

## 👤 Responsáveis

- Alice Shikida (`aliceshikida`) — camada de dados
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — telas e navegação

## 📋 Resumo

### ✅ Concluído
- Escopo Flutter alinhado à Web `/calendar`

### ⏳ Pendente
- Implementar repository, telas e item da sidebar
