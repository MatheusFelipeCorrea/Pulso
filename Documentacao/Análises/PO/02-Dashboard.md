# 📊 Módulo 02 — Dashboard Principal — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-007–014, RF-139), `Analise-Produto.md` (gap #1), `Roadmap/Roadmap.md` (Fase 4.4).
> Código auditado: `web/src/App.jsx`, `web/src/config/appRoutes.js`, `web/src/pages/InDevelopmentPage.jsx`, `web/src/pages/Dashboard.jsx`, `web/src/config/sidebarNavigation.js`, `web/src/components/routing/{ProtectedRoute,AuthBootstrap}.jsx`, `web/src/pages/AuthCallback.jsx`, `api/src/routes/transactionRoutes.js`, `api/src/services/transactionService.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README já é honesto aqui — marca Dashboard como **0/9, sem progresso**, e o `Analise-Produto.md` já identifica a navegação para páginas "em desenvolvimento" como gap #1. A auditoria **confirma isso no código** e adiciona um dado mais grave, que a documentação não menciona explicitamente: **não é só que o Dashboard não existe — é que ele é o destino obrigatório de toda autenticação bem-sucedida no sistema.** Login, cadastro (após verificação), callback do Google OAuth e o redirecionamento de usuário-já-logado (`GuestRoute`) **sempre** mandam para `/dashboard`, que sempre renderiza `InDevelopmentPage` ("Dashboard em desenvolvimento"). Ou seja, hoje, **100% dos logins bem-sucedidos no Pulso terminam numa tela de "em construção"**. Isso não é um módulo "não pronto" qualquer — é a porta de entrada do produto inteiro estar quebrada do ponto de vista de primeira impressão. Por outro lado, a auditoria encontrou que o backend já expõe blocos reutilizáveis (ex.: `GET /transactions/resumo`) que tornam um dashboard mínimo bem mais barato do que a lista de 9 RFs sugere.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-007 | Saldo total do mês | ❌ Não feito | Confirmado ausente. Mas `GET /transactions/resumo` (`transactionRoutes.js:28-33` → `transactionService.calcularResumo`, `transactionService.js:188-191`) já calcula `receitas.total`, `despesas.total` e `saldo` agregados por filtro de período — é 80% do dado que RF-007 pede, só falta a tela |
| RF-008 | Saldos por recurso (dinheiro/VA/VR/VT) | ❌ Não feito | Confirmado ausente como endpoint dedicado; a lógica de saldo por recurso individual existe espalhada (VT em `transportService.js`, mencionado no Módulo 08) mas não há um agregador único "saldo por recurso" pronto para consumo direto |
| RF-009 | Gráfico receitas vs. despesas | ❌ Não feito | Confirmado ausente. Dado bruto (receitas/despesas totais) já existe via `/transactions/resumo`, falta granularidade temporal (série por dia/semana) e o componente de gráfico |
| RF-010 | Gráfico gastos por categoria | ❌ Não feito | Confirmado ausente. Não há endpoint de agregação por categoria pronto (nem em `reportService.js`, que está vazio — ver T1) |
| RF-011 | Resumo das últimas transações | ❌ Não feito | Confirmado ausente como widget, mas `GET /transactions` já pagina e ordena — trivial de reaproveitar com `limite=5` |
| RF-012 | Alertas visuais de limite ultrapassado | ❌ Não feito | Confirmado ausente no dashboard; a lógica de alerta em si (80%/100% do limite) já existe no módulo de Orçamento (RF-111/112, ✅) — reaproveitável, não precisa ser reinventada |
| RF-013 | Progresso resumido das metas ativas | ❌ Não feito | Confirmado ausente; `GET /metas` já retorna progresso — reaproveitável |
| RF-014 | Score de saúde financeira | ❌ Não feito | Confirmado ausente. Não localizei nenhum cálculo de score em nenhum service ainda auditado — this parece depender do Módulo 06 (Insights), que também está em 0% |
| RF-139 | Quick-add (FAB) abrindo chatbot p/ registro em linguagem natural | ❌ Não feito | Confirmado ausente; depende do Chatbot (Módulo 06), também 0% |

**Achado não documentado explicitamente no README/Analise-Produto:** a lista de rotas que caem em `InDevelopmentPage` (`App.jsx:87-105`) inclui, além do Dashboard, `/reports`, `/insights`, `/chatbot`, `/achievements`, `/profile`, `/settings` — mas **o Dashboard é o único desse grupo que é destino forçado de navegação automática** (os outros só são visitados se o usuário clicar neles no menu). Isso muda a severidade relativa: um `/settings` incompleto é um gap; um `/dashboard` incompleto que **todo usuário vê automaticamente ao entrar** é um problema de produto de primeira ordem.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

Esta é a seção mais importante deste módulo, dado que ele é 100% placeholder.

1. **Toda autenticação bem-sucedida termina em "em desenvolvimento".** Confirmado em 3 pontos distintos do código, todos com `navigate('/dashboard', ...)` hardcoded:
   - `web/src/pages/Login.jsx:101` — login por email/senha
   - `web/src/pages/AuthCallback.jsx:74` — callback do Google OAuth
   - `web/src/components/routing/ProtectedRoute.jsx:21` (`GuestRoute`) — qualquer usuário já autenticado que acesse `/login` ou `/register` é redirecionado para `/dashboard`

   Não existe nenhuma lógica de "para onde mandar o usuário se o dashboard não estiver pronto" — por exemplo, mandar para `/transactions` (que é funcional) como destino provisório pós-login. Esse é o "beco sem saída" mais impactante de todo o sistema: o produto parece quebrado no primeiro segundo de uso, mesmo tendo 9 módulos financeiros inteiros funcionando por trás do menu.
2. **`InDevelopmentPage` é honesta, mas não oferece next-step.** O componente (`InDevelopmentPage.jsx:18-20`) diz "Esta área será implementada em breve. Use o menu lateral..." — correto, mas é texto genérico sem nenhum atalho (ex.: botão direto para "Ver minhas Transações" ou "Ver meu Orçamento"). Para quem acabou de logar, a orientação é vaga.
3. **Sidebar mostra "Dashboard" como primeiro item do menu** (`sidebarNavigation.js:8-12`, ícone `LayoutGrid`), reforçando a expectativa de que é a tela principal — o usuário volta a clicar nela repetidamente esperando encontrar algo, sem nenhuma affordance visual (badge "em breve", ícone acinzentado, etc.) diferenciando esse item dos módulos que funcionam.
4. **Nenhum onboarding cobre essa lacuna hoje.** O Módulo 19 (Onboarding) está planejado mas também em 0% — então não há nem uma tela de boas-vindas alternativa que amenize a primeira impressão enquanto o Dashboard não existe.

---

## 3. Diagnóstico de Regras de Negócio e Validações

Não há regras de negócio específicas de Dashboard documentadas em `RegrasDeNegocio.md` (o documento não tem uma seção "Regras de Dashboard") — o módulo é puramente de agregação/visualização de dados que já têm regras definidas em outros módulos (Transações, Orçamento, Metas). Não há, portanto, uma "regra frágil" própria deste módulo para diagnosticar; o risco real é de **duplicação de lógica** quando o dashboard for construído: por exemplo, se o cálculo de "saldo do mês" for reimplementado do zero no futuro service de dashboard em vez de reaproveitar `transactionService.calcularResumo`, os dois pontos podem divergir com o tempo (bug clássico de "dois lugares calculando a mesma coisa de jeitos ligeiramente diferentes").

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-B1 (prioridade máxima)** — Enquanto o Dashboard completo não for entregue, o destino pós-login/pós-registro/pós-OAuth deve ser uma tela **funcional** (ex.: `/transactions`), não `/dashboard`. Trivial de implementar (trocar 3 literais de string) e resolve o pior problema de primeira impressão do produto hoje.
- **RF-NOVO-B2** — Dashboard mínimo viável (MVP) reaproveitando dados já existentes, antes de construir os 9 RFs completos: card de saldo do mês (via `/transactions/resumo`), últimas 5 transações (via `/transactions?limite=5`), progresso das metas ativas (via `/metas`) e alertas de orçamento estourado (via módulo de Orçamento, já ✅). Isso cobre uma fatia de RF-007/011/012/013 com esforço de backend próximo de zero (é composição de endpoints já prontos).
- **RF-NOVO-B3** — Endpoint dedicado `GET /transactions/resumo-por-recurso` (saldo separado por Dinheiro/VA/VR/VT), para viabilizar RF-008 sem depender de agregações client-side espalhadas por múltiplas telas.

### Não funcionais

- **RNF-NOVO-B1 (UX)** — Adicionar indicador visual (badge "em breve"/ícone diferenciado) nos itens da sidebar que apontam para `InDevelopmentPage`, para não sugerir que módulos incompletos têm o mesmo nível de prontidão que os já entregues.
- **RNF-NOVO-B2 (Arquitetura)** — Ao implementar o Dashboard real, centralizar os cálculos de agregação (saldo, resumo por categoria) em um único service reaproveitado por Dashboard e Relatórios (Módulo 09, também 0%), em vez de duplicar a lógica de `transactionService.montarResumo` em dois lugares diferentes.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Trocar o destino pós-login/registro/OAuth de `/dashboard` para uma rota funcional (RF-NOVO-B1) | Resolve o problema mais visível e mais barato de corrigir do sistema inteiro — 3 linhas de código, impacto em 100% dos logins | Trivial (< 1h) |
| 2 | 🔴 Construir o Dashboard mínimo reaproveitando `/transactions/resumo`, `/transactions?limite=5`, `/metas` e alertas de orçamento (RF-NOVO-B2) | Já é a prioridade #1 sugerida pelo próprio `Analise-Produto.md`; a auditoria confirma que o custo é menor do que parece porque os dados já existem | Médio |
| 3 | 🟡 Badge visual nos itens de menu incompletos (RNF-NOVO-B1) | Reduz frustração de clique repetido em itens que não fazem nada | Baixo |
| 4 | 🟡 Endpoint de saldo por recurso (RF-NOVO-B3) | Necessário para RF-008; hoje a lógica de saldo por recurso está fragmentada entre módulos | Médio |
| 5 | 🟢 Score de saúde financeira (RF-014) e projeções (RF-107/108) | Depende do Módulo 06 (Insights), ainda não auditado — não priorizar isoladamente antes de mapear aquele módulo | A definir após Módulo 06 |

---

## ❓ Perguntas clarificadoras

1. Existe algum motivo técnico ou de produto para o destino pós-login ser fixo em `/dashboard` mesmo sabendo que a página está vazia (ex.: planejamento de lançar o dashboard "em breve" e preferir não mudar o destino duas vezes)? Se não, recomendo o ajuste do item #1 imediatamente, independentemente do resto do roadmap do módulo.
2. O "score de saúde financeira" (RF-014) já tem alguma fórmula definida em algum lugar não documentado, ou depende inteiramente do Módulo 06 (Insights) ainda ser desenhado?
3. Confirma que a prioridade é montar o Dashboard MVP reaproveitando dados de outros módulos (rápido) antes de investir nos gráficos completos (Recharts, RF-009/010), ou preferem entregar a versão completa de uma vez?

---

*Próximo módulo sugerido: 03 — Transações (núcleo financeiro, maior superfície de regras de negócio e validação).*
