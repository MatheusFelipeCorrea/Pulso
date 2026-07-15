# 💳 Módulo 03 — Gestão de Transações — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-015–025, RF-140–141), `RegrasDeNegocio.md` (RN-046–054, RN-032/035/038/039).
> Código auditado: `api/src/{controllers,services,repositories,schemas,utils}/transaction*.js`, `api/src/utils/recursoCategoriaRules.js`, `api/src/jobs/recurringTransactions.js`, `api/src/services/categoryService.js`, `api/prisma/schema.prisma` (model `Transacao`), `web/src/components/features/transactions/DeleteTransactionModal.jsx`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README marca Transações como **✅ 13/13**, e a auditoria confirma que a funcionalidade central (CRUD, recorrência, filtros, tags, sugestão de categoria, transferência entre recursos) realmente funciona e está bem estruturada (validação em 3 camadas: Zod → service → regra de domínio). Mas a auditoria encontrou **dois defeitos concretos e reproduzíveis**, não cosméticos: (1) o botão "Excluir esta e futuras" de uma transação recorrente **apaga também o histórico passado** da série, não só as ocorrências futuras — contradizendo o próprio texto do botão; e (2) a validação de compatibilidade recurso×categoria (RN-032/035/038/039, ex.: "VT não pode em Alimentação") é feita comparando o **nome em texto** da categoria com 3 strings fixas (`"alimentacao"`, `"compras"`, `"transporte"`) — o que significa que **nenhuma categoria personalizada** (recurso RF-018, já entregue) pode ser usada com VA/VR/VT, mesmo quando semanticamente óbvia (ex. uma categoria custom chamada "Mercado" ou "Uber").

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-015/016 | Registrar receita/despesa (valor, data, categoria, recurso/origem) | ✅ | Confirmado — `criarTransacaoSchema` (`transactionSchemas.js:6-43`) valida tudo; `transactionService.criarTransacao` aplica regras de domínio |
| RF-017 | Categorias padrão | ✅ | Seed via `categoryService.seedCategoriasPadrao`, chamado em `registerUser`/`authenticateGoogle` |
| RF-018 | Categorias personalizadas | ✅ | Confirmado, com ícone+cor (`categoryService.js`), mas ver gap crítico na seção 3 (incompatibilidade com VA/VR/VT) |
| RF-019 | Tags livres | ✅ | Confirmado (`tagRepository`, `vincularTags`/`desvincularTags`) |
| RF-020/021 | Recorrência configurável + geração automática | ✅ | Confirmado — `regraRecorrencia` (RRULE simplificada) + `jobs/recurringTransactions.js` roda diariamente e cria a ocorrência do dia. Suporta `FREQ=WEEKLY/MONTHLY/YEARLY` com `INTERVAL` e `UNTIL` |
| RF-022 | Editar/excluir transações | ✅ | Confirmado, mas ver gap crítico do delete de recorrentes na seção 3 |
| RF-023/024 | Filtros (período, categoria, tipo, recurso) + busca (descrição/tag) | ✅ | Confirmado, `transactionRepository.buildWhere` — bem implementado, inclusive com `OR` cobrindo descrição e nome de tag |
| RF-025 | Bloquear despesas de Alimentação usando VT | ✅ | Confirmado **apenas para a categoria padrão "Transporte"/"Alimentação" literal** — ver gap crítico seção 3 |
| RF-140 | Transferência entre recursos, fora dos totais de receita/despesa | ✅ | Confirmado — `tipo: TRANSFERENCIA`, `categoriaId` nulo, excluído de `montarResumo` (só soma `RECEITA`/`DESPESA`) |
| RF-141 | Sugestão de categoria por similaridade de descrição | ✅ | Não auditado em profundidade neste módulo (arquivo `categorySuggestionService.js` existe e tem conteúdo) — mencionar para futura verificação de precisão do algoritmo de Dice bigramas |

Todos os RFs "✅" do README de fato têm implementação real por trás (não são scaffolds mortos do T1) — este módulo passa no teste de "não é só checkbox".

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **"Excluir esta e futuras" não faz o que o texto promete.** Na UI (`DeleteTransactionModal.jsx:35-42`), o botão diz literalmente **"Excluir esta e futuras"**. No backend, esse fluxo chama `excluirRecorrentesFilhas(paiId)` (`transactionRepository.js:128-130`), que executa `deleteMany({ where: { paiId } })` **sem nenhum filtro de data** — ou seja, apaga **todas** as ocorrências já geradas da série, passadas e futuras, não só as futuras. Um usuário que tem 8 meses de histórico de "Aluguel" recorrente e clica "Excluir esta e futuras" pensando em parar a recorrência dali pra frente **perde o histórico financeiro dos 8 meses anteriores** sem aviso. Isso é uma perda de dados real, silenciosa, e diretamente contraditória com o texto do próprio botão.
2. **Confirmação de exclusão não diferencia visualmente o risco.** O modal (`DeleteTransactionModal.jsx`) usa `variant="danger"` só no botão "Excluir esta e futuras", o que é correto, mas a mensagem (`deleteRecurringTransactionMessage`, não lida neste módulo mas referenciada) precisa deixar claríssimo que isso afeta o passado também — hoje, a julgar pelo nome da função/botão, o usuário não é avisado disso.
3. **VA/VR/VT ficam "quebrados" silenciosamente ao criar categorias personalizadas para o mesmo propósito.** Um usuário que cria a categoria "Mercado" (em vez de usar a "Compras" padrão) ou "Uber"/"99" (em vez de "Transporte" padrão) **não consegue mais registrar despesas nessas categorias usando VA ou VT respectivamente** — o sistema rejeita com a mensagem genérica "VA só pode ser usado em despesas de Alimentação ou Compras" / "VT só pode ser usado em despesas de Transporte", que não deixa claro que o problema é o **nome exato** da categoria, não a categoria em si. Do ponto de vista do usuário, ele criou uma categoria mais específica (boa prática incentivada por RF-018) e foi "punido" com uma trava que parece um bug.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico A — Exclusão de recorrentes ("futuras") apaga também o passado

