---
card_id: PULSO-TASK-051
title: "Backend — viagemRepository e viagemMapper"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-024
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — viagemRepository e viagemMapper

> **Contexto:** Persistência Prisma e DTO de viagem com totais e meta resumida.

## 📝 Descrição

Implementar repository com includes de despesas, observações e meta; mapper com agregações.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Funções |
|---------|---------|
| `repositories/viagemRepository.js` | listar, buscar, criar, atualizar, excluir; despesas/observações; `buscarPorMetaId` |
| `utils/viagemMapper.js` | `mapViagem`, `mapDespesa`, `mapObservacao`, `calcTotalDespesas` |

**DTO:** `totalBrl`, `quantidadeDespesas`, `meta` resumida via `calcProgressoMeta`

## 📋 Resumo

### ✅ Concluído
- Shape de resposta definido

### ⏳ Pendente
- Implementar repository e mapper
