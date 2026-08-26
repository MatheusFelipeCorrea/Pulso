---
card_id: PULSO-TASK-118
title: "Backend — expenseSplitRepository e mapper"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-058
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — expenseSplitRepository e mapper

> **Contexto:** Persistência Prisma e DTOs de divisão/participante.

## 📝 Descrição

Implementar repository e mapper.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/expenseSplitRepository.js` | CRUD, listar ativas/histórico, participantes, lembretes, cleanup |
| `utils/expenseSplitMapper.js` | `mapDivisao`, `mapParticipante` |

Include participantes; `pagador` derivado de `pagouAConta`.

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper
