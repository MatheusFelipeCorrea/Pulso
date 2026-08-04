# 🧭 Achados Transversais — afetam múltiplos módulos

> 👉 **Comece pelo [00-Sumario-Executivo.md](./00-Sumario-Executivo.md)** para a síntese completa da auditoria (25 módulos + NFRs). Este documento aqui é o índice de todos os relatórios e o detalhe técnico dos achados de infraestrutura que atravessam múltiplos módulos.
> Atualizado conforme novos módulos forem auditados. Última atualização: Módulos 19–25 + auditoria de NFRs.

---

## T1 — Existem DOIS "codebases" sobrepostos: um scaffold inicial (EN, morto) e a implementação real (PT-BR, viva)

**Severidade: Alta (higiene/risco de auditoria e onboarding, não é bug em produção — verificado que não quebra o runtime).**

O repositório contém uma migration inicial (`prisma/migrations/20260422195021_init/migration.sql`) que criou um schema **inteiro em inglês**: `users`, `transactions`, `goals`, `goal_contributions`, `trips`, `trip_expenses`, `reminders`, `vt_sales`, `streaks`, `achievements`, `user_achievements` — todos com colunas monetárias `DOUBLE PRECISION` (float).

Nenhuma migration posterior referencia essas tabelas (nem `DROP TABLE`, nem `ALTER TABLE`). A segunda migration do histórico (`20260529120000_...`) já opera diretamente sobre `configuracoes_usuario`, `tags`, `metas` — tabelas que **nunca foram criadas por nenhuma migration**. O `schema.prisma` atual é 100% em português (`Usuario`, `Transacao`, `Meta`, `ConfiguracaoUsuario`...) com `Decimal @db.Decimal(12,2)` em todo campo monetário.

Em paralelo, no código da API existe um conjunto de arquivos **em inglês, todos vazios (0 bytes) desde o "commit inicial"**, cujos nomes espelham exatamente as tabelas mortas acima:

| Domínio | Arquivos vazios (mortos) | Implementação real (viva) |
|---|---|---|
| Metas | `controllers/goalController.js`, `services/goalService.js`, `repositories/goalRepository.js`, `routes/goalRoutes.js`, `schemas/goalSchemas.js` | `metaService.js` (+ controller/routes próprios, não auditado ainda) |
| Viagens | `controllers/tripController.js`, `services/tripService.js`, `repositories/tripRepository.js`, `routes/tripRoutes.js`, `schemas/tripSchemas.js` | `viagemService.js` |
| Usuário | `controllers/userController.js`, `services/userService.js`, `repositories/userRepository.js`, `routes/userRoutes.js` | `userSyncService.js` (parcial — Módulo 10 ainda não tem tela) |
| Gamificação | `controllers/gamificationController.js`, `repositories/gamificationRepository.js`, `routes/gamificationRoutes.js` | `services/gamificationService.js` (tem conteúdo real) |
| Insights | `controllers/insightController.js`, `routes/insightRoutes.js` | `services/insightService.js` (tem conteúdo real) |
| Relatórios | `controllers/reportController.js`, `services/reportService.js`, `routes/reportRoutes.js` | nenhuma — condiz com Módulo 09 em 0% |
| Diversos | `config/swagger.js`, `middlewares/rateLimitMiddleware.js`, `utils/helpers.js` | — |
| **Testes** | **Todos** os `.spec.js` em `src/tests/controllers/`, `src/tests/services/`, `src/tests/integration/` (25 arquivos) | testes reais confirmados em `api/tests/unit/**/*.test.js` (84 arquivos, 6.800 linhas) — ver T2 |

O mesmo padrão se repete no front-end: componentes inteiros em `web/src/components/features/{auth,chatbot,dashboard,gamification,goals,groups,homepage}/**/*.jsx` estão **vazios e não importados por nenhuma página** (confirmado para o fluxo de Auth: `pages/Login.jsx` implementa o formulário inline e não referencia `components/features/auth/Login/LoginForm.jsx`).

**Por que isso importa para a auditoria inteira:**
1. **Não dá pra usar o nome do arquivo como proxy de "existe/não existe"** — preciso confirmar, módulo a módulo, qual é o arquivo realmente montado nas rotas (`api/src/routes/index.js`) antes de declarar algo ausente ou presente.
2. **RNF-015 (85%+ cobertura de testes) é uma alegação que precisa ser recalculada** — se dezenas de arquivos `.spec.js` estão vazios (0 bytes) mas existem no diretório, qualquer contagem ingênua de "arquivos de teste presentes" superestima a cobertura real. A métrica correta é `jest --coverage`, não a existência do arquivo.
3. Não é um bug de runtime: `app.js` só importa `./routes` (agregador), e nenhuma rota morta é registrada — confirmado por grep, o servidor sobe normalmente.

