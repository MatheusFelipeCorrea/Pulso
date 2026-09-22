# Project Context

Fill when setting up the kit. Agents read this before acting.

## Name

Pulso

## Purpose

Pulso é um sistema de gestão financeira pessoal para estagiários, estudantes e jovens em início de carreira. Diferencia recursos reais (salário) de benefícios com restrição de uso (VA, VR), oferece insights via IA (Google Gemini), planejamento de viagens com câmbio e grupos para planejamento compartilhado. Interface em modo claro e escuro; o produto será gratuito.

O nome remete a manter o pulso firme nas finanças: cada registro é uma batida rumo à estabilidade.

Repositório acadêmico (PUC Minas — PMG-ES 2026-2, TI5). Apps em `Codigo/Pulso/web`, `Codigo/Pulso/api` e `Codigo/Pulso/mobile`.

## Team

Alunos: Matheus Felipe, Alice Shikida, Maria Clara, Sofia Vasconcelos, Vinicius Simões.

Professores: Leonardo Vilela, João Paulo Aramuni, Arthur Mol.

## Stack

| App | Pasta | Tecnologia |
|-----|--------|------------|
| Web | `Codigo/Pulso/web` | React + Vite |
| API | `Codigo/Pulso/api` | Node.js + Express + Prisma + PostgreSQL |
| Native | `Codigo/Pulso/mobile` | Flutter (auth Sprint-2; transações FEAT-108) |

Kit Hyperion aninhado em `Hyperion/` (`kit.root: Hyperion`).

## Constraints

- Disciplina TI5 / PMG-ES — documentação PUC em `docs/`.
- Web e API já têm `package.json`; Flutter tem auth; transações no app ainda não.
- Produto 100% gratuito (visão do README).

## Glossary

| Term | Definition |
|------|------------|
| Pulso | Produto de gestão financeira pessoal deste repositório |
| VA / VR | Vale-alimentação e vale-refeição — benefícios com restrição de uso |
| Recursos reais | Dinheiro de uso livre (ex.: salário), distinto dos benefícios restritos |
| Hyperion | Kit de agents/skills copiado em `Hyperion/` |
