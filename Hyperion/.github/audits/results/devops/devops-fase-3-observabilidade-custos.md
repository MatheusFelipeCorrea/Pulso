# DevOps — Fase 3: Observabilidade e custos

**Projeto:** Pulso  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Fases anteriores:** CI/CD; jobs/reliability.  
**Escopo desta fase:** logs, métricas, tracing, health, alertas, performance, custo.  
**Não alterado:** código de produto, workflows.

---

## 1. Resumo executivo

A API tem **Winston em console** (`Codigo/Pulso/api/src/utils/logger.js`) — alinhado a `docs/3.requisitos.md:299` como mecanismo de log — mas o formato é texto colorido, nível `warn` em produção, sem JSON, sem `request_id`, sem redaction. Metadados passados como segundo argumento em jobs **não entram** no printf.

Não há métricas (latência, erros, saturação), tracing, APM, alertas, synthetics nem runbooks. `/api/health` não mede Neon. RNF-001 (2s), RNF-007 (500 concorrentes) e RNF-009 (95% disponibilidade) estão **pendentes** e o próprio doc admite validação só após hospedagem pública (`docs/3.requisitos.md:274`).

Custos no free tier (Neon scale-to-zero, Vercel Hobby cron, Gemini, Duffel live, Blob) **não têm cota nem painel** no código. Cache in-memory de câmbio (TTL 5 min) reduz chamadas AwesomeAPI/Frankfurter em processo longo, mas some no cold start serverless.

**Riscos principais desta fase:** incidente sem sinal; SLO impossível de provar; fatura surpresa (Gemini/Duffel); logs inúteis em produção (`info` de jobs descartado).

---

## 2. Escopo e contexto detectado

### Logging

| Aspecto | Estado |
|---------|--------|
| Biblioteca | Winston 3 (`package.json` / `logger.js:1-21`) |
| Transporte | Console apenas |
| Formato | `printf` texto; `colorize()` no transport |
| Nível | `production` → `warn`; senão `debug` (`logger.js:4`) |
| Estrutura | Sem `splat` / JSON / campos (`userId`, `route`) |
| Correlação | Sem `request_id` (grep em `api/src` = 0) |
| Erros HTTP | `errorMiddleware.js:20-31` loga mensagem + **stack** em 500; cliente recebe genérico |

### Health / synthetics

- Liveness estático: `app.js:57-60`.
- Log de URL de health no boot: `server.js:99`.
- Sem uptime robot, Sem Grafana, Sem OpenTelemetry de produto (apenas dependência transitiva no lock da web).

### Métricas, alertas, runbooks

- N/A no repositório (sem Prometheus, Datadog, Sentry, PagerDuty, `runbook*`).
- Swagger (`swagger-jsdoc`, `swagger-ui-express`) está em `devDependencies` mas **não há mount** `/api/docs` no `app.js` — o boot **anuncia** a URL (`server.js:98`).

### Performance / custo (código)

- Cache câmbio `CACHE_TTL_MS = 5 * 60 * 1000` (`awesomeApiProvider.js:6-25`) — Map em memória.
- Timeouts em providers externos (Fase 2).
- `@vercel/blob` e `BLOB_READ_WRITE_TOKEN` no env — **sem uso** em `src/` além de `env.js`.
- Gemini PDF e Duffel opcionais (`.env.example:45-113`).
- `postinstall` `prisma generate` no CI (custo de minutos de runner).
- Web axios sem timeout (Fase 2).
- Jest/Vitest coverage **não** roda no product-ci (`npm test`, não `test:coverage`); limiares existem mas não são gate.

### N/A

- Tracing distribuído (não há malha de N serviços instrumentados).
- CDN/cache HTTP de API (SPA Vite `dist` seria estático se houver CD).
- Quotas Vercel/Neon no git.

---

## 3. Achados priorizados

### OPS-3-01 — Logs não operacionais em produção

