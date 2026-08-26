# 💳 Módulo 03 — Gestão de Transações — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-016–025, RF-027–141), `RegrasDeNegocio.md` (RN-046–054, RN-032/035/038/039).
> Código auditado: `api/src/{controllers,services,repositories,schemas,utils}/transaction*.js`, `api/src/utils/recursoCategoriaRules.js`, `api/src/jobs/recurringTransactions.js`, `api/src/services/categoryService.js`, `api/prisma/schema.prisma` (model `Transacao`), `web/src/components/features/transactions/DeleteTransactionModal.jsx`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README marca Transações como **✅ 13/13**, e a auditoria confirma que a funcionalidade central (CRUD, recorrência, filtros, tags, sugestão de categoria, transferência entre recursos) realmente funciona e está bem estruturada. Os dois defeitos críticos identificados nesta auditoria (**RF-NOVO-C1** e **RF-NOVO-C2**) foram **corrigidos** — ver seções 2–5 com status atualizado.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-016/016 | Registrar receita/despesa (valor, data, categoria, recurso/origem) | ✅ | Confirmado — `criarTransacaoSchema` (`transactionSchemas.js:6-43`) valida tudo; `transactionService.criarTransacao` aplica regras de domínio |
| RF-018 | Categorias padrão | ✅ | Seed via `categoryService.seedCategoriasPadrao`, chamado em `registerUser`/`authenticateGoogle` |
| RF-019 | Categorias personalizadas | ✅ | Confirmado, com ícone+cor; **`grupoBeneficio`** permite VA/VR/VT em custom (RF-NOVO-C2 ✅) |
| RF-020 | Tags livres | ✅ | Confirmado (`tagRepository`, `vincularTags`/`desvincularTags`) |
| RF-021/021 | Recorrência configurável + geração automática | ✅ | Confirmado — `regraRecorrencia` + `jobs/recurringTransactions.js` |
| RF-023 | Editar/excluir transações | ✅ | Delete recorrente corrigido — RF-NOVO-C1 ✅ |
| RF-024/024 | Filtros + busca | ✅ | Confirmado, `transactionRepository.buildWhere` |
| RF-026 | Bloquear despesas de Alimentação usando VT | ✅ | Via `grupoBeneficio` / categorias padrão — não depende mais só do nome literal |
| RF-027 | Transferência entre recursos, fora dos totais de receita/despesa | ✅ | Confirmado — `tipo: TRANSFERENCIA`, `categoriaId` nulo, excluído de `montarResumo` (só soma `RECEITA`/`DESPESA`) |
| RF-028 | Sugestão de categoria por similaridade de descrição | ✅ | Não auditado em profundidade neste módulo (arquivo `categorySuggestionService.js` existe e tem conteúdo) — mencionar para futura verificação de precisão do algoritmo de Dice bigramas |

Todos os RFs "✅" do README de fato têm implementação real por trás (não são scaffolds mortos do T1) — este módulo passa no teste de "não é só checkbox".

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**"Excluir esta e futuras" não faz o que o texto promete.**~~ **✅ Corrigido (ago/2026)** — `excluirRecorrentesFilhasAPartirDe` + `UNTIL` na mãe; histórico passado preservado; `dataCorte` no front.
2. **Confirmação de exclusão** — mensagens atualizadas; risco de perda de histórico eliminado com RF-NOVO-C1.
3. ~~**VA/VR/VT ficam "quebrados" com categorias personalizadas.**~~ **✅ Corrigido (ago/2026)** — campo `grupoBeneficio` + presets no `CategoryFormModal`; mensagens de erro explicam o grupo (RF-NOVO-C2/C3).

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico A — Exclusão de recorrentes ("futuras") apagava o passado

**Status: ✅ Corrigido (ago/2026 — RF-NOVO-C1).** `excluirRecorrentesFilhasAPartirDe(paiId, dataCorte)` + `UNTIL` na mãe; histórico passado preservado.

*(Diagnóstico original: `excluirRecorrentesFilhas` sem filtro de data apagava todas as filhas — oposto semântico do botão "Excluir esta e futuras".)*

### Achado crítico B — Validação recurso×categoria dependia do nome

**Status: ✅ Corrigido (ago/2026 — RF-NOVO-C2).** Campo `grupoBeneficio` + presets no form; `validarRecursoCategoria` usa grupo lógico.

