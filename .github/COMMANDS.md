# Catálogo de comandos

**O que rodar, quando e o que sai.**  
Os “comandos” são skills/agents em linguagem natural (não há CLI).

Guia da pasta: [`INDEX.md`](./INDEX.md) · Setup por ferramenta: [`USAGE.md`](./USAGE.md) · Índice de skills: [`skills/README.md`](./skills/README.md).

---

## Fluxo recomendado

```
1. project-startup       → configura o repo
2. project-discovery     → (via startup) grava project.yml
3. full-audit | *-audit  → achados
4. card-refiner          → epic apertado
5. implementation-plan   → plano + código
6. readme-updater / plantuml-diagram-generator
```

Comandos “puxam” outros: startup → discovery → menu; `full-audit` → cada `*-audit`.

---

## 1. Entrada

| Comando | Quando | Saída | Frase-gatilho |
|---------|--------|-------|---------------|
| **project-startup** | Pack novo / onboarding | `project.yml` + snapshot + menu | *Faça o start-up deste repositório* |
| **project-discovery** | Config ausente/stale ou outra skill precisa de contexto | Contexto **ou** `project.yml` (Configure) | *Configure o project.yml* / *Mapeie o repositório* |

`project-discovery` é quem **escreve** o `project.yml`. Você só confirma.

---

## 2. Auditorias

| Comando | Foco | Saída | Faseada? | Frase-gatilho |
|---------|------|-------|----------|---------------|
| **full-audit** | Suite + resumo | `results/*` + `_summary/` | Sim (1 dimensão por vez) | *Auditoria completa do repositório* |
| **po-audit** | Requisitos × código | `results/product-owner/` | Não | *Audite o módulo X com po-audit* |
| **security-audit** | AppSec | `results/application-security/` | Sim | *Rode a Fase 1 da security-audit* |
| **devops-audit** | CI/CD · SRE | `results/devops/` | Sim | *Audite DevOps* |
| **dev-senior-review** | Qualidade / dívida | `results/code-review/` | Sim | *Code review sênior do app web* |
| **ux-audit** | UX · DS | `results/ux-design/` | Sim | *Auditoria de UX* |
| **architecture-audit** | Camadas / deps | `results/architecture/` | Sim | *Audite a arquitetura* |

Prompts: [`audits/prompts/`](./audits/prompts/README.md) · Overlay: `audits.overlay` no `project.yml`.

---

## 3. Planejamento e implementação

| Comando | Quando | Saída | Frase-gatilho |
|---------|--------|-------|---------------|
| **card-refiner** | Antes de codar | Card em `outputs.cards` | *Refine este card* |
| **implementation-plan** *(agent)* | Card → código faseado | `outputs.implementations` + código | *Implemente o card #NN* |
| **project-architect** | Módulo grande do zero | Estrutura do módulo | *Crie a arquitetura do módulo Y* |

Agents: [`agents/README.md`](./agents/README.md).

---

## 4. Documentação

| Comando | Saída | Frase-gatilho |
|---------|-------|---------------|
| **readme-updater** | READMEs em `docs.*` | *Atualize os READMEs* |
| **plantuml-diagram-generator** | `docs.diagrams` | *Gere os diagramas do módulo Z* |

---

## 5. Mentoria

| Comando | Papel | Frase-gatilho |
|---------|-------|---------------|
| **mentoring-juniors** *(agent)* | Mentoria socrática | *Me ajude a entender X como um mentor* |

---

## Legado

`skills/_legacy/*` — blueprints greenfield. Ver [`skills/_legacy/README.md`](./skills/_legacy/README.md).

---

## Referências

- Contrato: [`project.yml`](./project.yml) · [`project.example.yml`](./project.example.yml) · [`project.schema.json`](./project.schema.json)
- Manifesto de auditorias: [`audits/manifest.yml`](./audits/manifest.yml)
