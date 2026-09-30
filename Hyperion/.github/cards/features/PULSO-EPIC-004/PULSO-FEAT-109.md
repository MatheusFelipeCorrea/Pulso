---
card_id: PULSO-FEAT-109
title: "Mobile Flutter e protótipos de metas"
status: "In Revision"
type: Feature
priority: High
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-004
due_date: null
categories:
  - Mobile
  - Frontend
  - Protótipo
  - UX / UI
  - Documentação
---

# [FEATURE] Mobile Flutter e protótipos de metas

> **Contexto:** A API (`PULSO-FEAT-018`) e a Web (`PULSO-FEAT-021`) cobrem RF-029–036. O Flutter em `Codigo/Pulso/mobile` precisa da mesma API `/api/metas`. Os frames de `PULSO-FEAT-090` entram na apostila (`docs/5.wireframe.md`) — a equipe sobe os exports nesta feature.

**Refs:** RF-029–036 · RF-140  
**Protótipo (Figma):** `PULSO-FEAT-090`  
**API:** `PULSO-FEAT-018` · **Web:** `PULSO-FEAT-021`

## 📝 Descrição

Como **usuário do app Flutter**, eu quero **listar metas, criar/editar, aportar, pausar/retomar e excluir no telefone**, para o planejamento financeiro existir no mobile sem segundo backend.

Como **equipe**, eu quero **os protótipos de metas publicados na apostila**, para a disciplina ver lista, tabs, formulário e aporte no `docs/5`.

## ✅ Critérios de Aceite

### Cenário 1 — Protótipos na apostila
**Então** `docs/5.wireframe.md` inclui exports (ou link Figma) de `/goals`, modal criar/editar, aporte e exclusão — claro e escuro, desktop e mobile — alinhados a `PULSO-FEAT-090`.

### Cenário 2 — Lista e resumo no Flutter
**Dado** sessão Bearer (`X-Pulso-Client: mobile`),  
**Quando** abre Metas,  
**Então** chama `GET /api/metas` e `GET /api/metas/resumo`; tabs todas/ativas/pausadas/concluídas; busca.

### Cenário 3 — CRUD e aportes
**Quando** cria/edita,  
**Então** `POST/PATCH /api/metas` com prazo, tipo curto/longo e atalho de reserva de emergência (`GET /api/metas/sugestao-reserva`).

**Quando** registra aporte,  
**Então** o endpoint de aporte da API; pause/retomar e exclusão existem.

### Cenário 4 — Mesma API
**Então** não há backend paralelo; tokens continuam no `flutter_secure_storage` (padrão FEAT-107).

## 🔗 Sub-issues

- PULSO-TASK-166
- PULSO-TASK-167
- PULSO-TASK-168

## 👤 Responsáveis

- Alice Shikida (`aliceshikida`) — camada de dados
- Maria Clara (`mariaoliveira27`) — telas

## 🔗 Pull Requests

- [#320](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/320) — camada de dados (Alice)
- [#321](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/321) — telas (Maria Clara)

## 🔗 Issues

- [#334](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/334) — PULSO-FEAT-109
- [#335](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/335) — PULSO-TASK-166
- [#336](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/336) — PULSO-TASK-167
- [#337](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/337) — PULSO-TASK-168

## 📋 Resumo

### ✅ Concluído
- Flutter lista, formulário, aportes, pause/retomar e exclusão mergeados na Sprint-3

### ⏳ Pendente
- PULSO-TASK-166 — subir protótipos na apostila
