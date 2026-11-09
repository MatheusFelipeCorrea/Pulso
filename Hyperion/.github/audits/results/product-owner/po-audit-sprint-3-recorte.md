# Auditoria PO — Pulso (produto completo, recorte Sprint 3)

| Campo | Valor |
| --- | --- |
| Data | 2026-09-30 |
| Skill | `po-audit` |
| Prompt | `Hyperion/.github/audits/prompts/product-owner.md` |
| Overlay | `null` (`.github/project.yml`) |
| Locale | pt-BR |
| Escopo | Produto completo (Web + API + Flutter), com ênfase no recorte Sprint 3 vs backlog |
| Modo | Somente leitura; nenhum código ou doc de produto foi alterado |

---

## 1. Resumo executivo

O recorte Sprint 3 (auth, transações, metas, viagens/moedas e REST no Flutter) **existe no código** e, na maior parte, corresponde a RF-001–006, RF-016–034, RF-036–038 e RF-040–047. O problema de produto não é “falta de tela no núcleo”: é **rastreabilidade e recorte**. Status em `docs/3.requisitos.md` foi atualizado para RF-016–047 e RF-140, mas ainda há checks `[x]` em requisito de plataforma *web e mobile* incompleto no Flutter, telas e CTAs que antecipam backlog, e um contrato de tempo real (Socket.IO) que **não está ligado em nenhum cliente**.

Riscos principais para o usuário agora:

1. **Jornadas visíveis e quebradas** — Grupos no Flutter chama `/api/grupos` com a rota comentada; Perfil/Configurações na web apontam para rotas inexistentes; o pós-login web cai num dashboard stub.
2. **Promessa vs entrega** — a landing vende Grupos e Calendário sem badge “Em breve”; Insights aparece como “Beta” sem inbox e sem Gemini.
3. **Contrato RF-140 / modelagem** — Socket.IO está desligado na API, não há uso em `web/src` e não há dependência no Flutter.

**Conclusão:** o recorte Sprint 3 é entregável como “núcleo financeiro pessoal (web + Flutter) sem dashboard, insights, grupos nem tempo real”, desde que a equipe **esconda ou badgeie** o que não está na API, **corrija checks/status** e **decida** se grupos são gratuitos ou premium. Não está pronto para ser apresentado como o produto da visão (`docs/2.nosso_produto.md`: tempo real, IA, hub colaborativo).

**Contagem de achados:** 2 Crítica · 7 Alta · 10 Média · 4 Baixa (23 no total).

---

## 2. Escopo e contexto detectado

### Fontes

| Fonte | Path | Uso nesta auditoria |
| --- | --- | --- |
| Contrato | `.github/project.yml` | Apps, docs, locale, outputs, incertezas |
| Requisitos | `docs/3.requisitos.md` | RF/RNF/FUT + coluna Status (verificar vs código) |
| Visão | `docs/2.nosso_produto.md` | Personas e “é / não é” |
| Modelagem | `docs/4.modelagem.md` | Arquitetura, atores, Socket.IO, premium |
| Wireframes | `docs/5.wireframe.md` + `docs/prototipos/` | Recorte auth / transações / metas / viagens |
| Memória | `Hyperion/.github/memory/PROJECT.md` | Propósito, stack, restrição Flutter Sprint 3 |
| Cards | `Hyperion/.github/cards/` (épicos 001–016) | Status de backlog vs código |
| Código | `Codigo/Pulso/{api,web,mobile}` | Comportamento observável |

### Stack e layout

Monorepo: API Node/Express/Prisma/PostgreSQL; Web React/Vite; Mobile Flutter. Overlay de auditoria: N/A.

### Recorte Sprint 3 — verificação vs Status em `docs/3.requisitos.md`

