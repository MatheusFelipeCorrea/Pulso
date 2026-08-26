---
card_id: PULSO-TASK-028
title: "Categorias, tags e validação recurso×categoria"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-013
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [TASK] Categorias, tags e validação recurso×categoria

> **Contexto:** RF-017–019, RF-025 — gestão de taxonomia e compatibilidade recurso/categoria.

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

**Campo:** `Categoria.grupoBeneficio` enum (VA, VR, VT, ALIMENTACAO, etc.)

### Frontend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `CategoryManageModal.jsx` | CRUD categorias + preset grupoBeneficio |
| `TagManageModal.jsx` | CRUD tags |
| `transactionValidation.js` | `validarRecursoCategoria` espelho client |
| `useTransactionFilterOptions.js` | Hook cache opções `/filtros` |

## 📐 Regras de Negócio

- RF-025: categoria alimentação incompatível com VT
- Categoria.tipo deve bater com transação.tipo
- Tag nome único case-insensitive por usuário

## 📋 Resumo

### ✅ Concluído
- Spec de validação desacoplada do nome literal (RF-NOVO-C2/C3)

### ⏳ Pendente
- Implementar rules + modais de gestão