- **Evidência:** `Codigo/Pulso/api/src/utils/logger.js:3-20`; `tokenCleanupJob.js:25`; `unverifiedAccountCleanupJob.js:17-20`.
- **Constatação:** Nível `warn` omite `info` dos jobs (limpeza, recorrência, Rabbit). `colorize` polui agregadores. `printf` usa só `message` — o objeto `summary` do cleanup **não é serializado** (Winston sem `splat`/`json()`). Sem rotação (só stdout — ok na Vercel; ruim se alguém redirecionar arquivo).
- **Impacto:** Diagnóstico de incidente e auditoria de jobs.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** JSON em produção (`winston.format.json()`), nível `info`, sem colorize; `splat` ou `logger.info('msg', { ...summary })` com format que preserve `splat`. Nunca logar `CRON_SECRET`, JWT, tokens de e-mail.
- **Esforço:** Baixo.

### OPS-3-02 — Sem métricas, tracing, alertas nem ownership de incidente

- **Evidência:** ausência de instrumentação em `Codigo/Pulso/api/src`; `docs/3.requisitos.md:257-265, 274` (RNF-001/007/009 pendentes).
- **Constatação:** Não há RED/USE metrics, SLO mensurável, alerta de error-rate, nem on-call. Disponibilidade 95% não pode ser calculada.
- **Impacto:** Resposta a incidente e cumprimento de RNF.
- **Severidade:** Alta  
- **Confiança:** Alta (ausência no repo; um dashboard Vercel externo não está evidenciado).
- **Recomendação:** Mínimo: (1) logs JSON + health ready; (2) uptime check 1–5 min em `/api/health/ready`; (3) após host definido, métricas de plataforma (Vercel Analytics / Neon metrics) documentadas. Sentry opcional para 500. Runbook de “API down / Neon awake”.
- **Esforço:** Médio.

### OPS-3-03 — Health check não é sinal de capacidade

- **Evidência:** `Codigo/Pulso/api/src/app.js:57-60` (`status: 'ok'` sem Prisma).
- **Constatação:** Synthetic que bata só nesse path **não** detecta Neon paused, migrate pendente ou JWT quebrado (OPS-1-08).
- **Impacto:** Falso positivo de disponibilidade (RNF-009).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Ready = DB ping; não exigir Google/SMTP no ready (evita flapping). Live = processo up.
- **Esforço:** Baixo.

### OPS-3-04 — RNFs de latência/carga/disponibilidade sem medição

- **Evidência:** `docs/3.requisitos.md:257, 263, 265, 274`.
- **Constatação:** 2s “em condições normais” conflita com cold start Neon+Vercel (doc já admite). 500 usuários simultâneos no free tier não tem teste de carga nem limite de connection pool documentado.
- **Impacto:** Expectativa de qualidade vs realidade de hobby tier.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Redigir SLO realista (ex. 95% das requests autenticadas < 2s **excluindo** cold start) **depois** de ter host e métricas. Não prometer 500 concorrentes no Neon free sem prova.
- **Esforço:** Médio (produto + ops).

### OPS-3-05 — Custo e quota de terceiros sem guarda-rail

- **Evidência:** `.env.example:45-51, 105-113, 141-147`; `package.json` `@vercel/blob`, Gemini, Duffel; `awesomeApiProvider.js:6-7` (cache 5 min, timeout 8s).
- **Constatação:** `GEMINI_API_KEY_PDF` e `DUFFEL_ACCESS_TOKEN` live são pay-as-you-go. Blob não está wired no src — risco de uso futuro sem lifecycle. Cache in-memory **não** limita Gemini. Sem budget alert no repo.
- **Impacto:** Custo; throttling de API terceira vira 500.
- **Severidade:** Média  
- **Confiança:** Média (uso real de Gemini/Duffel no tree atual não foi mapeado arquivo a arquivo além do env; dependências e exemplos existem).
- **Recomendação:** Feature flag + teto diário no service; preferir `duffel_test_` até go-live; alertas de billing nas consoles; não commitar tokens. Revisar se `@vercel/blob` deve permanecer se uploads locais bastam na disciplina.
- **Esforço:** Médio.

