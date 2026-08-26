# Pulso — Frontend

Interface web do **Pulso**, construída com React + Vite, design system próprio e Tailwind CSS v4.

## Documentação completa

Leia **[Documentacao/02-Engenharia/Web/Readme.md](../../../Documentacao/02-Engenharia/Web/Readme.md)** — arquitetura, rotas, estrutura de pastas e como rodar.

(Atalho local: [Documents/Readme.md](./Documents/Readme.md))

Design system: **[src/design-system/README.md](./src/design-system/README.md)**

## Início rápido

```bash
npm install
cp .env.example .env
npm run dev
```

Abre em `http://localhost:5173`. A API deve estar em `http://localhost:3333/api` (ver `.env`).

## O que já funciona

- Autenticação (email/senha, Google OAuth, verificação, reset de senha)
- Layout autenticado (sidebar + mobile drawer)
- **Landing** (`/`) — homepage pública com tema claro/escuro
- **Transações** — listagem, filtros, resumo, CRUD, recorrência, tags, categorias
- **Orçamento mensal** — limites por categoria, progresso e alertas
- **Calendário financeiro** — visão mensal, lembretes e integração Google Calendar (IA na tela pendente)
- **Dívidas** — empréstimos e cobranças com pagamentos parciais
- **Metas** — CRUD, aportes, progresso e sugestão de aporte mensal
- **Viagens** — planejamento, despesas, moedas, busca de destinos, estimativas de passagem
- **Grupos** — criar/entrar (Premium), viagem compartilhada, metas, chat Socket.IO, divisão por pretensão
- **Divisão de Despesas** (`/expense-split`) — rateio e acerto de contas
- **Planejamento de Compra** (`/purchase-planning`) — lista de desejos e prazo estimado
- **Notificações** — sino no layout (orçamento, lembretes, dívidas, grupos, metas)
- Planos Free/Premium (demo sem billing)
- Termos de uso e política de privacidade
- Demo do design system em `/design-system`

## Em desenvolvimento (placeholder)

Pós-login o destino padrão é **`/dashboard`**. Placeholders no menu: `/insights`, `/chatbot`, `/profile`, `/settings`.
