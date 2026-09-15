---
card_id: PULSO-FEAT-082
title: "Wireframes na apostila"
status: "In Progress"
type: Feature
priority: High
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-014
due_date: null
categories:
  - Documentação
  - UX / UI
  - Protótipo
---

# [FEATURE] Wireframes na apostila

> **Contexto:** `docs/5.wireframe.md` só define o que é wireframe. As telas vêm do epic de protótipos (`PULSO-EPIC-015`); esta feature **publica** o recorte na apostila, não redesenha no Figma.

**Arquivo:** `docs/5.wireframe.md`  
**Depende de:** `PULSO-EPIC-015`

## 📖 Histórias

- Como **equipe**, quero os wireframes/protótipos do Pulso na seção 5, para a disciplina ver estrutura de telas e navegação.
- Como **avaliador**, quero cada tela principal com breve descrição e link/export do Figma, para não ficar só o parágrafo de definição.

## ✅ Critérios de Aceite

### Cenário 1 — Conteúdo mínimo
**Então** a seção inclui, no mínimo, as telas cobertas por `PULSO-FEAT-086`–`098` (auth, público, dashboard, transações, metas, viagens, calendário, grupos, orçamento, compras, divisão, dívidas, insights) — export ou embed, com legenda.

### Cenário 2 — Navegação
**Então** fica explícito o relacionamento entre páginas (público → auth → `MainLayout` / módulos), sem um card extra de “layout”.

### Cenário 3 — Tema
**Então** se o Figma tiver claro e escuro, a apostila indica os dois (ou amostra representativa); não é obrigatório colar 2× cada tela se o link do arquivo cobrir.

### Cenário 4 — Sem definição solta
**Então** o texto de dicionário pode permanecer curto, mas não é a única coisa no arquivo.

## 🔗 Pull Requests

- [#290](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/290) — Seção 5 com exports de Auth
- [#291](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/291) — Protótipos de Auth na apostila

## 📋 Resumo

### ✅ Concluído
- Inventário de telas nos epics de produto

### ⏳ Pendente
- Aguardar protótipos e montar `docs/5`
