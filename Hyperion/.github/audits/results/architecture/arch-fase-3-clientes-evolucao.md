# Auditoria arquitetural — Fase 3: clientes e evolução

**Produto:** Pulso  
**Locale:** pt-BR  
**Overlay:** nenhum  
**Data:** 2026-09-30  
**Escopo desta fase:** arquitetura Web/Flutter, contratos compartilhados, paridade, dívida de evolução, ADRs e alinhamento com a intenção documentada.

---

## 1. Resumo executivo

Os clientes **convergem no REST da mesma API** para o núcleo ligado (auth, transações, categorias/tags, metas, moedas, viagens). A sessão **diverge de propósito**: Web usa cookies `httpOnly` + `withCredentials`; Flutter usa Bearer + refresh no body e `flutter_secure_storage`. Isso é uma decisão sólida.

A evolução está travada por **três contratos paralelos sem artefato único** (shapes JSON copiados em JS e Dart), por **módulos TEMP** (web e API comentam páginas/rotas “ainda não neste repo”) e por **grupos**: Flutter tem UI e repositório contra `/grupos`; a Web tem `grupoService.js` **sem rotas/páginas**; a API tem a rota comentada e **sem** `grupoRoutes.js`. Socket.IO não está no Flutter — e **tampouco** está ligado na API (Fase 2).

Documentação (diagramas, `docs/3.requisitos.md` mecanismos, prompt de arquitetura) descreve RabbitMQ, Gemini, Calendar e chat realtime como se fossem o sistema. O código é um **recorte Sprint** com schema largo. Sem ADRs de produto (só log Hyperion de pastas/kit), cada sprint reintroduz a mesma ambiguidade.

Capacidade de evolução: **alta no núcleo REST em camadas**; **baixa** para fechar o triângulo Web–API–Flutter em features novas sem OpenAPI e sem parar o drift de catálogos/regras duplicadas.

---

## 2. Escopo e contexto detectado

### Clientes

| App | UI ligada | Consome REST | Tempo real |
|-----|-----------|--------------|------------|
| Web `Codigo/Pulso/web` | Landing, auth, dashboard **stub**, transações, metas, viagens | Axios `/api` (proxy Vite `vite.config.js:53-58`) | `socket.io-client` no package.json, **zero** uso em `src/` |
| Flutter `Codigo/Pulso/mobile` | Auth, home (resumo de txs), transações, metas, viagens, **grupos** | Dio `baseUrl .../api` (`api_client.dart:19`) | Sem dependência Socket.IO |
| API | — | Source of truth | Socket off |

### Estado da Web vs Flutter (paridade)

- **Web tem, Flutter também (REST):** auth, transações, metas, viagens/moedas.
- **Flutter tem, Web não:** navegação e telas de grupos (`app_router.dart:199-201`, `groups_screen.dart`); sidebar web **comenta** grupos (`sidebarNavigation.js:32-35`); `App.jsx:66-74` não declara `/groups`.
- **Web tem client órfão:** `grupoService.js` (contrato completo: viagem de grupo, metas, chat REST, imagem).
- **Ambos incompletos vs requisitos:** orçamento, calendário, dívidas, divisão, compras, import, chatbot, perfil/config (footer aponta `/profile` e `/settings` — **sem** pages).
- **Dashboard:** Web stub (`DashboardPage.jsx:3-14`); Flutter home reusa resumo de transações (`home_screen.dart:49`).

### Documentação vs código

- `docs/imagens/diagrams/README.md:23`: Flutter REST; Socket.IO ainda não — **bate com o código**.
- `docs/3.requisitos.md:297-298`: Gemini, Calendar, Socket.IO, RabbitMQ como “implementação”.
- `docs/imagens/diagrams/Arquitetura/prompt-arquitetura.md`: Socket no Flutter e filas — **intenção / prompt de imagem**, não evidência de runtime.
- `docs/8.avaliacao_arquitetura.md`: template ATAM com Rails/Angular — **não descreve a Pulso**.
- ADRs: `Hyperion/.github/docs/adr/README.md` vazio; `DECISIONS.md` só setup de pastas/kit.

### N/A

- Micro-frontends, BFF por cliente, geradores de SDK.
- Feature flags server-driven (além de `plano` FREE/PREMIUM).
- Loja (Play/App Store) e pipelines de assinatura.

### Limitações

- Não se executou os apps nesta auditoria; paridade é por tree e rotas.
- “Módulos ausentes neste repo” sugere recorte/subset de um código maior — histórico git não foi usado como prova.

---

## 3. Achados priorizados

### ARCH-3-01 — Três implementações do contrato REST, nenhum OpenAPI