| IDs | Status declarado | Verificação no código |
| --- | --- | --- |
| RF-001, RF-003–006 | Implementado (web + Flutter) | Confirmado: rotas auth, cookies httpOnly (web), Bearer + secure storage (Flutter) |
| RF-002 | Web ok; Google nativo sem prova em device | Código nativo existe (`google_sign_in`); **sem evidência de device nesta auditoria** |
| RF-016–028 | Implementado (web + Flutter) | Confirmado: API `/transacoes`, job recorrente, VA/VR, transferência, sugestão RF-028 |
| RF-029–034, RF-036 | Implementado (web + Flutter) | Confirmado: `/metas`, aportes, progresso, reserva de emergência |
| RF-035 | Parcial; `/api/notificacoes` comentada | **Confirmado** — grava `META_ATINGIDA`, rota desligada |
| RF-037–038, RF-040–047 | Implementado (web + Flutter) | Confirmado: catálogo, conversor, favoritas, CRUD viagem, `metaId` |
| RF-039 | Check `[x]` “API + web; Flutter ainda sem gráfico” | **Mismatch de check:** API + `TripExchangeChart` na web; Flutter **sem** `/moedas/historico` |
| RF-140 | Parcial; Socket.IO ainda não | **Confirmado e mais amplo:** Socket.IO também está desligado na API e não é usado na web |
| RF-007–015, RF-048–079, RF-084–139 | Backlog / Pendente | Confirmado como não entregues (exceto trechos órfãos abaixo) |
| RF-071, RF-080–083 | Backlog / Pendente | **Código à frente do status:** tema claro/escuro e landing pública existem |
| RNF-002, RNF-011–014 | Implementado | Confirmado (bcrypt 12, camadas nos módulos ativos, JWT 15m/7d, CORS) |
| RNF-016 | Pendente | Persistência Decimal no Prisma; **cálculo em `Number()` (IEEE-754)** |

### Itens N/A nesta auditoria

- Runtime de produção (HTTPS público, 500 usuários, 95% uptime, backup Neon) — RNF-001, RNF-003, RNF-007–009: não observáveis sem URL.
- Overlay de domínio: ausente.
- Admin operacional da história em `docs/4.modelagem.md`: não há app de administrador no repositório.

### Limitação

Não houve execução de suíte de testes nem prova em dispositivo físico. Conclusões de “implementado” baseiam-se em rotas, serviços, UI e testes unitários versionados.

---

## 3. Achados priorizados

### PO-001 — Flutter expõe Grupos contra API desligada

- **Evidência:** `Codigo/Pulso/api/src/routes/index.js:17` e `:39` (`grupoRoutes` comentado); `Codigo/Pulso/mobile/lib/features/groups/data/group_repository.dart:28-31` (`GET /grupos`); `Codigo/Pulso/mobile/lib/core/widgets/app_shell.dart:229-234` (item de navegação); `Codigo/Pulso/mobile/lib/features/groups/screens/groups_screen.dart:52-54` (aviso de Sprint, mas a tela ainda chama a API); `docs/3.requisitos.md:148-162` (RF-084–098 Pendente).
- **Constatação:** o app nativo tem fluxo criar/listar/entrar/excluir grupos. A API não monta `/api/grupos`. O client web (`Codigo/Pulso/web/src/services/grupoService.js:3-5`) também fala `/grupos`, mas a sidebar oculta o item (`Codigo/Pulso/web/src/config/sidebarNavigation.js:33`).
- **Impacto:** jornada visível no mobile termina em erro; desalinha recorte Sprint 3 (`docs/5.wireframe.md:12` lista auth → transações, metas, viagens — sem grupos).
- **Severidade:** Crítica
- **Confiança:** Alta
- **Recomendação:** remover Grupos da navegação Flutter (ou feature-flag) até ligar a API; não tratar RF-084+ como “parcial por ter tela”.
- **Critério de aceite:** usuário autenticado no Flutter não vê item Grupos, **ou** `GET /api/grupos` responde 2xx autenticado e a lista funciona.

### PO-002 — Landing apresenta Grupos e Calendário como disponíveis

- **Evidência:** `Codigo/Pulso/web/src/components/features/landing/landingData.js:77-88` (Grupos e Calendário **sem** `badge`); contraste com Dashboard (`:49` “Em breve”) e Chatbot (`:74` “Em breve”); RF-084–098 e RF-112–116 Pendente em `docs/3.requisitos.md:148` e `:191`.
- **Constatação:** a homepage pública descreve módulos de backlog como se já existissem. Insights usa badge “Beta” (`landingData.js:68`), o que reforça a leitura de que Grupos/Calendário já estão no produto.
- **Impacto:** expectativa falsa para personas (Lucas: grupos/república; Isabella: calendário/lembretes) e risco acadêmico/comercial de overpromise.
- **Severidade:** Crítica
- **Confiança:** Alta
- **Recomendação:** badge “Em breve” em Grupos, Calendário e qualquer módulo sem rota autenticada; alinhar copy à Sprint 3.
- **Critério de aceite:** na landing, só módulos com jornada autenticada funcional ficam sem badge de indisponibilidade.

### PO-003 — Pós-login web cai em dashboard stub (RF-007–015)

