# Project Context

Fill when setting up the kit. Agents read this before acting.

## Name

Pulso

## Purpose

Pulso é um sistema de gestão financeira pessoal para estagiários, estudantes e jovens em início de carreira. Diferencia recursos reais (salário) de benefícios com restrição de uso (VA, VR), oferece insights via IA (Google Gemini), planejamento de viagens com câmbio e grupos para planejamento compartilhado. Interface em modo claro e escuro; o produto será gratuito.

O nome remete a manter o pulso firme nas finanças: cada registro é uma batida rumo à estabilidade.

Repositório acadêmico (PUC Minas — PMG-ES 2026-2, TI5). Código ainda não scaffoldado; pastas placeholder em `code/front`, `code/back` e `code/mobile`.

## Team

Alunos: Matheus Felipe, Alice Shikida, Maria Clara, Sofia Vasconcelos, Vinicius Simões.

Professores: Leonardo Vilela, João Paulo Aramuni, Arthur Mol.

## Stack

Planejada (ainda sem manifests):

| App | Pasta | Tecnologia |
|-----|--------|------------|
| Web | `code/front` | React |
| API | `code/back` | Node.js |
| Native | `code/mobile` | Flutter |

Kit Hyperion aninhado em `Hyperion/` (`kit.root: Hyperion`).

## Constraints

- Disciplina TI5 / PMG-ES — documentação PUC em `docs/`.
- Apps ainda vazias: não inventar ORM, banco ou deploy até o scaffold.
- Depois do init React/Node/Flutter, regenerar `project.yml` com `/discover`.
- Produto 100% gratuito (visão do README).

## Glossary

| Term | Definition |
|------|------------|
| Pulso | Produto de gestão financeira pessoal deste repositório |
| VA / VR | Vale-alimentação e vale-refeição — benefícios com restrição de uso |
| Recursos reais | Dinheiro de uso livre (ex.: salário), distinto dos benefícios restritos |
| Hyperion | Kit de agents/skills copiado em `Hyperion/` |
