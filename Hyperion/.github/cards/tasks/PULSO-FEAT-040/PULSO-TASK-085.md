---
card_id: "PULSO-TASK-085"
title: "Backend — upload imagem do grupo"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-040"
due_date: null
board_sync_at: "2026-08-26T15:32:13.000Z"
categories:
  - "Backend"
  - "Integração Externa"
---


# [TASK] Backend — upload imagem do grupo

> **Contexto:** Foto customizada do grupo via multipart ou URL https.

## 📝 Descrição

Implementar storage de imagem e middleware de upload para admin.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/grupoImageStorageService.js` | `storeGrupoImage` — jpg/png/webp, max 2MB |
| `middlewares/grupoImageUploadMiddleware.js` | `handleGrupoImageUpload` campo `imagem` |
| `grupoService.enviarImagem` | Admin only; atualiza `urlImagem` |

**Migration:** `20260617150000_grupo_imagem`

Fallback: capa viagem vinculada quando sem foto custom

## 📋 Resumo

### ✅ Concluído
- Limites upload definidos

### ⏳ Pendente
- Implementar storage e endpoint imagem
