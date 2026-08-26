# 📊 Módulo 02 — Dashboard Principal — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-007–014, RF-015), `Analise-Produto.md` (gap #1), `Roadmap/Roadmap.md` (Fase 4.4).
> Código auditado: `web/src/App.jsx`, `web/src/config/appRoutes.js`, `web/src/pages/InDevelopmentPage.jsx`, `web/src/pages/Dashboard.jsx`, `web/src/config/sidebarNavigation.js`, `web/src/components/routing/{ProtectedRoute,AuthBootstrap}.jsx`, `web/src/pages/AuthCallback.jsx`, `api/src/routes/transactionRoutes.js`, `api/src/services/transactionService.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca Dashboard como **0/9**. O dashboard em si continua placeholder, mas **RF-NOVO-B1 ✅ (ago/2026):** pós-login/OAuth/GuestRoute/Landing redirecionam para **`/transactions`** via `DEFAULT_AUTHENTICATED_ROUTE`. Backend já expõe blocos reutilizáveis para um dashboard MVP (`/transactions/resumo`, `/metas`, orçamento).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-007 | Saldo total do mês | ❌ Não feito | Confirmado ausente. Mas `GET /transactions/resumo` (`transactionRoutes.js:28-33` → `transactionService.calcularResumo`, `transactionService.js:188-191`) já calcula `receitas.total`, `despesas.total` e `saldo` agregados por filtro de período — é 80% do dado que RF-007 pede, só falta a tela |
| RF-008 | Saldos por recurso (dinheiro/VA/VR/VT) | ❌ Não feito | Confirmado ausente como endpoint dedicado; saldos por recurso ainda não têm agregador único pronto para consumo direto |
| RF-009 | Gráfico receitas vs. despesas | ❌ Não feito | Confirmado ausente. Dado bruto (receitas/despesas totais) já existe via `/transactions/resumo`, falta granularidade temporal (série por dia/semana) e o componente de gráfico |
| RF-010 | Gráfico gastos por categoria | ❌ Não feito | Confirmado ausente. Não há endpoint de agregação por categoria pronto |
| RF-011 | Resumo das últimas transações | ❌ Não feito | Confirmado ausente como widget, mas `GET /transactions` já pagina e ordena — trivial de reaproveitar com `limite=5` |
| RF-012 | Alertas visuais de limite ultrapassado | ❌ Não feito | Confirmado ausente no dashboard; a lógica de alerta em si (80%/100% do limite) já existe no módulo de Orçamento (RF-101/112, ✅) — reaproveitável, não precisa ser reinventada |
| RF-013 | Progresso resumido das metas ativas | ❌ Não feito | Confirmado ausente; `GET /metas` já retorna progresso — reaproveitável |
| RF-014 | Score de saúde financeira | ❌ Não feito | Confirmado ausente. Não localizei nenhum cálculo de score em nenhum service ainda auditado — this parece depender do Módulo 06 (Insights), que também está em 0% |
| RF-015 | Quick-add (FAB) abrindo chatbot p/ registro em linguagem natural | ❌ Não feito | Confirmado ausente; depende do Chatbot (Módulo 06), também 0% |

**Achado:** o Dashboard continua em `InDevelopmentPage`, mas **não é mais destino forçado** de autenticação — ver RF-NOVO-B1 abaixo.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

Esta é a seção mais importante deste módulo, dado que ele é 100% placeholder.

1. ~~**Toda autenticação termina em "em desenvolvimento".**~~ **✅ Corrigido (ago/2026)** — destino pós-login via `DEFAULT_AUTHENTICATED_ROUTE`.
2. **`InDevelopmentPage` sem next-step** — permanece se o usuário clicar em Dashboard no menu; falta atalho ou badge "em breve" na sidebar (RNF-NOVO-B1).
3. **Sidebar** — Dashboard ainda é primeiro item; usuário pode voltar ao placeholder manualmente.
4. **Onboarding (M19)** — ainda 0%; não cobre lacuna do dashboard completo.

---

## 3. Diagnóstico de Regras de Negócio e Validações

Não há regras de negócio específicas de Dashboard documentadas em `RegrasDeNegocio.md` (o documento não tem uma seção "Regras de Dashboard") — o módulo é puramente de agregação/visualização de dados que já têm regras definidas em outros módulos (Transações, Orçamento, Metas). Não há, portanto, uma "regra frágil" própria deste módulo para diagnosticar; o risco real é de **duplicação de lógica** quando o dashboard for construído: por exemplo, se o cálculo de "saldo do mês" for reimplementado do zero no futuro service de dashboard em vez de reaproveitar `transactionService.calcularResumo`, os dois pontos podem divergir com o tempo (bug clássico de "dois lugares calculando a mesma coisa de jeitos ligeiramente diferentes").

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-B1** — ✅ **Implementado (ago/2026):** destino pós-login = `/transactions` via `DEFAULT_AUTHENTICATED_ROUTE`.
- **RF-NOVO-B2** — Dashboard mínimo viável (MVP) reaproveitando dados já existentes, antes de construir os 9 RFs completos: card de saldo do mês (via `/transactions/resumo`), últimas 5 transações (via `/transactions?limite=5`), progresso das metas ativas (via `/metas`) e alertas de orçamento estourado (via módulo de Orçamento, já ✅). Isso cobre uma fatia de RF-007/011/012/013 com esforço de backend próximo de zero (é composição de endpoints já prontos).
- **RF-NOVO-B3** — Endpoint dedicado `GET /transactions/resumo-por-recurso` (saldo separado por Dinheiro/VA/VR/VT), para viabilizar RF-008 sem depender de agregações client-side espalhadas por múltiplas telas.

### Não funcionais

- **RNF-NOVO-B1 (UX)** — Adicionar indicador visual (badge "em breve"/ícone diferenciado) nos itens da sidebar que apontam para `InDevelopmentPage`, para não sugerir que módulos incompletos têm o mesmo nível de prontidão que os já entregues.
- **RNF-NOVO-B2 (Arquitetura)** — Ao implementar o Dashboard real, centralizar os cálculos de agregação (saldo, resumo por categoria) em um único service reaproveitado, em vez de duplicar a lógica de `transactionService.montarResumo` em dois lugares diferentes.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | Trocar destino pós-login (RF-NOVO-B1) | ✅ Feito → `/transactions` |
| 2 | Dashboard mínimo (RF-NOVO-B2) | 🟡 Pendente |
| 3 | Badge sidebar incompletos (RNF-NOVO-B1) | 🟡 Pendente |
| 4 | 🟡 Endpoint de saldo por recurso (RF-NOVO-B3) | Necessário para RF-008; hoje a lógica de saldo por recurso está fragmentada entre módulos | Médio |
| 5 | 🟢 Score de saúde financeira (RF-014) e projeções (RF-053/108) | Depende do Módulo 06 (Insights), ainda não auditado — não priorizar isoladamente antes de mapear aquele módulo | A definir após Módulo 06 |

---

## ❓ Perguntas clarificadoras

1. ~~Destino pós-login em `/dashboard`?~~ **Resolvido** — `/transactions` até o Dashboard MVP existir.
2. O "score de saúde financeira" (RF-014) já tem alguma fórmula definida em algum lugar não documentado, ou depende inteiramente do Módulo 06 (Insights) ainda ser desenhado?
3. Confirma que a prioridade é montar o Dashboard MVP reaproveitando dados de outros módulos (rápido) antes de investir nos gráficos completos (Recharts, RF-009/010), ou preferem entregar a versão completa de uma vez?

---

*Próximo módulo sugerido: 03 — Transações (núcleo financeiro, maior superfície de regras de negócio e validação).*
