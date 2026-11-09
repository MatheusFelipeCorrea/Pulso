# Auditoria de segurança — Fase 3: infraestrutura, supply chain e privacidade operacional

**Produto:** Pulso  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Overlay:** nenhum  
**Escopo:** CORS/Helmet, CI (`/.github/workflows`), dependências npm/pub, Android, Docker local, gitignore, privacidade operacional  
**Método:** revisão estática. Sem `npm audit` ofensivo contra registrars; sem publicar valores de `.env`.

---

## 1. Resumo executivo

A API aplica **Helmet** e **CORS com allowlist + credentials**, cookies com `secure` em produção, e o scan Hyperion semanal (`npm audit --audit-level=high` + TruffleHog). Isso é um bom ponto de partida.

Os gaps são típicos de monorepo acadêmico em aceleração:

- Dependabot **não está no caminho que o GitHub lê** (`/.github/dependabot.yml` ausente; o kit tem só Actions, com npm comentado);
- CI de produto usa `npm install` (não `npm ci`) e **não testa Flutter**;
- o scan de segurança **não cobre `pubspec.yaml`**;
- Android permite HTTP claro; o body JSON da API não tem teto de tamanho;
- a SPA não define CSP e carrega Google Fonts de terceiros.

Nenhum achado **Crítica** nesta fase. Prioridade: fechar supply chain e defaults de app nativo antes de store/produção.

---

## 2. Escopo e contexto detectado

### Infra no código

- API: `Codigo/Pulso/api/src/app.js` (Helmet, CORS, cookies, `express.json()`, static uploads em non-Vercel).  
- `trust proxy` se `VERCEL` ou `production`.  
- Health: `GET /api/health` sem auth (`app.js:58`).  
- Docker: `Codigo/Pulso/api/docker-compose.yml` — RabbitMQ local.  
- Sem `vercel.json` na raiz do repo (deploy implícito / ainda indefinido — alinhado a `project.yml` uncertainties).  
- IaC Kubernetes/Terraform: **N/A**.

### CI / supply chain

| Artefato | Papel |
|----------|--------|
| `.github/workflows/hyperion-security.yml` | `npm audit` em api/web; TruffleHog `--only-verified` |
| `.github/workflows/hyperion-product-ci.yml` | lint/test/build Node; **sem Flutter** |
| `Hyperion/.github/dependabot.yml` | só `github-actions`; npm/pip comentados; **não é** o arquivo raiz do GitHub |
| `Codigo/Pulso/api/package-lock.json` | lock npm da API |
| `Codigo/Pulso/web/package-lock.json` | lock npm da web |
| `Codigo/Pulso/mobile/pubspec.yaml` | Dart/Flutter; **sem** `pubspec.lock` audit no CI |

### Privacidade operacional

Política e termos na web (`PrivacyPolicy.jsx`, `privacyPolicy.js`). Contato “email informado na plataforma” sem implementação de canal DPO no código. Google Fonts (`web/index.html:8-9`). Flutter `google_fonts`.

### Itens N/A

- Orquestração cloud além de hints Neon/Vercel.  
- WAF dedicado no repo.  
- Dependabot pub (não configurado).

---

## 3. Achados priorizados

### SEC-3-01 — Dependabot npm/pub inativo no repositório GitHub

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** ausência de `/.github/dependabot.yml`; `Hyperion/.github/dependabot.yml:8-13` (ecosystem npm comentado); `project.yml` aponta scanner Dependabot no kit  
- **Cenário:** GitHub só aplica Dependabot em `/.github/dependabot.yml`. Atualizações automáticas de `express`, `axios`, `jsonwebtoken`, plugins Flutter etc. **não** abrem PRs. O workflow semanal de `npm audit` falha o job se houver high, mas não gera patch.  
- **Impacto:** CVEs alcançáveis permanecem até alguém rodar audit manualmente.  
- **Recomendação:** Copiar/ativar Dependabot na raiz para `npm` em `Codigo/Pulso/api` e `Codigo/Pulso/web`, e `pub` em `Codigo/Pulso/mobile` (quando o GitHub suportar o diretório).  
- **Validação:** PRs semanais de bump visíveis no GitHub.

