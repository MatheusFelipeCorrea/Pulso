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
- **Transações** — listagem, filtros, resumo, CRUD, recorrência, tags
- **Vale Transporte** — saldo, vendas e usos de passagens
- **Orçamento mensal** — limites por categoria, progresso e alertas
- **Calendário financeiro** — visão mensal, lembretes e integração Google Calendar (integração com IA ainda pendente)
- **Notificações** — sino no layout com alertas de orçamento
- Termos de uso e política de privacidade
- Demo do design system em `/design-system`

A **homepage** (`/`) ainda é só um placeholder; a landing completa aguarda prototipação.

Demais rotas do menu (dashboard, metas, viagens, etc.) exibem placeholder **“Em desenvolvimento”**.
