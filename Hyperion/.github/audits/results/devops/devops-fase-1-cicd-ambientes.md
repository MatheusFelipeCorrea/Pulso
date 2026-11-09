# DevOps — Fase 1: CI/CD e ambientes

**Projeto:** Pulso  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Overlay:** nenhum (`audits.overlay: null`)  
**Política CI:** `detect` (`.github/project.yml:71-79`)  
**Escopo desta fase:** pipelines, reprodutibilidade, ambientes, secrets versionados, release/rollback.  
**Não alterado:** workflows, código de produto, Dependabot, Docker.

---

## 1. Resumo executivo

A entrega versionada existe, mas **não há pipeline de produto madura nem CD**. No root do repositório GitHub há apenas workflows Hyperion (`hyperion-product-ci`, `hyperion-security`, `hyperion-sync-cards`). O `hyperion-product-ci.yml` ainda é o placeholder gerado pelo kit (comentário de “apps não scaffolded”), embora API, Web e Flutter já existam.

`ci.policy: detect` está correto: **não se deve sobrescrever** o que já está em `.github/workflows/`. A recomendação operacional é rodar **`pipeline-architect` (`/pipeline`)** para *planejar* um CI monorepo (api + web + Flutter, `npm ci`, cache, permissões mínimas) — **somente após aprovação explícita**, e sem este audit aplicar mudanças.

Não há workflow de deploy, promoção, smoke ou rollback. O contrato do produto declara deploy de produção indefinido (Vercel/Neon no código; URL pública ainda não). Falta `vercel.json` no repositório. Dependabot do kit vive em `Hyperion/.github/dependabot.yml` e **não é o arquivo que o GitHub consome** (espera-se `.github/dependabot.yml` na raiz do repo).

**Riscos principais desta fase:** gates de qualidade incompletos (Flutter fora; install não hermético); impossibilidade de promover um artefato rastreável; risco de subir a API na Vercel com variáveis obrigatórias ausentes.

---

## 2. Escopo e contexto detectado

### Contrato (`project.yml`)

| Campo | Valor |
|-------|--------|
| Layout | monorepo — `Codigo/Pulso/{api,web,mobile}` |
| CI provider | github-actions |
| policy | **detect** |
| stack | node-npm |
| hyperion.cards_sync | true |
| hyperion.kit_validation | false |
| hyperion.security_scan | true |
| hyperion.product_ci | auto |
| commands.test/lint/build | `null` |
| uncertainties | Deploy de produção indefinido |

### Workflows que **executam** (raiz `.github/workflows/`)

| Arquivo | Papel |
|---------|--------|
| `.github/workflows/hyperion-product-ci.yml` | Placeholder lint/test/build Node (api + web) em `push`/`pull_request` para `main` |
| `.github/workflows/hyperion-security.yml` | `npm audit` (api/web/root) + TruffleHog; cron semanal + `workflow_dispatch` |
| `.github/workflows/hyperion-sync-cards.yml` | Sync de cards Hyperion em `main` (paths do kit) + `workflow_dispatch` |

### Workflows **aninhados no kit** (não disparam no GitHub do produto)

`Hyperion/.github/workflows/hyperion-*.yml` (incluindo `hyperion-validate.yml`) são templates do kit. O GitHub Actions só carrega `.github/workflows/` na raiz do repositório. Com `kit_validation: false`, a validação do kit **não** está instalada no produto — esperado.

### Stack e onboarding

- API: Node/Express, Prisma 5.22, lockfile `Codigo/Pulso/api/package-lock.json`. Scripts: `lint`, `test` (Jest), sem `build`. `postinstall`: `prisma generate`.
- Web: Vite/React, `engines.node >= 22.12.0`, lockfile presente. Scripts: `lint`, `test` (`vitest`, não `vitest run`), `build`, `test:e2e` (Playwright).
- Mobile: Flutter SDK `^3.13.2`, testes em `Codigo/Pulso/mobile/test/`. **Fora do CI.**
- Docker produto: apenas `Codigo/Pulso/api/docker-compose.yml` (RabbitMQ local). `Hyperion/Dockerfile` é runtime do CLI do kit, não da API.

### Ambientes

| Ambiente | Evidência no repo | Estado observável |
|----------|-------------------|-------------------|
| Desenvolvimento local | READMEs, `.env.example`, Vite proxy `:5173` → `:3333` | Documentado |
| CI (GitHub Actions) | workflows Hyperion | Parcial |
| Produção / preview | Hints Vercel + Neon no código e docs | **Não versionado** (sem `vercel.json`, sem CD) |
| Staging | — | **N/A** |

