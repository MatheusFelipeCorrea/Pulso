---
card_id: PULSO-TASK-029
title: "Sugestão automática de categoria (RF-028)"
status: "In Revision"
type: Task
priority: Medium
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

# [TASK] Sugestão automática de categoria (RF-028)

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


## 👤 Responsável

Alice Shikida (`aliceshikida`)

## 🔗 Pull Requests

- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) — `categorySuggestionService` / utils (`FEAT-013`) → issue [#117](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/117)
## 📋 Resumo

### ✅ Concluído
- Algoritmo e contrato API especificados

### ⏳ Pendente
- Implementar service + integração no form