**Recomendação:** rodar `git rm` nos arquivos mortos (ou mover para uma pasta `_legacy/` explicitamente excluída do build) antes da próxima auditoria de módulo, para não gerar falsos negativos repetidos em todos os outros 24 relatórios.

---

## T2 — Suíte de testes real da API vive em outro diretório do que o scaffold morto

> **Correção:** a primeira versão deste achado (baseada só no Módulo 01) concluiu que a cobertura de testes da API era ~0%, por só ter encontrado os arquivos vazios `api/src/tests/{controllers,services,integration}/*.spec.js`. Investigação mais ampla (ao auditar a NFR de qualidade/RNF-015) encontrou a suíte **real**, então esta seção foi reescrita para não propagar a conclusão errada.

A API tem **dois diretórios de teste em paralelo**:
1. `api/src/tests/**/*.spec.js` — **25 arquivos, todos vazios (0 bytes)**. Fazem parte do scaffold morto do achado T1 (mesmo padrão dos controllers/services em inglês). O `jest.config.js` usa `testMatch: ['**/tests/**/*.test.js']` — note o sufixo `.test.js`, não `.spec.js` — então **esses 25 arquivos nunca são executados pelo Jest**, vazios ou não.
2. `api/tests/unit/**/*.test.js` — **84 arquivos reais, 6.800 linhas no total, nenhum vazio**. É esta a suíte que o `npm test` de fato roda, e o `jest.config.js` define `coverageThreshold.global` em 90% (lines/functions/statements) e 74% (branches) sobre um `collectCoverageFrom` que inclui `src/services/**`, `src/utils/**`, `src/jobs/**`, `src/middlewares/**` (não inclui `src/controllers/**`/`src/routes/**`).

**O que isso muda:** a alegação de RNF-015 (~95% linhas/~94% statements) é **plausível e não foi refutada** por esta auditoria — ao contrário do que uma leitura apressada dos arquivos `.spec.js` vazios sugeriria. Dito isso, dois pontos concretos valem seguimento (detalhados na auditoria de NFR):
- `gamificationService.js`, `insightService.js`, `googleCalendarService.js` e `googleCalendarSyncService.js` são **explicitamente excluídos** do `collectCoverageFrom` (via `!src/services/...`) — todos com conteúdo real e não triviais, então o "95%" é medido sobre um subconjunto que já exclui essas peças.
- Não foi encontrado teste dedicado para `viagemService.js` (Módulo 05) na suíte real — **`purchasePlanningService.test.js` adicionado (ago/2026)**; `viagemService` ainda sem teste dedicado.

**Recomendação:** os 25 arquivos `.spec.js` vazios deveriam ser removidos (fazem parte da limpeza de T1) — sua mera existência já causou uma leitura incorreta nesta própria auditoria, o que é evidência direta do risco descrito em T1.

---

## T3 — Tokens de sessão em `localStorage`, não em cookie `httpOnly` como a documentação afirma

> **✅ Corrigido (2026-06):** cookies `httpOnly` (`pulso_access` / `pulso_refresh`) no backend; front com `withCredentials`; OAuth via token de exchange de curta duração.

