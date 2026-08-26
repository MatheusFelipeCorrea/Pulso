# Pulso

Aplicativo de gestão financeira pessoal — receitas, despesas, metas, viagens, grupos, orçamento e insights com IA.

**Este é o README principal do repositório.** No GitHub ele aparece na página inicial do projeto.  
Automação e agents: [`.github/INDEX.md`](./.github/INDEX.md) (guia da pasta — **não** é a home do repo). Docs de produto: [Documentacao/](./Documentacao/README.md).

---

## Mapa do repositório

```
Pulso/
├── README.md                 ← você está aqui
├── Codigo/Pulso/
│   ├── web/                  Frontend React + Vite + Design System
│   └── api/                  Backend Node.js + Express + Prisma
├── Documentacao/             Produto, engenharia, auditorias, diagramas
└── .github/                  CI, epics, skills de auditoria, agentes
```

| Pasta | O que tem | Índice |
|-------|-----------|--------|
| [`Codigo/Pulso/web/`](./Codigo/Pulso/web/) | UI, rotas, componentes, DS | [Doc Web](./Documentacao/02-Engenharia/Web/Readme.md) |
| [`Codigo/Pulso/api/`](./Codigo/Pulso/api/) | REST, services, jobs, Prisma | [Doc API](./Documentacao/02-Engenharia/API/Readme.md) |
| [`Documentacao/`](./Documentacao/) | RFs, regras, deploy, auditorias históricas | [Índice](./Documentacao/README.md) |
| [`.github/plans/`](./.github/plans/) | Epics e stories (fonte de escopo) | [Índice de epics](./.github/plans/README.md) |
| [`.github/audits/`](./.github/audits/) | Prompts, scanners CI, novos relatórios | [Índice](./.github/audits/README.md) |
| [`.github/skills/`](./.github/skills/) | Skills de auditoria, startup, docs | [skills/README](./.github/skills/README.md) · [INDEX](./.github/INDEX.md) |

---

## Status do produto (ago/2026)

~**78%** dos requisitos funcionais do escopo TI5 entregues ([detalhe por RF](./Documentacao/01-Produto/Requisitos/Readme.md) — **139 RF** / **108** concluídos; **16 RNF** / **10** concluídos).

### Módulos entregues (UI + API utilizáveis)

| Módulo | RFs |
|--------|-----|
| Autenticação | 001–006 |
| Dashboard | 007–015 (🟡 falta RF-015 quick-add) |
| Transações | 016–028 |
| Metas financeiras | 029–036 |
| Viagens e moedas | 037–047 |
| Lembretes + Google Agenda | 062–067 |
| Perfil e configurações | 068–079 (🟡 só tema RF-071 ok) |
| Homepage pública | 080–083 |
| Grupos (+ chat Socket.IO) | 084–098 |
| Orçamento mensal | 099–105 |
| Divisão de despesas | 106–111 |
| Calendário financeiro | 112–116 |
| Dívidas pessoais | 117–123 |
| Planejamento de compra | 124–129 |
| Importação de extratos | 134–137, 139 (🟡 falta RF-138 aprendizado) |

### Planos Free / Premium (TI5)

| Plano | Acesso |
|-------|--------|
| **Free** | Core financeiro (transações, orçamento, metas, dívidas, dashboard, calendário/lembretes locais, etc.) |
| **Premium** | Grupos (+ chat Socket.IO), viagens/moedas e sync Google Calendar — gate no backend |

Alternância demo via API de auth (`plano` FREE/PREMIUM), sem billing.

### Infra TI5

- **RabbitMQ** — filas `pulso.alerts`, `pulso.reminders` e `pulso.emails`; sem `RABBITMQ_URL`, jobs/e-mails rodam em modo direto.
- **Socket.IO** — chat de grupos em tempo real (API long-running).
- **Hospedagem:** web na Vercel; API em processo contínuo — [TI5-Hospedagem.md](./Documentacao/02-Engenharia/Deploy/TI5-Hospedagem.md).

### Parcial ou só placeholder na UI

