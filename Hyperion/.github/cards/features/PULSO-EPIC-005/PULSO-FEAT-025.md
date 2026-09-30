---
card_id: PULSO-FEAT-025
title: "Pretensões e observações de viagem"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Pretensões e observações de viagem

> **Contexto:** Gastos estimados por categoria e notas/checklists dentro de cada viagem.

**Refs:** RF-042 · RF-043 · RF-045 · RN-069 · RN-074

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

## 🔗 Pull Requests

- [#316](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/316) — pretensões e observações na API

## 📋 Resumo

### ✅ Concluído
- Despesas e observações mergeados na Sprint-3 (In Revision)