- **Evidência:** `Codigo/Pulso/web/src/config/defaultAuthenticatedRoute.js:1-2` (`/dashboard`); `Codigo/Pulso/web/src/pages/DashboardPage.jsx:3-13` (stub textual); `Codigo/Pulso/api/src/routes/index.js:20` e `:42` (`dashboardRoutes` comentado); `Hyperion/.github/cards/epics/PULSO-EPIC-002.md:3` e `:23` (Backlog; destino padrão `/dashboard`); `docs/3.requisitos.md:26-34` (RF-007–015 Pendente).
- **Constatação:** após login a web abre um placeholder. O Flutter, por contraste, inicia em `/transactions` (`Codigo/Pulso/mobile/lib/core/router/app_router.dart:35`) e o “Início” só mostra resumo de transações (`home_screen.dart:49-59`) — não os gráficos/saldos por recurso de RF-007–010.
- **Impacto:** primeira tela autenticada na web não entrega o valor da visão (“visão unificada”); usuário precisa descobrir Transações pelo menu.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** até EPIC-002, apontar `DEFAULT_AUTHENTICATED_ROUTE` para `/transactions` (como o Flutter) e tratar `/dashboard` como “em breve” ou omitir da sidebar.
- **Critério de aceite:** pós-login web abre uma tela com lista/resumo de transações **ou** dashboard com RF-007–008 verificáveis.

### PO-004 — RF-035: notificação gravada sem canal de leitura

- **Evidência:** `Codigo/Pulso/api/src/services/metaService.js:332-338` (`META_ATINGIDA`); `Codigo/Pulso/api/src/routes/index.js:12` e `:34` (`notificationRoutes` comentado); não há `notificationRoutes.js` / controller em `api/src`; `docs/3.requisitos.md:64` (Status Parcial correto; Check `[ ]` correto).
- **Constatação:** o serviço persiste notificação no Prisma; o usuário não tem REST nem UI para listar/marcar lida. `transactionService` e `insightService` também gravam notificações (`transactionService.js:60`, `insightService.js:55`) para o mesmo buraco.
- **Impacto:** RF-035 (desejável, Sprint 3) não é verificável como “notificar o usuário”; dados órfãos na tabela `notificacoes`.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** ligar `GET /api/notificacoes` + indicador na web/Flutter **ou** não criar linhas até existir inbox; não marcar RF-035 como feito só com insert no banco.
- **Critério de aceite:** ao concluir meta, o usuário autenticado vê a mensagem em inbox in-app (web e mobile) sem consultar o banco.

### PO-005 — RF-140: Socket.IO ausente na API, na Web e no Flutter

- **Evidência:** `Codigo/Pulso/api/src/server.js:8` e `:90-91` (`initSocket` comentado; “módulo ausente”); pasta `api/src/socket` inexistente; `Codigo/Pulso/web/src` sem `socket` (dependência só em `web/package.json:37`); `Codigo/Pulso/mobile/pubspec.yaml:9-22` sem cliente Socket.IO; `docs/3.requisitos.md:244`; `docs/4.modelagem.md:13` (mobile “WebSocket para tempo real”).
- **Constatação:** o Status de RF-140 descreve “Socket.IO ainda não” no Flutter, o que sugere que a web já compartilha o canal. Na prática o canal **não está inicializado** nem consumido. Chat de grupo (RF-098) e modelagem C4 ficam no papel.
- **Impacto:** qualquer demo de “tempo real” falha; Vercel serverless (`server.js:93`) é restrição adicional não refletida como decisão de produto em RF-140.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** ou (a) reduzir RF-140 a “mesmo REST” até haver host long-running, ou (b) implementar Socket.IO nos três lados com critério de aceite de evento observado. Atualizar modelagem.
- **Critério de aceite:** documento de RF-140 descreve o contrato real (REST-only **ou** evento Socket.IO ponta a ponta em web e Flutter).

### PO-006 — RF-039 marcado `[x]` sem gráfico no Flutter

- **Evidência:** `docs/3.requisitos.md:73` (Check `[x]`, plataforma *web e mobile*); `Codigo/Pulso/web/src/pages/TripsPage.jsx:242` + `TripExchangeChart.jsx:63-82`; `Codigo/Pulso/api/src/routes/moedaRoutes.js:32`; `Codigo/Pulso/mobile/lib/features/currency/data/currency_repository.dart` (catálogo, converter, favoritas — **sem** historico); `mobile/test/currency_test.dart:25` (só conversão).
- **Constatação:** o texto de Status admite a lacuna Flutter, mas o check trata o RF como implementado. Plataforma do RF é web **e** mobile.
- **Impacto:** fechamento de Sprint 3 / card FEAT-110 pode parecer completo; Matheus (persona viajante) no app não vê histórico de cotação.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** Check `[ ]` até o gráfico Flutter **ou** alterar plataforma do RF para _web_ neste recorte, com RF-filho mobile.
- **Critério de aceite:** Flutter exibe gráfico equivalente ao da web via `GET /moedas/historico`, **ou** o RF deixa de exigir mobile.

