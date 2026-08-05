# Pulso

Aplicativo de gestão financeira pessoal — receitas, despesas, metas, viagens, grupos, orçamento e insights com IA.

**Este é o README principal do repositório.** No GitHub ele aparece na página inicial do projeto. Índices específicos: [Documentacao/](./Documentacao/README.md) · [`.github/`](./.github/README.md) (automação e agentes)

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
| [`.github/skills/`](./.github/skills/) | Skills Cursor (auditorias, cards, README) | [README .github](./.github/README.md) |

---

## Status do produto (ago/2026)

~**52%** dos requisitos funcionais entregues ([detalhe por RF](./Documentacao/01-Produto/Requisitos/Readme.md)).

### Módulos entregues (UI + API utilizáveis)

| Módulo | RFs |
|--------|-----|
| Autenticação | 001–006 |
| Transações | 015–025, 140–141 |
| Dashboard | 007–014 (🟡 revisão PO pendente) |
| Metas financeiras | 026–032 |
| Viagens e moedas | 033–043 |
| Lembretes + Google Agenda | 054–058 |
| Vale-transporte | 059–066 |
| Orçamento mensal | 109–114 |
| Divisão de despesas | 115–120 |
| Calendário financeiro | 121–125 |
| Dívidas pessoais | 126–132 |
| Planejamento de compra | 133–138 |
| Homepage pública | 084–087 |
| Grupos | 088–102 |

### Parcial ou só placeholder na UI

| Módulo | Situação |
|--------|----------|
| Perfil e configurações | Rotas existem; funcionalidades RF-073–078 incompletas |
| Design System / Sidebar | Contínuo — base pronta, evolução incremental |
| Importação OFX/CSV/PDF | UI do modal pronta; parser/backend RF-155–158 pendente |
| Gamificação | Página placeholder (RF-067–072) |
| Relatórios | Placeholder (RF-045–050) |
| Insights | Placeholder (RF-044–048) |
| Chatbot / quick-add IA | Placeholder (RF-049–053, RF-139); env Gemini configurável, código pendente |

### Planejados (sem implementação)

Onboarding (RF-151–154) · Cartão de crédito e faturas · Integrações Telegram/Discord · Modo casal/família · PWA + push · Veículos & FIPE — ver [módulos 19–25](./Documentacao/03-Auditorias/Product%20Owner/19-25-Modulos-Planejados.md).

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

Deploy: [Hospedagem.md](./Documentacao/02-Engenharia/Deploy/Hospedagem.md)

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React, Vite, Redux Toolkit, React Router, Recharts, Lucide |
| Backend | Node.js, Express, Prisma, PostgreSQL (Neon) |
| Auth | JWT + refresh em cookie httpOnly, Google OAuth |
| Hospedagem | Vercel (web + serverless API), cron Vercel |
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

Planejamento e ferramentas para agentes ficam em [`.github/`](./.github/README.md) — **não substituem este README**; são o índice da pasta de configuração do GitHub.

| Recurso | Uso |
|---------|-----|
| [`.github/plans/cards/`](./.github/plans/cards/) | Epics detalhados — escopo, stories, rastreamento |
| [`.github/audits/`](./.github/audits/) | Rodar auditorias (PO, segurança, DevOps, UX…) |
| [`.github/workflows/`](./.github/workflows/) | CI e security scan (automático em push/PR) |

Exemplo de invocação no Cursor: `Audite o módulo 02 Dashboard com po-audit`

---

## Contribuir

1. Consulte o epic em [`.github/plans/cards/`](./.github/plans/cards/) (se existir).
2. Siga [Guia-Commits.md](./Documentacao/02-Engenharia/Guia-Commits.md) (`Refs: RF-xxx` no corpo).
3. Abra PR — labels automáticos via [labeler.yml](./.github/labeler.yml).
