---
card_id: PULSO-FEAT-055
title: "Imagens do item de compra"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-010
due_date: null
categories:
  - Backend
  - Integração Externa
---

# [FEATURE] Imagens do item de compra

> **Contexto:** Resolução automática e upload de imagem do produto.

## 📝 Descrição

Resolver URL de imagem (direta, og:image, Wikimedia) e permitir upload multipart.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/resolver-imagem` | Preview de imagem por nome/URL/link |
| POST | `/:id/imagem` | Upload multipart; atualiza `imagemUrl` |

**Ordem resolve:** URL imagem → og/twitter:image do link → Wikimedia/Wikipedia pelo nome

Flag `buscarImagemAuto` no criar/editar (default true)

## 🔗 Sub-issues

- PULSO-TASK-112

## 📋 Resumo

### ✅ Concluído
- Pipeline de imagem definido

### ⏳ Pendente
- PULSO-TASK-112 — resolve + storage + upload