### PO-007 — Grupos “Premium” nos cards vs produto 100% gratuito

- **Evidência:** `Hyperion/.github/cards/epics/PULSO-EPIC-008.md:22` e `:38` (“Premium no escopo TI5”; `requirePremium`); `docs/3.requisitos.md:282` e `docs/2.nosso_produto.md:19` (produto gratuito); `docs/4.modelagem.md:44` (“módulo de grupos (premium)”); `.github/project.yml:37`.
- **Constatação:** há duas regras de negócio incompatíveis. Código de grupos na API nem está ligado; o card já assume gate premium.
- **Impacto:** se grupos forem premium, contradiz a visão e o README; se forem gratuitos, o card e a modelagem estão errados. Bloqueia priorização da Sprint seguinte.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** decisão explícita (ADR / `DECISIONS.md`): grupos no plano gratuito da disciplina **sem** `requirePremium`, e correção da modelagem.
- **Critério de aceite:** um único documento normativo (requisitos **ou** ADR) define se grupos exigem plano pago; cards e `docs/4` repetem essa decisão.

### PO-008 — Perfil e Configurações são becos sem saída na web

- **Evidência:** `Codigo/Pulso/web/src/config/sidebarNavigation.js:42-43`; `Codigo/Pulso/web/src/components/layouts/UserMenu/UserMenu.jsx:76-94`; `Codigo/Pulso/web/src/App.jsx:66-76` (rotas autenticadas: dashboard, transactions, goals, trips — **sem** profile/settings); `App.jsx:76` (`*` → `/`); RF-068–072 Pendente (`docs/3.requisitos.md:122-126`).
- **Constatação:** clicar Perfil ou Configurações no layout autenticado cai no catch-all e redireciona à landing (ou quebra a sessão percebida).
- **Impacto:** RF-068/069/072 inacessíveis e UX de “app quebrado” no recorte atual; o toggle de tema no mesmo menu **funciona** (ver PO-010), o que aumenta a confusão.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** desabilitar links com tooltip “Em breve” **ou** criar páginas mínimas; não apontar para rotas sem `Route`.
- **Critério de aceite:** Perfil/Configurações não navegam para página inexistente; usuário permanece no app autenticado.

### PO-009 — “IA / Insights Beta” sem Gemini e sem superfície para o usuário

- **Evidência:** `insightService.js:49-64` (`geradoPor: 'regras'`; `linkAcao: '/budget'`); `env.js:55-56` (Gemini só `GEMINI_API_KEY_PDF` / modelo PDF); `landingData.js:21-24` e `:63-68` (“IA Inteligente”, “IA Insights” Beta); `docs/2.nosso_produto.md:11` (insights via IA); privacidade web menciona Gemini para insights/chatbot (`web/src/content/legal/privacyPolicy.js:20`); RF-048–056 Pendente; `/budget` não existe em `App.jsx`.
- **Constatação:** o “insight” é uma notificação heurística do maior gasto do mês, gravada no mesmo canal morto de PO-004, com link para orçamento inexistente. Não há Gemini nos serviços ativos de insight/chat.
- **Impacto:** copy de produto e política de privacidade prometem IA que o recorte não entrega; badge Beta é enganoso.
- **Severidade:** Alta
- **Confiança:** Alta
- **Recomendação:** rebaixar copy para “em breve” até RF-048+; ou entregar inbox + texto honesto (“alerta por regras”). Não citar Gemini na privacidade até existir chamada.
- **Critério de aceite:** landing/privacidade só mencionam Gemini/insights se houver API + UI verificáveis; senão, badge “Em breve” e texto de política sem esse processamento.

### PO-010 — RF-071 (tema claro/escuro) implementado e ainda Backlog

