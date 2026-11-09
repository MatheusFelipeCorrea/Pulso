# Auditoria de segurança — Sumário executivo

**Produto:** Pulso (API Node, web React, mobile Flutter)  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Kit:** Hyperion security-audit (fases 1–3 + consolidate, unattended)  
**Config:** `.github/project.yml` (overlay nulo)  
**Método:** revisão estática somente leitura. Sem exploits, sem ataques live, sem valores secretos (apenas tipo e path).

---

## Postura geral

O Pulso trata autenticação e **autorização por objeto** com seriedade acima do típico trabalho de disciplina: cookies `httpOnly` na web, Bearer + secure storage no Flutter, rotação de refresh com punição de reuso, Prisma parametrizado e IDOR **não confirmado** em transações, metas e viagens.

A postura **não é ainda de produção pública**. Quatro achados **Alta** quebram o modelo de confiança (cliente declara ser mobile; usuário se promove a PREMIUM; código OAuth na URL; rate limit some na Vercel). Privacidade legal e supply chain estão **desencontrados** do código (Gemini na política, não no runtime; Dependabot npm/pub fora do GitHub).

**Urgência:** remediar as Altas antes de URL pública. Não há achado classificado como **Crítica** nesta passagem (nenhum RCE, SQLi confirmado ou segredo de `client_secret` no git avaliado — `.env` local da API está no gitignore da pasta).

---

## Contagem por severidade

| Severidade | Fase 1 | Fase 2 | Fase 3 | Total |
|------------|--------|--------|--------|-------|
| Crítica    | 0      | 0      | 0      | **0** |
| Alta       | 4      | 0      | 0      | **4** |
| Média      | 5      | 5      | 6      | **16** |
| Baixa      | 4      | 3      | 3      | **10** |
| **Soma**   | **13** | **8**  | **9**  | **30** |

IDs: `SEC-1-01` … `SEC-1-13`, `SEC-2-01` … `SEC-2-08`, `SEC-3-01` … `SEC-3-09`.

Relatórios:

- `Hyperion/.github/audits/results/application-security/security-fase-1-auth-authz.md`
- `Hyperion/.github/audits/results/application-security/security-fase-2-dados-integracoes.md`
- `Hyperion/.github/audits/results/application-security/security-fase-3-infra-privacy.md`

---

## Riscos principais (top 5)

1. **SEC-1-02 — Auto-upgrade PREMIUM** (`PATCH /api/auth/me/plano`) anula `requirePremium` em viagens e integrações pagas.  
2. **SEC-1-01 — `X-Pulso-Client: mobile`** devolve refresh/access no JSON a qualquer cliente, inclusive sessão web por cookie.  
3. **SEC-1-03 — Exchange OAuth na query string**, JWT reutilizável ~60s, mesmo `JWT_SECRET` do access.  
4. **SEC-1-04 — Rate limit in-memory** (5/min) não agrega entre isolates Vercel; OAuth GET sem limiter.  
5. **SEC-2-01 / SEC-2-02 — LGPD:** sem delete/export de conta; política cita Gemini, chatbot e tokens em localStorage, divergente do código.

---

## Foco solicitado — síntese

| Tema | Conclusão |
|------|-----------|
| JWT cookie vs Bearer | Dualidade implementada. Cookie primeiro; Bearer se não houver cookie. Header mobile **não é prova de app**. |
| Google OAuth web | Passport, state JWT, allowlist de `returnTo`. Callback põe `exchange` na query do frontend. |
| Google OAuth mobile | ID token com audiências web/Android/iOS; sem check `email_verified`. |
| Refresh | Opaco 48 bytes, rotação, revoke-all em reuso; **persistido em claro**; `JWT_REFRESH_SECRET` não usado. |
| IDOR transações/metas/viagens | **Não encontrado.** Filtro `usuarioId` nos repositórios/controllers. |
| Rate limits | Só rotas `/auth/*` selecionadas; MemoryStore; APIs de viagem sem teto. |
| CORS | Allowlist + `credentials`. Header `X-Pulso-Client` permitido. |
| Prisma / SQLi | Queries da API parametrizadas; `$queryRaw` apenas keepalive. |
| Secrets em env | Tipos em `Codigo/Pulso/api/.env` (gitignore da API): URL de banco, `JWT_*`, `GOOGLE_CLIENT_SECRET`, chave AES Google, `GEMINI_API_KEY_PDF`, SMTP, `CRON_SECRET`. Não reproduzidos aqui. |
| Gemini | Configurada, **não usada** em `src/`. Insights locais. |
| Supply chain | npm lock + audit high semanal; **sem** Dependabot npm/pub na raiz; Flutter fora do CI; deps mortas (`xlsx`, `multer`, `pdfjs-dist`, …). |

---

## Controles que funcionam (evidência)

- Cookies httpOnly, path `/api` — `authCookies.js:10`.  
- Rotação de refresh + reuse detection — `authService.js:273`.  
- bcrypt 12 + senha forte — `authService.js:26`.  
- State OAuth allowlist — `googleReturnTo.js:31`.  
- IDOR `usuarioId` — `transactionRepository.js:133`, `metaRepository.js:111`, `viagemRepository.js:29`.  
- Helmet + CORS allowlist — `app.js:18-34`.  
- Flutter `flutter_secure_storage` — `token_storage.dart:1`.  
- Web não grava tokens no localStorage — `web/.../authService.js:73`.

---

## Quick wins (menor esforço)

1. Remover ou trancar `PATCH /auth/me/plano`.  
2. Não ecoar tokens no JSON quando a sessão é cookie.  
3. Exchange OAuth de uso único (ou `#fragment`).  
4. `email_verified` obrigatório; `jwt.verify({ algorithms: ['HS256'] })`.  
5. Mascarar emails nos logs; HTTPS no default GeoNames.  
6. `npm ci` + Dependabot npm; `express.json({ limit: '32kb' })`; cleartext Android só em debug.

---

## Roadmap

| Horizonte | Ações |
|-----------|--------|
| Antes de URL pública | SEC-1-01 … SEC-1-04; revisar `CORS_ORIGIN` (sem wildcard de preview). |
| Sprint seguinte | Redis para rate limit; hash de refresh; exclusão de conta; política = código; rate limit viagens. |
| Contínuo | Podar deps; CI Flutter; CSP na web; reauditoria quando import PDF/Gemini e `/grupos` forem religados. |

**Risco residual aceitável (com as Altas abertas, não é aceitável em prod):** JWT access 15 min sem denylist; demo PREMIUM; MemoryStore em dev.

**N/A material:** MFA, Socket.IO, grupos, calendário, import PDF, Swagger montado, IaC.

**Perguntas que mudam classificação:** (1) `PATCH /me/plano` permanece no go-live? (2) Web e API serão same-origin? (3) Gemini/import volta nesta entrega?

---

## N/A e limitações

- Overlay Hyperion: nenhum.  
- Exploração dinâmica, `npm audit` interpretado como CVE alcançável, e inspeção de histórico git profundo: fora do escopo (TruffleHog no CI é a rede existente).  
- Segredos: arquivo local `Codigo/Pulso/api/.env` existe no workspace; conteúdo **não** é citado. Tipos listados na tabela acima.
