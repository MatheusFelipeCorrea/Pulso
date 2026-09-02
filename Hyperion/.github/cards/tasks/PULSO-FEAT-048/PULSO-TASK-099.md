---
card_id: "PULSO-TASK-099"
title: "Backend — alertas de orçamento e dedup"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-048"
due_date: null
board_sync_at: "2026-08-26T15:32:27.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Notificações"
---


# [TASK] Backend — alertas de orçamento e dedup

> **Contexto:** Criar notificações 80%/100% sem duplicar e sem bloquear transações.

## 📝 Descrição

Implementar `verificarLimitesUsuarioENotificar` e helper de criação com dedup.

## 🛠️ Implementação

### `budgetService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `criarNotificacaoOrcamento` | Tipos `ALERTA_ORCAMENTO` / `ORCAMENTO_ESTOURADO`; `verificarNotificacaoDuplicada` |
| `verificarLimitesUsuarioENotificar` | Skip se usuário sem orçamento no mês (RN-060) |
| `verificarLimitesENotificar` | Loop usuários com orçamento no mês atual |

**RN-058:** apenas notifica — nunca rejeita transação.

Metadados: `{ categoriaId, mesReferencia, percentual }` · `linkAcao: '/budget'`

## 📋 Resumo

### ✅ Concluído
- Matriz RF-111/112 definida

### ⏳ Pendente
- Implementar criação e dedup de alertas
