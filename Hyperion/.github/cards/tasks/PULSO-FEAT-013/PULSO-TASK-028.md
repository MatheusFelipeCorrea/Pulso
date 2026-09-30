---
card_id: PULSO-TASK-028
title: "Categorias, tags e validação recurso×categoria"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-013
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Categorias, tags e validação recurso×categoria

> **Contexto:** RF-019–020, RF-026 — gestão de taxonomia e compatibilidade recurso/categoria.

## 📝 Descrição

Implementar seed de categorias, CRUD via modais na página de transações e validação `grupoBeneficio` no backend e frontend.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `categoryService.js` | `seedCategoriasPadrao`, CRUD |
| `tagService.js` / `tagRepository.js` | CRUD tags |
| `recursoCategoriaRules.js` | `validarRecursoCategoria`, `buildMensagemIncompativel` |
| `categoryRoutes.js`, `tagRoutes.js` | REST categorias/tags |

**Campo:** `Categoria.grupoBeneficio` enum (VA, VR, ALIMENTACAO, etc.; VT legado rejeitado na API)

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `CategoryManageModal.jsx` | CRUD categorias + preset grupoBeneficio |
| `TagManageModal.jsx` | CRUD tags |
| `transactionValidation.js` | `validarRecursoCategoria` espelho client |
| `useTransactionFilterOptions.js` | Hook cache opções `/filtros` |

## 📐 Regras de Negócio

- RF-026: recurso VT rejeitado; VA/VR incompatível com `grupoBeneficio` da categoria
- Categoria.tipo deve bater com transação.tipo
- Tag nome único case-insensitive por usuário


## 👤 Responsável

Alice Shikida (`aliceshikida`)

## 🔗 Pull Requests

- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) — Categorias, tags e `recursoCategoriaRules` (`FEAT-013`) → issue [#116](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/116)
## 📋 Resumo

### ✅ Concluído
- Spec de validação desacoplada do nome literal (RF-NOVO-C2/C3)

### ⏳ Pendente
- Nenhum
