# Código — API

Backend do Pulso (`Codigo/Pulso/api`).

- Stack: **Node.js + Express** + Prisma + PostgreSQL (Neon)
- Contrato: REST (`/api`) compartilhado com Web e Flutter
- Auth: JWT em cookie `httpOnly` + refresh rotativo; Google OAuth

## Como rodar

```bash
cd Codigo/Pulso/api
cp .env.example .env   # preencha DATABASE_URL, JWT e SMTP
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Servidor: `http://localhost:3333`

RabbitMQ é opcional e **fail-soft**: se o broker estiver fora, emails e jobs seguem no caminho direto (SMTP / cron). A única credencial é `RABBITMQ_URL` (usuário e senha vão dentro da URL).

```bash
# local
docker compose up -d
# no .env:
# RABBITMQ_URL=amqp://pulso:pulso@localhost:5672
```

Painel: `http://localhost:15672` (usuário/senha `pulso`/`pulso`). Em nuvem, cole a URL `amqps://…` que o provedor gera. Sem a variável, ou na Vercel, nada quebra.
