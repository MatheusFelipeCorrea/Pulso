# Hospedagem Pulso — Vercel (web + API)

Deploy unificado: **frontend e backend no mesmo projeto Vercel**.

```text
https://seu-app.vercel.app/           → React (estático)
https://seu-app.vercel.app/api/...    → Express (serverless)
```

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
| `GOOGLE_CALLBACK_URL` | `https://seu-app.vercel.app/api/auth/google/callback` |
| `GOOGLE_CALENDAR_CALLBACK_URL` | `https://seu-app.vercel.app/api/calendario/google/callback` |
| `GEMINI_API_KEY` | sua chave |
| `SMTP_HOST` / `PORT` / `USER` / `PASS` / `FROM` | Gmail ou Mailtrap |
| `CORS_ORIGIN` | `https://seu-app.vercel.app` |
| `FRONTEND_URL` | `https://seu-app.vercel.app` |
| `CRON_SECRET` | `openssl rand -hex 32` |

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

- Política: `https://seu-app.vercel.app/privacidade`
- Termos: `https://seu-app.vercel.app/termos`
- Domínio autorizado: `vercel.app` (ou domínio custom)

### Credenciais → Cliente OAuth

**Origens JavaScript autorizadas:**

```text
http://localhost:5173
https://seu-app.vercel.app
```

**URIs de redirecionamento** (mesmo domínio Vercel):

```text
http://localhost:3333/api/auth/google/callback
http://localhost:3333/api/calendario/google/callback
https://seu-app.vercel.app/api/auth/google/callback
https://seu-app.vercel.app/api/calendario/google/callback
```

### Em teste vs Produção

- **Em teste:** só usuários na lista de teste
- **Produção:** qualquer Google; escopo **Calendar** pode exigir verificação do app

---

## 5. Deploy e validação

1. Push na `main` → deploy automático
2. `https://seu-app.vercel.app/api/health` → `{ "status": "ok", ... }`
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
| Timeout | 10 s por request |
| Crons | 1 job/dia (limite Hobby) |
| Gemini | Cota da API Google separada |

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
