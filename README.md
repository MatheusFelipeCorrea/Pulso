# Pulso


Aplicativo de gestão financeira pessoal — receitas, despesas, metas, viagens, gamificação e insights com IA.

## Status do produto (jun/2026)

| Área | Situação |
|------|----------|
| Auth, transações, VT, orçamento, calendário, dívidas | ✅ Entregue |
| Metas, viagens + moedas | ✅ Entregue |
| Dashboard, perfil, insights, chatbot, gamificação, grupos | ⏳ Placeholder na UI |
| IA (Gemini) | 🔑 Env configurada · código pendente |

Análise de gaps e ideias de evolução: [Documentacao/Analise-Produto.md](./Documentacao/Analise-Produto.md)

## Repositório

| Pasta | Descrição |
|-------|-----------|
| [Codigo/Pulso/web](./Codigo/Pulso/web/) | Frontend React + Vite |
| [Codigo/Pulso/api](./Codigo/Pulso/api/) | Backend Node.js + Express + Prisma |
| [Documentacao/](./Documentacao/) | Requisitos, diagramas, deploy, análise |
| [.github/plans/](./.github/plans/) | Epics e stories de implementação |

## Documentação técnica

- **Frontend:** [Codigo/Pulso/web/Documents/Readme.md](./Codigo/Pulso/web/Documents/Readme.md)
- **Backend:** [Codigo/Pulso/api/Documents/Readme.md](./Codigo/Pulso/api/Documents/Readme.md)
- **Banco de dados:** [Codigo/Pulso/api/Documents/Database.md](./Codigo/Pulso/api/Documents/Database.md)
- **Requisitos:** [Documentacao/Requisitos/Readme.md](./Documentacao/Requisitos/Readme.md)
- **Design System:** [Codigo/Pulso/web/src/design-system/README.md](./Codigo/Pulso/web/src/design-system/README.md)
- **Hospedagem (Vercel):** [Documentacao/Deploy/Hospedagem.md](./Documentacao/Deploy/Hospedagem.md)

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
