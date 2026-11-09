# DevOps — Fase 2: Jobs, migrations e confiabilidade

**Projeto:** Pulso  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Fase anterior:** `devops-fase-1-cicd-ambientes.md`  
**Escopo desta fase:** cron/filas, migrations Prisma, backups, resiliência, health.  
**Não alterado:** código de produto, workflows.

---

## 1. Resumo executivo

Há **migrations Prisma numerosas e versionadas** e dois jobs realmente ligados no processo long-running: limpeza de tokens (horária) e transações recorrentes (diária 00:05). O restante da malha operacional (alertas, lembretes, workers RabbitMQ, Socket.IO, vários cleanup jobs) está **comentado como TEMP Sprint-2**.

O desenho de produção mistura **node-cron in-process** (desligado se `VERCEL`) e **HTTP `/api/cron/*`** autenticado por `CRON_SECRET`, pensado para Vercel Cron — **sem `vercel.json`**. Resultado: em deploy serverless os schedulers locais não sobem e os crons de plataforma **não estão declarados no git**.

Não há evidência de backup/restore (RNF-008 pendente). Recorrência usa check-then-insert **sem unique** em `(pai_id, data)`. Health não consulta o banco. Não há `SIGTERM` / drain. RabbitMQ tem nack sem requeue e **sem DLQ**; os consumers nem estão ligados no `server.js`.

**Riscos principais desta fase:** jobs de negócio silenciosamente inativos em produção; duplicata de transações recorrentes; perda de dados sem backup comprovado; migrate nunca entra em pipeline.

---

## 2. Escopo e contexto detectado

### Jobs e agendamentos

| Mecanismo | Onde | Estado |
|-----------|------|--------|
| `node-cron` `0 * * * *` | `Codigo/Pulso/api/src/server.js:29-37` | Ativo se `!VERCEL` e `NODE_ENV !== test` → `runTokenCleanup` |
| `node-cron` `5 0 * * *` | `server.js:45-53` | Ativo se `!VERCEL` → `runRecurringTransactions` |
| HTTP `GET /api/cron/tick` | `cronRoutes.js:7` + `cronController.js:6-16` | Token cleanup; Bearer `CRON_SECRET` |
| HTTP `GET /api/cron/daily` | `cronRoutes.js:8` + `cronController.js:19-31` | Cleanup **e** recorrentes |
| `unverifiedAccountCleanupJob` | `src/jobs/unverifiedAccountCleanupJob.js` | Implementado + testes; **não agendado** |
| Alertas/orçamento/dívida/chat/split | `server.js:11-21, 55-62, 72-82` | Comentados TEMP Sprint-2 |
| RabbitMQ workers | `jobBridge.js` + `rabbit.js`; start comentado em `server.js:72` | Código existe; **não inicia** |
| Vercel Cron | comentários `server.js:70`, `.env.example:124-128` | **`vercel.json` ausente** |

### Dados

- `prisma/schema.prisma` + `prisma/migrations/` (~29 pastas + `init`) + `migration_lock.toml` (`provider = "postgresql"`).
- Scripts: `db:migrate`, `db:migrate:deploy`, `db:refresh`, `db:seed` (`Codigo/Pulso/api/package.json:13-19`).
- Adapter Neon + Pool WebSocket se `VERCEL` (`database.js:43-54`); keepalive SQL a cada 4 min **só fora** de test/Vercel (`database.js:23-26`).
- Retry em erros transitórios P1001/P1017 (`database.js:63-77`).

### Mensageria local

- `docker-compose.yml`: RabbitMQ 3-management, healthcheck, user/pass `pulso`/`pulso`.
- Filas: `pulso.alerts`, `pulso.reminders`, `pulso.emails` (`rabbit.js:6-10`).
- Fallback síncrono se broker down (`publishOrRun`).
- `nack(msg, false, false)` descarta mensagem com falha (`rabbit.js:84`) — sem dead-letter configurada.

### Health e processo

