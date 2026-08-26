---
card_id: PULSO-TASK-052
title: "Backend — viagemService CRUD e resolução de destino"
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
  - Regra de Negócio
---

# [TASK] Backend — viagemService CRUD e resolução de destino

> **Contexto:** Criar/editar viagem com destino validado, moeda, data futura e meta 1:1.

## 📝 Descrição

Implementar service principal com `resolverDestinoPayload`, validações e endpoints auxiliares.

## 🛠️ Implementação

### `viagemService.js` (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `criarViagem` / `editarViagem` | Data futura; moeda em catálogo; destino da lista |
| `validarMetaVinculo` | Meta existe; não duplicada → 409 |
| `listarDestinosViagem` | GeoNames ou catálogo fallback |
| `listarOrigensViagem` | `tripOrigins` |
| `obterResumoPagina` | Soma totais planejados |

### Rotas (NOVO — CRIAR)

`routes/viagemRoutes.js`, `controllers/viagemController.js`, `schemas/viagemSchemas.js`

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-037, RF-042, RF-043 documentados

### ⏳ Pendente
- Implementar service CRUD e rotas base
