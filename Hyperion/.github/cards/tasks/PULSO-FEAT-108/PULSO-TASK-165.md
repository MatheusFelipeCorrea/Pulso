---
card_id: PULSO-TASK-165
title: "Flutter — formulário, categorias/tags e exclusão"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-108
due_date: null
categories:
  - Mobile
  - Frontend
  - UX / UI
  - Regra de Negócio
---

# [TASK] Flutter — formulário, categorias/tags e exclusão

> **Contexto:** Completa o CRUD nativo. Validação VA/VR e transferência sem categoria (RF-026, RF-027). Exclusão recorrente “esta e futuras” (RF-022).

## 📝 Descrição

Sheets/telas de criar, editar e excluir transação; gestão mínima de categorias e tags; recorrência opcional no form.

## ✅ Critérios de Aceite

**Quando** cria ou edita,  
**Então** `POST` / `PATCH /api/transacoes` com tipo receita/despesa/transferência; transferência exige `recursoDestino` e **não** envia `categoriaId`.

**Quando** categoria é incompatível com VA/VR (ou recurso VT),  
**Então** o app bloqueia no cliente e a API pode devolver `400`.

**Quando** exclui recorrente,  
**Então** oferece “só esta” ou “esta e futuras” (`excluirFuturas`, `dataCorte`).

**Então** tags M:N e categorias usam as rotas `/api/tags` e `/api/categorias` (FEAT-013); sugestão `GET /api/transacoes/sugestao-categoria` é opcional se o debounce couber no prazo.

## 🛠️ Implementação

### `Codigo/Pulso/mobile/lib/features/transactions/` (EXISTENTE — ESTENDER)

- formulário criar/editar
- sheet de exclusão
- pickers de categoria/tag

Depende de FEAT-012 + FEAT-013 + FEAT-015 mergeados/descomentados na Sprint-3.

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 📋 Resumo

### ✅ Concluído
- Regras de domínio documentadas no epic
- Formulário, exclusão (simples e recorrente) e pickers no Flutter (Sprint-3)

### ⏳ Pendente
- Nenhum