- `GET /api/health` retorna JSON estático (`app.js:57-60`). Sem `/ready` nem probe de Prisma.
- `server.listen` sem handlers `SIGTERM`/`SIGINT`.
- Rate limit auth in-memory (`authRateLimit.js`); `trust proxy` se Vercel/production (`app.js:13-15`).

### N/A

- Kubernetes probes, HPA, circuit breaker library: não encontrados.
- Backup Neon (PITR) / retenção: **não verificável** no git.
- SLI medidos: nenhum (ver Fase 3).

---

## 3. Achados priorizados

### OPS-2-01 — Caminho de cron de produção está partido no repositório

- **Evidência:** `Codigo/Pulso/api/src/server.js:70-86`; `Codigo/Pulso/api/.env.example:124-128`; ausência de `vercel.json`; `cronAuthMiddleware.js:3-22`.
- **Constatação:** Em `VERCEL`, node-cron **não** registra. A alternativa documentada é Vercel Cron → `/api/cron/*` com `Authorization: Bearer <CRON_SECRET>`. Sem manifesto `crons` no git (e docs `Cron.md`/`Hospedagem.md` ausentes), **nenhum scheduler de produção está definido como código**. Hobby Vercel (1 cron/dia) vs tick 20 min citado no `.env.example` implica cron-job.org — também não versionado.
- **Impacto:** Confiabilidade — tokens expirados e recorrências **deixam de rodar** se a API for serverless; se for long-running, depende de um único processo acordado (risco de duplicar jobs com >1 réplica).
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Escolher um modo: (A) long-running + node-cron + lock (Redis/advisory lock); (B) versionar `vercel.json` crons + `CRON_SECRET` required. Documentar timezone (UTC vs local). Não deixar os dois caminhos “implícitos”.
- **Esforço:** Médio.

### OPS-2-02 — Superfície de jobs/workers desligada (TEMP Sprint-2)

- **Evidência:** `Codigo/Pulso/api/src/server.js:7-21, 55-83, 89-94`; `Codigo/Pulso/api/src/routes/index.js:10-43`; `jobBridge.js:64-75`.
- **Constatação:** Socket.IO, messaging workers, alertas de orçamento/dívida/lembrete, cleanups de chat/notificação/split e várias rotas de API estão comentados. `jobBridge` importa jobs (`budgetAlertJob`, etc.) que **não existem** em `src/jobs/` (só três arquivos de job). Religar o `require` quebraria o boot.
- **Impacto:** Confiabilidade de produto — requisitos de alerta/e-mail assíncrono não operam neste tree; dívida operacional quando os módulos voltarem.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Tratar como feature flags explícitas; não reabilitar `startMessagingWorkers` até os módulos e DLQ existirem. Checklist de religação no runbook.
- **Esforço:** Alto (depende dos módulos ausentes).

### OPS-2-03 — Backup automático (RNF-008) sem evidência de restore

- **Evidência:** `docs/3.requisitos.md:264`; nenhum script/workflow de dump, PITR ou drill; seed apenas dev (`package.json:19`).
- **Constatação:** O prompt de auditoria proíbe declarar backup efetivo sem restore testado. Neon pode ter backup de plano — **não está no repositório**. RNF-008 permanece Pendente.
- **Impacto:** Dados financeiros (LGPD) — RPO indefinido; perda total em drop acidental de projeto Neon.
- **Severidade:** Alta  
- **Confiança:** Alta quanto à ausência no git; baixa quanto ao que o dashboard Neon faz.
- **Recomendação:** Ativar backup gerenciado Neon (plano que inclua PITR se o RPO exigir); documentar retenção, owner e **teste de restore** semestral. Export lógico periódico (fora deste audit).
- **Esforço:** Médio (conta Neon) + Alto (disciplina de drill).

### OPS-2-04 — Recorrência não é idempotente sob concorrência

