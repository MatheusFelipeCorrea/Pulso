# Pulso

Aplicativo de gestão financeira pessoal — receitas, despesas, metas, viagens, gamificação e insights com IA.

## Repositório

| Pasta | Descrição |
|-------|-----------|
| [Codigo/Pulso/web](./Codigo/Pulso/web/) | Frontend React + Vite |
| [Codigo/Pulso/api](./Codigo/Pulso/api/) | Backend Node.js + Express + Prisma |
| [Documentacao/](./Documentacao/) | Requisitos e protótipos |
| [.github/plans/](./.github/plans/) | Epics e stories de implementação |

## Documentação técnica

- **Frontend:** [Codigo/Pulso/web/Documents/Readme.md](./Codigo/Pulso/web/Documents/Readme.md)
- **Backend:** [Codigo/Pulso/api/Documents/Readme.md](./Codigo/Pulso/api/Documents/Readme.md)
- **Design System:** [Codigo/Pulso/web/src/design-system/README.md](./Codigo/Pulso/web/src/design-system/README.md)

## Como rodar (desenvolvimento)

**API** (porta 3333):

```bash
cd Codigo/Pulso/api
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed   # opcional — usuário e transações de exemplo
npm run dev
```

**Web** (porta 5173):

```bash
cd Codigo/Pulso/web
npm install
cp .env.example .env
npm run dev
```

Configure `VITE_API_URL=http://localhost:3333/api` no `.env` do frontend.