- **Evidência:** Sem swagger montado (Fase 2). Web `grupoService.js:3-5` (`GET /grupos`). Flutter `group_repository.dart:28-32`. API `routes/index.js:39` comentado. Mappers Dart (`trip_models.dart`, `goal_models.dart`) vs `metaMapper.js` / `viagemMapper.js`.
- **Constatação:** O contrato vive em **três lugares**. Qualquer campo novo em viagem (ex. `destinoMeta`) exige PR coordenado. Swagger está só em devDependencies da API.
- **Impacto:** Evolução e quebra silenciosa no mobile (CI não roda Flutter). Grupos já divergem: Flutter só CRUD mínimo; web service antecipa viagem/chat/aportes.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** OpenAPI gerado das rotas **ligadas** (não do schema Prisma inteiro). Contratos de grupos só quando a API existir. Opcional: testes de contrato (Pact) no núcleo.
- **Trade-offs:** Manter OpenAPI à mão: desatualiza. Gerar de Zod: investimento único, alto retorno. SDK compartilhado JS/Dart: cedo demais para o time.

### ARCH-3-02 — Grupos: cliente à frente, API e Web desencontrados

- **Evidência:** Flutter `groups_screen.dart:52-54` (texto: API ainda não ligada; app já fala `/grupos` como a web). `group_repository.dart:28-62`. Web `grupoService.js` existe; `App.jsx` sem rota; `sidebarNavigation.js:33` comentado. API sem `grupoRoutes.js`; `index.js:17,39`.
- **Constatação:** Verificado o fato do `project.yml`: rota `/api/grupos` comentada; **clients** (Flutter de fato, web só service) assumem o path. A “web” do aviso do Flutter **não tem tela**. Empty/error no app documenta o buraco — bom — mas criar/entrar ainda dispara HTTP 404.
- **Impacto:** UX e dívida: feature visível e morta. Quando a API ligar, o subset Flutter (sem chat/viagem de grupo) ficará atrás do `grupoService` web.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Fatia vertical: API mínima (listar/criar/entrar) **ou** esconder nav Flutter até o 200. Não expandir `grupoService` web sem página. Um card = um contrato.
- **Trade-offs:** Esconder grupos: RF fica “não entregue” na banca. Entregar API mínima: desbloqueia o client já escrito. Mock local no Flutter: mentira de integração.

### ARCH-3-03 — Arquitetura documentada ≠ arquitetura observada

- **Evidência:** `docs/3.requisitos.md:281-298` (mesma API + Socket.IO; Gemini; RabbitMQ). `prompt-arquitetura.md:44-59,171-177` (socket Flutter, `rabbit.js`, filas). Código: Socket ausente, Gemini unused, workers off, `insightService` regras. `docs/8.avaliacao_arquitetura.md:29-30` (Rails/Angular).
- **Constatação:** Diagramas e apostila vendem um sistema **alvo**. O tree é um **subset TEMP** (`App.jsx:23`, `main.jsx:23-31`, `server.js:7`). Avaliação ATAM não foi preenchida para esta stack.
- **Impacto:** Decisões de evolução (contratar Gemini, subir Rabbit, Vercel) partem de desenho que o runtime não sustenta. Novos membros implementam o diagrama, não o `index.js`.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Separar no `docs/` “as-is” vs “to-be”. Atualizar mecanismos 3.4 com estados (ligado / código morto / só schema). Não usar o prompt Gemini de diagrama como evidência de implementação (o próprio prompt de auditoria proíbe).
- **Trade-offs:** Apostila “honesta” pode parecer menos completa na banca. Apostila “alvo” sem legendas gera exatamente este drift.

### ARCH-3-04 — Regras de domínio copiadas nos três lados

- **Evidência:** `api/src/utils/metaBalanceUtils.js` vs `web/src/utils/goalBalanceUtils.js` (`roundMoney`, `calcProgressoMeta`, `podeReceberAporte`). `api/src/utils/recursoCategoriaRules.js` vs `mobile/.../transaction_rules.dart:27-43` vs `web/.../transactionValidation.js`. `web/src/utils/tripBrazilCityCatalog.js:1-4` (“Manter keywords alinhadas com api/...”). `web/src/utils/importBeneficioUtils.js` duplica espírito de `api/src/utils/importBeneficioUtils.js` **sem** rota de import.
- **Constatação:** A restrição (`docs/3.requisitos.md:281`) “regra de negócio não mora no cliente” **já foi violada** para UX (validação imediata) — aceitável — mas os algoritmos **divergem** (`differenceInMonths` date-fns vs `diffMesesAte` string split).
- **Impacto:** Manutenção: bug de prazo/meta diferente web vs API. Import utils no client antecipam módulo desligado.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Cliente valida formato; servidor é autoridade. Extrair testes iguais (mesmos fixtures) para progresso de meta. Catálogos de destino: **só API** + cache HTTP; web não duplicar Unsplash/wiki.
- **Trade-offs:** 100% no servidor: latência em cada tecla. Duplicar: UX rápida, drift. Pacote npm compartilhado web/api: Flutter fica de fora.

