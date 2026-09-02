---
card_id: "PULSO-TASK-063"
title: "Backend — reminderService CRUD e marcar pago"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-030"
due_date: null
board_sync_at: "2026-08-26T15:31:51.000Z"
categories:
  - "Backend"
  - "Integração Externa"
  - "Regra de Negócio"
---


# [TASK] Backend — reminderService CRUD e marcar pago

> **Contexto:** Domínio de lembretes com sync Google, recorrência e dias até vencimento.

## 📝 Descrição

Implementar service com CRUD, `aplicarSyncGoogle`, `marcarComoPago` e normalização de recorrência.

## 🛠️ Implementação

### `reminderService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `criarLembrete` | Sync opcional; falha sync → retorna com `sincronizado: false` (RN-097) |
| `atualizarLembrete` | Re-sync se campos afetam evento |
| `marcarComoPago` | `pago: true`; remove evento Google (RN-099) |
| `removerLembrete` | Remove evento Google antes de deletar |
| `normalizarRecorrencia` | `diaRecorrencia` cap 28 |

**Helper:** `diasAteVencimento`, `mapLembreteComContagem`

## 📋 Resumo

### ✅ Concluído
- Fluxos RN-097 e RN-099 documentados

### ⏳ Pendente
- Implementar reminderService
