---
card_id: PULSO-FEAT-013
title: "Categorias, tags e sugestão automática"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de Negócio
---

# [FEATURE] Categorias, tags e sugestão automática

> **Contexto:** Categorias padrão/personalizadas, tags livres e inteligência de sugestão + validação recurso×categoria (RF-019–020, RF-026, RF-028).

**Refs:** RF-018 · RF-019 · RF-020 · RF-026 · RF-028

## 📝 Descrição

Seed de categorias no cadastro; CRUD de categorias custom com `grupoBeneficio`; tags M:N; endpoint de sugestão por similaridade de descrição; validação VA/VR × categoria e rejeição de recurso VT.

## ✅ Critérios de Aceite

### Cenário 1 — Categorias padrão
**Então** novo usuário recebe seed (`categoryService.seedCategoriasPadrao`).

### Cenário 2 — Categoria custom
**Quando** cria categoria DESPESA com `grupoBeneficio=VA`,  
**Então** só aceita despesas com recurso VA.

### Cenário 3 — Tags
**Então** transação pode ter N tags; nome único por usuário.

### Cenário 4 — Sugestão RF-028
**Quando** `GET /transacoes/sugestao-categoria?tipo=&descricao=`,  
**Então** retorna `categoriaId` sugerida por histórico (Dice/bigramas).

### Cenário 5 — RF-026
**Quando** despesa com recurso VT ou VA/VR incompatível com `grupoBeneficio`,  
**Então** retorna `400` com mensagem explicativa (`recursoCategoriaRules`).

## 🔗 Sub-issues

- PULSO-TASK-028
- PULSO-TASK-029


## 👤 Responsável

Alice Shikida (`aliceshikida`)

## 🔗 Pull Requests

- [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) — Categorias, tags e sugestão (`FEAT-013`) → issue [#26](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/26)
## 📋 Resumo

### ✅ Concluído
- Regras de domínio e modais de gestão especificados

### ⏳ Pendente
- PULSO-TASK-028 — validação recurso×categoria + modals categorias/tags
- PULSO-TASK-029 — sugestão automática backend + debounce no form