- **Evidência:** `docs/3.requisitos.md:126` (RF-071 Pendente); `UserMenu.jsx:96-118`; `PublicHeader.jsx:46-64`; `ThemeProvider.jsx:9-16`; Flutter `app_shell.dart:243-251` + `theme_controller.dart`.
- **Constatação:** alternância claro/escuro está na web (landing e app) e no Flutter. O RF permanece Backlog/`[ ]`.
- **Impacto:** rastreabilidade invertida (código sem crédito no backlog); risco de reimplementar.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** marcar RF-071 Implementado (web + Flutter) com evidência das telas do recorte.
- **Critério de aceite:** coluna Status/Check de RF-071 reflete o toggle persistido nos dois clientes.

### PO-011 — RF-080–083 / EPIC-007 Backlog com landing já no ar

- **Evidência:** `docs/3.requisitos.md:139-142`; `Hyperion/.github/cards/epics/PULSO-EPIC-007.md:3` (Backlog); `LandingPage.jsx:18-48`; `PublicHeader.jsx:72-86` (Entrar + Começar Grátis); `landingData.js:43-88` (seções de módulos).
- **Constatação:** homepage pública, CTAs e paleta escura/clara existem. RF-082 pede seções dos módulos — a página tem, mas várias são fictícias (PO-002, PO-009). RF-083 (responsivo 360–1920 / Vital Purple) não foi medido em viewport nesta auditoria.
- **Impacto:** cards e apostila subestimam a entrega web; ao mesmo tempo RF-082 pode ser marcado cedo demais se as seções mentem disponibilidade.
- **Severidade:** Média
- **Confiança:** Média (RF-083 visual não medido em todos os breakpoints)
- **Recomendação:** atualizar EPIC-007 e RF-080/081 para Implementado; RF-082 só após badges honestos; RF-083 após checklist de largura.
- **Critério de aceite:** status dos RF-080–081 = Implementado; RF-082 só `[x]` com badges corretos.

### PO-012 — Modelo de dados e restrições 3.3 divergem (gamificação, VT)

- **Evidência:** `docs/3.requisitos.md:285` (fora de escopo: vale-transporte, gamificação); `schema.prisma:563-657` (`VendaVt`, `UsoVt`, `Sequencia`, `Conquista`, `DesafioMensal`); `docs/4.modelagem.md:76` (ER inclui grupos, dívidas, etc.).
- **Constatação:** o Prisma do recorte carrega domínio de backlog e de itens explicitamente excluídos. Não há serviços ativos para gamificação neste `api/src/services`.
- **Impacto:** migrações/seed mais pesados; risco de alguém “ligar” VT/gamificação contra a restrição da disciplina.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** documentar como dívida de schema (tabelas reservadas) **ou** remover modelos fora de escopo em migração futura; não tratar como requisitos ativos.
- **Critério de aceite:** `docs/3.3` e o schema ou um ADR listam o que é “reservado / não implementar no TI5”.

### PO-013 — RNF-016: Decimal no banco, `Number` na regra

- **Evidência:** `docs/3.requisitos.md:272` (RNF-016 Pendente; “nunca float”); `schema.prisma:344` (`Decimal(12,2)` em `Transacao.valor`); `transactionService.js:19` (`Math.round(Number(value) * 100) / 100`); `metaService.js:323` (`Number(meta.valorAtual)`); Flutter `CurrencyRepository.converter` usa `double` (`currency_repository.dart:30`).
- **Constatação:** armazenamento atende a parte “persistir decimal”; a regra de negócio e o mobile usam IEEE-754. Status Pendente é mais honesto que “implementado”.
- **Impacto:** rateios, câmbio e aportes podem divergir em centavos; RNF essencial do recorte de viagens/metas.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** ou adotar decimal string/`Prisma.Decimal` em toda a API e centavos no Flutter, ou reescrever RNF-016 para “persistência Decimal + arredondamento half-up em 2 casas no service”, se a equipe aceitar esse risco.
- **Critério de aceite:** RNF-016 verificável (tipo na API + testes de arredondamento) **ou** texto do RNF alinhado ao `round2` atual.

### PO-014 — RNF-004 (100 req/min por usuário) ≠ rate limit real

- **Evidência:** `docs/3.requisitos.md:261`; `authRateLimit.js:8-19` (5 req/min **por IP por rota** de auth); não há `rateLimitMiddleware` ativo nas rotas de negócio (referência morta em `jest.config.js:31`).
- **Constatação:** há proteção de abuso em auth, não o teto global do RNF. EPIC-001 documenta 5/min por rota (`PULSO-EPIC-001.md:39`), o que é outra regra.
- **Impacto:** RNF essencial não é testável como escrito; risco de auditoria de segurança/disciplina.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** reescrever RNF-004 para o desenho atual (auth 5/min/IP/rota) **ou** implementar limiter autenticado 100/min.
- **Critério de aceite:** texto do RNF = comportamento medido (header `RateLimit-*` no caso documentado).