### ARCH-3-05 — Paridade Web/Flutter assimétrica e rotas mortas na chrome

- **Evidência:** `sidebarNavigation.js:41-44` (`/profile`, `/settings`). `App.jsx:76` catch-all `Navigate to="/"`. Sem páginas Profile/Settings. Flutter `app_shell.dart` tem drawer; grupos visíveis; dashboard real vs stub web.
- **Constatação:** A chrome promete conta/config. Dead links caem na landing. Flutter e Web não compartilham mapa de informação: um esconde grupos, o outro mostra 404.
- **Impacto:** UX e evolução (dois product backlogs implícitos).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Fonte única de nav (mesmo JSON de features flags). Footer só com rotas existentes. Alinhar grupos (ARCH-3-02).
- **Trade-offs:** Nav mínima parece “app pequeno”. Nav completa mentindo é pior.

### ARCH-3-06 — RF-140 tempo real: Flutter não consome Socket.IO (e a API não oferece)

- **Evidência:** `docs/3.requisitos.md:244` (parcial; Socket.IO ainda não). `pubspec.yaml` sem `socket_io_client`. Fase 2: `src/socket` inexistente. Vite `ws: true` no proxy (`vite.config.js:57`) antecipa websocket que não há.
- **Constatação:** O fato conhecido está **verificado**. O gap não é só mobile: é **plataforma**. Implementar só no Flutter contra API morta seria inútil.
- **Impacto:** Requisitos e chat de grupo Premium. Evolução: ordem correta é API+web depois Flutter, ou REST polling nos três.
- **Severidade:** Média (requisito essencial, mas bloqueado pelo backend)  
- **Confiança:** Alta  
- **Recomendação:** Reescrever RF-140 para “mesmo REST; tempo real quando houver processo long-running”. Não adicionar `socket_io_client` agora.
- **Trade-offs:** Marcar RF como fora do recorte serverless. Entregar chat via REST `MensagemChatGrupo` já no schema — suficiente para TI5.

### ARCH-3-07 — Estado de cliente: Redux mínimo vs Provider por feature

- **Evidência:** `web/src/store/index.js:4-10` (só `theme` + `auth`). Páginas de metas/viagens provavelmente estado local (não há slices). Flutter: `provider` + controllers por feature (`goals_controller`, `trips_controller`, `groups_controller`).
- **Constatação:** Não há shared kernel de estado entre clientes — esperado. Web Redux está **subutilizado** (bom, evita store global). Risco: cada página reimplementa loading/erro/refresh de sessão (Axios interceptor já centraliza 401 — `api.js:57-92`).
- **Impacto:** Baixo no curto prazo; médio se dashboard precisar de cache compartilhado transações/metas.
- **Severidade:** Baixa  
- **Confiança:** Média (não se leu cada page por completo).
- **Recomendação:** Manter Redux só para sessão/tema. Não introduzir RTK Query sem necessidade. Flutter: padrão repository+controller já é claro.
- **Trade-offs:** Cache global: menos refetch, mais invalidation bugs.

### ARCH-3-08 — Freemium no cliente vs produto “100% gratuito”

- **Evidência:** `PROJECT.md:11,37` (gratuito). `docs/3.requisitos.md:282`. `useSidebarState.js:8-11` (esconde `/trips` se não PREMIUM). Flutter `trips_screen.dart:31-37`. `PATCH /me/plano` (Fase 2).
- **Constatação:** A evolução do **modelo de negócio** está no código (enum `Plano`, seed FREE/PREMIUM) e contradiz a visão do README. Clientes implementam gate; o servidor também (`requirePremium` em viagens).
- **Impacto:** Produto e banca: o que é o recorte? Viagem Premium impede o RF de câmbio para o usuário default `FREE` (`schema.prisma:278`).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** ADR de uma página: demo TI5 (PATCH) vs grátis sem gate vs freemium futuro. Default `PREMIUM` no seed de desenvolvimento se a banca precisa ver viagens.
- **Trade-offs:** Sem gate: perde narrativa Premium. Com gate + PATCH: teatro. Billing: fora do escopo.

### ARCH-3-09 — Nenhuma ADR de arquitetura de produto

- **Evidência:** `Hyperion/.github/docs/adr/README.md:3-8` (pasta gerada sob demanda, vazia). `DECISIONS.md` D001–D009 (kit, paths). Decisões reais no código: Neon/Vercel, Rabbit fail-soft, dual cookie/Bearer, Premium demo, TEMP subset de módulos.
- **Impacto:** Evolução: cada sprint reabre “ligamos grupos?”. Diagramas envelhecem sem dono.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** 4 ADRs curtos: (1) topologia deploy; (2) grupos dual-table vs unificar; (3) aporte vs ledger; (4) realtime. Não ADR para “usamos Express”.
- **Trade-offs:** Overhead acadêmico vs retrabalho. O kit já aponta o path.

