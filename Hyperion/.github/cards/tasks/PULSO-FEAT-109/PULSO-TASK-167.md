---
card_id: PULSO-TASK-167
title: "Flutter — camada de dados de metas"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Alice Shikida"
parent: PULSO-FEAT-109
due_date: null
categories:
  - Mobile
  - Backend
---

# [TASK] Flutter — camada de dados de metas

> **Contexto:** Mesma API Node `/api/metas`. Sessão Bearer + `X-Pulso-Client: mobile` (FEAT-107).

## 📝 Descrição

Criar `features/goals/data` no app: models, `GoalRepository` (listar, resumo, CRUD, aportes, pausar/retomar, sugestão de reserva) e testes.

## ✅ Critérios de Aceite

**Então** `GET /api/metas` e `/resumo` usam os mesmos headers da web (`X-Total-Count` quando houver).

**Então** criar/atualizar/excluir, aportes e pause/retomar batem nas rotas da FEAT-018.

**Então** testes em `test/goals_test.dart`.

## 👤 Responsável

Alice Shikida (`aliceshikida`)

## 🔗 Pull Requests

- [#320](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/320)

## 📋 Resumo

### ✅ Concluído
- Repository, models e testes mergeados na Sprint-3
