---
card_id: PULSO-FEAT-110
title: "Mobile Flutter e protótipos de viagens e moedas"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-005
due_date: null
categories:
  - Mobile
  - Frontend
  - Protótipo
  - UX / UI
  - Documentação
---

# [FEATURE] Mobile Flutter e protótipos de viagens e moedas

> **Contexto:** API de moedas (`PULSO-FEAT-023`) e viagens (`PULSO-FEAT-024`) + Web (`PULSO-FEAT-027`/`028`) cobrem RF-037–047. O Flutter consome as mesmas rotas `/api/moedas` e `/api/viagens`. Grupos no app já falam `/api/grupos` no contrato da web; a API de grupos **ainda não está ligada** neste Sprint. Frames de `PULSO-FEAT-091` entram na apostila.

**Refs:** RF-037–047 · RF-140 · Premium (viagens)  
**Protótipo (Figma):** `PULSO-FEAT-091`  
**API:** `PULSO-FEAT-023` · `PULSO-FEAT-024` · **Web:** `PULSO-FEAT-027` · `PULSO-FEAT-028`

## 📝 Descrição

Como **usuário Premium do app Flutter**, eu quero **planejar viagens, converter moedas e ver detalhe com despesas/notas no telefone**, para o módulo existir no mobile sem segundo backend.

Como **equipe**, eu quero **os protótipos de viagens e moedas publicados na apostila**.

## ✅ Critérios de Aceite

### Cenário 1 — Protótipos na apostila
**Então** `docs/5.wireframe.md` inclui exports de `/trips` e `/trips/:id` (lista, conversor, detalhe, nova viagem) — claro e escuro — alinhados a `PULSO-FEAT-091`.

### Cenário 2 — Gate Premium
**Dado** plano diferente de PREMIUM,  
**Então** a tela de viagens explica o bloqueio, como a API `requirePremium`.

### Cenário 3 — Viagens e moedas
**Quando** Premium abre Viagens,  
**Então** catálogo/conversão/favoritas via `/api/moedas`; CRUD de viagens via `/api/viagens`; detalhe com despesas e observações.

### Cenário 4 — Grupos
**Então** o app lista/cria/entra em grupos em `/api/grupos` no contrato da web; empty/erro documenta que a API ainda não está ligada neste Sprint.

### Cenário 5 — Mesma API
**Então** não há backend paralelo.

## 🔗 Sub-issues

- PULSO-TASK-169
- PULSO-TASK-170
- PULSO-TASK-171
- PULSO-TASK-172

## 👤 Responsáveis

- Vinícius Simões (`ViniSimoesV`) — dados de viagens e grupos
- Sofia Vasconcelos (`sofiavasconcelosms`) — moedas
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — telas e navegação

## 🔗 Pull Requests

- [#322](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/322) — dados viagens/grupos (Vinícius)
- [#323](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/323) — moedas (Sofia)
- [#324](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/324) — telas (Matheus)

## 🔗 Issues

- [#338](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/338) — PULSO-FEAT-110
- [#339](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/339) — PULSO-TASK-169
- [#340](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/340) — PULSO-TASK-170
- [#341](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/341) — PULSO-TASK-171
- [#342](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/342) — PULSO-TASK-172

## 📋 Resumo

### ✅ Concluído
- Flutter viagens, moedas, grupos (client) e nav mergeados na Sprint-3
- Protótipos na apostila (`docs/5.4`, TASK-169)

### ⏳ Pendente
- Ligar API de grupos no backend (fora deste card)
- Revisão (In Revision)
