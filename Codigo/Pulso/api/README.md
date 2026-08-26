# Pulso — API

Backend do **Pulso** (Express + Prisma).

## Documentação

A documentação técnica foi **centralizada** em `Documentacao/02-Engenharia/`.

| Documento | Link |
|-----------|------|
| Visão geral (rotas, auth, jobs) | [Documentacao/02-Engenharia/API/Readme.md](../../../Documentacao/02-Engenharia/API/Readme.md) |
| Banco de dados (Prisma) | [Documentacao/02-Engenharia/API/Database.md](../../../Documentacao/02-Engenharia/API/Database.md) |
| Hospedagem TI5 (Vercel + API longa, RabbitMQ) | [Documentacao/02-Engenharia/Deploy/TI5-Hospedagem.md](../../../Documentacao/02-Engenharia/Deploy/TI5-Hospedagem.md) |
| Índice geral | [Documentacao/README.md](../../../Documentacao/README.md) |

Atalho local: [Documents/Readme.md](./Documents/Readme.md).

## Início rápido

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

API em `http://localhost:3333/api`.

RabbitMQ (opcional): `docker compose up -d` e `RABBITMQ_URL=amqp://pulso:pulso@localhost:5672` no `.env`.
