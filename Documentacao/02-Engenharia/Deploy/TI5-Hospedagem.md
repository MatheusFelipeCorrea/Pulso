# TI5 — Nota de hospedagem (acadêmica)

Contexto do trabalho de TI5: o **frontend** pode ir na **Vercel** (estático). A **API** precisa de processo **long-running** (não serverless) porque usa **Socket.IO** (chat de grupos) e **RabbitMQ** (consumers).

| Camada | Hospedagem sugerida |
|--------|---------------------|
| Web | Vercel (ou equivalente estático) |
| API | VM / container / PaaS com Node contínuo (Render, Railway, Fly, VPS, etc.) |
| Banco | Neon (PostgreSQL) ou Postgres local |
| Mensageria | RabbitMQ (`RABBITMQ_URL`) — **opcional**; sem URL, jobs/emails rodam em modo direto |

## Ligar o RabbitMQ (local)

1. Subir o broker (na pasta da API):

```bash
cd Codigo/Pulso/api
docker compose up -d
```

- AMQP: `localhost:5672`
- Management UI: http://localhost:15672 (user/pass `pulso` / `pulso`)

2. No arquivo `Codigo/Pulso/api/.env` (não commitar), acrescente:

```env
RABBITMQ_URL=amqp://pulso:pulso@localhost:5672
```

3. Reinicie a API (`npm run dev`). Nos logs deve aparecer conexão Rabbit e consumers das filas:
   - `pulso.alerts` — orçamento / dívidas
   - `pulso.reminders` — lembretes / recorrência
   - `pulso.emails` — verificação e reset de senha

**Sem** `RABBITMQ_URL` (ou com broker offline): a API **não quebra** — crons e e-mails executam na hora (modo direto). Ideal para copiar o projeto aos poucos.

Deploy unificado só-Vercel (web + API serverless) continua em [Hospedagem.md](./Hospedagem.md), mas **não** cobre Socket.IO + consumers Rabbit em produção para o escopo TI5.

Variáveis relacionadas: `RABBITMQ_URL`, `CORS_ORIGIN`, `FRONTEND_URL` — ver `Codigo/Pulso/api/.env.example`.
