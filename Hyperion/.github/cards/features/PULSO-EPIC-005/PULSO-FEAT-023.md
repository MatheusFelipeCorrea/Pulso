---
card_id: "PULSO-FEAT-023"
title: "Backend — API de moedas"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-005"
due_date: null
board_sync_at: "2026-08-26T15:29:56.000Z"
categories:
  - "Backend"
  - "Integração Externa"
  - "Regra de Negócio"
---


# [FEATURE] Backend — API de moedas

> **Contexto:** Cotações, conversão, histórico e moedas favoritas via AwesomeAPI.

**Refs:** RF-033 · RF-034 · RF-035 · RF-036 · RN-070 · RN-071

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

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e limites definidos

### ⏳ Pendente
- PULSO-TASK-049–050 — persistência favoritas e service/rotas
