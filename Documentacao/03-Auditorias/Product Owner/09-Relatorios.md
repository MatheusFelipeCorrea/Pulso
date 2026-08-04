# 📈 Módulo 09 — Relatórios e Histórico — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md) (achado T1 é a explicação técnica deste módulo)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-067–072), `RegrasDeNegocio.md` (RN-152–158).
> Código auditado: `api/src/{controllers,services,routes}/report*.js` (todos vazios — scaffold morto, achado T1), `web/src/pages/Reports.jsx` (vazio), `web/src/App.jsx`/`config/appRoutes.js` (rota `/reports` cai em `InDevelopmentPage`).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **0/6**, e a auditoria confirma isso sem ressalvas — este é o único módulo, junto com Chatbot (Módulo 06), em que **toda a cadeia** (`reportController.js`, `reportService.js`, `reportRoutes.js`, `web/src/pages/Reports.jsx`) está vazia (achado T1), sem nenhuma lógica parcial escondida em outro arquivo com nome diferente (diferente do que ocorreu com Insights, onde havia lógica real sob outro nome). Não há achados de "regra mal aplicada" a reportar aqui, porque não há regra nenhuma implementada — o valor desta auditoria está em mapear o que já pode ser reaproveitado de outros módulos para acelerar a construção.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-067 | Relatório mensal (receitas, despesas, saldo) | ❌ | Confirmado ausente. **Reaproveitável:** `transactionService.calcularResumo` (Módulo 03) já produz exatamente esse agregado para qualquer filtro de período |
| RF-068 | Gráfico de pizza por categoria | ❌ | Confirmado ausente. Não existe endpoint de agregação por categoria pronto em nenhum módulo já auditado — precisa ser construído do zero (agrupar `transacao.groupBy(['categoriaId'])`, que já é usado de forma pontual em `insightService.js` para achar "maior gasto") |
| RF-069 | Gráfico de barras comparando meses anteriores | ❌ | Confirmado ausente |
| RF-070 | Gráfico de evolução temporal do saldo | ❌ | Confirmado ausente |
| RF-071 | Exportar PDF | ❌ | Confirmado ausente — Roadmap já prevê `@react-pdf/renderer`, não instalado/usado em nenhum arquivo encontrado até agora |
| RF-072 | Exportar CSV | ❌ | Confirmado ausente — Roadmap prevê `PapaParse` |

**RN-152–158 (regras de relatório):** nenhuma tem código correspondente hoje. Vale destacar RN-158 ("Relatórios NÃO incluem dados de grupos") como um requisito a não esquecer no desenho futuro, já que Grupos (Módulo 13) tem sua própria contabilidade de despesas de viagem que não deve vazar para os relatórios pessoais.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Mesmo padrão do Dashboard (Módulo 02):** `/reports` está no menu lateral (`sidebarNavigation.js:42`) e cai em `InDevelopmentPage` ao ser clicado — mas, diferente do Dashboard, não é destino forçado de nenhum fluxo automático, então o impacto de primeira impressão é bem menor.
2. **Sobreposição de propósito com um futuro Dashboard.** Se o Dashboard (Módulo 02) for construído reaproveitando `calcularResumo` e agregações por categoria (como proposto no relatório daquele módulo), há risco de duplicar a mesma lógica de agregação em dois lugares (Dashboard e Relatórios) com pequenas diferenças de filtro — vale desenhar os dois módulos com um service de agregação compartilhado desde o início.

---

## 3. Diagnóstico de Regras de Negócio e Validações

Não há o que diagnosticar em código inexistente. O único ponto de atenção antecipado para quando o módulo for construído: **RN-155** ("se período anterior = 0, não calcular variação, exibir 'Sem dados anteriores'") é uma regra de divisão-por-zero que precisa ser lembrada explicitamente no desenho do comparativo mês-a-mês (RF-069) — é o tipo de edge case que costuma ser esquecido na primeira versão de qualquer cálculo de variação percentual.

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-I1** — Ao desenhar o service de Relatórios, expor um endpoint de agregação por categoria (`GET /transacoes/resumo-por-categoria`) que sirva tanto a este módulo (RF-068, gráfico de pizza) quanto a um futuro Dashboard (RF-010), evitando duplicação de lógica.

### Não funcionais

- **RNF-NOVO-I1 (Reuso)** — Centralizar toda lógica de agregação financeira (resumo, por categoria, por recurso, comparativo de períodos) em um único service compartilhado entre Dashboard, Relatórios e, futuramente, Insights — os três módulos consomem essencialmente os mesmos dados brutos com recortes diferentes.
- **RNF-NOVO-I2** — Ao implementar RF-071/072 (export PDF/CSV), aplicar RN-158 desde o primeiro commit (garantir que a query de exportação nunca inclua transações de Grupos).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟢 Não iniciar a implementação de Relatórios isoladamente — desenhar em conjunto com o Dashboard mínimo (Módulo 02) o service de agregação compartilhado (RNF-NOVO-I1) | Evita retrabalho e duas fontes de verdade para o mesmo cálculo | Decisão de arquitetura antes de codar |
| 2 | 🟢 Ao codar RF-069 (comparativo), tratar explicitamente RN-155 (divisão por zero) desde a primeira versão | Edge case previsível e barato de tratar cedo | Trivial |

---

## ❓ Perguntas clarificadoras

1. Relatórios e Dashboard estão no roadmap para serem construídos em sequência próxima (o que justificaria desenhar o service de agregação compartilhado agora) ou são esforços distantes um do outro no tempo?
2. Exportação em PDF (RF-071) tem alguma referência visual/wireframe já definida, ou fica a critério de quem implementar?

---

*Próximo módulo sugerido: 10 — Perfil e Configurações (README marca 🟡 parcial — dados existem no banco, mas sem tela; módulo importante porque destrava VT/onboarding).*