Ver detalhe em [01-Autenticacao.md](./01-Autenticacao.md#3-diagnóstico-de-regras-de-negócio-e-validações). ~~`RN-135` e o Roadmap (`Fase 3.2`) documentam `httpOnly cookie`; o código usava `localStorage`.~~ Implementação alinhada à documentação.

---

## T5 — Caches e contadores em memória (`Map`/`MemoryStore`) não sobrevivem entre invocações serverless

**Severidade: Média-Alta (afeta corretude de rate-limit e eficácia de cache; não derruba o sistema).**

> **⏸️ Decisão (2026-06):** mantido como **best effort** por ora. Redis/Upstash recomendado quando houver tráfego relevante, incidente de abuso ou exigência de compliance — não bloqueia MVP.

Encontrado duas vezes até agora, em módulos diferentes, o mesmo padrão: código que assume um processo Node de longa duração, mas roda como função serverless na Vercel (confirmado em `Modulos/Grupos.md` e `api/vercel.json`/`database.js`, que já documentam isso para o caso do chat/WebSocket):

1. **`authRateLimit.js`** (Módulo 01) — `express-rate-limit` com `MemoryStore` padrão (implícito, nenhum store externo configurado).
2. **`awesomeApiProvider.js:5-23`** (Módulo 05) — `const cache = new Map()` a nível de módulo, com TTL de 5 minutos, para cotações de moeda.

Em ambos os casos, o estado vive na memória de uma instância de função serverless específica. Como a Vercel pode escalar/reciclar instâncias a qualquer momento (e cada cold start começa com um `Map`/contador zerado), **o comportamento real em produção é bem menos consistente do que o código sugere isoladamente**:
- O rate-limit de auth (5 req/min) pode, na prática, permitir bem mais que 5 requisições por IP em 1 minuto se elas caírem em instâncias diferentes.
- O cache de cotação de moeda (5 min) pode não estar "quente" na maioria das requisições, fazendo a API bater na AwesomeAPI (serviço gratuito, com limites) bem mais do que o pretendido — o que é exatamente o risco que a nota do README ("evitando dependência de API paga de cotação tick-a-tick") diz querer evitar.

**Recomendação:** ao revisar performance/confiabilidade (RNF-001/004/007), avaliar mover esses dois casos (e quaisquer outros que a auditoria encontrar adiante) para um cache/rate-limit compartilhado externo (ex.: Upstash Redis, que tem free tier e integra bem com Vercel) — ou, no mínimo, documentar explicitamente que esses mecanismos são "best effort" em produção serverless, não garantias.

---

## T4 — Concorrência: múltiplos 401 simultâneos podem deslogar uma sessão válida

> **✅ Corrigido (2026-06):** mutex em `web/src/services/api.js` deduplica `POST /auth/refresh`.

Ver detalhe em [01-Autenticacao.md](./01-Autenticacao.md#3-diagnóstico-de-regras-de-negócio-e-validações). ~~Como o refresh token é rotativo/single-use e o interceptor do axios não tinha mutex/deduplicação~~ — resolvido.

---

## T6 — Padrão recorrente: falha de efeito colateral opcional apaga o recurso principal recém-criado

**Severidade: Média-Alta (perda de dados do usuário; já confirmado em 2 módulos independentes).**

> **✅ Corrigido (2026-06)** nos dois casos confirmados abaixo.

Duas vezes até agora, em módulos sem relação direta um com o outro, o mesmo anti-padrão apareceu: uma operação principal é bem-sucedida (criar conta, criar lembrete), mas um efeito colateral **opcional/auxiliar** falha (enviar email de verificação, sincronizar com Google Calendar) — e o código reagia **excluindo o recurso principal recém-criado** em vez de preservá-lo e apenas sinalizar a falha do efeito colateral:

1. **Módulo 01 (Auth):** ~~`registerUser` deleta o usuário se o envio do email de verificação falhar~~ → conta mantida com `emailPendente: true`.
2. **Módulo 07 (Lembretes):** ~~`criarLembrete` deleta o lembrete se a sincronização com o Google Calendar falhar~~ → lembrete preservado com `sincronizado: false`.

Em ambos os casos, existe uma versão "correta" do mesmo tipo de tratamento em outro fluxo do mesmo módulo (reenvio de verificação não deleta a conta; edição de lembrete não deleta o lembrete) — sugerindo que não é uma escolha deliberada de arquitetura, e sim um padrão que se repete por hábito/cópia em fluxos de criação.

**Recomendação:** ao revisar os próximos módulos, verificar especificamente esse padrão em qualquer fluxo de criação que tenha um efeito colateral externo (envio de email, chamada a API de terceiros, notificação). Regra geral sugerida: falha em efeito colateral opcional nunca deveria reverter a operação principal — deveria apenas sinalizar o estado de "pendente"/"não sincronizado" e permitir retry manual.

---

## T7 — Padrão recorrente: regras de "só pode existir 1" ou "saldo suficiente" checadas na aplicação, nunca no banco

**Severidade: Média (nenhuma ocorrência confirmada em produção; risco estrutural presente em pelo menos 4 módulos).**

Quarta variação do mesmo anti-padrão de concorrência encontrada de forma independente em módulos sem relação entre si — uma regra de unicidade ou de saldo é garantida só por um `SELECT` de checagem antes de um `INSERT`/`UPDATE`, sem transação atômica nem constraint de banco:

1. **Módulo 01 (Auth):** ~~verificação de email duplicado antes de criar usuário — e, pior, o erro de constraint (`P2002`) resultante de uma corrida não é tratado~~ → **✅ P2002 → 409** implementado.
2. **Módulo 05 (Viagens):** vínculo 1:1 Viagem↔Meta — **✅ `@unique(metaId)`** + migration + P2002→409.
3. **Módulo 08 (VT):** ~~checagem de saldo~~ → **✅ transação serializável** — impede estouro de saldo VT (RN-044).
4. **Módulo 13 (Grupos):** "uma viagem por grupo" — **✅ `@unique(grupoId)`** em `ViagemGrupo`; metas ativas — **✅ transação Serializable** em `criarMetas`.

> **Distinção importante:** **VT / VA / VR** = saldo de benefício com **piso zero** (não se gasta além do creditado). **DINHEIRO** = saldo de conta pode ser **negativo de propósito** (receitas − despesas em `transactionService`; cheque especial, cartão, etc.). A urgência de transação atômica em benefícios é **integridade do ledger**, não “evitar vermelho na conta”. VA/VR ainda não checam saldo ao lançar despesa — só categoria (`recursoCategoriaRules`).

**Recomendação:** priorizar por tipo de regra — (1) **benefícios** que não podem estourar (VT ✅; VA/VR se/quando houver módulo de saldo); (2) **conta corrente** — negativo permitido, sem bloqueio; (3) **unicidade** Viagens/Grupos — baixo risco, documentar ou 409 basta no MVP.

---

## Índice de módulos auditados

| Módulo | Documento | Status da auditoria |
|---|---|---|
| 01 — Autenticação | [01-Autenticacao.md](./01-Autenticacao.md) | ✅ Concluído |
| 02 — Dashboard | [02-Dashboard.md](./02-Dashboard.md) | ✅ Concluído |
| 03 — Transações | [03-Transacoes.md](./03-Transacoes.md) | ✅ Concluído |
| 04 — Metas Financeiras | [04-Metas-Financeiras.md](./04-Metas-Financeiras.md) | ✅ Concluído |
| 05 — Viagens e Moedas | [05-Viagens-e-Moedas.md](./05-Viagens-e-Moedas.md) | ✅ Concluído |
| 06 — Insights e Chatbot | [06-Insights-e-Chatbot.md](./06-Insights-e-Chatbot.md) | ✅ Concluído |
| 07 — Lembretes e Google Agenda | [07-Lembretes-e-Google-Agenda.md](./07-Lembretes-e-Google-Agenda.md) | ✅ Concluído |
| 08 — Vale Transporte | [08-Vale-Transporte.md](./08-Vale-Transporte.md) | ✅ Concluído |
| 09 — Relatórios | [09-Relatorios.md](./09-Relatorios.md) | ✅ Concluído |
| 10 — Perfil e Configurações | [10-Perfil-e-Configuracoes.md](./10-Perfil-e-Configuracoes.md) | ✅ Concluído |
| 11 — Gamificação | [11-Gamificacao.md](./11-Gamificacao.md) | ✅ Concluído |
| 12 — Homepage | [12-Homepage.md](./12-Homepage.md) | ✅ Concluído |
| 13 — Grupos | [13-Grupos.md](./13-Grupos.md) | ✅ Concluído |
| 14 — Orçamento Mensal | [14-Orcamento-Mensal.md](./14-Orcamento-Mensal.md) | ✅ Concluído |
| 15 — Divisão de Despesas | [15-Divisao-de-Despesas.md](./15-Divisao-de-Despesas.md) | ✅ Concluído |
| 16 — Calendário Financeiro | [16-Calendario-Financeiro.md](./16-Calendario-Financeiro.md) | ✅ Concluído |
| 17 — Dívidas Pessoais | [17-Dividas-Pessoais.md](./17-Dividas-Pessoais.md) | ✅ Concluído |
| 18 — Planejamento de Compra | [18-Planejamento-de-Compra.md](./18-Planejamento-de-Compra.md) | ✅ Concluído |
| 19–25 — Módulos planejados (jul/2026) | [19-25-Modulos-Planejados.md](./19-25-Modulos-Planejados.md) | ✅ Concluído (auditoria de escopo, sem código) |
| Requisitos Não Funcionais (transversal) | [20-Requisitos-Nao-Funcionais.md](./20-Requisitos-Nao-Funcionais.md) | ✅ Concluído |
