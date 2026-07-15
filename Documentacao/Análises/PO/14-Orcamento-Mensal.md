# 📊 Módulo 14 — Orçamento Mensal — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-109–114, RF-150), `RegrasDeNegocio.md` (RN-055–060, RN-170).
> Código auditado: `api/src/services/budgetService.js`, `api/src/utils/budgetRolloverUtils.js`, `api/src/repositories/budgetRepository.js`, `api/src/services/notificationService.js` (dedup).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 7/7**, e esta é, até agora, a auditoria de módulo com **menos achados críticos** do sistema. A lógica de rollover (RF-150/RN-170) — a regra mais complexa deste módulo — está implementada corretamente nos dois caminhos possíveis de disparo (edição manual de categoria nova no mês e "copiar do mês anterior"), incluindo o cuidado de não herdar estouro (sobra negativa) e não retroagir sobre orçamentos já criados. A deduplicação de notificações de alerta (80%/100%) também está correta, evitando spam de notificação conforme o gasto sobe gradualmente dentro da mesma faixa. Não foram encontrados achados de severidade alta.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-109 | Limite mensal por categoria | ✅ | Confirmado, `salvarOrcamentos` |
| RF-110 | Barra de progresso gasto vs. limite | ✅ | Dado calculado corretamente (`percentualUsado`), renderização não auditada aqui (frontend) |
| RF-111 | Alerta em 80% | ✅ | Confirmado, `verificarLimitesUsuarioENotificar:279-290` |
| RF-112 | Alerta ao estourar (100%+) | ✅ | Confirmado, `:267-278` |
| RF-113 | Editar limites a qualquer momento | ✅ | Confirmado, `salvarOrcamentos` faz upsert por categoria |
| RF-114 | Resumo visual de quanto ainda pode gastar | ✅ | Confirmado, `resumo.restanteTotal` e `restanteValor` por categoria |
| RF-150 | Rollover ativável por categoria | ✅ | Confirmado e correto — ver seção 3 |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **RN-059 (orçamento total > renda) é dado bruto, não um aviso pronto.** `obterStatusOrcamento` retorna tanto `rendaMensalPlanejada` quanto `resumo.orcamentoTotal` separadamente, mas não computa nem sinaliza a comparação — a regra "exibir warning permanente" depende inteiramente do frontend calcular `orcamentoTotal > rendaMensalPlanejada` por conta própria. Não é um bug (os dados estão todos lá), mas é uma responsabilidade que poderia estar centralizada no backend para garantir consistência entre diferentes telas que eventualmente consumam esse dado.
2. **`rendaMensalPlanejada` depende de um campo que, pelo Módulo 10, nunca foi exposto para o usuário configurar.** `obterRendaMensalPlanejada` usa `config.rendaMensalPlanejada ?? config.valorSalario` — mas `valorSalario` também não tem nenhuma tela de configuração confirmada (Módulo 10). Isso significa que, na prática, `rendaMensalPlanejada` é `0` para todo usuário hoje, e a comparação RN-059 (mesmo se implementada) nunca disparia de forma útil até o Módulo 10 ser resolvido.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Verificação da regra mais complexa do módulo — Rollover (RN-170)

`calcularValorRollover` (`budgetRolloverUtils.js:1-6`) implementa exatamente o que RN-170 descreve:
- Só aplica rollover se o orçamento do mês anterior **também** tinha `rolloverAtivo` (`if (!orcamentoAnterior || !orcamentoAnterior.rolloverAtivo) return 0`).
- Sobra negativa (estouro) nunca é herdada (`sobra > 0 ? sobra : 0`).
- Confirmado nos **dois** pontos de entrada onde a regra pode disparar: `salvarOrcamentos` (edição manual, `:156-162`) e `copiarParaMes` (cópia do mês anterior, `budgetRepository.js:99-108`) — ambos chamam a mesma função utilitária, evitando duplicação de lógica com o risco de divergência.
- Confirmado que rollover só se aplica a uma categoria **nova** no mês (`!jaExiste`), não retroage sobre orçamento já criado — exatamente como a nota de RN-170 exige.

### Resiliência a estados extremos

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Copiar orçamento para um mês que já tem orçamentos | Bloqueado com mensagem clara, orientando editar/remover antes (`copiarOrcamento:195-201`) | ✅ |
| Copiar de um mês sem nenhum orçamento definido | Bloqueado (`:203-206`) | ✅ |
| Categoria de orçamento não pertence ao usuário ou não é de despesa | Validado (`validarCategoriasDoUsuario:100-114`) | ✅ |
| Registrar transação sem verificar orçamento | Corretamente não bloqueia — RN-058 respeitada (não há chamada a `budgetService` em `transactionService.criarTransacao`) | ✅ |
| Gasto subindo gradualmente de 81% a 99% ao longo de vários dias/execuções do job | Notificação de "alerta 80%" não é reenviada repetidamente — dedup por `(tipo, categoriaId, mesReferencia)`, ignorando o percentual exato (`notificationService.verificarNotificacaoDuplicada`) | ✅ Boa engenharia |
| Salvar lista de orçamentos vazia | Remove todos os orçamentos do mês em vez de erro (`salvarOrcamentos:120-123`) | ✅ Comportamento razoável, ainda que mereça confirmação de que é o esperado pelo produto (ver pergunta clarificadora) |

---

## 4. 💡 Novos Requisitos Propostos

### Não funcionais

- **RNF-NOVO-N1** — Mover o cálculo de "orçamento total excede renda planejada" (RN-059) para o backend, retornando um booleano/flag pronto em `obterStatusOrcamento`, para não depender de cada consumidor do endpoint reimplementar a mesma comparação.
- **RNF-NOVO-N2** — Este módulo reforça a prioridade do Módulo 10 (Perfil/Configurações): sem uma forma de configurar `rendaMensalPlanejada`/`valorSalario`, RN-059 nunca é útil na prática.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟢 Mover cálculo de RN-059 para o backend (RNF-NOVO-N1) | Consistência entre telas futuras que usem esse dado | Baixo |
| 2 | 🟢 Confirmar que "salvar lista de limites vazia = remover todos os orçamentos do mês" é o comportamento esperado pela UI (não achado de bug, apenas confirmação) | Evita surpresa se a tela permitir esse estado sem intenção | Trivial (validação) |

Este módulo não gera itens de alta prioridade — reforça-se apenas a dependência já registrada no Módulo 10.

---

## ❓ Perguntas clarificadoras

1. Confirma que enviar uma lista vazia de limites para `POST/PUT` de orçamentos deve mesmo remover todos os orçamentos existentes do mês (comportamento atual), e não ser tratado como "nenhuma mudança"?

---

*Próximo módulo sugerido: 15 — Divisão de Despesas.*
