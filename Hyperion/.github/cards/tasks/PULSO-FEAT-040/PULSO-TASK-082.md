---
card_id: "PULSO-TASK-082"
title: "Backend — grupoRepository e grupoMapper"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-040"
due_date: null
board_sync_at: "2026-08-26T15:32:10.000Z"
categories:
  - "Backend"
  - "Banco de Dados"
---


# [TASK] Backend — grupoRepository e grupoMapper

> **Contexto:** Persistência Prisma e DTOs resumo/detalhe/preview.

## 📝 Descrição

Implementar repository com includes de membros, viagem, metas, mensagens; mappers de resposta.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/grupoRepository.js` | CRUD, membros, codigoConviteExiste, listarPorUsuario |
| `utils/grupoMapper.js` | `mapGrupoResumo`, `mapGrupoDetalhe`, `mapGrupoPreview`, `imagemExibicao` |

**imagemExibicao:** urlImagem → capa viagem → gradiente fallback

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper
