# Hospedagem demo (apresentação aos orientadores)

Stack **live** do Pulso (TI5 / 2026-2):

| Peça | Serviço | URL / nota |
| --- | --- | --- |
| Postgres | **Neon** | `DATABASE_URL` + `DIRECT_URL` |
| API Node | **Render** (Web Service free) | https://pulso-api-aldu.onrender.com |
| Web React | **Vercel** | https://pulso-psi-five.vercel.app |
| Mobile | Download na landing | `/downloads/pulso-android.apk` e `/downloads/pulso-ios.ipa` |

Login demo: `tester@mail.com` / `Pulso@123`

Arquivos de apoio:

- `render.yaml` — blueprint da API (`rootDir: Codigo/Pulso/api`)
- `Codigo/Pulso/web/vercel.json` — SPA + exclusão de `/downloads/` do rewrite
- `Codigo/Pulso/web/public/downloads/README.md` — como regenerar APK/IPA
- `.github/workflows/mobile-demo-builds.yml` — CI dos artefatos mobile

## URLs rápidas

| Recurso | Link |
| --- | --- |
| Web | https://pulso-psi-five.vercel.app |
| API health | https://pulso-api-aldu.onrender.com/api/health |
| APK Android | https://pulso-psi-five.vercel.app/downloads/pulso-android.apk |
| IPA iOS | https://pulso-psi-five.vercel.app/downloads/pulso-ios.ipa |

> Free tier do Render **dorme** após ~15 min sem tráfego. O primeiro hit após idle pode levar 30–60s — abra o `/api/health` antes da apresentação.

## 1. Neon (banco)

1. Projeto em [neon.tech](https://neon.tech) (região `sa-east-1` se possível).
2. Connection string **pooled** → `DATABASE_URL`.
3. Connection string **direta** → `DIRECT_URL`.
4. Guarde as duas para o Render.

## 2. Render (API)

Serviço atual: **`pulso-api`** → https://pulso-api-aldu.onrender.com  
Repo: `ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso`, branch **`main`**, `rootDir: Codigo/Pulso/api`.

Env vars mínimas (produção):

```text
NODE_ENV=production
DATABASE_URL=...          # Neon pooler
DIRECT_URL=...            # Neon direta
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGIN=https://pulso-psi-five.vercel.app,http://localhost:5173,http://localhost:8080
FRONTEND_URL=https://pulso-psi-five.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://pulso-api-aldu.onrender.com/api/auth/google/callback
GOOGLE_CALENDAR_CALLBACK_URL=https://pulso-api-aldu.onrender.com/api/auth/google/calendar/callback
GOOGLE_TOKENS_ENCRYPTION_KEY=...
GEMINI_API_KEY_PDF=...             # chatbot/insights reusam se não houver chave própria
GEMINI_API_KEY_LEMBRETES=...
SMTP_HOST / PORT / USER / PASS / FROM
```

Após merge na `main`, o auto-deploy do Render sobe o tip. Se não subir, use **Manual Deploy** no dashboard.

Seed (uma vez):

```bash
cd Codigo/Pulso/api
# com DATABASE_URL/DIRECT_URL de produção
npm run db:migrate:deploy
npm run db:reseed-tester
```

Se textos demo aparecerem com acento quebrado (`Almo�o`, `Maca�`), o `prisma/seed.js` foi reparado em UTF-8 — rode de novo o reseed acima (Neon/produção) para sobrescrever as strings antigas.

## 3. Vercel (web)

Site atual: https://pulso-psi-five.vercel.app

No plano **Hobby**, o import do repositório da **org** pode falhar (`repo_owned_by_org`). A demo usa o mirror pessoal `MatheusFelipeCorrea/Pulso` (branch `deploy-demo-s6` / `main`) ou deploy via CLI a partir de `Codigo/Pulso/web`.

Configuração:

1. **Root Directory:** `Codigo/Pulso/web` (quando o git root é o monorepo) — ou pasta `web` se o link for só desse diretório.
2. Framework: Vite (`vercel.json`).
3. Environment Variables (Build + Production):

```text
VITE_API_URL=https://pulso-api-aldu.onrender.com/api
VITE_GOOGLE_CLIENT_ID=...   # Client ID web do Google Cloud
```

4. Confirme no Render `CORS_ORIGIN` / `FRONTEND_URL` com a URL da Vercel.

### Downloads mobile

Os binários **não vão no git** (`*.apk` / `*.ipa` no `.gitignore`). Gerar no CI (`mobile-demo-builds`) ou local e colocar em `Codigo/Pulso/web/public/downloads/` antes do deploy:

- `pulso-android.apk`
- `pulso-ios.ipa` (unsigned — instalar com Sideloadly/AltStore; confiar em **Ajustes → Geral → VPN e Gerenciamento de Dispositivo**)

Builds apontam para `API_BASE_URL=https://pulso-api-aldu.onrender.com`.

## 4. Google Cloud Console

Em **APIs & Services → Credentials** (client OAuth Web):

- **Authorized JavaScript origins**
  - `https://pulso-psi-five.vercel.app`
  - `http://localhost:5173` (dev)
- **Authorized redirect URIs**
  - `https://pulso-api-aldu.onrender.com/api/auth/google/callback`
  - `https://pulso-api-aldu.onrender.com/api/auth/google/calendar/callback` (Calendar)

## 5. Checklist pré-banca

- [ ] `GET /api/health` responde `ok`
- [ ] Login e-mail com `tester@mail.com` / `Pulso@123`
- [ ] Login Google (se for mostrar)
- [ ] Dashboard com dados seedados
- [ ] Insights / Chatbot
- [ ] Grupos + chat (Socket.IO) — espere cold start do Render
- [ ] Downloads APK/IPA na homepage
- [ ] Tema claro/escuro

## 6. O que não precisa na demo

- RabbitMQ (API já é fail-soft sem broker)
- Vercel Blob
- Publicação nas lojas (Play Store / App Store)

## Ordem sugerida (do zero)

1. Neon → 2. Render (API + migrate + seed) → 3. Vercel (web + `VITE_API_URL`) → 4. Ajustar CORS/OAuth → 5. Publicar APK/IPA em `/downloads/` → 6. Testar fluxo completo.
