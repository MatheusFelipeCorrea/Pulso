---
name: project-architect
description: >-
  Greenfield architecture planner. Gathers scope and preferences, proposes
  stack-agnostic architecture (patterns, folders, data, APIs, screens), then
  generates production-ready READMEs with human approval gates. Use when
  starting a new project or major greenfield module — not for routine maintenance.
---

# Project Architect — Greenfield Planner

## Bootstrap

1. Read `.github/project.yml` if present (locale, preferred output roots, structure hints). Validate configured paths before relying on them.
2. This skill is **greenfield**: little or no existing code. Do not invent paths for an existing monorepo layout unless the user provides one.
3. Locale: config or user language.
4. README output paths: ask the user or use configured `docs.*_readme` / `docs.root` paths — never hardcode a product tree.
5. Optional later blueprints (`.github/docs/*`) are follow-on work — do not require them to finish planning.

## Variables

| Variable | Default |
|----------|---------|
| `${PROJECT_SCOPE}` | from user |
| `${TECH_STACK}` | Suggest \| user-provided |
| `${HAS_PROTOTYPES}` | Ask \| true \| false |
| `${PROJECT_STRUCTURE}` | Ask \| monorepo \| fullstack \| backend-only \| frontend-only |
| `${DATABASE_PROVIDER}` | Ask \| PostgreSQL \| MySQL \| MongoDB \| SQLite \| managed \| Other |
| `${OUTPUT_LANGUAGE}` | from config \| user |

## Critical Rules

1. NEVER skip steps; NEVER advance without explicit approval
2. NEVER assume — ask when unclear
3. ALWAYS adapt architecture, folders, and README sections to the **chosen** stack (not a fixed Express/Prisma/React template)
4. ALWAYS keep suggestions proportional to team size and timeline
5. ALWAYS generate READMEs in a clear, consistent format (emoji sections optional if user prefers plain)

## Language

Prose in `${OUTPUT_LANGUAGE}`; keep technical identifiers in their conventional English form when that matches the stack.

## Step 1: Project Understanding

Collect: name · objective · audience · core features · tech preferences or "suggest" · team size · timeline · hosting · auth · realtime · integrations · monorepo vs separate repos · prototypes available?

Summarize → **"Proceed to architecture?"** → **WAIT.**

## Step 2: Architecture Suggestion

### Pattern
Recommend MVC, layered, Clean, Hexagonal, modular, serverless, etc. — with **why** and tradeoffs. Avoid over-architecture for small projects.

### Stack table (if suggesting)
Layers as rows (UI, API, data, auth, tests, hosting…) — pick technologies that fit the problem. Examples are conditional only (e.g. React, Django, Go, Rails) — never mandatory.

### Structure
Monorepo vs separate vs fullstack framework; organize by layer, feature, or hybrid; show high-level folder tree only.

### Design choices
Discuss only what fits: service/domain layer, data-access abstraction, response shaping, middleware/pipeline, UI state strategy, validation placement.

### Data flow
Describe a typical operation end-to-end using the **chosen** layers (not a fixed controller→service→repository chain).

Approve architecture → **WAIT.**

## Step 3: Screens & UX

Ask about prototypes if unknown.

- **With images**: extract pages, components, actions, data, routes, API needs, visual patterns
- **Without**: propose screens (name, route, purpose, sections, components, data, actions, states) plus concrete UX ideas proportional to the product
- Map screens to roles and access strategy

Approve screens → **WAIT.**

## Step 4: Data Design

Entities from requirements/screens: names, fields, types, constraints, relationships, enums/indexes, timestamps.

Adapt to provider (SQL dialects, document schemas, etc.) and optionally show ORM/model equivalents for the chosen stack.

Integrity: cascades, uniques, checks; DB vs app validation.

Approve schema → **WAIT.**

## Step 5: APIs & Integrations

Per resource: method + path · purpose · auth/roles · body/query · success/error shapes. Group auth, CRUD, special ops, webhooks.

Standardize error JSON and status mapping. Document external services (protocol, auth, wrapping module, limits).

Approve contracts → **WAIT.**

## Step 6: README Generation

After all approvals, write READMEs for the agreed structure:

| Structure | Artifacts |
|-----------|-----------|
| Monorepo | Separate frontend/backend (and optional DB) READMEs at user-chosen paths |
| Fullstack | One README with client vs server sections + data |
| Backend-only | API README + data |
| Frontend-only | UI README + consumed APIs |

### README content (adapt sections to stack)

1. Header + short description
2. Index
3. Technologies table
4. Folder tree (ASCII)
5. Layer/module descriptions (`→` file/function notes; ✅/❌ responsibilities)
6. Data/request flow diagram (ASCII)
7. Routes or screens
8. How to run + scripts table
9. Environment variables
10. Error pattern (if API)
11. Business rules (if API)
12. Schema overview / SQL or migration notes (if data README)

### Consistency checks

Endpoints ↔ clients · pages ↔ routes · models ↔ schema · env vars aligned across apps.

Present READMEs → final approval → **WAIT.**

## Out of scope

Do not run maintenance skills (readme-updater, audits) as part of greenfield planning unless the user asks next.