- **Evidência:** `Codigo/Pulso/api/src/jobs/recurringTransactions.js:51-88`; `Codigo/Pulso/api/prisma/schema.prisma:337-365` (índices, **sem** `@@unique([paiId, data])`).
- **Constatação:** `findFirst` no dia + `criar` sem transação serializável nem unique. `daily` HTTP e node-cron 00:05 podem sobrepor; duas instâncias (réplicas / tick+daily) duplicam lançamentos. Timezone: `setHours(0,0,0,0)` usa TZ do processo (local vs UTC na Vercel).
- **Impacto:** Integridade financeira (lançamentos duplicados).
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Unique parcial `(pai_id, data::date)` + `create` com catch de unique; ou transação `SERIALIZABLE` / advisory lock por `mae.id`. Normalizar data em UTC. Idempotency-Key no HTTP cron.
- **Esforço:** Médio.

### OPS-2-05 — Job de contas não verificadas nunca dispara

- **Evidência:** `Codigo/Pulso/api/src/jobs/unverifiedAccountCleanupJob.js:1-29`; grep de `runUnverifiedAccountCleanup` só no job e no teste; ausente em `server.js` e `cronController.js`.
- **Constatação:** Código e testes existem; operação 30 dias **não entra** em nenhum scheduler.
- **Impacto:** Higiene / superfície de contas mortas (menor que duplicata financeira).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Incluir em `daily` (ou cron semanal) depois de confirmar regra de negócio e backup.
- **Esforço:** Baixo.

### OPS-2-06 — Migrations não passam por CI nem por CD

- **Evidência:** `Codigo/Pulso/api/package.json:14-16`; nenhum step `prisma migrate deploy` em `.github/workflows/*.yml`; Fase 1 sem deploy.
- **Constatação:** Schema drift: app novo contra banco velho (P2021/P2022) ou migrate manual esquecida. Drops já ocorreram em histórico (`prisma/migrations/20260715130000_lembrete_divisao_m2m/migration.sql:1-9`).
- **Impacto:** Disponibilidade no primeiro deploy real.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Job CD: `prisma migrate deploy` com `DIRECT_URL` (secret) **antes** de apontar tráfego; expand/contract para drops. CI pode usar `prisma validate` + `migrate diff` (sem DB de prod).
- **Esforço:** Médio.

### OPS-2-07 — RabbitMQ: descarte em falha e workers desligados

- **Evidência:** `Codigo/Pulso/api/src/messaging/rabbit.js:72-85, 60-69`; `server.js:72`; `emailBridge.js:5-20` (payload com email+token na fila).
- **Constatação:** `nack(..., requeue=false)` sem `deadLetterExchange`. Sem prefetch. Sem retry/backoff. Filas durable, publish persistent — bom, mas sem consumer no processo atual. Tokens de verificação na fila são **segredo em trânsito**.
- **Impacto:** Quando religado: perda silenciosa de e-mails/alertas; duplicidade se fallback `direct` + mensagem antiga.
- **Severidade:** Média  
- **Confiança:** Alta no código; workers off reduz impacto **hoje**.
- **Recomendação:** DLQ + retry limitado **antes** de ligar consumers. Não logar payload. Compose: senha só local (já é).
- **Esforço:** Médio.

### OPS-2-08 — Health não prova dependências; processo sem shutdown gracioso

- **Evidência:** `Codigo/Pulso/api/src/app.js:57-60`; `server.js:64-105` (`prisma.$connect` só no boot; `process.exit(1)` se falhar start); nenhum `process.on('SIGTERM')`.
- **Constatação:** Load balancer/Vercel podem marcar instância saudável com Neon suspenso até a primeira query. Encerramento de plataforma corta requests/jobs no meio (recorrência).
- **Impacto:** Disponibilidade e RPO de jobs.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** `/api/health/live` (processo) vs `/api/health/ready` (`SELECT 1` com timeout curto). `SIGTERM`: stop cron, `server.close`, `prisma.$disconnect` (host long-running).
- **Esforço:** Baixo.

### OPS-2-09 — Rate limit e timeouts incompletos no caminho do usuário

