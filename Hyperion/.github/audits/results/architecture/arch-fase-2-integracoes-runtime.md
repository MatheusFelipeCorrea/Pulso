# Auditoria arquitetural — Fase 2: integrações e runtime

**Produto:** Pulso  
**Locale:** pt-BR  
**Overlay:** nenhum  
**Data:** 2026-09-30  
**Escopo desta fase:** contratos HTTP, provedores externos, mensageria, jobs, deploy, resiliência, observabilidade e segurança nos boundaries.

---

## 1. Resumo executivo

A API **sobe como processo Node** (`server.js`) com Express, JWT (cookie e Bearer), SMTP via `emailBridge`, Google OAuth, cotações AwesomeAPI/Frankfurter e, em viagens, GeoNames + Duffel/Amadeus com fallback de catálogo. RabbitMQ e Socket.IO aparecem em **dependências, código e documentação**, mas o runtime efetivo **não liga workers nem o socket**.

O risco dominante é **topologia dupla e incompleta**: o código ramifica `process.env.VERCEL` (Prisma Neon, sem `node-cron`, Socket.IO off) enquanto o README e o `docker-compose` descrevem broker e jobs long-running. **Não há `vercel.json` no repositório**, embora `server.js:70` afirme que na Vercel os jobs rodam via crons desse arquivo. Em ambiente `VERCEL`, recorrência e limpeza de tokens **podem simplesmente não executar**.

Segundo: `authService` **já publica** e-mails na fila `pulso.emails` quando `RABBITMQ_URL` está setada, mas `startMessagingWorkers` está comentado — mensagens enfileiradas **não têm consumer**. Terceiro: `jobBridge.js` faz `require` de jobs que **não existem** neste tree.

Capacidade de evolução das integrações: **boa no caminho síncrono com fallback** (FX, voos, e-mail direto); **perigosa** se alguém “ligar” RabbitMQ ou Vercel sem fechar o circuito.

---

## 2. Escopo e contexto detectado

### Integrações observadas (código)

| Integração | Onde | Estado |
|------------|------|--------|
| PostgreSQL / Neon | `config/database.js` | Ativo |
| Google OAuth | `config/passport.js`, `utils/googleOAuth.js` | Ativo (auth) |
| SMTP / Nodemailer | `providers/emailProvider.js` via `messaging/emailBridge.js` | Ativo (modo direto se broker off) |
| AwesomeAPI + Frankfurter | `providers/awesomeApiProvider.js` | Ativo; fallback e cache Map 5 min |
| GeoNames | `providers/geonamesProvider.js` | Ativo se `GEONAMES_USERNAME` |
| Duffel / Amadeus | `tripFlightPriceService.js:86-117` | Opcional; fallback catálogo |
| Gemini | só `config/env.js:55-56` | **Não usado** em services |
| Google Calendar | tokens em `ConfiguracaoUsuario`; rotas comentadas | Schema + env; HTTP off |
| RabbitMQ | `messaging/rabbit.js`, `docker-compose.yml` | Biblioteca viva; workers **não iniciados** |
| Socket.IO | `package.json`; `server.js:8,90` | `src/socket/` **ausente** |
| Vercel Blob | `BLOB_READ_WRITE_TOKEN` em env; uploads estáticos só se não-Vercel | `app.js:39-54` |

### Runtime

- Dev: `node-cron` hourly + daily 00:05 se **não** `VERCEL` (`server.js:71-86`).
- Cron HTTP: `/api/cron/tick` e `/daily` com `CRON_SECRET` (`cronRoutes.js:7-8`, `cronAuthMiddleware.js:6-24`).
- Health: `/api/health` JSON estático **sem** ping no banco (`app.js:58-60`).
- Log: Winston console (`logger.js:11-20`); nível `warn` em production.
- CI produto: Node lint/test/build em api+web; Flutter **não** entra no loop npm (`.github/workflows/hyperion-product-ci.yml:40-48`).

### Overlay / N/A

- Overlay: nenhum.
- Circuit breaker / saga / service mesh: N/A ao porte; timeouts axios **existem** (8–12s nos providers).
- Multi-região, DR documentado, RPO/RTO: não observáveis.
- Webhooks de terceiros inbound: não encontrados.

