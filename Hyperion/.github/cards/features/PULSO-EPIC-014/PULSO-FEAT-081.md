---
card_id: PULSO-FEAT-081
title: "Modelagem e projeto arquitetural"
status: Done
type: Feature
priority: High
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-014
due_date: null
categories:
  - Documentação
  - Arquitetura
---

# [FEATURE] Modelagem e projeto arquitetural

> **Contexto:** `docs/4.modelagem.md` tem visão genérica, histórias “Fulano/Cicrano” e diagramas de exemplo (`classes.gif`, `componentes.png`, `der.png`).

**Arquivo:** `docs/4.modelagem.md`  
**Fonte:** epics de produto, `docs/3` (quando preenchido), memória do kit

## 📖 Histórias

- Como **equipe**, quero histórias de usuário do Pulso (não do template), para a visão de negócio refletir as personas da seção 2.
- Como **equipe**, quero visão lógica (classes/componentes) e, se fizer sentido, modelo de dados do domínio financeiro, para a apostila explicar a arquitetura de verdade.

## ✅ Critérios de Aceite

### Cenário 1 — Visão geral
**Então** o diagrama macro (Web, API, persistência, OAuth, Gemini, cotações, jobs) substitui `imagens/visao.png` de exemplo; texto descreve o Pulso, não “medium.com”.

### Cenário 2 — Histórias de usuário
**Então** 4.1 lista histórias no formato persona → funcionalidade → valor, derivadas dos módulos (auth, dashboard, transações VA/VR, metas, etc.); remove a tabela “Registrar minhas tarefas”.

### Cenário 3 — Diagrama de classes / componentes
**Então** 4.2 usa artefatos do Pulso (domínio: usuário, recurso, transação, categoria, orçamento, meta, etc.) e explica o papel de cada componente; não deixa o gif/png de exemplo sem nota de “substituir”.

### Cenário 4 — Modelo de dados
**Então** 4.3, se incluído, é ER/tabelas do Pulso (ou justificativa de omissão); não o DER genérico do template.

## 📋 Resumo

### ✅ Concluído
- Seções 4.1–4.3 do template mapeadas
- Diagramas do Pulso anexados em `docs/4.modelagem.md` (Figs. 1–11) a partir de `docs/imagens/diagrams/`

### ⏳ Pendente
- Revisão (In Revision): textos da visão lógica com o professor, se a apostila exigir mais detalhe por componente
