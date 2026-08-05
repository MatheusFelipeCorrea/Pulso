# Hospedagem Pulso — Vercel (web + API)

Deploy unificado: **frontend e backend no mesmo projeto Vercel**.

```text
https://pulso-psi-five.vercel.app/           → React (estático)
https://pulso-psi-five.vercel.app/api/...    → Express (serverless)
```

(Substitua pelo domínio customizado se houver.)

Banco: **Neon** (PostgreSQL). Jobs: **Vercel Cron** → `/api/cron/*`.

---

## Estrutura no repositório

```text
Pulso/
├── vercel.json           ← build, rewrites, crons
├── package.json          ← serverless-http + scripts de build
├── api/index.js          ← entrada serverless (wrap Express)
└── Codigo/Pulso/
    ├── web/              ← Vite → dist
    └── api/src/app.js    ← Express (exportado)
```

**Dev local** (inalterado): dois terminais em `Codigo/Pulso/api` e `Codigo/Pulso/web`.

---

## 1. Vercel — importar projeto

1. [vercel.com/new](https://vercel.com/new) → repositório **Pulso**
2. **Root Directory:** raiz do repo (`.`) — **não** `Codigo/Pulso/web`
3. Framework detecta Vite via `vercel.json`
4. **Production Branch:** `main`

O `vercel.json` na raiz já define install, build e output.

---

## 2. Variáveis de ambiente (Vercel)

**Settings → Environment Variables** — marque Production (e Preview se quiser).

### Frontend

| Variável | Production |
|----------|------------|
| `VITE_API_URL` | `/api` |
| `VITE_GOOGLE_CLIENT_ID` | seu Client ID |

### API (mesmo projeto)

| Variável | Exemplo |
|----------|---------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon **pooler** |
| `DIRECT_URL` | Neon **direct** (migrations no build) |
| `JWT_SECRET` | string longa |
| `JWT_REFRESH_SECRET` | string longa |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` |
| `GOOGLE_CALLBACK_URL` | `https://pulso-psi-five.vercel.app/api/auth/google/callback` |
| `GOOGLE_CALENDAR_CALLBACK_URL` | `https://pulso-psi-five.vercel.app/api/calendario/google/callback` |
| `GOOGLE_TOKENS_ENCRYPTION_KEY` | hex 64 chars (`openssl rand -hex 32`) |
| `GEMINI_API_KEY_PDF` | chave Gemini para importação de PDF |
| `GEMINI_PDF_MODEL` | opcional — default `gemini-3.1-flash-lite` |
| `SMTP_HOST` / `PORT` / `USER` / `PASS` / `FROM` | Gmail ou Mailtrap |
| `CORS_ORIGIN` | `https://pulso-psi-five.vercel.app` (+ previews separados por vírgula) |
| `FRONTEND_URL` | `https://pulso-psi-five.vercel.app` |
| `API_PUBLIC_URL` | `https://pulso-psi-five.vercel.app` |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | opcional — Vercel Blob (imagens de grupo em prod) |

### Opcionais (viagens / passagens)

| Variável | Uso |
|----------|-----|
| `GEONAMES_USERNAME` | Busca global de destinos |
| `DUFFEL_ACCESS_TOKEN` | Cotações ao vivo de voo (sandbox `duffel_test_…`) |
| `AMADEUS_CLIENT_ID` / `AMADEUS_CLIENT_SECRET` | Fallback de voo (contas novas podem não ter acesso) |

Sem essas chaves, o módulo de viagens usa estimativas sazonais (avião, ônibus, trem onde há ferrovia).

**Preview branches:** adicione URLs preview no `CORS_ORIGIN` separadas por vírgula, ou use a URL fixa do ambiente de staging.

---

## 3. Jobs agendados (Vercel Cron)

| Cron | Rota | O que faz |
|------|------|-----------|
| `5 0 * * *` (1×/dia) | `GET /api/cron/daily` | Alertas de orçamento + limpeza de tokens + transações recorrentes |

Protegidos por `CRON_SECRET` — a Vercel envia `Authorization: Bearer <CRON_SECRET>` automaticamente.

**Plano Hobby:** só crons **diários** (máx. 1× por dia cada). Alertas de orçamento passam a rodar 1×/dia às 00:05 UTC.

**Dev local:** `node-cron` no `server.js` mantém intervalos curtos (20 min, hourly).

**Opcional (alertas mais frequentes em prod):** serviço externo gratuito ([cron-job.org](https://cron-job.org)) chamando `GET /api/cron/tick` a cada 20 min com header `Authorization: Bearer <CRON_SECRET>`.

**Plano Pro Vercel:** permite crons a cada minuto — pode restaurar `*/20 * * * *` em `/api/cron/tick`.

---

## 4. Google Cloud OAuth

### Tela de consentimento

- Política: `https://pulso-psi-five.vercel.app/privacidade`
- Termos: `https://pulso-psi-five.vercel.app/termos`
- Domínio autorizado: `vercel.app` (ou domínio custom)

### Credenciais → Cliente OAuth

**Origens JavaScript autorizadas:**

```text
http://localhost:5173
https://pulso-psi-five.vercel.app
```

**URIs de redirecionamento** (mesmo domínio Vercel):

```text
http://localhost:3333/api/auth/google/callback
http://localhost:3333/api/calendario/google/callback
https://pulso-psi-five.vercel.app/api/auth/google/callback
https://pulso-psi-five.vercel.app/api/calendario/google/callback
```

### Em teste vs Produção

- **Em teste:** só usuários na lista de teste
- **Produção:** qualquer Google; escopo **Calendar** pode exigir verificação do app

---

## 5. Deploy e validação

1. Push na `main` → deploy automático
2. `https://pulso-psi-five.vercel.app/api/health` → `{ "status": "ok", ... }`
3. Login email/senha e Google
4. Conectar Google Calendar em `/calendar`
5. E-mail (registro / reset)

### Migrations

Rodam **uma vez** no Neon (local), não no build da Vercel:

```bash
cd Codigo/Pulso/api
npm run db:migrate:deploy
```

Se aparecer `P3009` (migration falhou no meio), marque como aplicada ou revertida:

```bash
# se a tabela já existe no banco:
npx prisma migrate resolve --applied 20260610140000_notificacoes

# se a migration falhou e nada foi criado:
npx prisma migrate resolve --rolled-back 20260610140000_notificacoes
npm run db:migrate:deploy
```

---

## 6. Branches

| Branch | Uso |
|--------|-----|
| `main` | Produção |
| `dev` | Integração; Preview na Vercel |
| `sprint/*` | PR → preview URL automática |

---

## 7. Limitações (Hobby)

| Item | Detalhe |
|------|---------|
| Cold start | 1–3 s na API após idle |
| Timeout | Hobby ~10 s; projeto configura `maxDuration: 30` em `vercel.json` para a função API |
| Crons | 1 job/dia (limite Hobby) |
| Gemini | Cota da API Google separada |

**Dependabot:** [`.github/dependabot.yml`](../../../.github/dependabot.yml) existe, mas `open-pull-requests-limit: 0` — atualizações via `npm audit` / bump manual, sem PRs automáticos.

**Viagens / capa:** resolução de imagem de destino (Wikipedia/Commons) roda no **criar/editar** viagem, não no `GET /viagens` (evita timeout no Preview).

---

## 8. Dev local vs Vercel

| | Local | Vercel |
|--|-------|--------|
| API | `npm run dev` → `server.js` + node-cron | `api/index.js` serverless |
| Web | `npm run dev` → proxy `/api` | build estático |
| `VITE_API_URL` | `http://localhost:3333/api` | `/api` |

---

## Checklist rápido

- [ ] Projeto Vercel na **raiz** do repo
- [ ] Todas env vars no painel
- [ ] `VITE_API_URL=/api`
- [ ] Google redirects no domínio Vercel
- [ ] `CRON_SECRET` definido
- [ ] `/api/health` ok
- [ ] OAuth login + Calendar testados
