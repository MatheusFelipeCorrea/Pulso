---
card_id: "PULSO-TASK-084"
title: "Backend — membros, sair e papéis"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-040"
due_date: null
board_sync_at: "2026-08-26T15:32:12.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — membros, sair e papéis

> **Contexto:** Gestão de membership e restrições de admin único.

## 📝 Descrição

Implementar sair do grupo, remover membro e alterar papel ADMIN/MEMBRO.

## 🛠️ Implementação

### `grupoService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `sairGrupo` | Membro sai; bloqueio se único admin (RN-113) |
| `removerMembro` | Apenas admin (RN-114) |
| `alterarPapelMembro` | Promoção/rebaixamento admin |

Notificar demais membros via `grupoNotificationService`

## 📋 Resumo

### ✅ Concluído
- Regras RN-113–114 documentadas

### ⏳ Pendente
- Implementar fluxos de membership
