# Pulso


Aplicativo de gestão financeira pessoal — receitas, despesas, metas, viagens, gamificação e insights com IA.

## Status do produto (ago/2026)

| Área | Situação |
|------|----------|
| Auth, transações, VT, orçamento, calendário, dívidas | ✅ Entregue |
| Metas, viagens + moedas, lembretes, homepage | ✅ Entregue |
| Grupos, divisão de despesas, planejamento de compra | ✅ Entregue |
| Dashboard, perfil, insights, chatbot, gamificação | ⏳ Placeholder ou parcial na UI |
| IA (Gemini) | 🔑 Env configurada · código pendente |

Análise de gaps e ideias de evolução: [Documentacao/01-Produto/Analise-Produto.md](./Documentacao/01-Produto/Analise-Produto.md)

## Repositório

| Pasta | Descrição |
|-------|-----------|
| [Codigo/Pulso/web](./Codigo/Pulso/web/) | Frontend React + Vite |
| [Codigo/Pulso/api](./Codigo/Pulso/api/) | Backend Node.js + Express + Prisma |
| [Documentacao/](./Documentacao/) | [Índice de documentação](./Documentacao/README.md) — produto, engenharia, auditorias |
| [.github/plans/](./.github/plans/) | Epics e stories de implementação |

## Documentação técnica

- **Frontend:** [Documentacao/02-Engenharia/Web/Readme.md](./Documentacao/02-Engenharia/Web/Readme.md)
- **Backend:** [Documentacao/02-Engenharia/API/Readme.md](./Documentacao/02-Engenharia/API/Readme.md)
- **Banco de dados:** [Documentacao/02-Engenharia/API/Database.md](./Documentacao/02-Engenharia/API/Database.md)
- **Requisitos:** [Documentacao/01-Produto/Requisitos/Readme.md](./Documentacao/01-Produto/Requisitos/Readme.md)
- **Design System:** [Codigo/Pulso/web/src/design-system/README.md](./Codigo/Pulso/web/src/design-system/README.md)
- **Hospedagem (Vercel):** [Documentacao/02-Engenharia/Deploy/Hospedagem.md](./Documentacao/02-Engenharia/Deploy/Hospedagem.md)

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

Integrações opcionais da API: `GEONAMES_USERNAME`, `DUFFEL_ACCESS_TOKEN` — ver [api/.env.example](./Codigo/Pulso/api/.env.example).
