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

RabbitMQ opcional: `docker compose up -d` nesta pasta. Sem `RABBITMQ_URL`, jobs rodam em modo direto.
