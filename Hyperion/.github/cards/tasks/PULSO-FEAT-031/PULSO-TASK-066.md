---
card_id: "PULSO-TASK-066"
title: "Backend — googleCalendarSyncService"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-031"
due_date: null
board_sync_at: "2026-08-26T15:31:54.000Z"
categories:
  - "Backend"
  - "Integração Externa"
---


# [TASK] Backend — googleCalendarSyncService

> **Contexto:** Sync de eventos, import bidirecional e resync em lote.

## 📝 Descrição

Implementar serviço de sincronização com calendário "Pulso" e importação RF-058b.

## 🛠️ Implementação

### `googleCalendarSyncService.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `garantirCalendarioPulso` | Cria ou reutiliza calendário "Pulso" |
| `sincronizarLembrete` | insert/update evento; recreate em 404 |
| `buildEventBody` | start/end com `horaLembrete`; reminders por antecedência |
| `importarAlteracoesDoGoogle` | Atualiza titulo/data no Pulso (RF-058b) |
| `sincronizarPendentes` | Escopos futuros/todos |
| `contarPendentesSync` | Contadores para UI resync |
| `removerEventoLembrete` | Delete evento ao desmarcar sync/pagar |

**Token refresh:** `client.on('tokens')` persiste merge criptografado

**Erros:** `mapGoogleError` — scopes, invalid_grant, 403

## 📋 Resumo

### ✅ Concluído
- Contratos RF-056 e RF-058b definidos

### ⏳ Pendente
- Implementar sync service
