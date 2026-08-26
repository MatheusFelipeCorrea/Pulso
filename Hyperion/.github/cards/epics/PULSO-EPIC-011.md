---
card_id: PULSO-EPIC-011
title: "Divisão de Despesas"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
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

**Refs:** RF-115–120 · RN-081–086 · RNF-016

## 🎯 Objetivos

- Registrar despesa compartilhada com valor total e participantes (RF-115, RN-081)
- Calcular quanto cada um deve — igualitário ou personalizado (RF-116–117, RN-082–083)
- Organizador (“Você”) incluído automaticamente (RN-084)
- Marcar/desmarcar quem já pagou a parte (RF-118)
- Auto-quitar quando todos pagos; reabrir se desmarcar (RN-085)
- Saldo consolidado: me devem vs eu devo (RF-119)
- Lembrete de cobrança via módulo Lembretes, N:N com participantes (RF-120, RN-086)
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
| Grupos / RF-095 | Integração toggle viagem ↔ `/expense-split` — evolução futura |

## 🔗 Sub-issues

- PULSO-FEAT-058
- PULSO-FEAT-059
- PULSO-FEAT-060
- PULSO-FEAT-061
- PULSO-FEAT-062
- PULSO-FEAT-063

## 📋 Resumo

### ✅ Concluído
- Escopo RF-115–120 e RN-081–086 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Vincular toggle RF-095 (Grupos) a este módulo — evolução futura
