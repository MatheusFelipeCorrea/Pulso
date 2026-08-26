---
card_id: PULSO-FEAT-013
title: "Categorias, tags e sugestão automática"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [FEATURE] Categorias, tags e sugestão automática

> **Contexto:** Categorias padrão/personalizadas, tags livres e inteligência de sugestão + validação recurso×categoria (RF-017–019, RF-025, RF-141).

**Refs:** RF-017 · RF-018 · RF-019 · RF-025 · RF-141

## 📝 Descrição

Seed de categorias no cadastro; CRUD de categorias custom com `grupoBeneficio`; tags M:N; endpoint de sugestão por similaridade de descrição; bloqueio VT em categorias de alimentação via regra desacoplada do nome.

## ✅ Critérios de Aceite

### Cenário 1 — Categorias padrão
**Então** novo usuário recebe seed (`categoryService.seedCategoriasPadrao`).

### Cenário 2 — Categoria custom
**Quando** cria categoria DESPESA com `grupoBeneficio=VA`,  
**Então** só aceita despesas com recurso VA.

### Cenário 3 — Tags
**Então** transação pode ter N tags; nome único por usuário.

### Cenário 4 — Sugestão RF-141
**Quando** `GET /transacoes/sugestao-categoria?tipo=&descricao=`,  
**Então** retorna `categoriaId` sugerida por histórico (Dice/bigramas).

### Cenário 5 — RF-025
**Quando** despesa categoria alimentação + recurso VT,  
**Então** retorna `400` com mensagem explicativa (`recursoCategoriaRules`).

## 🔗 Sub-issues

- PULSO-TASK-028
- PULSO-TASK-029

## 📋 Resumo

### ✅ Concluído
- Regras de domínio e modais de gestão especificados

### ⏳ Pendente
- PULSO-TASK-028 — validação recurso×categoria + modals categorias/tags
- PULSO-TASK-029 — sugestão automática backend + debounce no form
