---
card_id: PULSO-TASK-163
title: "Documentação — subir protótipos de transações"
status: "In Revision"
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-108
due_date: null
categories:
  - Protótipo
  - Documentação
  - UX / UI
  - Mobile
---

# [TASK] Documentação — subir protótipos de transações

> **Contexto:** `PULSO-FEAT-089` especifica os frames. `PULSO-FEAT-082` publica na apostila. Auth, transações, metas e viagens estão em `docs/5.wireframe.md`.

## 📝 Descrição

Exportar (ou embedar) os protótipos de transações no repositório e na seção 5 da apostila: lista, filtros, resumo, modal criar/editar, exclusão, categorias e tags — claro e escuro, desktop e mobile.

## ✅ Critérios de Aceite

**Então** `docs/5.wireframe.md` tem um bloco Transações com:
- lista `/transactions` (preenchida + empty)
- modal nova/editar (receita, despesa, transferência)
- modal excluir (simples e recorrente)
- modais categorias e tags
- amostra claro e escuro (ou link Figma que cubra os dois)

**Então** imagens/exports versionados no repo (pasta da apostila / assets de docs), com legenda e referência a `PULSO-FEAT-089`.

**Então** não redesenha o Figma nesta task — só sobe o que já foi prototipado.

## 🛠️ Implementação

### `docs/5.wireframe.md` (EXISTENTE — MODIFICAR)

Incluir recorte Transações no mesmo padrão do bloco de Auth.

### Assets (NOVO — CRIAR)

Exports PNG/WebP (ou frames Figma linkados) das telas acima.

## 📋 Resumo

### ✅ Concluído
- Inventário de telas em `PULSO-FEAT-089`
- Exports publicados em `docs/prototipos/Transações/` e na seção 5.2

### ⏳ Pendente
- Revisão na apostila (In Revision)
