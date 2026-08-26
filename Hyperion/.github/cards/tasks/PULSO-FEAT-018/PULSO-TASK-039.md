---
card_id: PULSO-TASK-039
title: "Backend — metaService e metaRepository"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-018
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — metaService e metaRepository

> **Contexto:** Camada de domínio — listagem, resumo, CRUD e montagem de filtros.

## 📝 Descrição

Implementar repository Prisma e service com validações de prazo, valor-alvo e exclusão.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Responsabilidade |
|---------|------------------|
| `api/src/repositories/metaRepository.js` | `listarPorUsuario`, `listarTodasComAportes`, `contarPorStatus`, `listarAtividadeRecente`, CRUD meta/aporte |
| `api/src/services/metaService.js` | `listarMetas`, `calcularResumo`, `criarMeta`, `editarMeta`, `excluirMeta`, `montarResumo` |

**Validações:**
- `validarPrazoFuturo` — RN-061
- `valorAlvo` ≥ `valorAtual` na edição
- Meta cancelada/concluída — regras de edição

**Integração:** `gamificationService.processarAposCriarMeta` em criação

## 📋 Resumo

### ✅ Concluído
- Contratos de service e queries definidos

### ⏳ Pendente
- Implementar repository e service base
