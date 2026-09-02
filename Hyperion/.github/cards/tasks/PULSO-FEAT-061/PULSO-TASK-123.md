---
card_id: "PULSO-TASK-123"
title: "Backend — lembrete de cobrança (RF-120)"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-061"
due_date: null
board_sync_at: "2026-08-26T15:23:46.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Notificações"
---


# [TASK] Backend — lembrete de cobrança (RF-120)

> **Contexto:** RN-086 — cria Lembrete de calendário para 1+ pendentes.

## 📝 Descrição

Implementar `POST /:id/lembrete` e cancelamento automático.

## 🛠️ Implementação

### `criarLembreteCobranca` (NOVO — CRIAR)

1. Validar participantes pendentes (não `pagouAConta` / PAGO)
2. Bloquear se já houver lembrete ativo no participante
3. `reminderService.criarLembrete` — título default `Cobrar {nomes} — {titulo}`
4. Vincular M2M aos participantes
5. Vencimento default: +2 dias; valor = soma das partes

**cancelarLembretesQuitados:** marca lembrete como pago quando todos cobertos quitam

## 📋 Resumo

### ✅ Concluído
- Fluxo RF-120 / RN-086 documentado

### ⏳ Pendente
- Implementar lembrete de cobrança
