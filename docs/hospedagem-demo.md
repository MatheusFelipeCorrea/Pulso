# Hospedagem demo (apresentação aos orientadores)

Stack gratuita recomendada para o Pulso:

| Peça | Serviço | Motivo |
| --- | --- | --- |
| Postgres | **Neon** | Já usado no projeto (`DATABASE_URL` + `DIRECT_URL`) |
| API Node | **Render** (Web Service free) | Processo longo: Socket.IO, cron, Gemini |
| Web React | **Vercel** | Build Vite + HTTPS + domínio `*.vercel.app` |
| Mobile | Local / não hospedar | Demo no notebook; web basta na banca |

Arquivos de apoio nesta branch:

- `render.yaml` — blueprint da API
- `Codigo/Pulso/web/vercel.json` — SPA (fallback para `index.html`)

## 1. Neon (banco)

1. Crie um projeto em [neon.tech](https://neon.tech) (região `sa-east-1` se possível).
2. Copie a connection string **pooled** → `DATABASE_URL`.
3. Copie a connection string **direta** → `DIRECT_URL`.
4. Guarde as duas para o Render.

## 2. Render (API)

1. [render.com](https://render.com) → **New → Blueprint** → repositório Pulso → branch `main` (após merge da sprint-6; enquanto isso use `sprint-6`).
2. Confirme o serviço `pulso-api` (`rootDir: Codigo/Pulso/api`).
3. Preencha as env vars (mínimo para a demo):

```text
NODE_ENV=production
DATABASE_URL=...          # Neon pooler
DIRECT_URL=...            # Neon direta
JWT_SECRET=...            # openssl rand -hex 32
JWT_REFRESH_SECRET=...
CORS_ORIGIN=https://SEU-APP.vercel.app
FRONTEND_URL=https://SEU-APP.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://SUA-API.onrender.com/api/auth/google/callback
GOOGLE_TOKENS_ENCRYPTION_KEY=...   # openssl rand -hex 32
GEMINI_API_KEY_PDF=...             # chatbot/insights reusam se não houver chave própria
SMTP_HOST / PORT / USER / PASS / FROM
```

4. Deploy. Health: `https://SUA-API.onrender.com/api/health`
5. Rode o seed **uma vez** (Shell do Render ou máquina local apontando pro Neon):

```bash
cd Codigo/Pulso/api
# com DATABASE_URL/DIRECT_URL de produção no .env local temporário
npm run db:migrate:deploy
npm run db:reseed-tester
```

Login demo: `tester@mail.com` / `Pulso@123`

> Free tier do Render **dorme** após ~15 min sem tráfego. O primeiro hit após idle pode levar 30–60s — abra o `/api/health` antes da apresentação.

## 3. Vercel (web)

1. [vercel.com](https://vercel.com) → Import do mesmo repositório.
2. **Root Directory:** `Codigo/Pulso/web`
3. Framework: Vite (detecta `vercel.json`).
4. Environment Variables (Build + Preview + Production):

```text
VITE_API_URL=https://SUA-API.onrender.com/api
VITE_GOOGLE_CLIENT_ID=...   # mesmo Client ID web do Google Cloud
```

5. Deploy. Anote a URL `https://SEU-APP.vercel.app`.
6. Volte no Render e confirme `CORS_ORIGIN` / `FRONTEND_URL` com essa URL (vírgula se tiver preview).

## 4. Google Cloud Console

Em **APIs & Services → Credentials** (client OAuth Web):

- **Authorized JavaScript origins**
  - `https://SEU-APP.vercel.app`
  - `http://localhost:5173` (dev)
- **Authorized redirect URIs**
  - `https://SUA-API.onrender.com/api/auth/google/callback`
  - `https://SUA-API.onrender.com/api/calendario/google/callback` (se usar Calendar)

## 5. Checklist pré-banca

- [ ] `GET /api/health` responde `ok`
- [ ] Login e-mail com `tester@mail.com`
- [ ] Login Google (se for mostrar)
- [ ] Dashboard com dados seedados
- [ ] Insights / Chatbot (1–2 regenerações — cota Gemini)
- [ ] Grupos + chat (Socket.IO) — espere cold start do Render
- [ ] Tema claro/escuro

## 6. O que não precisa na demo

- RabbitMQ (API já é fail-soft sem broker)
- Vercel Blob (uploads locais / opcional)
- Flutter publicado (mostrar no emulador se pedirem)

## Ordem sugerida

1. Neon → 2. Render (API + migrate + seed) → 3. Vercel (web com `VITE_API_URL`) → 4. Ajustar CORS/OAuth → 5. Testar fluxo completo.
