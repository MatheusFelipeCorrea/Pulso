# 📅 Módulo 16 — Calendário Financeiro — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [09-Relatorios.md](./09-Relatorios.md), [10-Perfil-e-Configuracoes.md](./10-Perfil-e-Configuracoes.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-121–125, nota de RF-123), `RegrasDeNegocio.md` (RN-100).
> Código auditado: `api/src/services/calendarService.js`, `api/src/utils/fixedIncomeUtils.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 5/5**, confirmado. Módulo bem implementado, com uma peça de valor extra não documentada como RF: `buildVariacao` já resolve corretamente a divisão-por-zero (RN-155, regra do módulo de Relatórios que ainda não existe) — vale reaproveitar essa função quando o Módulo 09 for construído, em vez de reimplementá-la. O único achado real é uma reafirmação de uma dependência já registrada no Módulo 10: os marcadores de recebimento fixo (VA/VR/VT) já sabem se adaptar por `modoUso`, mas como esse campo nunca muda de `CLT` na prática, os ramos de Estagiário/PJ/Pessoa Física deste módulo nunca são exercitados por um usuário real hoje.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-121 | Calendário mensal com marcadores por dia | ✅ | Confirmado, `obterMarcadoresDias` |
| RF-122 | Diferenciar receitas (verde)/despesas (vermelho)/ambos (roxo) | ✅ | Dados (`temReceita`/`temDespesa`) calculados corretamente; a cor em si é responsabilidade do frontend | 
| RF-123 | Dias de recebimento fixo destacados | ✅ | Confirmado, `fixedIncomeUtils.js`, condicionado corretamente por `modoUso` — mas ver achado na seção 3 |
| RF-124 | Vencimentos de contas/lembretes no calendário | ✅ | Confirmado, `proximosVencimentos` e marcadores de dia |
| RF-125 | Clicar no dia para ver detalhe | ✅ | Confirmado, `obterDetalheDia` |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

Nenhum gap de usabilidade relevante identificado neste módulo especificamente — a experiência de calendário em si (dados corretos, detalhamento por dia) está bem resolvida. Os gaps de experiência que afetam este módulo (ex.: usuário nunca ver a experiência de Estagiário/PJ) são heranças do Módulo 10, não deste.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Confirmação — RN-100 respeitada

"Calendário financeiro mostra SOMENTE transações já registradas + lembretes futuros": confirmado — `obterMarcadoresDias`/`obterDetalheDia` consultam transações e lembretes por intervalo de data sem nenhuma lógica de projeção/estimativa futura de transações, apenas o que já existe no banco.

### Achado — Dependência do Módulo 10 reforçada

`fixedIncomeUtils.podeExibirVt`/`podeExibirVaVr` (`:11-22`) já implementam corretamente a matriz de RN-002/018/022–025 (quem vê VA/VR/VT por modo de uso). Mas, como já registrado no [Módulo 10](./10-Perfil-e-Configuracoes.md), `modoUso` nunca é setado para nada além do padrão `CLT` em produção hoje — então, na prática, todo usuário vê o comportamento de "CLT" no calendário (VA+VR+VT todos visíveis), e os ramos de código para Estagiário (mesmo comportamento de CLT aqui), PJ (`vtHabilitado`) e Pessoa Física (nada visível) nunca são exercitados por um usuário real. Não é um bug deste módulo — é mais uma confirmação do alcance do problema já identificado.

### Achado positivo — Lógica de variação percentual reaproveitável para o Módulo 09

`buildVariacao` (`:124-141`) já resolve corretamente o que RN-155 (do módulo de Relatórios, ainda não implementado) exige: distingue "sem base" (0 → 0), "valor novo" (0 → N) e "percentual" (N → M), evitando divisão por zero. Quando o Módulo 09 for desenhado, esta função é uma candidata natural a ser extraída para um utilitário compartilhado, em vez de reescrita do zero — reforça a recomendação já feita naquele módulo (RNF-NOVO-I1) de centralizar lógica de agregação.

### Resiliência a estados extremos

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Dia de recebimento fixo configurado além do último dia do mês (ex.: dia 31 em fevereiro) | `clampDiaMes` ajusta para o último dia real do mês (`fixedIncomeUtils.js:5-9`) — consistente com RN-163 | ✅ |
| Mês anterior sem nenhuma transação (variação percentual) | Tratado sem divisão por zero (`buildVariacao`) | ✅ |
| Consultar detalhe de um dia sem nenhuma transação/lembrete/recebimento fixo | Retorna estrutura vazia coerente, não erro | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

Nenhum requisito novo específico — os itens de ação já estão cobertos pelas recomendações dos Módulos 09 e 10.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟢 Ao construir o Módulo 09 (Relatórios), reaproveitar `buildVariacao` deste módulo em vez de reimplementar | Evita duplicação e garante consistência de regra (RN-155) entre Calendário e Relatórios | Baixo |

---

## ❓ Perguntas clarificadoras

Nenhuma pergunta específica deste módulo.

---

*Próximo módulo sugerido: 17 — Dívidas Pessoais.*
