---
card_id: PULSO-FEAT-018
title: "Backend — API de metas"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-004
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de metas

> **Contexto:** Camada REST autenticada para CRUD, listagem paginada e resumo agregado de metas pessoais.

**Refs:** RF-029 · RF-034

## 📝 Descrição

Expor endpoints em `/api/metas` para criar, editar, excluir, listar com filtros e obter resumo consolidado.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/metas` | Lista paginada; headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page` |
| `GET` | `/metas/resumo` | Totais, progresso médio, categorias, contadores, atividade recente |
| `POST` | `/metas` | Cria meta com prazo futuro (RN-061) |
| `PATCH` | `/metas/:id` | Edita parcialmente; transições de status |
| `DELETE` | `/metas/:id` | Exclui meta (204) |

**Filtros query:** `status`, `tipo`, `busca`, `prazoInicio`, `prazoFim`, `pagina`, `limite`

## 🔗 Sub-issues

- PULSO-TASK-037
- PULSO-TASK-039
- PULSO-TASK-040

## 👤 Responsável

Alice Shikida (`aliceshikida`)

## 🔗 Issues

- [#31](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/31) — PULSO-FEAT-018

## 🔗 Pull Requests

- [#314](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/314) — módulo de metas na API
- [#318](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/318) — religamento das rotas

## 📋 Resumo

### ✅ Concluído
- Persistência, service e rotas mergeados na Sprint-3 (In Revision)