### SEC-3-02 — Dependências pesadas não referenciadas em `src/`

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/package.json:31-63` (`xlsx`, `multer`, `pdfjs-dist`, `crypto-js`, `express-session`, `passport-jwt`, `socket.io`, `swagger-*` em devDependencies); `grep` em `api/src` sem imports desses módulos  
- **Cenário:** A cadeia de supply inclui parsers de planilha/PDF e sessão Express mesmo com rotas de import/socket comentadas. Pacotes como `xlsx` têm histórico de advisories; **não se afirma CVE específico só pela versão**. Superfície de `npm audit` e de um futuro `require` acidental.  
- **Impacto:** Aumento de TCB; falha de CI de audit por pacote inalcançável; risco se alguém religar import sem review.  
- **Recomendação:** Remover do `package.json` o que não é importado; reintroduzir com lockfile no PR da feature.  
- **Validação:** `npm ls` alinhado a imports; audit mais limpo.

### SEC-3-03 — CI de produto: `npm install` e Flutter fora do pipeline

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `.github/workflows/hyperion-product-ci.yml:41`, `.github/workflows/hyperion-security.yml:20` (audit só Node), `Codigo/Pulso/mobile/pubspec.yaml:1`  
- **Cenário:** `npm install` resolve o lock de forma menos rígida que `npm ci`. O job detecta npm e **não** executa `flutter test` / `dart pub outdated`. Comentário do workflow ainda diz “placeholder until scaffolded”, mas os apps existem.  
- **Impacto:** Build irreprodutível; regressão Flutter (auth headers, storage) sem rede de segurança; supply chain Dart invisível.  
- **Recomendação:** `npm ci`; job Flutter com `pub get` + `flutter test`; opcional `dart pub audit` quando disponível na toolchain.  
- **Validação:** CI vermelho se lock divergir; testes mobile no `main`.

### SEC-3-04 — Android `usesCleartextTraffic="true"`

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/mobile/android/app/src/main/AndroidManifest.xml:7`, `Codigo/Pulso/mobile/lib/core/config/app_config.dart:16` (default HTTP emulador)  
- **Cenário:** Tráfego HTTP permitido em **todo** o app, não só debug. Em release, MITM em redes abertas captura Bearer (SEC-1-01) e PII financeira.  
- **Impacto:** Compromisso de sessão mobile fora de TLS.  
- **Recomendação:** `usesCleartextTraffic` só em `src/debug`; release com network security config HTTPS.  
- **Validação:** APK release recusa `http://` de API pública.

### SEC-3-05 — `express.json()` sem limite de tamanho

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/app.js:36`  
- **Cenário:** Default ~100kb do Express 4 mudou de comportamento ao longo das versões; Express 5 + body sem `limit` explícito permite payloads grandes em rotas autenticadas (e login). Sem rate limit global.  
- **Impacto:** Memory DoS na função serverless / Node.  
- **Recomendação:** `express.json({ limit: '32kb' })` (ajustar se upload JSON for necessário).  
- **Validação:** POST acima do limite retorna 413.

### SEC-3-06 — SPA sem CSP; fontes e preconnect Google

- **Severidade:** Média  
- **Confiança:** Média  
- **Evidência:** `Codigo/Pulso/web/index.html:8`, `Codigo/Pulso/api/src/app.js:18` (Helmet na **API**, não na origem Vite)  
- **Cenário:** A API tem Helmet (HSTS/frameguard úteis no host da API). O frontend Vite não publica `Content-Security-Policy`. XSS futuro (dependência React) + SEC-1-01 = roubo de sessão via header mobile. Google Fonts = terceiro que vê IPs.  
- **Impacto:** Falta de mitigação XSS; vazamento de metadados de rede.  
- **Recomendação:** CSP em `vercel.json`/headers da web (`default-src 'self'`; fonts self-hosted).  
- **Validação:** DevTools sem violações CSP nas rotas autenticadas.

### SEC-3-07 — RabbitMQ local com credencial padrão no compose

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/docker-compose.yml:8`, `Codigo/Pulso/api/.env.example:136`  
- **Cenário:** Usuário/senha `pulso`/`pulso`, portas 5672 e 15672 publicadas no host. Aceitável em laptop; perigoso se o compose for usado em VM exposta. Mensageria está opcional (`RABBITMQ_URL`).  
- **Impacto:** Acesso à fila se a porta vazar.  
- **Recomendação:** Senha só via env; não publicar 15672 em rede não confiável.  
- **Validação:** Compose de prod sem default.