- **Evidência:** `docs/3.requisitos.md:261` (RNF-004: 100 req/min **por usuário** — Pendente); `authRateLimit.js:8-19` (5/min/IP **por rota de auth**, store default memória); `Codigo/Pulso/web/src/services/api.js:4-10` (axios **sem** `timeout`); contrastar providers API com timeout (`awesomeApiProvider.js:7`, `geonamesProvider.js:93`, `duffelProvider.js:81`).
- **Constatação:** Em serverless, store memória não compartilha réplicas (RNF-004 não atendido). Cliente web pode pendurar indefinidamente. Keepalive de conexão **desligado na Vercel** (`database.js:24`) — correto para serverless; cold start Neon pode estourar RNF-001.
- **Impacto:** Abuso, saturação, latência.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Timeout axios (ex. 10s) no web; rate limit global com store compartilhado se multi-instância; documentar que RNF-004/001 dependem do host.
- **Esforço:** Médio.

### OPS-2-10 — Compose local com credenciais default; Socket.IO incompatível com o caminho Vercel

- **Evidência:** `Codigo/Pulso/api/docker-compose.yml:8-10`; `server.js:89-93`; `docs/3.requisitos.md:244` (RF-140 Socket.IO no Flutter ainda não).
- **Constatação:** Broker local previsível (ok para TI5, risco se a porta 15672 for exposta). Decisão Vercel **desliga** Socket.IO — conflito com RF-140 tempo real.
- **Impacto:** Arquitetura de deploy vs requisito de tempo real.
- **Severidade:** Baixa (compose) / **Média** se produção for Vercel (Socket.IO).
- **Confiança:** Alta  
- **Recomendação:** Host da API long-running se chat/tempo real for Sprint 3; compose não em produção.
- **Esforço:** Decisão de plataforma (Alto) / compose (N/A).

---

## 4. Pontos positivos

- **Histórico Prisma versionado** e `directUrl` para migrate (`schema.prisma:7-11`, `migration_lock.toml:3`).
- **Auth de cron** com 401/503 explícitos e testes (`cronAuthMiddleware.js`, `tests/unit/middlewares/cronAuthMiddleware.test.js`).
- **Skip se filha do dia já existe** na recorrência (`recurringTransactions.js:58-68`) — idempotência **parcial** no caso happy-path single instance.
- **Reconnect Prisma** em erro transitório (`database.js:4-14, 63-77`).
- **Timeouts** em GeoNames, Duffel, AwesomeAPI, Wikipedia (`FETCH_TIMEOUT_MS = 5000` em `tripDestinationImageService.js:6`) — lição de `maxDuration` Vercel citada em `viagemService.js:91-92`.
- **Filas durable + persistent** quando Rabbit está on (`rabbit.js:38-40, 67-68`).
- **Fallback direto** se Rabbit cai (`publishOrRun`) — degradação, não crash.
- **Rate limit de auth** já existe (melhor que nada para brute force).
- **Seed** isolado de produção (script explícito).

---

## 5. Quick wins

1. Ligar `runUnverifiedAccountCleanup` no `daily` **ou** documentar deprecação.
2. Unique `(pai_id, data)` + tratar conflito.
3. `/api/health` com `SELECT 1` (timeout 1s) como `ready`.
4. Timeout no axios da web.
5. `CRON_SECRET` required em produção (Fase 1 OPS-1-09).
6. Checklist: nunca `migrate dev` em produção; só `migrate deploy`.

---

## 6. Roadmap e riscos

| Horizonte | Ação |
|-----------|------|
| Estabilização | Um único scheduler; unique de recorrência; health ready; backup Neon documentado |
| Evolução | Religar jobs com DLQ; migrate no CD; lock distribuído se N réplicas |
| Dependência | Módulos Sprint-2 ainda comentados; decisão Vercel vs long-running |
| Residual | Drops futuros sem expand/contract; TZ do cron |
| RTO/RPO | Não mensuráveis sem backup testado |

### Perguntas externas

1. Neon está em projeto com backup automático ligado? Já houve restore?
2. Haverá uma única instância da API ou várias?
3. Socket.IO entra na Sprint 3 no mesmo host da API REST?
