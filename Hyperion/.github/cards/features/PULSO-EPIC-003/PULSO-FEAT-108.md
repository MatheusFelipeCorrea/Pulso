---
card_id: PULSO-FEAT-108
title: "Mobile Flutter e protótipos de transações"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Mobile
  - Frontend
  - Protótipo
  - UX / UI
  - Documentação
---

# [FEATURE] Mobile Flutter e protótipos de transações

> **Contexto:** A Web (FEAT-016) e a API (FEAT-012) cobrem RF-016–028. O Flutter em `Codigo/Pulso/mobile` ainda para no `/home` pós-auth. Os frames de `PULSO-FEAT-089` precisam entrar na apostila (`docs/5.wireframe.md`) e o app nativo deve consumir a **mesma** API `/api/transacoes`.

**Refs:** RF-016–028 · RF-140  
**Protótipo (Figma):** `PULSO-FEAT-089`  
**API:** `PULSO-FEAT-012` · **Web:** `PULSO-FEAT-016`

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **listar, filtrar, lançar, editar e excluir transações no telefone**, para que o núcleo financeiro exista no mobile sem segundo backend.

Como **equipe**, eu quero **os protótipos de transações publicados na apostila**, para a disciplina ver lista, filtros, formulário, exclusão e temas (claro/escuro) no `docs/5`.

## ✅ Critérios de Aceite

### Cenário 1 — Protótipos na apostila
**Então** `docs/5.wireframe.md` inclui exports (ou link Figma) da lista `/transactions`, modal criar/editar, exclusão (simples e recorrente), categorias e tags — claro e escuro, desktop e mobile — alinhados a `PULSO-FEAT-089`.

### Cenário 2 — Lista e resumo no Flutter
**Dado** sessão Bearer (`X-Pulso-Client: mobile`),  
**Quando** abre Transações,  
**Então** chama `GET /api/transacoes` e `GET /api/transacoes/resumo`; lista agrupada por data; cards de receita/despesa/saldo acompanham os filtros.

### Cenário 3 — Filtros
**Então** período, categoria, tipo, recurso e busca usam `GET /api/transacoes/filtros` (e query da listagem); estados vazio/loading/erro existem.

### Cenário 4 — CRUD
**Quando** cria/edita,  
**Então** `POST/PATCH /api/transacoes` com validação VA/VR no cliente; transferência sem categoria; recorrência opcional.

**Quando** exclui,  
**Então** `DELETE /api/transacoes/:id` com opção “esta e futuras” (`excluirFuturas`, `dataCorte`).

### Cenário 5 — Mesma API
**Então** não há backend paralelo; tokens continuam no `flutter_secure_storage` (padrão FEAT-107).

## 🔗 Sub-issues

- PULSO-TASK-163
- PULSO-TASK-164
- PULSO-TASK-165

## 🔗 Issues

- [#303](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/303) — PULSO-FEAT-108
- [#304](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/304) — PULSO-TASK-163
- [#305](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/305) — PULSO-TASK-164
- [#306](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/306) — PULSO-TASK-165

## 📋 Resumo

### ✅ Concluído
- Escopo mobile + publicação dos frames de `PULSO-FEAT-089`

### ⏳ Pendente
- PULSO-TASK-163 — subir protótipos na apostila
- PULSO-TASK-164 — Flutter lista, filtros e resumo
- PULSO-TASK-165 — Flutter formulário, tags/categorias e exclusão
