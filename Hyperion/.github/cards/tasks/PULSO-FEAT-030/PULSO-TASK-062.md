---
card_id: "PULSO-TASK-062"
title: "Backend — reminderRepository, mapper e categorias"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-030"
due_date: null
board_sync_at: "2026-08-26T15:31:50.000Z"
categories:
  - "Backend"
  - "Regra de Negócio"
---


# [TASK] Backend — reminderRepository, mapper e categorias

> **Contexto:** Persistência, DTO e catálogo de 52 categorias agrupadas.

## 📝 Descrição

Implementar repository, mapper e constantes de categoria/antecedência.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/reminderRepository.js` | listarPorUsuario, listarProximos, CRUD |
| `utils/reminderMapper.js` | `mapLembrete` |
| `constants/reminderCategories.js` | 11 grupos, labels, `normalizeCategoria`, legacy map |
| `utils/reminderAntecedencia.js` | `ANTECEDENCIA_DIAS`, `ANTECEDENCIA_MINUTOS`, labels |

## 📋 Resumo

### ✅ Concluído
- Shape DTO e categorias especificados

### ⏳ Pendente
- Implementar repository, mapper e constants