### ARCH-3-10 — Catálogos e cobertura de teste web referem arquivos que não existem

- **Evidência:** `vite.config.js:35-40` (exclude `syncService.js`, `purchasePlanningService.js`, `expenseSplitService.js` — **ausentes** em `web/src/services/`). `main.jsx:23-31` CSS comentado. `grupoService.js` presente sem page.
- **Constatação:** O front foi **recortado** de um monólito maior. Ferramenta de teste ainda conhece o fantasma. Evolução: `npm test` coverage config mente.
- **Impacto:** Manutenção; onboarding.
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Limpar excludes e services mortos **ou** restaurar o módulo completo. Não deixar `grupoService` como único sobrevivente sem UI.
- **Trade-offs:** Limpar agora vs esperar o merge do “resto do repo”.

### ARCH-3-11 — Dependência Socket no web sem código

- **Evidência:** `web/package.json:37`. Grep `src`: sem `socket.io-client`.
- **Impacto:** Bundle/lockfile; falsa prontidão.
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Remover até existir `groupChat` client. Proxy `ws: true` pode ficar (barato).
- **Trade-offs:** Tirar e recolocar depois vs deixar morto.

### ARCH-3-12 — Deep links e CORS: dois clientes, um e-mail

- **Evidência:** `emailProvider.js:45-46,69-70` (`FRONTEND_URL` + `pulso://`). Flutter `app_router.dart:218-258` (`app_links`). `app.js:20-21` (CORP cross-origin para Flutter web). `CORS_ORIGIN` split (`app.js:24-31`).
- **Constatação:** O desenho **multi-cliente de auth** está pensado (returnTo Google, header `X-Pulso-Client`). Risco de evolução: `FRONTEND_URL` único no SMTP não cobre preview Vercel + app nativo simultâneos sem links universais bem configurados.
- **Impacto:** Operação de verificação de e-mail em vários ambientes.
- **Severidade:** Baixa  
- **Confiança:** Média (não se auditou stores/intent-filters Android além do Dart).
- **Recomendação:** Documentar intent-filter + `CORS_ORIGIN` com origens web e Flutter web. Manter links universais no e-mail.
- **Trade-offs:** Vários FRONTEND_URL por ambiente vs um domínio canônico.

---

## 4. Pontos positivos

- **Mesma API, dois transportes de sessão** — decisão correta (`authCookies.js`, `api_client.dart`).
- **Refresh lock** no Flutter (`api_client.dart:87-118`) e promise única na web (`api.js:41-49`).
- **Gate Premium no servidor** (`viagemRoutes.js:23`) — clientes não são a autoridade (mesmo que o PATCH de plano seja fraco).
- **Flutter modularizado por feature** (`lib/features/{auth,transactions,goals,trips,groups,currency}`).
- **Design system web** extraído (`design-system/`) e tokens Flutter (`pulso_tokens.dart`).
- **Proxy Vite `/api`** evita CORS no dev (`vite.config.js:53-58`).
- **Grupos no Flutter admitem o buraco** (`groups_screen.dart:52-54`) em vez de fingir dados locais.
- **Zod no servidor** reduz um pouco a necessidade de confiar no client.

---

## 5. Quick wins

1. Remover grupos da nav Flutter **ou** ligar API list/create (ARCH-3-02).
2. Tirar `/profile` e `/settings` do footer até existirem páginas (ARCH-3-05).
3. Remover `socket.io-client` não usado (ARCH-3-11).
4. Limpar `vite.config.js` coverage exclude fantasma (ARCH-3-10).
5. Seed/dev default PREMIUM se a demo precisa de viagens (ARCH-3-08).
6. Uma página as-is/to-be na apostila (ARCH-3-03).

---

## 6. Roadmap e riscos

| Horizonte | Ação | Risco residual |
|-----------|------|----------------|
| Estabilizar | Nav honesta; OpenAPI das rotas vivas; esconder grupos | Time continua copiando `grupoService` |
| ADR | Deploy, grupos, ledger metas, realtime, grátis vs Premium | Sem isso o diagrama Gemini volta a mandar |
| Estrutural | Fatia grupos completa (API+web+Flutter) **numa** sprint; catálogo só na API | Dual-table (Fase 1) explode custo |
| Evolução consciente | Chat REST antes de Socket; Gemini só com import | RF-140 “parcial” eterno |

**Pergunta que altera recomendação:** o tree atual é o produto inteiro ou um **subset** temporário de um repo maior? Se o restante (budget, calendar, grupos API) voltar em breve, ARCH-3-10 é higiene. Se este **é** o recorte até o fim do semestre, apagar services/schema não usados deixa de ser opcional.