### N/A nesta fase

- IaC (Terraform/Pulumi/CDK): não encontrado.
- Branch protection / Environments do GitHub: estado externo, não verificado.
- Overlay de auditoria: nenhum.

### Limitação

Secrets, variáveis (`HYPERION_AUDIT_SOFT`), Neon dashboard, projeto Vercel e proteção de `main` **não são observáveis** neste audit.

---

## 3. Achados priorizados

### OPS-1-01 — CI de produto é placeholder Hyperion; monorepo já está scaffolded

- **Evidência:** `.github/workflows/hyperion-product-ci.yml:1-48`; `.github/project.yml:71-79`; `Codigo/Pulso/api/package.json:1-22`; `Codigo/Pulso/web/package.json:1-18`; `Codigo/Pulso/mobile/pubspec.yaml:1-7`.
- **Constatação:** O workflow declara *“Placeholder until React / Node / Flutter are scaffolded”* e detecta só npm **ou** Flutter (o primeiro lock/package.json npm ganha). Com apps Node presentes, Flutter nunca entra. Um único job sequencial: `npm install` (não `npm ci`) + lint/test/build `--if-present` em api e web. Sem cache, sem matrix, sem `permissions`, sem `concurrency`.
- **Impacto:** Entrega — regressões Flutter e falhas de lockfile passam despercebidas; feedback lento; política `detect` impede overwrite automático.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Executar **`pipeline-architect` (`/pipeline`)** em modo detect: planejar jobs separados api/web/mobile, `npm ci`, cache npm, `CI=true` + `npm run test:run` na web, `flutter analyze` + `flutter test`. **Não aplicar** sem aprovação. Não copiar `Hyperion/.github/workflows/` à mão.
- **Esforço:** Médio (depende de aprovação `/pipeline`).

### OPS-1-02 — Inexistência de CD, promoção, smoke e rollback

- **Evidência:** nenhum workflow `deploy`/`release` na raiz; `.github/project.yml:93`; `docs/3.requisitos.md:301`.
- **Constatação:** Não há artefato promovido (imagem, build Vite versionado, tag). Deploy de produção está como incerteza do contrato. RNF-003 (HTTPS) permanece pendente no doc de requisitos.
- **Impacto:** Confiabilidade e entrega — rollback seria manual e não rastreável (commit ≠ release).
- **Severidade:** Alta  
- **Confiança:** Alta (ausência no repo; estado Vercel externo = confiança média sobre “nada está no ar”).
- **Recomendação:** Decidir host (Vercel serverless vs API long-running). Versionar manifesto de plataforma + job de migrate/smoke **depois** do CI verde. Até lá, tratar produção como não operacional para SLOs.
- **Esforço:** Alto.

### OPS-1-03 — Contrato Vercel/Neon no código sem `vercel.json` nem docs de hospedagem

- **Evidência:** `Codigo/Pulso/api/src/server.js:70-93`; `Codigo/Pulso/api/src/config/database.js:44-54`; `Codigo/Pulso/api/.env.example:124-147`; `Codigo/Pulso/web/Documents/Readme.md:26-35` (links para `Deploy/Hospedagem.md`, `Modulos/Cron.md` — arquivos **não encontrados** no tree); busca `vercel.json` = 0 arquivos.
- **Constatação:** Runtime ramifica em `process.env.VERCEL` (desliga node-cron e Socket.IO; usa adapter Neon). Cron de plataforma exigiria `vercel.json` `crons` + `CRON_SECRET`. Documentação operacional referenciada não existe no repositório.
- **Impacto:** Entrega e confiabilidade — deploy “na Vercel” reproduzível a partir do git é impossível; jobs agendados de produção ficam no limbo (ver Fase 2).
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Ou versionar `vercel.json` (rewrites web→API, crons, `maxDuration`) e os runbooks citados, ou documentar host long-running e **não** depender de `VERCEL`. Alinhar `project.yml` uncertainties quando a URL existir.
- **Esforço:** Médio.

### OPS-1-04 — Dependabot do kit não está no path que o GitHub lê

- **Evidência:** `Hyperion/.github/dependabot.yml:1-13` (só `github-actions` em `directory: "/"`; npm/pip comentados). Não há `.github/dependabot.yml` na raiz do produto.
- **Constatação:** Dependabot GitHub procura o arquivo na raiz do repositório. O arquivo do kit aninhado **não atualiza** Actions do produto nem lockfiles de `Codigo/Pulso/*`.
- **Impacto:** Segurança e custo de manutenção — CVEs em Express/Prisma/Vite só aparecem no `npm audit` semanal do `hyperion-security.yml`.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Via `/pipeline` ou PR manual: `.github/dependabot.yml` na raiz com `github-actions` + `npm` em `/Codigo/Pulso/api` e `/Codigo/Pulso/web` (+ `pub` para Flutter se desejado). Limite de PRs. **Não feito neste audit.**
- **Esforço:** Baixo.

### OPS-1-05 — Build de CI não hermético; Node da web mais estrito que o runner

- **Evidência:** `.github/workflows/hyperion-product-ci.yml:30-34` (`node-version: "22"`), `:40-47` (`npm install`); `Codigo/Pulso/web/package.json:5-7` (`>=22.12.0`); lockfiles presentes em api e web; `Codigo/Pulso/api/package.json:9` (`postinstall: prisma generate`).
- **Constatação:** `npm install` pode resolver fora do lock. Sem `cache: npm`. API sem campo `engines`. `prisma generate` no postinstall exige que o CI tenha schema acessível (ok) mas aumenta tempo e acopla install a binários Prisma (`binaryTargets` inclui `rhel-openssl-3.0.x` — adequado a runners Ubuntu/Vercel).
- **Impacto:** Reproduzibilidade — “passa na minha máquina” / drift de lock.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** `npm ci`; pin `22.12` ou `22`; cache por `package-lock.json`; `CI=true` explícito; na web preferir `npm run test:run` em vez de `npm test` (`vitest` watch). GitHub define `CI=true` (Vitest tende a não ficar em watch) — risco residual se o job for reusado fora do GHA.
- **Esforço:** Baixo.

### OPS-1-06 — Superfície de supply chain e permissões do product-ci

- **Evidência:** `.github/workflows/hyperion-product-ci.yml:15` (`actions/checkout@v5`) — sem `permissions:` no workflow; `.github/workflows/hyperion-security.yml:8-10` (permissions explícitas) vs `:35-38` (`trufflesecurity/trufflehog@v3.97.0` por tag, não SHA); `.github/workflows/hyperion-sync-cards.yml:25-32` (concurrency + permissions).
- **Constatação:** Product-ci herda permissões default do repositório (frequentemente mais largas que `contents: read`). Actions flutuam em major tag. Sync-cards e security estão melhores neste aspecto.
- **Impacto:** Segurança da entrega (PR de fork / token).
- **Severidade:** Média  
- **Confiança:** Média (default de permissões GHA é configuração da org, não visível).
- **Recomendação:** `permissions: contents: read` no product-ci; `concurrency` com cancel-in-progress em PRs; pin SHA das actions quando o `/pipeline` for aplicado.
- **Esforço:** Baixo.

### OPS-1-07 — Flutter e E2E web fora da qualidade automatizada

- **Evidência:** `Codigo/Pulso/mobile/test/*.dart` (vários testes); `.github/workflows/hyperion-product-ci.yml:20-28` (Flutter só se **não** houver package.json npm); `Codigo/Pulso/web/package.json:17`; `Codigo/Pulso/web/playwright.config.js:1-30`; pasta `Codigo/Pulso/web/e2e/` **inexistente**.
- **Constatação:** RF-140 (app nativo) não tem gate. Playwright está configurado (retries em CI, webServer `npm run dev`) mas sem specs e sem job.
- **Impacto:** Entrega — quebra mobile e fluxos UI críticos só aparecem manualmente.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Job `mobile` com Flutter stable; job e2e opcional depois que existirem specs. Incluir no plano `/pipeline`.
- **Esforço:** Médio.

### OPS-1-08 — Startup na Vercel não aborta com variáveis obrigatórias ausentes

- **Evidência:** `Codigo/Pulso/api/src/config/env.js:1-31`.
- **Constatação:** Fora da Vercel, `missing.length > 0` faz `process.exit(1)`. Em `NODE_ENV === 'production' && VERCEL`, apenas `console.error` — o módulo exporta `undefined` para JWT/DB. Comentário: exit quebraria o bundle serverless.
- **Impacto:** Segurança e confiabilidade — instância “sobe” e falha de forma opaca ou insegura (JWT indefinido).
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Falhar o **handler** na primeira request (health 503) se `missing.length`; validar env no build Vercel (`ignoreCommand` / script `check-env`). Não usar `process.exit` no cold start se a plataforma proibir — mas **não servir tráfego**.
- **Esforço:** Baixo (código; fora do escopo deste audit).

### OPS-1-09 — `CRON_SECRET` e SMTP fora do contrato de required vars

- **Evidência:** `Codigo/Pulso/api/src/config/env.js:7-18` vs `:57-64`; `Codigo/Pulso/api/src/middlewares/cronAuthMiddleware.js:6-14`; `Codigo/Pulso/api/.env.example:52-80,124-129`.
- **Constatação:** Cron HTTP responde 503 se `CRON_SECRET` vazio (bom), mas o boot não exige o secret. SMTP não é required — e-mails de verificação (RF-003/004) falham só em runtime.
- **Impacto:** Confiabilidade operacional em promoção de ambiente.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Required condicional: `CRON_SECRET` se `VERCEL` ou `NODE_ENV=production`; SMTP required em produção. Espelhar no `.env.example` e no futuro runbook.
- **Esforço:** Baixo.

### OPS-1-10 — Comandos canônicos nulos no contrato; imagem Docker só do kit

- **Evidência:** `.github/project.yml:81-85`; `Hyperion/Dockerfile:1-22`; `Codigo/Pulso/api/docker-compose.yml:1-16`; `Codigo/Pulso/api/README.md:11-22`.
- **Constatação:** Hyperion não sabe `test`/`lint`/`build` do produto. Onboarding API usa `npm install` + migrate local. Compose sobe RabbitMQ com usuário/senha `pulso`/`pulso` (dev).
- **Impacto:** Onboarding e automação (`hyperion:repo-detect`) fracos; compose não é ambiente completo da API.
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Preencher `commands:` no `project.yml` no próximo `/discover`. Dockerfile de API só se o host escolhido for container — hoje N/A para Vercel.
- **Esforço:** Baixo.

---

## 4. Pontos positivos

- **Lockfiles versionados** da API e da Web (`Codigo/Pulso/api/package-lock.json`, `Codigo/Pulso/web/package-lock.json`) — base para `npm ci`.
- **Prisma `binaryTargets`** inclui `rhel-openssl-3.0.x` (`Codigo/Pulso/api/prisma/schema.prisma:1-4`) — alinhado a Linux serverless.
- **Separação DATABASE_URL (pooler) / DIRECT_URL (migrate)** documentada em `Codigo/Pulso/api/.env.example:8-17` e no schema (`schema.prisma:7-11`).
- **`.env` gitignorado** em api e web (`Codigo/Pulso/api/.gitignore:4-10`, `Codigo/Pulso/web/.gitignore:26-32`); exemplos sem credenciais reais.
- **Scan semanal** `npm audit --audit-level=high` + TruffleHog verified (`.github/workflows/hyperion-security.yml:20-38`) com `permissions` mínimas de contents/security-events.
- **Sync de cards** com `concurrency` e cancel-in-progress (`.github/workflows/hyperion-sync-cards.yml:25-27`).
- **Helmet + CORS por allowlist + trust proxy** em produção/Vercel (`Codigo/Pulso/api/src/app.js:12-34`).
- **Rate limit de auth** por rota (`Codigo/Pulso/api/src/middlewares/authRateLimit.js:8-30`).
- Política **`detect`** evita overwrite acidental de CI de produto.

---

## 5. Quick wins

1. Preencher `commands.test/lint/build` em `project.yml` (sem mudar workflows).
2. Trocar o step npm do product-ci para `npm ci` + `npm run test:run` na web — **somente via `/pipeline` aprovado**.
3. Criar `.github/dependabot.yml` na raiz (cópia ajustada do kit).
4. `permissions: contents: read` no product-ci.
5. Falha explícita de health se env incompleto na Vercel (OPS-1-08).
6. Restaurar ou criar `Deploy/Hospedagem.md` e `Modulos/Cron.md` apontados pelo Documents.

---

## 6. Roadmap e riscos

| Horizonte | Ação |
|-----------|------|
| Estabilização | `/pipeline` (detect): CI real api+web+mobile; Dependabot raiz; env check |
| Evolução | CD com migrate `prisma migrate deploy` + smoke `/api/health`; ambientes GitHub |
| Dependência | Decisão Vercel serverless vs API 24/7 (Socket.IO / node-cron) |
| Residual | Branch protection e secrets da org não auditáveis aqui |
| Decisão pendente | URL pública e provedor final (`project.yml:93`) |

**Recomendação de skill (sem executar):** `pipeline-architect` / `/pipeline`. Política permanece `detect`. **Nenhum arquivo de workflow foi modificado neste audit.**

### Perguntas externas (mudam a avaliação)

1. Já existe projeto Vercel/Neon ligados a este GitHub, só que fora do repo?
2. A API de TI5 será long-running (obrigatório para Socket.IO e node-cron) ou serverless?
3. Há branch protection em `main`?
