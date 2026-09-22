---
card_id: PULSO-EPIC-003
title: "Gerenciamento de Transações"
status: "In Progress"
type: Epic
priority: Highest
sprint: null
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
---

# [EPIC] Gerenciamento de Transações

> **Contexto:** Núcleo financeiro do Pulso — registrar, listar, filtrar, editar e excluir receitas, despesas e transferências; vincular categorias/tags; recorrência automática; validação recurso×categoria (VA/VR; VT rejeitado); sugestão de categoria por histórico.

**Refs:** RF-016–028  
**Spec:** `Hyperion/.github/plans/specs/PULSO-EPIC-003-transacoes/`

## 🎯 Objetivos

- CRUD de transações (receita, despesa, transferência) com validações de domínio
- Categorias padrão + personalizadas com `grupoBeneficio` (VA/VR)
- Tags livres M:N com criação inline no formulário
- Filtros por período, categoria, tipo, recurso; busca por descrição/tag
- Cards de resumo (receitas, despesas, saldo) sincronizados com filtros
- Recorrência RFC 5545 (semanal, quinzenal, mensal, anual) + job diário
- Transferências entre recursos sem contabilizar em totais de receita/despesa (RF-027)
- Sugestão automática de categoria ao digitar descrição (RF-028)
- Validar compatibilidade VA/VR × categoria; recurso VT rejeitado na API (RF-026)
- Exclusão recorrente "esta e futuras" preservando histórico passado

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/transactions` | Transações | Resumo, filtros, lista paginada agrupada por data |
| Modal | Nova/Editar | Toggle receita/despesa/transferência, recorrência, tags |
| Modal | Excluir | Simples ou recorrente (só esta / esta e futuras) |
| Modal | Categorias | CRUD categorias custom com preset benefício |
| Modal | Tags | CRUD tags com ícone e cor |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Categorias | Seed no cadastro; `categoryService`, `CategoryManageModal` |
| Tags | `tagService`, `TagManageModal`, `TransacaoTag` |
| Notificações | `RECEITA_REGISTRADA`, `DESPESA_REGISTRADA`, `TRANSFERENCIA_REGISTRADA` |
| Insights | `insightService.tentarGerarInsightAposTransacao` |
| Dashboard | `calcularResumo` reutilizado em `dashboardService` |
| Importação | `categorySuggestionUtils` compartilhado com import |
| Cron | `recurringTransactions.js` — 00:05 diário |

## 🔗 Sub-issues

- PULSO-FEAT-012
- PULSO-FEAT-013
- PULSO-FEAT-014
- PULSO-FEAT-015
- PULSO-FEAT-016
- PULSO-FEAT-017
- PULSO-FEAT-108

## 👤 Responsáveis

- Matheus Felipe Correa (`MatheusFelipeCorrea`) — FEAT-012
- Alice Shikida (`aliceshikida`) — FEAT-013
- Sofia Vasconcelos (`sofiavasconcelosms`) — FEAT-014 + FEAT-017
- Vinícius Simões (`ViniSimoesV`) — FEAT-015
- Maria Clara (`mariaoliveira27`) — FEAT-016

## 🔗 Pull Requests

- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) — FEAT-012 API de transações → [#25](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/25)
- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) — FEAT-013 categorias/tags → [#26](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/26)
- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) — FEAT-014 + FEAT-017 testes → [#27](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/27) · [#30](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/30)
- [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) — FEAT-015 recorrência → [#28](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/28)
- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) — FEAT-016 página web → [#29](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/29)
- [#307](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/307) — Wire-up API + Web na Sprint-3 + specs

## 🔗 Issues (mobile + protótipos)

- [#303](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/303) — PULSO-FEAT-108 Mobile Flutter e protótipos

## 📋 Resumo

### ✅ Concluído
- Escopo RF-016–028 mapeado
- Hierarquia Epic → Features → Tasks definida
- Contratos API e fluxos de UI documentados como spec
- FEAT-012–017 (API + Web + QA) mergeados na Sprint-3

### ⏳ Pendente
- PULSO-FEAT-108 — Flutter e protótipos na apostila
- Concorrência otimista em edição (If-Match) — evolução futura
- Indicador visual de recorrência na lista — opcional
