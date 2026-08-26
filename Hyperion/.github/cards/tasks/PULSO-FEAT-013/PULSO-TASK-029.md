---
card_id: PULSO-TASK-029
title: "Sugestão automática de categoria (RF-141)"
status: Backlog
type: Task
priority: Medium
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

# [TASK] Sugestão automática de categoria (RF-141)

> **Contexto:** Sugerir categoria com base em descrições similares do histórico do usuário.

## 📝 Descrição

Endpoint backend + debounce no formulário para preencher categoria automaticamente ao digitar descrição.

## ✅ Critérios de Aceite

**Quando** descrição ≥3 chars no form,  
**Então** após 400ms chama `GET /transacoes/sugestao-categoria`; preenche select se confiança suficiente.

## 🛠️ Implementação

### Backend (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `categorySuggestionService.js` | Orquestra histórico + utils |
| `categorySuggestionUtils.js` | `similaridade`, `sugerirCategoriaId` (Dice bigramas) |
| `transactionRepository.js` | `listarDescricoesPorTipo` |

### Frontend (NOVO — CRIAR)

Em `TransactionFormModal.jsx`:
- Debounce 400ms (`SUGESTAO_DEBOUNCE_MS`)
- Flag `categoriaAutoSugerida` para UX
- `transactionService.sugerirCategoria({ tipo, descricao })`

## 📋 Resumo

### ✅ Concluído
- Algoritmo e contrato API especificados

### ⏳ Pendente
- Implementar service + integração no form
