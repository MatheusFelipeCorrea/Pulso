# 🤝 Módulo 17 — Dívidas Pessoais — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [04-Metas-Financeiras.md](./04-Metas-Financeiras.md) (comparar com o achado equivalente lá)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-126–132), `RegrasDeNegocio.md` (RN-075–080).
> Código auditado: `api/src/services/debtService.js`, `api/src/utils/debtBalanceUtils.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 7/7**, confirmado. Módulo bem construído, com tratamento explícito de reabertura ao remover pagamento (ao contrário do bug equivalente no Módulo 04, aqui a exclusão de pagamento **não é bloqueada** quando a dívida está quitada). A auditoria encontrou um comportamento sutil, não necessariamente um bug, mas uma inconsistência de exibição digna de nota: ao remover o **único** pagamento de uma dívida já quitada, o sistema **fabrica** um `valorPago` igual ao valor total para fins de exibição (em vez de mostrar 0% pago), e a dívida continua bloqueada para novos pagamentos até que o usuário explicitamente clique em "reabrir" — uma ação que não faz sentido intuitivo pedir numa dívida que, na tela, aparenta estar 100% paga.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-126/127 | Registrar empréstimo feito/recebido | ✅ | Confirmado, `criarDivida` com `direcao` (ME_DEVEM/EU_DEVO) |
| RF-128 | Prazo de devolução | ✅ | Confirmado, `validarPrazoDevolucao` — exige prazo posterior à data do empréstimo |
| RF-129 | Marcar como paga/devolvida | ✅ | Confirmado, `quitarDivida` |
| RF-130 | Saldo consolidado (me devem vs. devo) | ✅ | Confirmado, `montarResumo` |
| RF-131 | Histórico completo (ativas e quitadas) | ✅ | Confirmado, `listarDividas` com filtro `quitada` |
| RF-132 | Alertar vencimento próximo | ✅ | Não aprofundado neste módulo (serviço de alerta separado, mesmo padrão do Módulo 07) |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Remover o único pagamento de uma dívida quitada gera uma tela enganosa.** Ver mecanismo completo na seção 3. Do ponto de vista do usuário: ele registra um pagamento errado, decide excluí-lo para corrigir, e a dívida **continua aparecendo como "Quitada" com o valor total "pago"** — mesmo não havendo mais nenhum pagamento real registrado. Se ele tentar registrar o pagamento correto, recebe "Dívida já está quitada" (bloqueio de `registrarPagamento`), sem nenhuma pista de que precisa primeiro usar a ação "Reabrir" — ação que não parece necessária numa dívida que a tela mostra como 100% paga.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado — Exibição fabricada após excluir o único pagamento de uma dívida quitada

**Mecanismo (`debtBalanceUtils.js:17-34`):** `isDividaQuitada` considera uma dívida quitada em dois casos: (a) saldo restante ≤ 0 pelos pagamentos reais, OU (b) `divida.quitada === true` **e** zero pagamentos (`Boolean(divida.quitada) && pagamentos.length === 0`). O segundo caso é, na leitura do código, uma proteção deliberada para dívidas quitadas sem nunca ter tido pagamento formal (ex.: perdão de dívida). Mas ele também cobre, sem distinção, o cenário de "dívida quitada que **teve** pagamento e ele foi removido depois" — e nesse cenário, `calcSaldoDivida` força `valorPago = valorTotal` para exibição (`:28`, "`valorPago > 0 ? valorPago : valorTotal`"), mesmo o valor pago real sendo zero.
**Efeito no fluxo:** após `excluirPagamento` remover o único pagamento de uma dívida quitada, a dívida no banco continua com `quitada: true` (nenhuma das branches de `sincronizarQuitacao` chama `debtRepository.reabrir` nesse caso específico, porque a condição de reabertura automática exige `pagamentos.length > 0`, que é falso aqui). A tela mostra "Quitada, 100% pago" mesmo sem nenhum pagamento real, e novas tentativas de pagamento são bloqueadas (`registrarPagamento` recusa se `divida.quitada`). A única saída é a ação explícita "Reabrir" (`reabrirDivida`), que **funciona corretamente** quando chamada (confirmado por leitura de código: a guarda de `reabrirDivida:301-307` — que impede reabrir dívidas "quitadas por pagamentos parciais" — não bloqueia este caso específico, porque `divida.pagamentos.length > 0` também é falso ali). Ou seja, **não é um beco sem saída** como o achado equivalente do Módulo 04 — existe uma saída — mas ela exige uma ação que não é intuitiva diante de uma tela que mostra a dívida como perfeitamente quitada.
**Severidade:** Média — dado consistente no banco, inconsistência é só de exibição/UX, e há caminho de recuperação (diferente do Módulo 04, onde a exclusão de aporte é ativamente bloqueada).

### Resiliência a estados extremos (itens que funcionam corretamente)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Pagamento maior que o saldo restante | Bloqueado (`registrarPagamento:241-243`) | ✅ |
| Editar valor total para menos do que já foi pago | Bloqueado (`editarDivida:201-206`) | ✅ |
| Editar/pagar/excluir dívida já quitada | Bloqueado nos três casos (`editarDivida:189-191`, `registrarPagamento:231-233`, `excluirDivida:318-322`) | ✅ |
| Quitar dívida com saldo restante > 0 | Reaproveita `registrarPagamento` internamente para registrar o pagamento do saldo (`quitarDivida:283-289`), evitando duplicar a lógica de quitação | ✅ Boa prática de reuso |
| Prazo de devolução anterior/igual à data do empréstimo | Bloqueado (`validarPrazoDevolucao:56-58`) | ✅ |
| Excluir dívida já quitada | Bloqueado, orientando que a limpeza é automática após 180 dias (mesmo padrão do Módulo 15) | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-O1** — Ao remover o último pagamento de uma dívida quitada, reabrir automaticamente a dívida (chamando `debtRepository.reabrir` nesse caso específico) em vez de deixá-la num estado "quitada com exibição fabricada" — elimina a necessidade de uma ação manual "Reabrir" não intuitiva.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Reabrir automaticamente ao excluir o último pagamento de uma dívida quitada (RF-NOVO-O1) | Elimina uma inconsistência visual e uma ação não intuitiva; risco baixo de regressão dado que a lógica de reabertura manual já existe e funciona | Baixo |

---

## ❓ Perguntas clarificadoras

1. O caso de "dívida quitada sem nenhum pagamento formal" (ex.: perdão de dívida registrado diretamente como quitado) é um cenário real de produto que `isDividaQuitada` precisa proteger, ou foi escrito só para cobrir o efeito colateral de remover o último pagamento? Isso muda a forma certa de corrigir o item 1 (reabrir automaticamente sempre, vs. só quando havia pagamento antes).

---

*Próximo módulo sugerido: 18 — Planejamento de Compra (último módulo com código já entregue; a partir do 19 entramos nos módulos 100% planejados sem implementação).*
