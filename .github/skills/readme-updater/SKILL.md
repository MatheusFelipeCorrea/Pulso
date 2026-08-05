---
name: readme-updater
description: >-
  Maintains existing project READMEs by scanning the codebase and surgically
  updating only what changed. Discovers canonical README paths via project.yml
  or repository layout — never hardcodes product-specific trees. Reports a
  diff-style change set and requires approval before applying. Use when READMEs
  drift from the code or on a periodic documentation refresh.
---

# README Updater — Documentation Maintenance

## Bootstrap

1. Read `.github/project.yml` if present (`docs.*_readme`, `docs.root`, `locale`, app roots). Validate configured paths; stale paths fall back to discovery.
2. If absent, **discover** — never invent paths:
   - Find `README.md` / `Readme.md` near repository and package roots, common documentation directories, and app folders
   - Prefer docs that describe modules/layers over stubs that only redirect
   - Manifests: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.
3. Locale: config or match existing README language — do not switch languages.
4. Optional blueprints under `.github/docs/` are context only; **code is primary**.

## Variables

| Variable | Default |
|----------|---------|
| `${README_LOCATIONS}` | Auto-detect \| paths from config/user |
| `${UPDATE_SCOPE}` | All \| Frontend only \| Backend only \| named packages |
| `${OUTPUT_LANGUAGE}` | from config \| match existing README |

## Critical Rules

1. NEVER rewrite a README from scratch — surgical updates only
2. NEVER remove without explaining why and getting approval
3. NEVER change format — preserve emojis, sections, arrows, tables, trees, tone
4. NEVER apply without approval — report all changes first
5. ALWAYS scan real files on disk
6. ALWAYS show old vs new
7. ALWAYS match the author's style

## Discover What to Scan

Do **not** assume controllers/services/hooks/Prisma. Infer folders from:

- Folder trees already documented in each README
- Discovered source roots (`src/`, `app/`, `lib/`, `pkg/`, etc.)
- Manifest scripts and dependencies

Typical signals (use only if they exist): pages/views/components, hooks/stores, routes/handlers, domain/services, data access, schemas/models, workers/jobs, tests, `.env.example`, ORM/schema files of any kind.

### Data / schema section

If a README documents a database:

- Locate schema via discovery (`prisma/schema.prisma`, Django models, TypeORM entities, SQL migrations, etc.)
- Update models/fields/enums/relations and recent migrations only when that section already exists or the user asks to add it

## Step 1: Scan and Compare

1. Parse each target README → inventory of documented files, methods, routes, models
2. Scan corresponding code → inventory of what exists now
3. Classify per section: **NEW** | **REMOVED** | **MODIFIED** | **UNCHANGED** (leave unchanged alone)

## Step 2: Report Changes

Present a change report (adapt labels to README locale):

```
### README Update Report

**[README path]:**

| Section | Change | Details |
|---------|--------|---------|
| … | NEW / MODIFIED / unchanged | … |

Removals (REQUIRE APPROVAL):

| Section | Would remove | Reason / possible rename? |
|---------|--------------|---------------------------|
```

Ask for approval. **WAIT.**

Neutral example detail (only if it matches the stack): "NEW module `order/` — handler `createOrder`, route `POST /orders`".

## Step 3: Apply (after approval)

- **NEW**: insert in the correct section, same format as neighbors, alpha or logical order
- **MODIFIED**: change only what drifted
- **REMOVED**: only after explicit approval; keep empty section headers if needed
- **Schema section**: create only if missing and user approved; otherwise surgical field/model updates
- Update ASCII folder trees / data-flow diagrams only when structure or flow actually changed

Preserve: emoji headers, `→` notation, ✅/❌ layer notes, tables, code blocks, indentation, language.

## Step 4: Confirm

DIFF-style list of applied edits per README. Ask the user to review the files.

## Periodic Guidance

On "Update the READMEs" / scheduled refresh:

- No significant surface changes → report up to date; do not write
- Significant → Steps 2–4

**Worth updating:** new/removed files in documented areas, public methods, routes/endpoints, schema surface, deps/scripts/env vars, folder tree changes.

**Not worth updating:** internal method body logic, style-only, comments, test contents (new test *files* may be documented), config *values*, git metadata.

## Extra Context (optional)

Cards (`outputs.cards` or `.github/plans/cards/`), diagrams (`docs.diagrams` or `.github/diagrams/`), engineering docs — context only. Code wins.
