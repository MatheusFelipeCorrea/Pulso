# Project Context

Fill when setting up the kit. Agents read this before acting.

## Name

Pulso

## Purpose

Aplicativo de gestão financeira pessoal: receitas, despesas, metas, viagens, grupos, orçamento, lembretes, dívidas, divisão de despesas, planejamento de compra e insights com IA.

## Team

Time acadêmico / produto Pulso (repo `MatheusFelipeCorrea/Pulso`).

## Stack

- Monorepo: `Codigo/Pulso/api` (Node.js, Express, Prisma, PostgreSQL/Neon) + `Codigo/Pulso/web` (React, Vite, Design System)
- Deploy unificado Vercel (web + API)
- Kit Hyperion nested em `./Hyperion/` (`kit.root: Hyperion`)
- Gestão de cards: GitHub Projects (`management.backend: github`)

## Constraints

- Locale de agents/cards: `pt-BR`
- Não espalhar skills/agents do kit na raiz do produto
- CI de produto própria (`.github/workflows/ci.yml`) — não substituir pelo template genérico `hyperion-product-ci.yml`
- ~55% dos RFs entregues (ago/2026); cards Hyperion em Backlog descrevem implementação alinhada à arquitetura alvo

## Glossary

| Term | Definition |
|------|------------|
| RF / RN / RNF | Requisitos funcionais, regras de negócio, não-funcionais |
| PULSO-EPIC / FEAT / TASK | IDs de cards Hyperion do produto |
| kit.root | Pasta do kit Hyperion dentro do repo (`Hyperion/`) |