| Módulo | Situação |
|--------|----------|
| Perfil e configurações | Tema claro/escuro (RF-071) ok; demais de 068–079 incompletos |
| Design System / Sidebar | Contínuo — base pronta, evolução incremental |
| Insights | Placeholder (048–056) |
| Chatbot / quick-add IA | Placeholder (057–061, RF-015); Gemini usado na importação PDF |

### Planejados (sem implementação)

Onboarding (RF-130–133) — ver [módulos planejados TI5](./Documentacao/03-Auditorias/Product%20Owner/19-25-Modulos-Planejados.md).

Gaps e prioridades: [Analise-Produto.md](./Documentacao/01-Produto/Analise-Produto.md) · Auditoria PO: [Sumário executivo](./Documentacao/03-Auditorias/Product%20Owner/00-Sumario-Executivo.md)

---

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

No `.env` do frontend: `VITE_API_URL=http://localhost:3333/api`

Após login, o app redireciona para **`/dashboard`**.

Integrações opcionais da API: `GEONAMES_USERNAME`, `DUFFEL_ACCESS_TOKEN`, `GEMINI_API_KEY_PDF` (importação PDF) — ver [`api/.env.example`](./Codigo/Pulso/api/.env.example).

Deploy: [Hospedagem.md](./Documentacao/02-Engenharia/Deploy/Hospedagem.md) · TI5: [TI5-Hospedagem.md](./Documentacao/02-Engenharia/Deploy/TI5-Hospedagem.md)

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React, Vite, Redux Toolkit, React Router, Recharts, Lucide |
| Backend | Node.js, Express, Prisma, PostgreSQL (Neon) |
| Auth | JWT + refresh em cookie httpOnly, Google OAuth |
| Mensageria | RabbitMQ (alerts + reminders) — opcional |
| Realtime | Socket.IO (chat de grupos) |
| Hospedagem | Vercel (web) + API long-running (TI5); ver também deploy serverless legado |
| CI | GitHub Actions — lint, test, build, `npm audit` |

---

## Documentação essencial

| Preciso de… | Documento |
|-------------|-----------|
| Lista completa de RFs | [Requisitos/Readme.md](./Documentacao/01-Produto/Requisitos/Readme.md) |
| Regras de negócio | [RegrasDeNegocio.md](./Documentacao/01-Produto/Regras-de-Negocio/RegrasDeNegocio.md) |
| Schema do banco | [API/Database.md](./Documentacao/02-Engenharia/API/Database.md) |
| Design System (código) | [design-system/README.md](./Codigo/Pulso/web/src/design-system/README.md) |
| Padrão de commits | [Guia-Commits.md](./Documentacao/02-Engenharia/Guia-Commits.md) |
| Diagramas UML/DER | [04-Diagramas/](./Documentacao/04-Diagramas/Readme.md) |

---

## Automação, epics e auditorias

Guia do pack em [`.github/INDEX.md`](./.github/INDEX.md) — **não substitui este README**; é o índice da pasta de configuração do GitHub.

| Recurso | Uso |
|---------|-----|
| [`.github/INDEX.md`](./.github/INDEX.md) | O que é a pasta, agents, skills, fluxos |
| [`.github/COMMANDS.md`](./.github/COMMANDS.md) | Catálogo: start-up, discovery, auditorias, implementação |
| [`.github/USAGE.md`](./.github/USAGE.md) | Cursor, Copilot e Claude |
| [`.github/plans/cards/`](./.github/plans/cards/) | Epics — escopo e rastreamento |
| [`.github/audits/`](./.github/audits/) | Prompts, scanners, resultados |
| [`.github/workflows/`](./.github/workflows/) | CI e security scan |

Primeiro comando: `Faça o start-up deste repositório`  
Auditoria: `Auditoria completa do repositório` · Isolada: `Audite o módulo 02 Dashboard com po-audit`

---

## Contribuir

1. Consulte o epic em [`.github/plans/cards/`](./.github/plans/cards/) (se existir).
2. Siga [Guia-Commits.md](./Documentacao/02-Engenharia/Guia-Commits.md) (`Refs: RF-xxx` no corpo).
3. Abra PR — labels automáticos via [labeler.yml](./.github/labeler.yml).
