---
card_id: "PULSO-FEAT-025"
title: "Pretensões e observações de viagem"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-005"
due_date: null
board_sync_at: "2026-08-26T15:29:58.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Pretensões e observações de viagem

> **Contexto:** Gastos estimados por categoria e notas/checklists dentro de cada viagem.

**Refs:** RF-038 · RF-039 · RF-041 · RN-069 · RN-074

## 📝 Descrição

Implementar CRUD de pretensões (despesas) e observações aninhadas em viagens, com total agregado no mapper.

## ✅ Critérios de Aceite

**Pretensões** (`/viagens/:id/despesas`):
- 10 categorias: TRANSPORTE, HOSPEDAGEM, ALIMENTACAO, PASSEIOS, COMPRAS, DOCUMENTACAO, SAUDE, EMERGENCIAS, ENTRETENIMENTO, OUTROS
- `valorEstimado > 0`; retorna viagem atualizada com `totalBrl` (soma RN-069)

**Observações** (`/viagens/:id/observacoes`):
- Título obrigatório; conteúdo opcional; URL validada; checklist JSON normalizado
- Tipo inferido: CHECKLIST, LINK ou GERAL

## 🔗 Sub-issues

- PULSO-TASK-053

## 📋 Resumo

### ✅ Concluído
- Categorias e payloads definidos

### ⏳ Pendente
- PULSO-TASK-053 — despesas e observações backend