### PO-015 — Visão e modelagem descrevem tempo real e IA que o recorte não tem

- **Evidência:** `docs/2.nosso_produto.md:9-11`; `docs/4.modelagem.md:13` e `:54` (Socket.IO, ISocket, Gemini); `docs/3.requisitos.md:297` (mecanismos: Gemini + Socket.IO).
- **Constatação:** documentos de produto/arquitetura falam do alvo completo como se fosse o sistema atual. A coluna Status dos RF de insights/chat/grupos está mais honesta que a prosa da modelagem.
- **Impacto:** leitores da apostila (banca/professores) inferem capacidades Sprint 3 inexistentes.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** na modelagem, marcar tempo real/IA/grupos como “alvo / não no recorte Sprint 3” sem reescrever os diagramas nesta auditoria (fora de escopo editar docs).
- **Critério de aceite:** um parágrafo de recorte na apostila lista o que **não** está ligado (Socket.IO, Gemini, `/grupos`, dashboard).

### PO-016 — Cards Hyperion desatualizados frente ao código

- **Evidência:** EPIC-003/004/005 `status: In Revision` com resumo “API + Web + Flutter mergeados”; EPIC-007 Homepage `Backlog` com landing no código; EPIC-002 Dashboard ainda Backlog (ok) mas destino `/dashboard` já é default; incertezas em `project.yml:91-96` batem com o código (grupos, Socket.IO, deploy).
- **Constatação:** o kit de cards não é fonte confiável de “feito / não feito” sem cruzar o repo.
- **Impacto:** planejamento de Sprint 4 a partir dos cards superestima homepage como não feita e pode subestimar dívida de grupos no Flutter.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** sincronizar status dos épicos 001–005 e 007 com o recorte verificado; manter 002/008+ em Backlog.
- **Critério de aceite:** status do card = mesma leitura que a coluna Status do RF correspondente.

### PO-017 — Contrato de transação ainda aceita VT no schema, API rejeita depois

- **Evidência:** `transactionSchemas.js:4` (`VT` no enum); `recursoCategoriaRules.js:59-60` (throw 400); `categoryBeneficioGroups.js:1` e `:19`; restrição `docs/3.requisitos.md:285`.
- **Constatação:** o cliente pode enviar VT e receber erro de negócio, não de validação Zod. Flutter também trata VT (`transaction_rules.dart:38`).
- **Impacto:** RF-026 Status cita “VT rejeitado” (ok), mas o contrato OpenAPI/Zod ainda anuncia o recurso; fora de escopo vaza para o formulário se a UI listar VT.
- **Severidade:** Média
- **Confiança:** Média (não auditada cada opção de select da UI)
- **Recomendação:** tirar VT do enum público de transação; manter só em utils de importação futura (RF-135).
- **Critério de aceite:** `POST /transacoes` com `recurso: VT` falha em 400 na validação de schema; UI não oferece VT.

### PO-018 — Destino autenticado Web ≠ Flutter

- **Evidência:** web `defaultAuthenticatedRoute.js:2` → `/dashboard`; Flutter `app_router.dart:35` → `/transactions`; redirect `/home` → `/dashboard` (`app_router.dart:53`).
- **Constatação:** dois clientes, duas “casas” pós-login; a web é a pior (stub).
- **Impacto:** testes de aceite e roteiro de demo divergem; RF-140 (“mesmo produto”) falha na jornada inicial.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** unificar em `/transactions` até existir dashboard real.
- **Critério de aceite:** web e Flutter abrem a mesma capacidade de núcleo após login (lista de transações ou dashboard completo).

### PO-019 — `modoUso` na sessão sem RF-073/onboarding

- **Evidência:** `authService.js:206-221`; Flutter `user_model.dart:8` default `'CLT'`; badges em `UserMenu.jsx:23` e `home_screen.dart:35`; RF-073–074 e RF-130–132 Pendente.
- **Constatação:** a UI mostra badge de perfil (CLT/estagiário/PJ) sem o usuário ter escolhido modo no onboarding/configurações do recorte.
- **Impacto:** regra implícita (default CLT) que deveria ser requisito; RF-074 (ocultar VA/VR) não se aplica.
- **Severidade:** Média
- **Confiança:** Alta
- **Recomendação:** não exibir badge como se o modo fosse escolhido **ou** puxar RF-073 para o recorte com seletor mínimo.
- **Critério de aceite:** ou o usuário define modo de uso, ou a UI não afirma um modo além de “não configurado”.

