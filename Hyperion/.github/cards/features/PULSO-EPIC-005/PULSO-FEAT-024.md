---
card_id: PULSO-FEAT-024
title: "Backend — API de viagens"
status: "In Revision"
type: Feature
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-005
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API de viagens

> **Contexto:** CRUD de viagens pessoais com resolução de destino e vínculo opcional a meta.

**Refs:** RF-041 · RF-046 · RF-047 · RN-072 · RN-073

## 📝 Descrição

Expor endpoints em `/api/viagens` para listar, criar, editar, excluir e obter resumo da página.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/viagens` | Lista viagens do usuário com despesas/observações/meta |
| `GET` | `/viagens/resumo` | `quantidadeViagens`, `totalPlanejadoBrl` |
| `GET` | `/viagens/:id` | Detalhe mapeado |
| `GET` | `/viagens/destinos?q=` | Busca GeoNames ou catálogo local |
| `GET` | `/viagens/origens` | Catálogo de origens BR |
| `POST` | `/viagens` | Cria com data futura, moeda válida, destino resolvido |
| `PATCH` | `/viagens/:id` | Edita parcialmente |
| `DELETE` | `/viagens/:id` | Exclui viagem (204) |

**Meta:** `metaId` único por viagem; conflito → 409

## 🔗 Sub-issues

- PULSO-TASK-049
- PULSO-TASK-051
- PULSO-TASK-052

## 👤 Responsável

Vinícius Simões (`ViniSimoesV`)

## 🔗 Issues

- [#37](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/37) — PULSO-FEAT-024

## 🔗 Pull Requests

- [#316](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/316) — módulo de viagens na API

## 📋 Resumo

### ✅ Concluído
- DB, repository, service e rotas mergeados na Sprint-3 (In Revision)