### SEC-3-08 — Sem `.gitignore` na raiz do monorepo

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** gitignores apenas em `Codigo/Pulso/api`, `web`, `mobile`, `Hyperion` (glob do repo)  
- **Cenário:** `.env` da API/web está ignorado **pelos gitignores aninhados** (`api/.gitignore:5-10`). A raiz não ignora `*.pem`, `.env` solto, dumps. Risco de commit acidental fora das pastas das apps.  
- **Impacto:** Segredo em path inesperado entrar no git.  
- **Recomendação:** `.gitignore` raiz com `.env`, `*.pem`, `coverage/`.  
- **Validação:** `git check-ignore` para um `.env` na raiz.

### SEC-3-09 — TruffleHog apenas `--only-verified`

- **Severidade:** Baixa  
- **Confiança:** Média  
- **Evidência:** `.github/workflows/hyperion-security.yml:35`  
- **Cenário:** Segredos sem verificador online (JWT, CRON_SECRET hex) podem passar. Client IDs OAuth no Flutter (`app_config.dart:5-11`) são **públicos por desenho** (não são `client_secret`).  
- **Impacto:** Falso negativo em secrets de app.  
- **Recomendação:** Scanner adicional (gitleaks) em PRs; manter `--only-verified` como camada, não única.  
- **Validação:** Fixture de `JWT_SECRET=` em arquivo rastreadível falha o CI.

---

## 4. Pontos positivos

- **Helmet** na API (`app.js:18-22`) com CORP `cross-origin` documentado para Flutter web.  
- **CORS allowlist + credentials + headers explícitos** incluindo `X-Pulso-Client` (`app.js:24-34`).  
- **gitignore de `.env`** em api e web.  
- **Scan semanal** Node + TruffleHog; permissões do workflow `contents: read`.  
- **Lockfiles npm** presentes.  
- **Health check** mínimo, sem dump de env.  
- **Erros 500** sem stack no cliente (`errorMiddleware.js:33`).  
- **Prisma + SSL** nos exemplos Neon (`sslmode=require` no `.env.example`).  
- Flutter **secure storage** para tokens (fase 1).

---

## 5. Quick wins

1. Criar `/.github/dependabot.yml` para npm (api+web).  
2. Trocar `npm install` por `npm ci`.  
3. `express.json({ limit: '32kb' })`.  
4. Cleartext só no flavor debug.  
5. Podar `xlsx`/`multer`/`pdfjs-dist` até a feature existir.

---

## 6. Roadmap e riscos

| Prazo | Itens |
|-------|--------|
| Imediato | SEC-3-04 (se houver build store), SEC-3-05 |
| Curto | SEC-3-01, SEC-3-02, SEC-3-03, SEC-3-06 |
| Contínuo | SEC-3-07 a SEC-3-09; revisar CORS_ORIGIN a cada preview |

**Riscos residuais:** deploy ainda indefinido (`project.yml` uncertainties) — HSTS/cookies `SameSite=None` dependem de split de domínio. Sem WAF no repo. `pubspec.yaml` sem pin de hash (padrão pub).

**Pergunta:** a origem de produção será same-site (`/api` no mesmo host)? Isso reduz SEC-1-08 e simplifica cookies; não elimina supply chain.
