---
card_id: "PULSO-EPIC-002"
title: "Dashboard Principal"
status: "Backlog"
type: "Epic"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
board_sync_at: "2026-08-26T15:29:22.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "Integração Externa"
  - "Regra de Negócio"
  - "UX / UI"
---


# [EPIC] Dashboard Principal

> **Contexto:** Painel central pós-login do Pulso — consolida saldos, gráficos, alertas de orçamento, metas ativas, saúde financeira e ponto de entrada para importação de extratos. Destino autenticado padrão: `/dashboard`.

**Refs:** RF-007–014 · RF-155–158 · RF-160 · RF-139 (pendente)

## 🎯 Objetivos

- Exibir saldo total do mês e saldos por recurso (DINHEIRO, VA, VR, VT) com variação vs. mês anterior (RF-007, RF-008)
- Gráfico receitas vs. despesas diárias do mês com seletor de período (RF-009)
- Gráfico donut de gastos por categoria (RF-010)
- Listar últimas transações, alertas de orçamento (≥80%), progresso de metas ativas (RF-011–013)
- Score de saúde financeira com checklist explicativo (RF-014)
- Importar extratos (OFX/CSV/XLSX/PDF) via modal no dashboard (RF-155–158, RF-160)
- Quick-add via chatbot para lançamento em linguagem natural (RF-139 — pendente)

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
| VT | `transportService.obterSaldoVt` para saldo VT em tempo real |
| Importação | `POST /importacoes/analisar` + `POST /importacoes/confirmar` |
| Notificações | `NotificationPanel` no header (MainLayout) — tipos linkam para `/dashboard` |

## 🔗 Sub-issues

- PULSO-FEAT-006
- PULSO-FEAT-007
- PULSO-FEAT-008
- PULSO-FEAT-009
- PULSO-FEAT-010
- PULSO-FEAT-011

## 📋 Resumo

### ✅ Concluído
- Escopo mapeado nos RFs RF-007–014 e RF-155–158/160
- Contrato agregado `GET /dashboard` especificado com payloads por seção
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar endpoint agregado e todos os widgets frontend
- Fluxo completo de importação via modal
- RF-139 quick-add (depende módulo Chatbot)
- RF-159 aprendizado de categorização na importação (fora do escopo mínimo deste epic)
- Testes unitários dedicados para `dashboardService`
