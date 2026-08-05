---
name: card-refiner
description: >-
  Turns rough feature ideas or epics into structured board cards (GitHub
  Projects, Jira, Azure DevOps, Linear). Infers real layers and file paths from
  project.yml, docs, and code — never assumes controllers/services/repos or a
  fixed stack. Writes one README with Epic plus sub-issues. Use when refining
  backlog items before implementation.
---

# Card Refiner — Structured Card Generator

## Bootstrap

1. Read `.github/project.yml` if present (`outputs.cards`, `locale`, stack, docs paths). Validate configured paths; if they are stale or absent, use discovery.
2. If absent, discover layout, manifests, READMEs, `.github/docs/*` (optional), conventions in code — **never invent paths**.
3. Infer **actual layers** from architecture docs or folder/code patterns (handlers, use-cases, components, modules, etc.). Do not require MVC/controllers/services/repositories.
4. Locale: config or user language.
5. Output dir: `outputs.cards` from config, else `.github/plans/cards/`.
6. Missing blueprints: use READMEs + code; ask when unsure — do not block.

## Variables

| Variable | Default |
|----------|---------|
| `${BOARD_PLATFORM}` | GitHub Projects \| Jira \| Azure DevOps \| Linear \| Other |
| `${OUTPUT_LANGUAGE}` | from config \| user |
| `${TECH_STACK}` | Auto-detect \| user-provided |
| `${CARD_TYPES}` | All \| Epic only \| subset (by discovered surfaces) |

## Critical Rules

1. NEVER generate without understanding scope — clarify first
2. NEVER advance without approval between steps
3. NEVER invent requirements — ask
4. NEVER guess paths/symbols — use docs/code; if unknown, mark "validate with team"
5. ALWAYS adapt card sections to the **discovered** architecture
6. ALWAYS mark files `(EXISTING — MODIFY)` or `(NEW — CREATE)` from evidence
7. ALWAYS emit **one** markdown file: Epic then sub-issues, dividers between them

## Language

- Card prose in `${OUTPUT_LANGUAGE}`
- Technical identifiers stay as in the codebase
- User story: locale-appropriate ("As a…", "Como um…")

## Context Sources

| Source | Use |
|--------|-----|
| Architecture docs (if any) | Layers, dependency rules, cross-cutting concerns |
| Exemplars / peer modules | Template for NEW files |
| Folder/structure docs | Paths and naming |
| Project READMEs | Existing files, methods, routes, schemas — **primary for EXISTING vs NEW** |
| Agent/contributor instructions | Do not suggest forbidden patterns |
| Code search | Fallback when docs lag |

Conditional stack notes (only if detected): Zod/validation schemas, TanStack Query hooks, Prisma/SQL migrations, Express routes — never treat as mandatory.

## File Status Logic

For every file mentioned:

1. Search READMEs / structure docs / codebase
2. **Exists** → `(EXISTING — MODIFY)`; list unchanged public surface; list only new additions
3. **Missing** → `(NEW — CREATE)`; full path from discovered conventions; reference a peer exemplar if found
4. Unrelated existing files → omit

For persistence: ALTER vs CREATE based on whether the table/collection/type exists; do not recreate existing enums/types.

## Step 1: Understand

Gather: feature name · roles · main operations · prototypes? · business rules · which card types · integrations.

If very rough: ask targeted questions; suggest optional ideas only with approval.

Summarize understanding + card list → **"Can I proceed?"** → **WAIT.**

## Step 2: Generate

Save as `[EPIC] Feature-Name.md` under the resolved cards directory.

Sub-issue order by dependency using **discovered** surfaces, typically: data/persistence (if any) → API/backend (if any) → UI/frontend (if any) → prototype (if requested). Skip types that do not apply (e.g. no DB → no database story).

### Generic card skeleton

Each card block:

```markdown
# [TYPE] Title

Tipo:        Epic | Story | Task | Bug | …
Prioridade:  (suggest; user may override)
Sprint:      (fill)
Categoria:   (from discovered surface)
Relator:     (fill)
Pai:         [EPIC] … or —
Data Limite: (fill)

## Description
[User story or narrative]

## Acceptance Criteria
### Scenario N — [Name]
Given … When … Then …
(error paths included)

## Technical refinement
[Only layers/modules that exist or will be created]

### [module-or-file] ([EXISTING — MODIFY] | [NEW — CREATE])
- Existing (do not change): …
- New to add: …
- If NEW: path + exemplar peer if known

## Business rules
- …

## Notes / Visual
[Prototypes, UX, constraints]
```

**Epic**: narrative scope, roles, major areas — no fake layer list.

**Data story** (if applicable): migrations/SQL/schema ops matching the real ORM/DB; post-apply commands from project scripts; diagram-update note if diagrams exist.

**API / backend story**: scenarios with real route style of the project; list only real layer files (handlers, services, repos, *or* whatever the repo uses).

**UI / frontend story**: scenarios with UI states; list components/pages/hooks/services as they exist in *this* repo; consumed endpoints/contracts.

**Prototype story** (optional): screens and acceptance checklist.

## Step 3: Quality Checks

- Contracts align across generated stories (API ↔ UI, schema ↔ API)
- Business rules consistent
- Every file correctly EXISTING vs NEW
- Metadata filled; dependency order respected
- No mandatory mention of layers the project does not use

## Step 4: Present

Show the full file → ask for adjustments → **WAIT** → user copies sections to the board.

## Priority Hints

| Type | Default |
|------|---------|
| Epic / Data / API (when blocking) | Highest |
| UI | High |
| Prototype | Medium |
| Bug | High |
| Docs | Low |

## Scenarios

- Rough idea → clarify → approve scope → generate
- Detailed epic → restructure into template + fill technical detail from discovery
- Prototype images → extract screens/actions into Visual + AC
- Subset of cards → generate only those; keep internal consistency
- Mostly MODIFY → emphasize existing vs new surface clearly
