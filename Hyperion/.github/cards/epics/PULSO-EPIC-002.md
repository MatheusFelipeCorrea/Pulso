---
card_id: PULSO-EPIC-002
title: "Dashboard Principal"
status: "In Revision"
type: Epic
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
  - Integração Externa
---

# [EPIC] Dashboard Principal

> **Contexto:** Painel central pós-login do Pulso — consolida saldos, gráficos, alertas de orçamento, metas ativas, saúde financeira e ponto de entrada para importação de extratos. Destino autenticado padrão: `/dashboard`.

**Refs:** RF-007–015 · RF-134–137 · RF-139

## 🎯 Objetivos

- Exibir saldo total do mês e saldos por recurso (DINHEIRO, VA, VR) com variação vs. mês anterior (RF-007, RF-008)
- Gráfico receitas vs. despesas diárias do mês com seletor de período (RF-009)
- Gráfico donut de gastos por categoria (RF-010)
- Listar últimas transações, alertas de orçamento (≥80%), progresso de metas ativas (RF-011–013)
- Score de saúde financeira com checklist explicativo (RF-014)
- Importar extratos (OFX/CSV/XLSX/PDF) via modal no dashboard (RF-134–137, RF-139)
- Quick-add via chatbot para lançamento em linguagem natural (RF-015 — pendente)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/dashboard` | Dashboard | Carrega `GET /dashboard?mes=YYYY-MM`; header com saudação + importar extrato |
| Modal import | ImportStatementModal | pick → mapping (CSV) → preview → confirmar → recarrega dashboard |

**Layout:** `MainLayout` + sidebar · **API única:** `GET /api/dashboard` · **Redirect pós-login:** `/dashboard`

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `transactionService.calcularResumo`, `transactionRepository.listarPorUsuario` |
| Orçamento | `budgetService.obterStatusOrcamento` → alertas ≥80% |
| Metas | `metaRepository.listarPorUsuario` (status ATIVA, limite 4) |
| Importação | `POST /importacoes/analisar` + `POST /importacoes/confirmar` |
| Notificações | `NotificationPanel` no header (MainLayout) — tipos linkam para `/dashboard` |

## 🔗 Sub-issues

- PULSO-FEAT-006
- PULSO-FEAT-007
- PULSO-FEAT-008
- PULSO-FEAT-009
- PULSO-FEAT-010
- PULSO-FEAT-011

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`) — API, web e Flutter


## 🔗 Pull Requests

- [#370](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/370) — dashboard API + web
- [#378](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/378) — dashboard Flutter
- [#384](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/384) — parity (gráficos + import no mobile)

## 📋 Resumo

### ✅ Concluído
- `GET /dashboard` + widgets web (saldos, gráficos, alertas, metas, saúde, importação)
- Flutter dashboard alinhado à web (hero, recursos, barras, donut, import)
- Hierarquia Epic → Features → Tasks em In Revision (Sprint 5)

### ⏳ Pendente
- RF-015 quick-add chatbot (`PULSO-FEAT-011`) — bloqueado no épico Chatbot
- RF-138 aprendizado persistente na importação
