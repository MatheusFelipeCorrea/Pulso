# Decisions Log

Quick decisions that do not warrant a full ADR. For architecture, use `.github/docs/adr/`.

| ID | Date | Decision | Rationale |
|----|------|----------|-----------|
| D001 | 2026-08-26 | Kit Hyperion adotado aninhado em `Hyperion/` (`kit.root: Hyperion`) | Evita espalhar skills/scripts na raiz do produto PUC |
| D002 | 2026-08-26 | Layout monorepo: `code/front` (React), `code/back` (Node), `code/mobile` (Flutter) | Combinado no setup; pastas PUC já existiam vazias |
| D009 | 2026-09-08 | Pastas de código: `Codigo/Pulso/{api,web,mobile}` (antes `code/{back,front,mobile}` e um flatten temporário em `Codigo/{api,web,mobile}`) | Código do produto fica sob `Codigo/Pulso/`; READMEs, `project.yml` e CI acompanham |
| D003 | 2026-08-26 | Não scaffoldar apps agora; regenerar `project.yml` depois do init | Time começa o código depois; manifests ainda não existem |
| D004 | 2026-08-26 | Board: GitHub (`management.backend: github`) | Remote origin em ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso |
| D006 | 2026-08-26 | `package.json` na raiz só para atalhos `hyperion:*` / `cards:*` | Doctor avisava ausência; não é o app Node — apps ficam em `code/*` |
| D007 | 2026-08-26 | Cards PULSO migrados para `Hyperion/.github/cards/` aninhados por `parent` | Formato antigo era flat (`features/ID.md`); kit novo exige `features/{parent}/{id}.md`. Paths `Codigo/Pulso/{web,api}` → `code/{front,back}` |
| D008 | 2026-08-26 | GitHub Project #726 (`ICEI-PUC-Minas-PMGES-TI`) vinculado ao repo | Auto-create no primeiro `/sync`; `projects-map.json` gravado para os próximos syncs |

## 2026-08-26 — Setup Hyperion (project-startup)

**Context:** Repositório PUC quase vazio, kit já copiado em `Hyperion/`.
**Decision:** `/setup` + `hyperion:init --adopt`; contrato em `.github/project.yml`; memória preenchida a partir do README.
**Alternatives considered:** Scaffold React/Node/Flutter agora — adiado a pedido do time.
**Follow-up:** Scaffold das apps, depois `/discover` para atualizar manifests e `commands.*`.