### PO-020 — RNF-015 (85% serviços) não é o que o Jest mede

- **Evidência:** `docs/3.requisitos.md:271`; `jest.config.js:7-44` (`collectCoverageFrom` exclui `insightService`, `viagemService`, `dashboardService`, `grupoService`, etc.; threshold global lines 87% **nesse recorte de arquivos**). Flutter tem testes pontuais (`mobile/test/*.dart`), sem meta 85%.
- **Constatação:** a meta do RNF fala “camadas de serviço”; a ferramenta ignora vários `*Service.js` (alguns nem existem mais). Viagens — núcleo Sprint 3 — está excluída (`viagemService.js`).
- **Impacto:** “85%” pode ser reportado sem cobrir o serviço de viagens.
- **Severidade:** Baixa
- **Confiança:** Alta (config); Baixa quanto ao percentual real desta branch (suíte não executada)
- **Recomendação:** incluir `viagemService` / `moedaService` / `metaService` na cobertura; separar meta Flutter.
- **Critério de aceite:** relatório de coverage inclui os services do recorte Sprint 3 e atinge o % do RNF **ou** o RNF cita os globs reais.

### PO-021 — RF-002 Google nativo: código sem prova de device

- **Evidência:** `docs/3.requisitos.md:16`; `google_auth_client.dart:13-36` e `:41-54`; `authRoutes.js:118-119` (`googleMobile`); Status já declara a ressalva.
- **Constatação:** implementação presente; aceite “em device” não evidenciado no repo.
- **Impacto:** fechar RF-002 como “web + mobile” é prematuro.
- **Severidade:** Baixa
- **Confiança:** Alta
- **Recomendação:** checklist de aceite em Android/iOS com `GOOGLE_SERVER_CLIENT_ID`; manter Status atual até lá.
- **Critério de aceite:** captura ou ata de teste em device com login Google nativo OK.

### PO-022 — Superfície morta: Socket.IO, uploads de grupos/compras

- **Evidência:** `api/package.json` (dep `socket.io`); `web/package.json:37`; `app.js:42-54` (static `/api/uploads/grupos` e `/compras` em dev); rotas de grupos/compras comentadas.
- **Constatação:** dependências e mounts antecipam módulos desligados.
- **Impacto:** ruído operacional e falsa impressão de feature.
- **Severidade:** Baixa
- **Confiança:** Alta
- **Recomendação:** comentar mounts e deps até o epic correspondente.
- **Critério de aceite:** API sobe sem anunciar uploads/socket de módulos inexistentes.

### PO-023 — Protótipos “Pretenção” vs copy “pretensão”

- **Evidência:** `docs/5.wireframe.md:136` (`Nova Pretenção.png`); pasta `docs/prototipos/Viagens e Moedas/.../Nova Pretenção.png`; RF-042 usa “pretensões”.
- **Constatação:** inconsistência de nomenclatura no recorte de viagens (já visível nos arquivos de protótipo).
- **Impacto:** baixo (cosmético); polui aceite visual.
- **Severidade:** Baixa
- **Confiança:** Alta
- **Recomendação:** padronizar “pretensão” nos exports na próxima revisão de apostila.
- **Critério de aceite:** títulos de protótipo e UI usam o mesmo termo do RF-042.

---

## 4. Pontos positivos

- **Núcleo de transações rastreável (RF-016–028).** API em camadas, job diário `recurringTransactions.js:51` + cron Vercel `cronController.js:22`, validação VA/VR `recursoCategoriaRules.js:58-70`, sugestão RF-028 testada (`categorySuggestionService.test.js`), Flutter e web consomem o mesmo contrato.
- **Metas e viagens no recorte, com vínculo `metaId` (RF-047).** Épico 004/005 e código de `/metas` e `/viagens` coerentes; web tem gráfico de câmbio (`TripExchangeChart.jsx`).
- **Auth sólida no que é observável (RNF-002, RNF-013, RNF-014).** `SALT_ROUNDS = 12` (`authService.js:26`); access `15m` e refresh 7d/30d (`tokenUtils.js:5-7`); CORS por origem (`app.js:24-34`); Flutter Bearer + `flutter_secure_storage`.
- **Apostila de wireframes alinhada ao recorte declarado** (`docs/5.wireframe.md:12`) — auth, transações, metas, viagens em claro/escuro — mesmo que a navegação Flutter já ultrapasse esse recorte (PO-001).
- **Incertezas em `project.yml:91-96` estão corretas** (grupos comentados, Socket.IO Flutter, deploy indefinido): o contrato Hyperion não mente sobre essas dívidas.
- **Landing tem CTAs reais (RF-081 de fato).** `PublicHeader.jsx:72-86` Entrar + Começar Grátis, mesmo com EPIC-007 ainda Backlog (PO-011).
- **Persistência monetária no Prisma é Decimal** (`schema.prisma` em transação/meta/viagem) — base correta para fechar RNF-016 depois (PO-013).

