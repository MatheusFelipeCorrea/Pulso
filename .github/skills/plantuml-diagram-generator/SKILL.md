---
name: plantuml-diagram-generator
description: >-
  Generates PlantUML diagrams and adaptive C4 Level-2 architecture image prompts
  from discovered project docs and code. Writes under docs.diagrams from
  project.yml or .github/diagrams/ with English folder names. Use when creating
  or updating Use Case, Component, Class, Package, Deployment, or architecture
  prompts — never invents components that do not exist.
---

# PlantUML Diagram Generator

## Bootstrap

1. Read `.github/project.yml` if present — especially `docs.diagrams`, locale, layout. Validate the configured root; if it does not exist and cannot safely be created, ask or use the fallback.
2. If absent, discover READMEs, architecture docs, folder docs, exemplars, manifests, and code — **never invent** components or paths.
3. Diagram root: `docs.diagrams` from config, else **`.github/diagrams/`**. Do not require any product-specific documentation tree.
4. Locale: config or user language for labels/notes; PlantUML keywords stay English.
5. Missing `.github/docs/*` blueprints: use discovered docs/code — do not block.

## Variables

| Variable | Default |
|----------|---------|
| `${DIAGRAM_SELECTION}` | All \| subset \| custom |
| `${PROJECT_TYPE}` | Auto-detect \| user |
| `${OUTPUT_LANGUAGE}` | from config \| user |
| `${MODE}` | Generate \| Update |

## Critical Rules

1. NEVER invent components, classes, or relationships — only what docs/code show
2. NEVER advance without approval; generate **one diagram at a time**
3. ALWAYS valid PlantUML that renders (e.g. plantuml.com)
4. ALWAYS write under the resolved diagrams root with the folder layout below
5. ALWAYS match the project's real stack and layer names

## Output layout (unified fallback)

```
<diagrams-root>/          # docs.diagrams or .github/diagrams/
  use-case/
    use-case.puml
  components/
    components.puml
  classes/
    classes.puml
  packages/
    packages-frontend.puml   # only if frontend exists
    packages-backend.puml    # only if backend exists
  deployment/
    deployment.puml
  architecture/
    architecture-prompt.md   # C4 L2 image prompt — not PlantUML
```

Use locale-specific **file titles inside** diagrams if desired; keep **directory names** stable (English kebab-case) for portability.

## Context Sources

| Source | Use for |
|--------|---------|
| Architecture docs | layers, deps, integrations |
| READMEs | files, methods, routes, models |
| Folder/structure docs | package diagrams |
| Exemplars / peer modules | detailed class samples |
| Contributor/agent instructions | dependency rules as notes |
| Code / manifests | fallback and verification |

## Step 1: Select

Ask which diagrams to generate (Use Case, Component, Class, Package, Deployment, Architecture prompt, All). Confirm docs availability. **WAIT.**

## Step 2: Generate (one at a time)

### Use Case → `use-case/use-case.puml`
Actors, system boundary, use cases from features/endpoints/roles; include/extend where real; notes for key rules.

### Component → `components/components.puml`
Packages per architectural layer; components; dependency arrows per project rules; externals; DB; workers if present. Monorepo: subprojects as packages with real communication protocol.

### Class → `classes/classes.puml`
Generate for domains that have meaningful types/classes (often backend). Include only layers that exist (models, services, repos, handlers — **or** whatever the repo uses). Relationships and cardinality from real deps/FKs. Skip if the project has no useful class surface.

### Package → `packages/*.puml`
One file per major app surface discovered. Packages mirror folders; arrows follow import/dependency direction; notes for folder rules.

### Deployment → `deployment/deployment.puml`
Nodes from hosting/CI/Docker/env docs; protocols; ports; env separation if documented.

### Architecture prompt → `architecture/architecture-prompt.md`
Not PlantUML. Fill an adaptive C4 Model Level 2 (container) **image-generator prompt** from detection:

1. Architecture type (SPA+API, fullstack, microservices, serverless, …)
2. Layers that **exist**
3. Background jobs / queues if any
4. External integrations if any
5. Clients and databases

Prompt sections: image description · visual style · layout/content (only detected parts) · arrows/protocols · exact names from docs · PNG output constraints.

Monorepo: ask separate prompts vs one high-level diagram.

Conditional style examples (illustrative only): layered API, Clean Architecture, microservices, fullstack framework, serverless — fill with **this** project's names, never a fixed product stack.

After each artifact: present → adjust? → **WAIT.**

## Update mode

When `${MODE}` is Update:

1. Read existing `.puml` / prompt under diagrams root
2. Compare to current docs/code
3. Report per diagram: unchanged vs changes
4. Regenerate only what the user approves

**Significant:** entities/layers/integrations/roles/endpoints/folder moves/hosting/jobs added or removed.
**Not significant:** minor method adds, bugfixes, style, config, tests.

## Style guide

Shared skinparam baseline on every `.puml`:

```
skinparam backgroundColor white
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 12
skinparam roundcorner 8
skinparam packageBorderColor #CCCCCC
skinparam noteBackgroundColor #FFFFF0
skinparam arrowColor #555555
```

Color hints: UI blues · API greens · data oranges · externals purples · auth reds · shared grays. Tune stereotypes per diagram type (usecase, component, class, node).

## Extensibility

Unknown diagram type: clarify intent → pick PlantUML kind (sequence, activity, state, ER, …) → same extract → write → approve cycle. Save under `<diagrams-root>/<kebab-name>/`.