*(Diagnóstico original: comparação com literais `'alimentacao'`, `'compras'`, `'transporte'` — categorias custom incompatíveis com VA/VR/VT.)*

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Transação com data futura, não recorrente | Bloqueado (`validarData`, `transactionService.js:107-121`) — RN-054 ✅ | ✅ |
| Transação recorrente com data futura (data-base da regra) | Permitido (é esperado — a mãe recorrente define a regra a partir de uma data) | ✅ |
| Criar transação sem `regraRecorrencia` mas `recorrente=true` | Bloqueado explicitamente (`:214-216`) | ✅ |
| Transferência com `recursoDestino === recurso` | Bloqueado tanto no schema (Zod `superRefine`) quanto no service (dupla camada) | ✅ |
| Excluir transação inexistente/de outro usuário | `buscarPorId(transacaoId, usuarioId)` filtra por dono — 404 correto, sem vazamento de dado de outro usuário | ✅ |
| Editar transação trocando `tipo` de `TRANSFERENCIA` para `DESPESA` | Tratado explicitamente (`:287-289`, zera `recursoDestino`) | ✅ |
| Concorrência: 2 edições simultâneas na mesma transação | Não há controle de versão otimista (`updatedAt`/`If-Match`) — a segunda gravação sempre vence (last-write-wins), sem aviso ao primeiro editor de que seus dados foram sobrescritos | 🟡 Aceitável para MVP, mas vale registrar como não-tratado |
| Job de recorrência rodando 2x no mesmo dia (ex.: redeploy/cron duplicado) | Protegido — verifica se já existe filha com `data` de hoje antes de criar (`recurringTransactions.js:58-68`) | ✅ Boa proteção contra duplicidade |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-C1 (correção, não greenfield)** — Ajustar RN-052/exclusão de recorrentes: "excluir esta e futuras" deve preservar todas as ocorrências com `data < hoje` e impedir apenas novas gerações a partir de então (ex.: parar de deletar a mãe e, em vez disso, marcar a série como encerrada/aplicar `UNTIL` na regra).
- **RF-NOVO-C2** — Desacoplar a validação recurso×categoria do nome em texto: adicionar um campo estrutural na `Categoria` (ex.: `grupoRecurso: 'ALIMENTACAO' | 'TRANSPORTE' | null`), preenchido automaticamente nas categorias padrão e **oferecido como opção no formulário de categoria personalizada** ("Esta categoria pode ser usada com VA/VR?" / "Pode ser usada com VT?"), permitindo que o usuário estenda a lista de categorias compatíveis sem depender do nome exato.
- **RF-NOVO-C3** — Ao tentar registrar uma despesa com VA/VR/VT numa categoria incompatível, a mensagem de erro deveria sugerir explicitamente as categorias aceitas atualmente disponíveis do usuário (hoje a mensagem é genérica e não lista as opções válidas existentes).

### Não funcionais

- **RNF-NOVO-C1 (Confiabilidade)** — Adicionar teste de regressão específico para o fluxo "excluir mãe recorrente com `excluirFuturas=true`" verificando que transações passadas **não** são apagadas — hoje nenhum teste (dado o achado T2 de arquivos de teste vazios, ainda a confirmar para este módulo especificamente) cobre esse cenário, já que o bug passou despercebido.
- **RNF-NOVO-C2 (Concorrência)** — Avaliar necessidade de controle de concorrência otimista (`atualizadoEm` como version token) em edições de transação, hoje inexistente.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | 🔴 Corrigir exclusão de recorrentes (RF-NOVO-C1) | ✅ `excluirRecorrentesFilhasAPartirDe` + `UNTIL` na mãe; histórico preservado |
| 2 | 🔴 Desacoplar validação recurso×categoria (RF-NOVO-C2) | ✅ `grupoBeneficio` + presets de intenção no form; inferência conservadora |
| 3 | 🟡 Melhorar mensagens de erro VA/VR/VT (RF-NOVO-C3) | ✅ Mensagens explicam grupo e sugerem editar categoria |
| 4 | 🟢 Testes de regressão (RNF-NOVO-C1) | ✅ `transactionService.test.js`, `recursoCategoriaRules.test.js` |
| 5 | 🟢 Concorrência otimista em edição (RNF-NOVO-C2) | ⏸ Aceitável no MVP (decisão PO) |

---

## ❓ Perguntas clarificadoras (respondidas)

1. **Delete apagando histórico** — bug confirmado; corrigido em RF-NOVO-C1.
2. **Custom + VA/VR/VT** — sim, por grupo lógico (`grupoBeneficio`); VT só transporte.
3. **Edição simultânea em duas abas** — aceitável no MVP.

---

*Próximo módulo sugerido: 04 — Metas Financeiras.*