### Limitações

- Deploy de produção “indefinido” (`.github/project.yml` uncertainties). Inferências Vercel/Neon vêm do código, não de um manifesto de hospedagem no repo.
- Sem `vercel.json` — não se pode afirmar que crons serverless estão configurados **fora** do git.

---

## 3. Achados priorizados

### ARCH-2-01 — Runtime Vercel desliga cron local e o manifesto de crons não está no repo

- **Evidência:** `server.js:70-86` (se `VERCEL`, pula `node-cron`; comentário “jobs rodam via /api/cron/* (vercel.json crons)”). Glob na raiz do produto: **zero** `vercel.json`. `cronController.js:5-31` só token cleanup + recorrentes. `database.js:24-26` (keepalive off na Vercel).
- **Constatação:** Há dois failure domains de agendamento. O caminho serverless **depende de um artefato ausente**. Recorrência (`recurringTransactions.js`) e limpeza de tokens ficam órfãs se a API for deployada com `VERCEL=1` sem cron externo.
- **Impacto:** Operação e confiabilidade (lançamentos recorrentes param; tokens de refresh acumulam). Single point of failure disfarçado de “já está no Vercel”.
- **Severidade:** Crítica  
- **Confiança:** Alta no código; Média se o time só roda Node long-running (aí o cron local cobre).
- **Recomendação:** Escolher **uma** topologia e materializá-la: (A) processo 24/7 + `node-cron` (e ignore Vercel); (B) serverless + `vercel.json` crons (e testes de `/api/cron/daily`). Até lá, não setar `VERCEL` em ambientes que precisem de jobs.
- **Trade-offs:** Long-running: Socket.IO/Rabbit possíveis, custo de VM. Serverless: barato, **incompatível** com Socket.IO no mesmo processo (`server.js:93`) e com consumers AMQP. Híbrido (API serverless + worker): correto e mais caro de operar no TI5.

### ARCH-2-02 — E-mail já usa a fila; consumers não sobem

- **Evidência:** `authService.js:7-10,91-92` (`enqueueVerificationEmail`). `emailBridge.js:5-11` (`publishOrRun` na fila `EMAILS`). `server.js:15-21,72` (`startMessagingWorkers` comentado). `rabbit.js:60-69` (se canal existe, **não** chama fallback).
- **Constatação:** Sem `RABBITMQ_URL`, fallback SMTP roda na hora — OK. **Com** URL, a mensagem vai para `pulso.emails` e ninguém consome neste processo. README da API (`README.md:22`) incentiva `docker compose up` + URL.
- **Impacto:** Cadastro/reset **silenciosamente** não enviam e-mail em “modo correto” de mensageria. Usuário fica `emailPendente` só se `sendMail` lança; publish bem-sucedido **não** cai no catch.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Não exportar `RABBITMQ_URL` até `startMessagingWorkers` estar ativo **e** os jobs existirem. Ou fazer `publishOrRun` exigir consumer health. Documentar: broker local ≠ e-mail assíncrono.
- **Trade-offs:** Manter só modo direto: mais simples, suficiente para SMTP. Ligar workers: precisa processo long-running (conflito com ARCH-2-01). Outbox no Postgres: mais trabalho, sobrevive a broker down.

### ARCH-2-03 — `jobBridge` referencia jobs inexistentes

- **Evidência:** `messaging/jobBridge.js:2-5` (`budgetAlertJob`, `debtAlertJob`, `reminderAlertJob`, `reminderRecurrenceJob`). Pasta `src/jobs/`: apenas `tokenCleanupJob.js`, `recurringTransactions.js`, `unverifiedAccountCleanupJob.js`.
- **Constatação:** Descomentar `startMessagingWorkers` **quebra o boot** no `require`. O “fail-soft” do Rabbit não protege módulo ausente.
- **Impacto:** Evolução/operação: onboarding “ligar mensageria” é armadilha. Comentários TEMP em `server.js:7` já admitem deps ausentes.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Guardar `jobBridge` atrás de feature flag que verifica `fs.exists` **ou** remover o arquivo até os jobs voltarem. Não deixar `require` no topo de módulo morto.
- **Trade-offs:** Deletar bridge perde o desenho TI5. Stubs no-op: a fila “funciona” sem efeito — pior para debug. Restaurar módulos completos: alinhado ao schema, fora do recorte atual.

### ARCH-2-04 — Socket.IO é dependência e log, não um boundary real

- **Evidência:** `api/package.json:59` (`socket.io`). `server.js:8,88-94` (`initSocket` comentado; “módulo ausente”; off na Vercel). Diretório `Codigo/Pulso/api/src/socket`: **não existe**. Web: `socket.io-client` em `web/package.json:37` **sem** import em `src/` (grep). Flutter `pubspec.yaml`: **sem** `socket_io_client`.
- **Constatação:** RF-140 e o prompt de diagrama descrevem `/api/socket.io`. Runtime: HTTP only. Serverless Vercel **explicitamente** recusa o socket no mesmo processo.
- **Impacto:** Contrato de integração falso; chat de grupo (Premium, schema `MensagemChatGrupo`) não tem canal. Qualquer deploy serverless torna o RF irrealizável sem serviço à parte.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** ADR: tempo real só com processo long-running **ou** provedor (Ably/Pusher) **ou** polling REST nas mensagens. Não reativar `initSocket` na Vercel.
- **Trade-offs:** Polling: simples, atende chat esporádico. Socket no mesmo Node: barato no TI5, bloqueia serverless. Serviço extra: custo e complexidade.

### ARCH-2-05 — Upgrade Premium é PATCH autenticado sem billing

- **Evidência:** `authRoutes.js:78` (`PATCH /me/plano`). `authService.js:540-551` (“TI5 demo — alterna FREE/PREMIUM sem billing”). `requirePremium.js:21-27` (403 `PREMIUM_REQUIRED` em **todas** as rotas `/viagens`). `viagemRoutes.js:22-23`.
- **Constatação:** O gate de integração (viagens, FX “avançado”, grupos futuros) é **honor system**. Qualquer cliente chama o PATCH. Alinhado a demo acadêmica; incompatível com o discurso de produto gratuito **e** com um plano pago real.
- **Impacto:** Segurança arquitetural do boundary Premium; evolução (quando billing existir, esta rota é um bypass). Viagens inteiras dependem desse bit.
- **Severidade:** Alta (em produção real); no TI5 é dívida consciente.  
- **Confiança:** Alta  
- **Recomendação:** Restringir a seed/admin ou header de demo. Se o produto é 100% grátis, **não** gatear `/viagens`. Se freemium for para valer, remover o PATCH público.
- **Trade-offs:** PATCH demo: facilita banca. Sem gate: RF Premium some. Billing: fora do escopo da disciplina (`docs/3.requisitos.md:282`).

### ARCH-2-06 — Caches de cotação e voos são `Map` no processo

- **Evidência:** `awesomeApiProvider.js:9,13-25` (`CACHE_TTL_MS = 5 min`). `amadeusProvider.js:6,52-56`. `duffelProvider.js:8,45-48`. `geonamesProvider.js:5-7`. `database.js:44-54` (serverless Neon).
- **Constatação:** Cache não sobrevive a cold start nem é compartilhado entre isolates. Em Vercel, o TTL de 6h de voos **quase nunca** aquece. Rate limits de terceiros batem mais.
- **Impacto:** Performance e custo de API externa; resiliência (cada lambda martela Awesome/Duffel).
- **Severidade:** Média  
- **Confiança:** Alta se Vercel; Baixa se um único Node long-running (aí o Map funciona).
- **Recomendação:** Cache HTTP (`Cache-Control`) no GET de cotações; ou tabela `cotacoes_cache` no Postgres. Não inventar Redis sem carga.
- **Trade-offs:** Postgres cache: consistente entre instâncias, mais writes. CDN: ótimo para GET público — mas rotas de moeda exigem auth (`moedaRoutes.js:15-21`).

### ARCH-2-07 — Gemini e Calendar estão no env/schema, não no fluxo

- **Evidência:** `env.js:55-56` (`GEMINI_API_KEY_PDF`). Grep `Codigo/Pulso`: **nenhum** client Gemini além de env/test setup. `insightService.js:53-64` (`geradoPor: 'regras'`). `schema.prisma:268-271` (`tokensGoogle`, `googleCalendarAtivo`). `routes/index.js:14,36` (`calendarRoutes` comentado).
- **Constatação:** Integração de IA e Calendar são **intenção**. Import PDF (RF-134) não tem rota. Tokens de calendar podem ser gravados no futuro sem módulo.
- **Impacto:** Documentação e diagramas superestimam o sistema. Chaves Gemini sem uso aumentam superfície de secret.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Não exigir `GEMINI_*` no boot. Ligar Gemini só com `/importacoes`. Calendar: não criptografar tokens até a rota existir (`googleTokenCrypto.js` já existe — bom — mas módulo HTTP off).
- **Trade-offs:** Manter env “completo” facilita o dia do import; confunde operadores agora.

### ARCH-2-08 — Provedores externos: timeout sim, isolamento de falha parcial limitado

- **Evidência:** Awesome tenta Frankfurter (`awesomeApiProvider.js:165-171`, `344-347`). Voos: Duffel → Amadeus → estimativa (`tripFlightPriceService.js:86-117`, catch vazio). GeoNames timeout no provider. Sem circuit breaker, sem bulkhead, sem retry/backoff padronizado.
- **Constatação:** Fail-soft de **negócio** (estimativa) é bom. Catch vazio engole erros de autenticação Duffel. `moedaService.js:49-53` transforma qualquer falha de cotação em 502 — OK para o cliente; sem métrica de origem.
- **Impacto:** Resiliência e operação (não se distingue quota vs rede).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Log estruturado `fonte`/`erro`; retry só em 429/5xx com jitter; não retry em 401. Circuit breaker só se houver evidência de cascata.
- **Trade-offs:** Retry agressivo piora rate limit. Estimativa silenciosa (já feita) pode enganar o usuário sobre “preço real”.

### ARCH-2-09 — Observabilidade de um único stream de console

- **Evidência:** `logger.js:4-20` (printf, colorize, sem `requestId`). `health` sem DB (`app.js:58-60`). Rabbit nack loga e descarta (`rabbit.js:82-84`).
- **Impacto:** Operação: correlacionar 502 de câmbio com o usuário é manual. Sem traces, RTO de incidente é alto mesmo em projeto pequeno.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Middleware `X-Request-Id`; health `/health/ready` com `SELECT 1`; JSON logs em production (Winston já está).
- **Trade-offs:** APM (Sentry): útil, é vendor. Não bloquear merge por falta de Datadog no TI5.

### ARCH-2-10 — Consumer Rabbit: nack sem requeue e sem DLQ

- **Evidência:** `rabbit.js:76-85` (`nack(msg, false, false)`). Filas só `assertQueue` durable, **sem** dead-letter (`38-40`).
- **Impacto:** Quando workers existirem, poison message some. Jobs de alerta não são replayable.
- **Severidade:** Média  
- **Confiança:** Alta no código; impacto adiado até ARCH-2-02/03.
- **Recomendação:** DLQ `pulso.*.dlq` + retry limitado. Idempotência nos jobs (ARCH-1-11).
- **Trade-offs:** Requeue infinito: loop quente. Drop: perda. DLQ: operacionalmente o mínimo sério.

### ARCH-2-11 — Health check não prova persistência

- **Evidência:** `app.js:58-60`.
- **Impacto:** Load balancer/Vercel marcam “up” com Neon down; usuários 500 em todas as rotas autenticadas.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** `/api/health` liveness (processo) + `/api/ready` com Prisma. Não bloquear o listen atual em falha de DB no health se quiser restart rápido — separar os dois.
- **Trade-offs:** Ready que bate no DB: falso negativo em hiccup. Só liveness: o que existe hoje.

### ARCH-2-12 — CI de produto não fecha o triângulo (Flutter ausente; workflow desatualizado)

- **Evidência:** `hyperion-product-ci.yml:3` (“Placeholder until … scaffolded”). Job npm em `Codigo/Pulso/api` e `web` (`40-48`). Apps **já** existem. Sem `flutter test`.
- **Impacto:** Contratos REST quebrados no mobile passam no CI. Evolução: RF-140 sem rede de segurança.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Job Flutter (analyze + test) em path `Codigo/Pulso/mobile`. Atualizar o comentário placeholder.
- **Trade-offs:** Tempo de CI; setup Flutter no GHA. Vale para um app que já tem testes em `test/`.

### ARCH-2-13 — `/api/docs` anunciado, Swagger não montado

- **Evidência:** `server.js:98`. `package.json:73-74` (`swagger-jsdoc`, `swagger-ui-express`) em **devDependencies**. Grep `src`: **sem** swagger.
- **Impacto:** Contrato implícito; onboarding. Sem OpenAPI versionado (Fase 3).
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Remover o log ou montar UI só em non-production.
- **Trade-offs:** Swagger em prod: superfície extra. Sem docs: clientes duplicam shapes (já ocorre).

### ARCH-2-14 — Uploads estáticos de módulos desligados

- **Evidência:** `app.js:39-54` (`/api/uploads/grupos`, `/compras`) se não-Vercel.
- **Impacto:** Boundary HTTP extra sem o módulo; em prod Vercel o static some (Blob previsto, não visto neste fluxo).
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Condicionar ao feature grupos/compras.
- **Trade-offs:** Deixar montado não quebra; só confunde.

### ARCH-2-15 — Google Client IDs no binário Flutter (OAuth público)

- **Evidência:** `mobile/lib/core/config/app_config.dart:5-12` (`defaultValue` com IDs).
- **Constatação:** Client IDs OAuth são públicos por desenho; ainda assim o **boundary de config** está hardcoded, não só `--dart-define`.
- **Impacto:** Rotação de ID exige rebuild; risco baixo vs secrets de servidor (`JWT_SECRET` no env — correto).
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Só `fromEnvironment` sem default de produção no git, ou flavor files.
- **Trade-offs:** Sem default, `flutter run` quebra até o README explicar flags.

---

## 4. Pontos positivos

- **Dois transportes de auth bem definidos:** cookie `httpOnly` + Bearer (`authCookies.js:22-57`); Flutter usa header (`api_client.dart:22-25,47-54`).
- **CORS e Helmet** com `X-Pulso-Client` (`app.js:17-34`).
- **Rate limit** em auth (`authRoutes.js` + `authRateLimit.js`).
- **Cron HTTP autenticado** (`cronAuthMiddleware.js:16-21`).
- **FX com fallback e timeout** (`awesomeApiProvider.js:7,165-171`).
- **Preço de passagem degradável** (catálogo se APIs off) (`tripFlightPriceService.js:83-84`).
- **E-mail com deep link web + `pulso://`** (`emailProvider.js:45-46`).
- **Neon adapter + retry de conexão transiente** (`database.js:63-77`).
- **Rabbit `publishOrRun`** é um bom padrão — **desde que** o consumer exista (hoje só o ramo `direct` é seguro).
- **Zod nas rotas ligadas** (auth, meta, viagem, moeda).

---

## 5. Quick wins

1. Não definir `RABBITMQ_URL` em `.env` de demo até workers existirem (ARCH-2-02).
2. Health com `SELECT 1` opcional via query `?deep=1` (ARCH-2-11).
3. Remover log `/api/docs` ou o comentário de vercel.json mentiroso (ARCH-2-01/13).
4. Feature-flag `jobBridge` para não `require` arquivos mortos (ARCH-2-03).
5. JSON logs + request id (ARCH-2-09).
6. Job GHA `flutter test` (ARCH-2-12).

---

## 6. Roadmap e riscos

| Horizonte | Ação | Risco residual |
|-----------|------|----------------|
| Estabilizar | Uma topologia de deploy; crons testáveis; Rabbit off-by-default | Time liga compose “porque o README manda” |
| ADR | Serverless vs Node 24/7 vs worker dedicado; Socket.IO vs REST chat; Premium demo | Escolher Vercel **e** chat realtime no mesmo processo é inviável |
| Estrutural | Cache de cotações no DB; DLQ; Gemini só com import | Secrets e quotas |
| Residual | Dependência de AwesomeAPI/Frankfurter sem SLA | 502 em moedas (já mapeado) |

**Pergunta que altera recomendação:** a API de produção será Vercel serverless ou um Node longo? Se serverless, RabbitMQ no mesmo app e Socket.IO devem sair do desenho-alvo (não só “TEMP Sprint-2”).
