# Guia de contribuição — Pulso

Repositório da equipe **Pulso** (TI5 / 2026-2, PUC Minas):

[`ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso`](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso)

Ao contribuir, você concorda com o [Código de Conduta](CODE_OF_CONDUCT.md).

Código do produto: `Codigo/Pulso/` (`api`, `web`, `mobile`). Documentação da apostila: `docs/`. Cards do board: `Hyperion/.github/cards/`.

## Regra de ouro: branch nasce da sprint

**Toda branch de trabalho é criada a partir da branch da sprint vigente — nunca a partir da `main`.**

A sprint atual é `Sprint-5`. Quando a disciplina avançar, a base passa a ser `Sprint-6`, e assim por diante. Confirme o nome da sprint aberta no GitHub antes de ramificar.

```bash
git fetch origin
git checkout Sprint-5
git pull origin Sprint-5
git checkout -b feat/minha-tarefa
```

O Pull Request aponta para **`Sprint-5`** (a sprint vigente), não para `main`.

`main` só recebe o merge da própria sprint (ou correção acordada com a equipe). Commit direto na `main` não é fluxo deste repositório.

## Por que não partir da `main`

A `main` pode estar atrás da sprint. Branch criada dela traz código velho, gera conflito e mistura entrega de sprints diferentes. A sprint é a linha estável do time **nesta** iteração.

## Branches permanentes

| Branch | Papel | Apagar? | Commit direto? |
|---|---|---|---|
| `main` | entrega consolidada da disciplina | nunca | não |
| `Sprint-N` | trabalho da sprint N | nunca (enquanto for a sprint da disciplina) | não — só via PR |

Branches de tarefa (`feat/…`, `fix/…`, `docs/…`) são temporárias: nascem da sprint, voltam para a sprint por PR e são apagadas depois do merge.

Não faça `git push --force` em `main` nem na sprint.

## Nomenclatura

```
<tipo>/<descricao-curta>
```

Exemplos a partir da sprint:

- `feat/orcamento-mensal-mobile`
- `fix/ci-api-globals`
- `docs/conduta-e-contribuicao`
- `refactor/email-bridge`
- `chore/atualiza-dependencias`

Uma branch, uma entrega. Não misture correção de CI com tela nova.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
<tipo>(escopo opcional): descrição curta
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

Não commite `.env`, senhas, tokens nem chave de app.

## Pull Request

1. Atualize a sprint (`git pull origin Sprint-5`) e rebase ou merge a sua branch nela antes de abrir o PR, se estiver atrás.
2. Abra o PR **contra a sprint vigente**.
3. Descreva o que mudou e como testar. Vincule o card/issue (`Closes #123`) quando o PR resolver de fato.
4. Outra pessoa do time revisa. Não faça merge do próprio PR sem review, salvo combinado com a equipe.
5. Depois do merge, apague a branch de trabalho (local e remoto).

## Onde mexer

| Pasta | Quando |
|---|---|
| `Codigo/Pulso/api` | backend (Express, Prisma, jobs, RabbitMQ) |
| `Codigo/Pulso/web` | React |
| `Codigo/Pulso/mobile` | Flutter |
| `docs/` | apostila e material da disciplina |
| `Hyperion/.github/cards/` | cards do Project |

Web e mobile devem entregar a mesma qualidade de UX no que já existe nos dois lados. Não invente endpoint ou módulo que o time ainda não combinou (por exemplo, grupos no backend).

## Cards (Hyperion / GitHub Project)

O markdown em `Hyperion/.github/cards/` alimenta o board. A Action de sync roda no `main`.

- Mexeu **no board** → `npm run cards:reverse` **antes** de commitar.
- Não empurre YAML antigo de card por cima do que o time já moveu no Project.

O PR de card também nasce da sprint e entra nela; a `main` recebe isso quando a sprint for integrada.

## Checklist rápido

- [ ] Branch criada a partir da sprint vigente (`Sprint-5` agora)
- [ ] PR aberto para a sprint, não para `main`
- [ ] Sem segredo no commit
- [ ] Review de outra pessoa do time
- [ ] Branch de trabalho apagada depois do merge
