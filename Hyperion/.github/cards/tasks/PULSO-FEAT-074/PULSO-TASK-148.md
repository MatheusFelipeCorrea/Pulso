---
card_id: "PULSO-TASK-148"
title: "Backend — rotas /insights e regenerar"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-074"
due_date: null
board_sync_at: "2026-08-26T15:29:12.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — rotas /insights e regenerar

> **Contexto:** API autenticada + cota de regeneração (RN-126).

## 📝 Descrição

Expor controllers, schemas e políticas de cache/cota.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `routes/insightRoutes.js` | Montar em `/insights` |
| `controllers/insightController.js` | Handlers |
| `schemas/insightSchemas.js` | query mes, regenerar |
| `repositories/insightRepository.js` | CRUD snapshot |

| Rota | Regra |
|------|-------|
| GET `/` | Snapshot do mês; gera sob demanda se vazio (flag config) |
| GET `/score` | Último score + últimos N de `HistoricoScore` |
| POST `/regenerar` | Incrementa `regeneracoesNoMes`; 429 se excedeu cota (ex. 3) |

Remover trava “1 insight/mês impede tudo” do service legado.

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- Implementar rotas e cota
