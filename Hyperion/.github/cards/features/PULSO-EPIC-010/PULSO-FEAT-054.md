---
card_id: "PULSO-FEAT-054"
title: "Vincular meta e marcar comprado"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-010"
due_date: null
board_sync_at: "2026-08-26T15:30:27.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [FEATURE] Vincular meta e marcar comprado

> **Contexto:** Integração com metas e geração automática de transação ao comprar.

**Refs:** RF-137 · RF-138 · RN-092 · RN-093

## 📝 Descrição

Permitir vínculo/desvínculo de meta e fluxo “Comprei!” com efeitos colaterais.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/:id/vincular-meta` | Meta existente ou `criarMeta`; opcional `ajustarMetaValor` |
| DELETE | `/:id/vincular-meta` | Remove `metaId` |
| POST | `/:id/comprar` | Cria DESPESA; status COMPRADO; conclui meta (RN-093) |

**Comprar:** categoria Compras (default) ou `categoriaId`; recurso default `DINHEIRO`

**Bloqueios:** meta CANCELADA/CONCLUIDA no vínculo; item já COMPRADO na edição/compra

## 🔗 Sub-issues

- PULSO-TASK-110
- PULSO-TASK-111

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-137/138 definidos

### ⏳ Pendente
- PULSO-TASK-110–111 — meta e comprar