---

## 5. Quick wins

| # | Ação | Fecha / mitiga | Esforço |
| --- | --- | --- | --- |
| 1 | Trocar `DEFAULT_AUTHENTICATED_ROUTE` para `/transactions` | PO-003, PO-018 | Baixo |
| 2 | Ocultar item Grupos no Flutter (como a sidebar web já faz) | PO-001 | Baixo |
| 3 | Badge “Em breve” em Grupos e Calendário na landing; Insights deixar de ser “Beta” | PO-002, PO-009 | Baixo |
| 4 | Desabilitar links Perfil/Configurações | PO-008 | Baixo |
| 5 | Check `[ ]` em RF-039 até o gráfico Flutter | PO-006 | Baixo (doc) |
| 6 | Marcar RF-071 (e RF-080/081) conforme o código | PO-010, PO-011 | Baixo (doc) |
| 7 | Não inserir `INSIGHT_IA` / `META_ATINGIDA` até existir GET `/notificacoes` **ou** ligar a rota mínima | PO-004, PO-009 | Médio |

---

## 6. Roadmap e riscos

### Curto prazo (fechar Sprint 3 / banca do recorte)

1. Congelar o recorte comunicável: **auth + transações + metas + viagens/moedas (web gráfico; Flutter sem histórico)**. Sem grupos, sem dashboard real, sem Socket.IO.
2. Executar quick wins 1–6 para a demo não mostrar telas mortas.
3. Decidir PO-007 (grupos free vs premium) **antes** de ligar `grupoRoutes`.
4. Alinhar RF-140 ao fato (REST only) para não prometer tempo real na apresentação.

### Médio prazo (próxima sprint de produto)

1. **Inbox de notificações** (desbloqueia RF-035 de verdade e limpa inserts órfãos).
2. **Dashboard mínimo** RF-007–008–011 (saldos + últimas transações) para justificar `/dashboard` como home.
3. **RF-039 Flutter** ou reescopo formal.
4. **Grupos API** só depois de esconder a UI morta e da decisão premium; senão o Flutter já está um passo à frente da API.
5. **RNF-004 e RNF-016** — ou texto ou implementação; hoje ambos estão “quase”.

### Longo prazo (visão `docs/2`)

Insights Gemini (RF-048+), chatbot (RF-057+), orçamento (RF-099+), calendário/Google (RF-062+), onboarding (RF-130+), importação (RF-134+), divisão de despesas e dívidas. Prisma já antecipa várias tabelas (PO-012): risco de construir no schema errado (gamificação/VT) se ninguém podar.

### Dependências

- Host da API **não serverless** se Socket.IO for requisito real (já anotado em `server.js:93` e EPIC-008:37).
- `GEONAMES_USERNAME` / cotações: viagens já dependem de cache gratuito (restrição 3.3).
- Google OAuth nativo: projeto Cloud + teste em device (PO-021).
- Deploy público: bloqueia RNF-003/007/009.

### Questões em aberto (alteram requisito, prioridade ou recomendação)

1. **Grupos são gratuitos no TI5 ou premium?** (PO-007) — muda RF-084+ e o gate `requirePremium`.
2. **O recorte Sprint 3 aceita RF-039 só na web?** Se sim, o Check `[x]` precisa de mudança de plataforma, não de Flutter.
3. **A home autenticada deve ser Transações até o dashboard existir?** (PO-003/018) — recomendação desta auditoria; contradiz EPIC-002 se a equipe quiser insistir em `/dashboard`.
4. **Há URL HTTPS de produção prevista nesta disciplina?** Sem isso, RNF-003 permanece inverificável e RF-140 Socket.IO em Vercel continua inviável.
5. **Gemini no recorte é só importação de PDF (env) ou insights?** Hoje só existe chave de PDF; a visão e a privacidade já falam de insights/chat.

---

*Fim do relatório. IDs `PO-001`–`PO-023`. Evidências `path:line`. Nenhuma alteração em código ou documentação de produto.*