### OPS-3-06 — Cold start e cache local vs custo/latência

- **Evidência:** `database.js:24-26, 44-54`; `awesomeApiProvider.js:9-25`; `docs/3.requisitos.md:274`.
- **Constatação:** Serverless: cada isolado tem cache vazio → mais egress para AwesomeAPI/Frankfurter. Neon wake adiciona segundos. Keepalive 4 min só no long-running — bom para esse modo.
- **Impacto:** Custo de compute + falha de RNF-001.
- **Severidade:** Média  
- **Confiança:** Alta no código; magnitude do cold start = externa.
- **Recomendação:** Se serverless: cache de cotação em Neon/KV. Se long-running: manter keepalive. Medir p95 após URL pública.
- **Esforço:** Médio.

### OPS-3-07 — Stack de erro e PII

- **Evidência:** `errorMiddleware.js:29-36`; Winston sem mask; `emailBridge.js:5-18` (token na mensagem de fila — Fase 2).
- **Impacto:** Segurança/LGPD se logs de plataforma retiverem stack + query strings.
- **Severidade:** Média  
- **Confiança:** Média (depende do que cai em `err.message`).
- **Recomendação:** Não logar body; truncar stack em produção; nunca logar tokens de e-mail/cron.
- **Esforço:** Baixo.

### OPS-3-08 — `/api/docs` anunciado sem implementação; cobertura fora do CI

- **Evidência:** `server.js:98`; `app.js` sem swagger; `package.json:73-74`; `jest.config.js:37-44`; `web/package.json:14-16`; `vite.config.js:43-48`; product-ci usa `npm test` (`hyperion-product-ci.yml:46`).
- **Constatação:** Operador segue o log e toma 404. RNF-015 (85% serviços) pendente; thresholds Jest/Vitest **não** são gate do CI (coverage não coletado no script `test`).
- **Impacto:** Onboarding e qualidade (custo de regressão).
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Remover log de docs ou montar Swagger só em non-prod. Coverage no CI quando `/pipeline` existir — não neste audit.
- **Esforço:** Baixo.

---

## 4. Pontos positivos

- Winston **existe** e é o mecanismo declarado nos requisitos (`docs/3.requisitos.md:299`, `logger.js:3`).
- Cliente **não** recebe stack (`errorMiddleware.js:33-36`).
- Timeouts em integrações caras/lentas (Wikipedia 5s, Duffel 15s, AwesomeAPI 8s).
- Cache de câmbio com TTL (reduz custo/quota da AwesomeAPI no processo longo).
- Health path estável e documentado no boot (`server.js:99`).
- Doc de requisitos é honesto sobre free tier / cold start (`docs/3.requisitos.md:274`).
- Security workflow semanal (`hyperion-security.yml:4-5`) — sinal de higiene, não de APM.

---

## 5. Quick wins

1. JSON + nível `info` no Winston de produção; remover colorize.
2. Incluir `summary` no message string (`JSON.stringify`) até haver splat.
3. Ready check Prisma.
4. Synthetic gratuito (cron HTTP) quando houver URL — com `CRON_SECRET` **não** no health público.
5. Timeout axios web (também Fase 2).
6. Apagar ou implementar `/api/docs`.

---

## 6. Roadmap e riscos

| Horizonte | Ação |
|-----------|------|
| Estabilização | Logs JSON; health ready; synthetic pós-URL |
| Evolução | Error tracking; dashboard Neon/Vercel; SLO escrito |
| Custo | Flags Gemini/Duffel; revisar Blob não usado |
| Residual | Sem tracing até haver N serviços |
| Decisão | Host define se cache in-memory vale a pena |

### Perguntas externas

1. Haverá URL pública nesta disciplina com uptime check da PUC/GitHub?
2. Contas Gemini/Duffel são free-tier com billing travado?
3. Alguém olha o `npm audit` semanal do `hyperion-security`?
