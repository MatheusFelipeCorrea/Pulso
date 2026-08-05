---
name: project-startup
description: >-
  Onboarding orchestrator for a repository. Bootstraps project context, creates
  or refreshes .github/project.yml, then chains discovery, a repo-wide analysis,
  and optional audits. Use when dropping this pack into a new or existing repo,
  or when the user says "start up", "onboard", "analyze the whole repo".
---

# Project Startup — repo onboarding orchestrator

This is the **entry command**. It does not do deep analysis itself; it detects
the situation and **calls other skills in order**, pausing for the user between
heavy steps. Never invent paths, stacks, or requirements — always defer to
`project-discovery` for facts.

## Step 0 — Detect situation

1. Check for `.github/project.yml`.
   - **Missing/stale** → this is *first-time onboarding* (or a refresh).
   - **Valid** → this is a *returning repo*; skip to Step 3.
2. Check whether the repo has code yet (any manifest / source tree).
   - **Has code** → *existing project* path.
   - **Empty / scaffold only** → *greenfield* path (see Step 4).

## Step 1 — Discover + configure `project.yml`

Run **`project-discovery` in Configure mode**:

- Resolve layout, apps, docs, outputs, stack, conventions from evidence.
- Produce `.github/project.yml`, validate with `project.schema.json`.
- If a domain overlay is relevant, note it under `audits.overlay` (create the
  overlay file only if the user provides domain context).

**Show the proposed `project.yml` and wait for the user's OK before saving.**

## Step 2 — Repo snapshot

Report a short, evidence-backed snapshot (no file edits):

- Layout + apps/packages with their roots and manifests
- Detected stack (confirmed via imports/scripts/config)
- Docs found: requirements, READMEs, ADRs, diagrams
- Verified commands: install / lint / test / build (from manifests — never guessed)
- Gaps / uncertainties needing confirmation

## Step 3 — Offer the next commands

Present the menu and let the user pick; **do not auto-run heavy analysis**:

| Goal | Chain to | Skill / agent |
|------|----------|---------------|
| Full quality sweep | run every audit | **`full-audit`** |
| Single audit | one dimension | `po-audit`, `security-audit`, `devops-audit`, `dev-senior-review`, `ux-audit`, `architecture-audit` |
| Refresh docs | READMEs from code | `readme-updater` |
| Diagrams | PlantUML from code | `plantuml-diagram-generator` |
| Refine a card/epic | tighten scope + AC | `card-refiner` |
| Implement a card | phased plan + code | agent `implementation-plan` |
| New large module | scaffold architecture | `project-architect` |

Full catalog and trigger phrases: [`.github/COMMANDS.md`](../../COMMANDS.md).

## Step 4 — Greenfield (empty repo)

If there is no code yet:

1. Ask the user for name, locale, intended stack, and layout (monorepo/single).
2. Write a minimal `project.yml` from `project.example.yml` with only what the
   user confirmed; mark the rest as `uncertainties`.
3. Point them at `project-architect` (new modules) and the
   `implementation-plan` agent (build from cards). Re-run `project-discovery`
   once real code exists so `project.yml` reflects reality.

## Rules

- **Orchestrate, don't duplicate.** Delegate facts to `project-discovery` and
  work to the specialized skills/agents.
- **Pause between heavy steps.** Confirm before writing `project.yml` and before
  starting audits or implementation.
- Read-only except the `project.yml` write in Step 1 (with consent).
- Match `locale` from config, else the user's language.

## Example

> "Start up this repo." → detect no `project.yml` → run discovery → show proposed
> `project.yml` → save on OK → print snapshot → offer `full-audit` or a single audit.
