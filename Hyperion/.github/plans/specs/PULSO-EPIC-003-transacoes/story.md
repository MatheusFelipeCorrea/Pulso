# Gerenciamento de Transações (épico)

## Discovery

Núcleo financeiro do Pulso. Cards em `Hyperion/.github/cards/epics/PULSO-EPIC-003.md` e features `PULSO-FEAT-012`–`017` + `PULSO-FEAT-108`.
Rollup humano: `Hyperion/.github/plans/cards/[EPIC] Gerenciamento de Transacoes.md`.

## User Story

Como **usuário autenticado (Web agora; Flutter em FEAT-108)**,
eu quero **registrar, listar, filtrar, editar e excluir receitas, despesas e transferências, com categorias, tags e recorrência**,
para que **eu separe salário de benefícios (VA/VR) e mantenha o histórico financeiro no mesmo backend**.

## Acceptance Criteria (high-level)

- [x] CRUD autenticado em `/api/transacoes` (lista, resumo, filtros, criar, editar, excluir)
- [x] Categorias e tags com validação recurso × categoria (VA/VR; VT rejeitado)
- [x] Transferência sem categoria; origem ≠ destino; fora dos totais de receita/despesa
- [x] Recorrência (RRULE básica) + job diário 00:05; exclusão “esta e futuras”
- [x] Sugestão de categoria por descrição (`GET /transacoes/sugestao-categoria`)
- [x] Web `/transactions` com resumo, filtros, lista paginada e modais
- [x] Suites unitárias API + Web (FEAT-017)
- [ ] Flutter lista/CRUD + protótipos na apostila (FEAT-108)

## Rastreio

| Card | Issue | PR | Status local |
|------|-------|----|--------------|
| PULSO-EPIC-003 | — | [#307](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/307) wire-up | In Progress |
| PULSO-FEAT-012 | [#25](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/25) | [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) | Done |
| PULSO-FEAT-013 | [#26](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/26) | [#299](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/299) | Done |
| PULSO-FEAT-014 | [#27](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/27) | [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) | Done |
| PULSO-FEAT-015 | [#28](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/28) | [#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) | Done |
| PULSO-FEAT-016 | [#29](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/29) | [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) | Done |
| PULSO-FEAT-017 | [#30](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/30) | [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) | Done |
| PULSO-FEAT-108 | [#303](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/303) | — | Backlog |
| TASK-163–165 | [#304](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/304)–[#306](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/306) | — | Backlog |

Tasks 025–036: issues [#113](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/113)–[#117](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/117), [#119](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/119), [#121](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/121)–[#124](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/124), [#152](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/152), [#155](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/155).

## Out of Scope

- Orçamento, dívidas, grupos, importação de extrato, dashboard completo
- RabbitMQ / workers de e-mail
- Concorrência otimista (`If-Match`)
- Segundo backend no Flutter
