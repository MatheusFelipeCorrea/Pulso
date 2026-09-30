---
card_id: PULSO-FEAT-023
title: "Backend — API de moedas"
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
  - Integração Externa
  - Regra de Negócio
---

# [FEATURE] Backend — API de moedas

> **Contexto:** Cotações, conversão, histórico e moedas favoritas via AwesomeAPI.

**Refs:** RF-037 · RF-038 · RF-039 · RF-040 · RN-070 · RN-071

## 📝 Descrição

Expor endpoints autenticados em `/api/moedas` para catálogo, cotações, conversão, histórico e favoritas.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/moedas/catalogo` | Lista moedas suportadas |
| `GET` | `/moedas/cotacoes?codigos=USD,EUR` | Cotações com `bid`, `pctChange`, `updatedAt` |
| `GET` | `/moedas/converter?valor=&de=&para=` | Conversão via BRL ou par cruzado |
| `GET` | `/moedas/historico?codigo=USD&dias=30` | Pontos + resumo min/max/variação |
| `GET` | `/moedas/favoritas` | Favoritas com cotações embutidas |
| `POST` | `/moedas/favoritas` | Adiciona (limite 8, P2002 → 409) |
| `DELETE` | `/moedas/favoritas/:codigo` | Remove favorita |

**Cache:** 5 min por instância em `awesomeApiProvider`

## 🔗 Sub-issues

- PULSO-TASK-049
- PULSO-TASK-050

## 👤 Responsável

Sofia Vasconcelos (`sofiavasconcelosms`)

## 🔗 Issues

- [#36](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/36) — PULSO-FEAT-023

## 🔗 Pull Requests

- [#313](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/313) — módulo de moedas (API e web)

## 📋 Resumo

### ✅ Concluído
- Catálogo, conversão, histórico e favoritas mergeados na Sprint-3 (In Revision)
