---
card_id: "PULSO-TASK-042"
title: "Backend — registrarAporte e notificação META_ATINGIDA"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-020"
due_date: null
board_sync_at: "2026-08-26T15:31:30.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Notificações"
---


# [TASK] Backend — registrarAporte e notificação META_ATINGIDA

> **Contexto:** Fluxo de aporte com auto-conclusão e alerta ao usuário (RF-032).

## 📝 Descrição

Implementar `registrarAporte` com `sincronizarConclusao` e integração a `notificationService`.

## 🛠️ Implementação

### `metaService.registrarAporte` (NOVO — CRIAR)

1. Validar meta ATIVA (`podeReceberAporte`)
2. Validar valor ≤ valorRestante (RN-062)
3. Validar data não futura
4. Criar `AporteMeta`; incrementar `valorAtual`
5. Se `valorRestante <= 0` → status CONCLUIDA + `concluidaEm`
6. Notificação `META_ATINGIDA` com `linkAcao: '/goals'`

**Rota:** `POST /metas/:id/aportes`

## 📋 Resumo

### ✅ Concluído
- Fluxo RN-062–063 e RF-032 especificados

### ⏳ Pendente
- Implementar registrarAporte e sincronizarConclusao
