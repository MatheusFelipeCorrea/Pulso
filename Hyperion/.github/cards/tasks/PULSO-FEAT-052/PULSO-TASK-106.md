---
card_id: "PULSO-TASK-106"
title: "Backend — repository e mapper"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-052"
due_date: null
board_sync_at: "2026-08-26T15:32:34.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
---


# [TASK] Backend — repository e mapper

> **Contexto:** Persistência Prisma e DTOs com simulações e progresso de meta.

## 📝 Descrição

Implementar repository e mappers de item desejado/comprado.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/purchasePlanningRepository.js` | listarDesejados, listarComprados, CRUD, contarPorCategoria |
| `utils/purchasePlanningMapper.js` | `mapItem`, `mapItemComprado`, `mapSimulacaoParcelas` |

**mapItem:** mesesParaComprar, simulacoes, comprometimentoPrincipal, meta vinculada

**mapItemComprado:** diasNaLista, transacao resumo

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper
