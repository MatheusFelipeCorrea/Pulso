---
card_id: "PULSO-TASK-112"
title: "Backend — imagem do item (resolve e upload)"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-055"
due_date: null
board_sync_at: "2026-08-26T15:23:34.000Z"
categories:
  - "Backend"
  - "Integração Externa"
---


# [TASK] Backend — imagem do item (resolve e upload)

> **Contexto:** Obter capa do produto automaticamente ou via upload.

## 📝 Descrição

Implementar resolução de URL e storage de imagem.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/purchaseItemImageService.js` | `resolvePurchaseItemImage` — URL / og:image / Wikimedia |
| `services/purchaseItemImageStorageService.js` | `storePurchaseItemImage` |
| `middlewares/purchaseItemImageUploadMiddleware.js` | Multipart campo imagem |
| Rotas | POST `/resolver-imagem`, POST `/:id/imagem` |

Integrar em criar/editar via `obterImagemUrl` + flag `buscarImagemAuto`.

**Migration:** `20260620160000_item_compra_imagem`

## 📋 Resumo

### ✅ Concluído
- Pipeline de imagem definido

### ⏳ Pendente
- Implementar resolve, storage e rotas
