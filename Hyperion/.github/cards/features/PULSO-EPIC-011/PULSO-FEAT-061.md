---
card_id: "PULSO-FEAT-061"
title: "Lembrete de cobrança e limpeza"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-011"
due_date: null
board_sync_at: "2026-08-26T15:30:34.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
  - "Notificações"
---


# [FEATURE] Lembrete de cobrança e limpeza

> **Contexto:** RF-120 cria Lembrete real; job remove quitadas antigas.

**Refs:** RF-120 · RN-086

## 📝 Descrição

Criar lembrete de cobrança para 1+ pendentes e limpar histórico antigo.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/:id/lembrete` | Lembrete cobrindo participantes pendentes selecionados |

- Não criar para quem já pagou / pagou a conta
- Um participante não pode ter 2 lembretes ativos
- Cancelar lembrete quando todos cobertos quitam
- Excluir divisão remove lembretes vinculados
- Job diário: excluir QUITADA com `quitadaEm` > 180 dias
- Excluir QUITADA manualmente → 400 (só limpeza automática)

## 🔗 Sub-issues

- PULSO-TASK-123
- PULSO-TASK-124

## 📋 Resumo

### ✅ Concluído
- Fluxos lembrete e retenção definidos

### ⏳ Pendente
- PULSO-TASK-123–124 — lembrete e job
