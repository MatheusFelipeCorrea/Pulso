# Skills

Instruções especializadas para coding agents. Cada pasta tem um `SKILL.md` (frontmatter `name` + `description`).

Catálogo com frases-gatilho: [`../COMMANDS.md`](../COMMANDS.md) · Como invocar por plataforma: [`../USAGE.md`](../USAGE.md) · Guia da pasta: [`../INDEX.md`](../INDEX.md).

## Ativas

### Entrada / contexto

| Skill | Papel | Saída |
|-------|-------|-------|
| [`project-startup`](./project-startup/SKILL.md) | Onboarding; orquestra o próximo passo | `project.yml` + snapshot + menu |
| [`project-discovery`](./project-discovery/SKILL.md) | Mapeia o repo; **grava** `project.yml` (modo Configure) | Contexto ou `.github/project.yml` |

### Auditorias

| Skill | Papel | Saída (`outputs.audits`) |
|-------|-------|--------------------------|
| [`full-audit`](./full-audit/SKILL.md) | Suite completa + resumo | `results/*` + `_summary/` |
| [`po-audit`](./po-audit/SKILL.md) | Requisitos × código | `results/product-owner/` |
| [`security-audit`](./security-audit/SKILL.md) | AppSec | `results/application-security/` |
| [`devops-audit`](./devops-audit/SKILL.md) | CI/CD · SRE | `results/devops/` |
| [`dev-senior-review`](./dev-senior-review/SKILL.md) | Code review sênior | `results/code-review/` |
| [`ux-audit`](./ux-audit/SKILL.md) | UX · design system | `results/ux-design/` |
| [`architecture-audit`](./architecture-audit/SKILL.md) | Arquitetura | `results/architecture/` |

Protocolos: [`../audits/prompts/`](../audits/prompts/README.md) · Mapa: [`../audits/manifest.yml`](../audits/manifest.yml).

### Planejamento e docs

| Skill | Papel | Saída |
|-------|-------|-------|
| [`card-refiner`](./card-refiner/SKILL.md) | Refina epic/card | `outputs.cards` |
| [`project-architect`](./project-architect/SKILL.md) | Novo módulo grande | Estrutura / plano do módulo |
| [`readme-updater`](./readme-updater/SKILL.md) | READMEs vs. código | paths em `docs.*` |
| [`plantuml-diagram-generator`](./plantuml-diagram-generator/SKILL.md) | Diagramas PlantUML | `docs.diagrams` |

## Legado

Geradores greenfield (blueprints) — uso pontual: [`_legacy/README.md`](./_legacy/README.md).

## Contrato

Todas as skills ativas leem [`.github/project.yml`](../project.yml) (ou fazem discovery). Não inventam paths de produto.