**Reprodução (leitura de código):** `transactionService.excluirTransacao(usuarioId, transacaoId, excluirFuturas=true)` → se a transação é a "mãe" de uma série (`existente.recorrente && !existente.paiId`) → chama `transactionRepository.excluirRecorrentesFilhas(transacaoId)`, que roda:
```js
prisma.transacao.deleteMany({ where: { paiId } }) // sem where.data
```
Isso apaga **toda e qualquer** transação-filha já gerada por essa mãe, independentemente de a `data` dela ser passada ou futura. Como o job `recurringTransactions.js` gera a ocorrência "de hoje" a cada execução diária (não pré-gera o futuro), toda transação-filha existente no momento da exclusão é, por definição, uma ocorrência **já passada ou de hoje** — ou seja, na prática, **hoje o botão "excluir futuras" apaga exatamente o oposto do que promete: apaga o passado, não o futuro** (porque não existem filhas "futuras" ainda geradas — elas só nascem no dia em que ocorrem).
**Severidade:** Alta — perda de dados financeiros históricos sem aviso claro, e a funcionalidade faz o oposto semântico do texto exibido ao usuário (RN-052).
**Correção sugerida:** ao excluir a "mãe" com `excluirFuturas=true`, o correto é (a) apagar apenas filhas com `data >= hoje` (se existirem), e (b) sempre marcar a mãe como não-recorrente/encerrada (ou aplicar um `UNTIL=hoje` na `regraRecorrencia`) em vez de deletá-la — preservando o histórico e impedindo novas gerações, que é o que RN-052 realmente pede.

### Achado crítico B — Validação recurso×categoria depende do texto do nome, não de uma propriedade estável

**Reprodução:** `validarRecursoCategoria` (`recursoCategoriaRules.js:14-45`) normaliza (`normalize()`, remove acento/case) o `categoria.nome` e compara com literais fixos: `'alimentacao'`, `'compras'`, `'transporte'`. Não existe nenhum campo estrutural (ex.: `categoria.grupoSemantico` ou enum `CategoriaTipoRecurso`) que marque uma categoria personalizada como "compatível com VA" ou "compatível com VT" — a única forma de uma categoria ser aceita é ter exatamente esse nome (padrão, imutável — `atualizarCategoria` bloqueia edição de categoria `padrao: true`, `categoryService.js:39-41`).
**Impacto real:** RF-018 (categorias personalizadas) e as regras VA/VR/VT (RN-032/035/038/039) são features que, combinadas, **não funcionam juntas** — qualquer categoria personalizada para gastos de comida/transporte trava o uso do benefício correspondente.
**Severidade:** Média-Alta — não é um bug que quebra o sistema, mas neutraliza o valor de duas features que o README lista como 100% entregues quando usadas em conjunto (cenário realista: praticamente todo usuário brasileiro cria uma categoria tipo "iFood" ou "Uber").

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

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Corrigir a exclusão de recorrentes para não apagar histórico passado (RF-NOVO-C1) | Perda de dados financeiros real e silenciosa; contradiz o texto exibido ao usuário | Baixo-Médio |
| 2 | 🔴 Desacoplar validação recurso×categoria do nome em texto (RF-NOVO-C2) | Hoje neutraliza a combinação de duas features "prontas" (categorias personalizadas + benefícios); vira uma reclamação recorrente de usuário assim que alguém criar uma categoria própria de comida/transporte | Médio |
| 3 | 🟡 Melhorar mensagem de erro de recurso×categoria (RF-NOVO-C3) | Reduz confusão até a correção estrutural do item 2 estar pronta | Baixo |
| 4 | 🟢 Testes de regressão para os dois achados críticos (RNF-NOVO-C1) | Evita reincidência | Baixo |
| 5 | 🟢 Avaliar necessidade de concorrência otimista em edição (RNF-NOVO-C2) | Risco baixo hoje (uso single-user, não colaborativo nesta tela), mas registrar para não esquecer | Baixo, não urgente |

---

## ❓ Perguntas clarificadoras

1. O comportamento atual de "excluir esta e futuras" apagar o histórico passado foi uma decisão consciente de simplificação (ex.: "encerrar a série = limpar tudo") ou é de fato um bug não percebido? Isso muda se o item #1 é uma correção urgente ou uma mudança de escopo a ser discutida.
2. Vocês confirmam que RF-018 (categorias personalizadas) e as regras de VA/VR/VT deveriam funcionar juntas (ou seja, uma categoria customizada de comida deveria aceitar VA), ou a intenção sempre foi restringir VA/VR/VT só às categorias padrão do sistema?
3. Existe alguma tela ou fluxo (não encontrado neste módulo) que avise o usuário quando a mesma transação está sendo editada por duas abas/dispositivos ao mesmo tempo? Se não, isso é aceitável para o estágio atual do produto?

---

*Próximo módulo sugerido: 04 — Metas Financeiras.*
