---
card_id: PULSO-TASK-082
title: "Backend — grupoRepository e grupoMapper"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-040
due_date: null
categories:
  - Backend
  - Banco de Dados
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

## 👤 Responsável

- Alice Shikida (`aliceshikida`) — API core


## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper
