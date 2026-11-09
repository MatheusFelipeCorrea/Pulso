# DevOps — Sumário executivo

**Projeto:** Pulso (monorepo `Codigo/Pulso/{api,web,mobile}`)  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Protocolo:** `Hyperion/.github/audits/prompts/devops.md`  
**Contrato:** `.github/project.yml` (`ci.policy: detect`, `ci.hyperion.product_ci: auto`, overlay `null`)  
**Relatórios:**  
- `devops-fase-1-cicd-ambientes.md`  
- `devops-fase-2-jobs-confiabilidade.md`  
- `devops-fase-3-observabilidade-custos.md`  

**Este audit não alterou workflows, Dependabot, Docker nem código de produto.**

---

## Veredito

Maturidade operacional **inicial / pré-produção**. Há base saudável de *dev* (Prisma, `.env.example`, Helmet/CORS, cron HTTP autenticado, Winston, health stub) e **apenas CI Hyperion + product-ci placeholder**. Não há CD, backup comprovado, observabilidade acionável nem scheduler de produção versionado.

A política **`detect` está correta.** O repositório **não** tem CI de produto independente (`ci.yml` / `deploy.yml`). O que existe é:

| Camada | O que o GitHub executa |
|--------|-------------------------|
| Produto | `.github/workflows/hyperion-product-ci.yml` (placeholder npm api+web) |
| Kit | `.github/workflows/hyperion-security.yml`, `hyperion-sync-cards.yml` |
| Kit aninhado | `Hyperion/.github/workflows/*` **não dispara** (incluindo `hyperion-validate.yml`; `kit_validation: false`) |

**Recomendação (não executada):** `pipeline-architect` (`/pipeline`) para *planejar* CI monorepo (api + web + Flutter, `npm ci`, cache, permissões). **Não sobrescrever** workflows sem aprovação explícita.

---

## Contagem de severidade

| Severidade | Fase 1 | Fase 2 | Fase 3 | **Total** |
|------------|--------|--------|--------|-----------|
| Crítica | 0 | 0 | 0 | **0** |
| Alta | 4 | 4 | 2 | **10** |
| Média | 5 | 6 | 5 | **16** |
| Baixa | 1 | 0 | 1 | **2** |
| **Achados** | 10 | 10 | 8 | **28** |

IDs: `OPS-1-01` … `OPS-1-10`, `OPS-2-01` … `OPS-2-10`, `OPS-3-01` … `OPS-3-08`.

---

## Riscos operacionais no topo

Ordenados por combinação impacto × evidência (não por ID).

1. **Deploy e cron de produção indefinidos** (`OPS-1-02`, `OPS-1-03`, `OPS-2-01`)  
   Vercel/Neon no código; sem `vercel.json`; node-cron desliga se `VERCEL`; docs `Hospedagem.md`/`Cron.md` quebrados. Jobs de token/recorrência podem **nunca rodar**.

2. **Sem CD, migrate nem rollback** (`OPS-1-02`, `OPS-2-06`)  
   Primeiro go-live arrisca schema drift (`prisma migrate deploy` só existe como script local).

3. **CI placeholder não cobre o monorepo** (`OPS-1-01`, `OPS-1-05`, `OPS-1-07`)  
   Flutter e E2E fora; `npm install` não hermético. Gates insuficientes para `main`.

4. **Integridade de recorrência** (`OPS-2-04`)  
   Check-then-insert sem unique `(pai_id, data)` — duplicata financeira sob overlap/réplicas/TZ.

5. **Backup RNF-008 sem restore** (`OPS-2-03`)  
   Dados financeiros; RPO não declarado. Neon PITR, se existir, não está evidenciado no git.

6. **Boot Vercel com env incompleto** (`OPS-1-08`)  
   `env.js` não dá `exit` na Vercel — processo pode servir com JWT/DB undefined.

7. **Jobs/workers Sprint-2 desligados** (`OPS-2-02`)  
   Alertas, filas e Socket.IO comentados; religar `jobBridge` quebraria o boot (jobs importados inexistentes).

8. **Cegueira operacional** (`OPS-3-01`, `OPS-3-02`, `OPS-3-03`)  
   Logs texto/`warn`/sem metadados; health estático; zero métricas/alertas/synthetics. RNF-001/007/009 não mensuráveis.

9. **Dependabot inativo no produto** (`OPS-1-04`)  
   Arquivo só em `Hyperion/.github/dependabot.yml` — o GitHub não o consome.

10. **Custo/terceiros sem teto** (`OPS-3-05`, `OPS-3-06`)  
    Gemini, Duffel live, cold start Neon+Vercel vs RNF-001.

---

## O que já está bem (evidência)

- Lockfiles api/web; Prisma `directUrl` + `binaryTargets` rhel; `.env` gitignorado.
- Scan semanal `npm audit` + TruffleHog; sync-cards com concurrency.
- Cron HTTP com `CRON_SECRET` e testes de middleware.
- Reconnect Prisma; timeouts em providers; cache de câmbio 5 min.
- Helmet, CORS allowlist, rate limit de auth, erros 500 opacos para o cliente.
- Contrato honesto: incerteza de URL pública e RNFs pós-hospedagem.

---

## N/A e limitações

- Sem IaC, sem Kubernetes, sem overlay de auditoria.
- **Não observados:** branch protection, Environments GitHub, projeto Vercel, dashboard Neon (backup), secrets reais, duração real do product-ci.
- Estado de produção “já no ar” é **incerteza** (`project.yml:93`).

---

## Roadmap consolidado

| Prioridade | Ação | Skill / dono |
|------------|------|----------------|
| 1 | Decidir host API (Vercel serverless **ou** long-running) e versionar manifesto (`vercel.json` **ou** runbook 24/7) | Time + docs |
| 2 | **`/pipeline`** (detect): CI api/web/mobile, `npm ci`, permissions, Dependabot na **raiz** | `pipeline-architect` |
| 3 | Unique de recorrência + um scheduler só + health ready | API |
| 4 | Backup Neon + drill de restore; migrate no futuro CD | Ops |
| 5 | Winston JSON `info`; synthetic após URL | API + ops |
| 6 | Falha de ready se env incompleto na Vercel | API |

**Não fazer agora:** copiar `Hyperion/.github/workflows` por cima do product-ci; religar Rabbit/Socket sem DLQ e host adequado.

---

## Quick wins (alto retorno, baixo esforço)

- `commands:` no `project.yml` (test/lint/build).
- Unique Prisma + `CRON_SECRET` required em produção.
- Health `SELECT 1`; timeout axios web.
- Logs JSON; consertar log fantasma `/api/docs`.
- Dependabot na raiz (PR separado, não neste audit).

---

## Contagem rápida para o board

| | |
|--|--|
| Crítica | 0 |
| Alta | 10 |
| Média | 16 |
| Baixa | 2 |
| Top 3 ops | Cron/deploy partido; sem backup/CD; CI placeholder + cegueira de logs |

CI detectado: **somente Hyperion (security, sync-cards) + `hyperion-product-ci` placeholder.** Recomendação: **`pipeline-architect` / `/pipeline`** — arquivos de pipeline **não** foram modificados.
