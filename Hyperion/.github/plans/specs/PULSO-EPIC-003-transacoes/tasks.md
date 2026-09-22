# Tasks — Gerenciamento de Transações

## From Spec

| # | Scenario | Task | Layer | Card | Complexity |
|---|----------|------|-------|------|------------|
| 1 | 1, 7, 8, 13 | CRUD + listagem + resumo + filtros | API | FEAT-012 / TASK-025–027 | Medium |
| 2 | 2–4, 16 | Categorias, tags, `recursoCategoriaRules` | API + Web | FEAT-013 / TASK-028 | Medium |
| 3 | 12 | Sugestão automática de categoria | API + Web | FEAT-013 / TASK-029 | Low |
| 4 | 5–6 | Transferências (service + form) | API + Web | FEAT-014 / TASK-030 | Medium |
| 5 | 11 | Job + `recurrenceUtils` + RRULE no form | API + Web | FEAT-015 / TASK-031 | High |
| 6 | 9–10 | Exclusão simples e “esta e futuras” | API + Web | FEAT-015 / TASK-032 · FEAT-016 / TASK-035 | Medium |
| 7 | 14–16 | `TransactionsPage`, filtros, CSS | Web | FEAT-016 / TASK-033–035 | High |
| 8 | 1–16 | Suites unitárias API + Web | QA | FEAT-017 / TASK-036 | Medium |
| 9 | — | Wire-up Sprint-3 (rotas, layout, deps) | API + Web | [#307](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/307) | Medium |
| 10 | 18 | Protótipos na apostila | Docs | FEAT-108 / TASK-163 | Low |
| 11 | 17 | Flutter lista, filtros, resumo | Mobile | FEAT-108 / TASK-164 | High |
| 12 | 15, 17 | Flutter form, categorias/tags, exclusão | Mobile | FEAT-108 / TASK-165 | High |

## Implementation Order

1. Persistência + service + rotas (`/transacoes`, `/categorias`, `/tags`)
2. Regras VA/VR, transferência, recorrência
3. Página Web e testes
4. Wire-up na Sprint-3 (rotas descomentadas, MainLayout)
5. Flutter + apostila (aberto)

## Código âncora

| Área | Path |
|------|------|
| Rotas | `Codigo/Pulso/api/src/routes/{transaction,category,tag}Routes.js` |
| Service | `Codigo/Pulso/api/src/services/transactionService.js` |
| Job | `Codigo/Pulso/api/src/jobs/recurringTransactions.js` |
| Web | `Codigo/Pulso/web/src/pages/TransactionsPage.jsx` |
| Wire-up | `api/src/routes/index.js`, `web/src/App.jsx` |
