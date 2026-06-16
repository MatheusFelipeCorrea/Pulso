# Pulso — Frontend

Interface web do **Pulso**, construída com React + Vite, design system próprio e Tailwind CSS v4.

## Documentação completa

Leia **[Documents/Readme.md](./Documents/Readme.md)** — arquitetura, rotas, estrutura de pastas e como rodar.

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
- **Vale Transporte** — saldo, vendas e usos de passagens (conforme `modoUso`)
- **Orçamento mensal** — limites por categoria, progresso e alertas
- **Calendário financeiro** — visão mensal, lembretes e integração Google Calendar (IA na tela pendente)
- **Dívidas** — empréstimos e cobranças com pagamentos parciais
- **Metas** — CRUD, aportes, progresso e sugestão de aporte mensal
- **Viagens** — planejamento, despesas, moedas, busca de destinos, estimativas de passagem
- **Notificações** — sino no layout (orçamento, lembretes, dívidas)
- Termos de uso e política de privacidade
- Demo do design system em `/design-system`

## Em desenvolvimento (placeholder)

`/dashboard`, `/insights`, `/chatbot`, `/achievements`, `/groups`, `/reports`, `/settings` e demais rotas do menu ainda exibem **“Em desenvolvimento”**.
