---
card_id: PULSO-EPIC-006
title: "Lembretes e Google Agenda"
status: "In Revision"
type: Epic
priority: Highest
sprint: "Sprint 4"
story_points: null
reporter: "Matheus Felipe Correa"
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Integração Externa
  - Regra de Negócio
---

# [EPIC] Lembretes e Google Agenda

> **Contexto:** Lembretes financeiros com categorias (52), antecedência configurável, flag pago, recorrência mensal ou a cada N dias; calendário financeiro unificando transações e vencimentos; sync bidirecional com Google Calendar (calendário "Pulso"), tokens OAuth criptografados.

**Refs:** RF-062–067 · RF-067 · RN-094–100 · RN-169

## 🎯 Objetivos

- CRUD de lembretes com título, valor opcional, data, hora, categoria e antecedência (RF-063, RF-066)
- OAuth Google Calendar separado do login (`GOOGLE_CALENDAR_CALLBACK_URL`) (RF-062)
- Sync opt-in: criar/atualizar eventos no calendário "Pulso" (RF-064, RN-096)
- Desconectar Google a qualquer momento; remover eventos ao desativar sync (RF-065)
- Import Google → Pulso: título e data ao abrir mês ou sync manual (RF-067)
- Falha de sync na criação preserva lembrete com `sincronizado: false` (RN-097)
- Marcar como pago remove evento Google; não gera transação (RN-099)
- Recorrência mensal gera instâncias; `repetirCadaDias` avança vencimento (RN-098)
- Job diário de alertas `LEMBRETE_VENCIMENTO` por antecedência (RN-094, RN-095)
- Calendário financeiro: marcadores de transações + lembretes + recebimentos fixos (RN-100)
- Horário configurável `horaLembrete` no evento Google (RN-169)

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/calendar` | Calendário Financeiro | Grade mensal, painel do dia, próximos vencimentos |
| Banner | Google Agenda | Conectar/desconectar, status email |
| Modal | Lembrete | CRUD, categoria, recorrência, sync Google |
| Modal | Resync Google | Sincronizar pendentes (futuros/todos) |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | Marcadores no calendário via `calendarService` |
| Notificações | `LEMBRETE_VENCIMENTO` via `reminderAlertService` |
| Divisão de Despesas | M2M `DivisaoParticipante` ↔ `Lembrete` (epic separado) |
| Cron | `reminderAlertJob`, `reminderRecurrenceJob` |
| Google APIs | `@googleapis/calendar`, `@googleapis/oauth2` |
| Segurança | `googleTokenCrypto` AES-256-GCM em repouso |

## 🔗 Sub-issues

- PULSO-FEAT-030
- PULSO-FEAT-031
- PULSO-FEAT-032
- PULSO-FEAT-033
- PULSO-FEAT-034
- PULSO-FEAT-035
- PULSO-FEAT-111

## 📋 Resumo

### ✅ Concluído
- Escopo RF-062–067, RF-067 e RN-094–100 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend + jobs
- Paginação no job de alertas — evolução futura (escala)
