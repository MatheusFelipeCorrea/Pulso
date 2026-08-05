# Agents

Personas de conversa longa (além das skills pontuais). Ficam em `.github/agents/` no formato Copilot (`.agent.md`).

Guia da pasta: [`../INDEX.md`](../INDEX.md) · Comandos: [`../COMMANDS.md`](../COMMANDS.md) · Setup: [`../USAGE.md`](../USAGE.md).

| Agent | Arquivo | Papel | Saída típica |
|-------|---------|-------|--------------|
| **implementation-plan** | [`implementation-plan.agent.md`](./implementation-plan.agent.md) | Lê um card/epic, gera plano faseado, implementa com OK humano entre fases | `outputs.implementations` + código |
| **mentoring-juniors** | [`mentoring-juniors.agent.md`](./mentoring-juniors.agent.md) | Mentoria socrática — pergunta e guia; não entrega a solução pronta | Conversa / exercícios |

## Quando usar agent vs. skill

| Situação | Preferir |
|----------|----------|
| Onboarding, auditoria, README, diagrama | **Skill** (`project-startup`, `*-audit`, …) |
| Implementar um epic inteiro em várias sessões | **Agent** `implementation-plan` |
| Aprender o código / pairing didático | **Agent** `mentoring-juniors` |

## Cursor

O Cursor não carrega `.github/agents` automaticamente. Opções:

- `@.github/agents/implementation-plan.agent.md` no chat, ou  
- copiar para `.cursor/agents/implementation-plan.md` (ver [`USAGE.md`](../USAGE.md)).

## Contrato

Os agents leem `project.yml` (ou discovery), respeitam `locale` / `outputs.*` e **não inventam** paths.
