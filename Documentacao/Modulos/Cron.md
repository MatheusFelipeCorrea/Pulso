# ⏰ Cron e jobs agendados

> **Junho/2026** — Pulso na Vercel (plano Hobby).

## Limitação do Hobby

O plano **Hobby** permite **apenas 1 cron job por dia**. O `vercel.json` agenda `/api/cron/daily` às **10:00 BRT** (`0 13 * * *` UTC).

Esse endpoint roda **todos** os jobs pesados de uma vez:

- Alertas de orçamento (global)
- Limpeza de tokens
- Alertas de lembretes e dívidas
- Recorrência de lembretes
- Limpeza de dívidas quitadas
- Limpeza de notificações
- Limpeza de divisões de despesas quitadas (180 dias)
- Transações recorrentes

## Mitigações implementadas

### 1. Sync por usuário (`POST /api/sync`)

Quando o usuário abre o app autenticado, o frontend chama `/api/sync` **no máximo a cada 20 minutos** (por sessão). Isso executa alertas de orçamento **só para o usuário logado** — cobre o gap entre o cron diário e o comportamento local (node-cron a cada 20 min).

### 2. Cron externo (recomendado em produção)

Para jobs globais com mais frequência, use um serviço gratuito como [cron-job.org](https://cron-job.org) ou [Uptime Robot](https://uptimerobot.com):

| Endpoint | Frequência sugerida | Jobs |
|----------|---------------------|------|
| `GET /api/cron/tick` | A cada 20 min | Orçamento + limpeza de tokens |
| `GET /api/cron/daily` | 1×/dia (já na Vercel) | Todos os jobs |

**Header obrigatório:**

```
Authorization: Bearer <CRON_SECRET>
```

Configure `CRON_SECRET` nas variáveis de ambiente da Vercel (mesmo valor usado pelo cron nativo).

### 3. Desenvolvimento local

Com `npm run dev` na API, o `server.js` agenda todos os jobs via `node-cron` — comportamento completo sem depender da Vercel.

## Variáveis

| Variável | Uso |
|----------|-----|
| `CRON_SECRET` | Protege `/api/cron/*` |
| `BLOB_READ_WRITE_TOKEN` | Upload de imagens (produção) — ver [Grupos.md](./Grupos.md) |

## Upload de imagem de grupo

Ver [Grupos.md](./Grupos.md) — `POST /api/grupos/:id/imagem` (multipart, campo `imagem`).

- **Dev:** arquivos em `Codigo/Pulso/api/uploads/grupos/`, servidos em `/api/uploads/grupos/`
- **Produção:** Vercel Blob (`BLOB_READ_WRITE_TOKEN`)
