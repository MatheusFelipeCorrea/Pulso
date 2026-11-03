---
card_id: PULSO-EPIC-011
title: "Divisão de Despesas"
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
  - Banco de Dados
  - Regra de Negócio
  - Notificações
---

# [EPIC] Divisão de Despesas

> **Contexto:** Split bill standalone — despesa compartilhada com participantes por nome livre, rateio igual ou personalizado, “quem paga quem”, saldo consolidado e lembrete de cobrança no calendário.

**Refs:** RF-106–111 · RN-081–086 · RNF-016

## 🎯 Objetivos

- Registrar despesa compartilhada com valor total e participantes (RF-106, RN-081)
- Calcular quanto cada um deve — igualitário ou personalizado (RF-107–108, RN-082–083)
- Organizador (“Você”) incluído automaticamente (RN-084)
- Marcar/desmarcar quem já pagou a parte (RF-109)
- Auto-quitar quando todos pagos; reabrir se desmarcar (RN-085)
- Saldo consolidado: me devem vs eu devo (RF-110)
- Lembrete de cobrança via módulo Lembretes, N:N com participantes (RF-111, RN-086)
- Rateio em centavos inteiros determinístico (RNF-016)
- Job limpa quitadas com +180 dias; excluir ATIVA remove lembretes órfãos

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/expense-split` | Divisão de Despesas | Criar/editar, pagar, lembrete, histórico paginado |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Lembretes | `criarLembreteCobranca` → `reminderService`; M2M `_DivisaoParticipanteToLembrete` |
| Google Agenda | Sync herdado do M07 (falha preserva `sincronizado: false`) |
| Grupos / RF-091 | Integração toggle viagem ↔ `/expense-split` — evolução futura |

## 🔗 Sub-issues

- PULSO-FEAT-058
- PULSO-FEAT-059
- PULSO-FEAT-060
- PULSO-FEAT-061
- PULSO-FEAT-062
- PULSO-FEAT-063

## 👤 Responsáveis

- Vinícius Simões (`ViniSimoesV`) — API e web
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — Flutter / parity


## 🔗 Pull Requests

- [#374](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/374) — divisão API + web
- [#380](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/380) — divisão Flutter
- [#384](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/384) — edição/lembrete no mobile

## 📋 Resumo

### ✅ Concluído
- API + web + Flutter (rateio, pagar, resumo, lembrete de cobrança)
- Hierarquia Epic → Features → Tasks em In Revision (Sprint 5)

### ⏳ Pendente
- Vincular toggle RF-091 (Grupos) a este módulo — evolução futura
