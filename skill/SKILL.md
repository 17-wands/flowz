# Flowz Workflow Builder Skill

## Purpose

Guide the user through building a `workflow.md` for their project — a structured Markdown document that gives LLMs context about how their team works. The output is a two-tier file set: a lightweight manifest (`workflow.md`) plus focused workflow files in `workflows/`.

This skill can be invoked at any time to create, update, or extend the workflow documentation for a project. It does not require the Flowz visual editor.

---

## When to invoke

Invoke `/flowz` when:
- A project has no `workflow.md` and the user wants to add one
- The user wants to update or extend an existing `workflow.md`
- The user wants to document a specific phase or workflow in isolation
- The user says "document our workflow", "create a workflow file", or similar

---

## Procedure

### Step 1 — Assess existing state

Check whether `workflow.md` or `workflows/` already exist in the project root. If they do, read them before proceeding so you can extend rather than overwrite.

```
Read: workflow.md (if exists)
Read: workflows/*.md (if exists)
```

### Step 2 — Discover team context

Ask the user (or infer from existing files like `README.md`, `CLAUDE.md`, `package.json`, `.github/`, etc.) the following. Do not ask all at once — gather what you can from the codebase first, then ask only what's missing:

1. **Workspace name** — e.g. "Acme Engineering", "Mobile App Team"
2. **Team name** (optional)
3. **Existing workflows** — what distinct areas of work exist? (e.g. discovery, dev, deployment) Each should become a separate `workflows/*.md` file.
4. **Tech stack** — what tools, IDEs, and AI models does the team use? (infer from package.json, .cursor/, .claude/ etc.)

### Step 3 — Build each workflow

For each workflow the user identifies, walk through phases interactively:

```
For each workflow:
  For each phase:
    Ask: What are the steps in this phase?
    For each step:
      - Name (required)
      - Description (≤ 200 chars)
      - Actor (human / agent / either — who is eligible to perform this step?)
      - Inputs (what artifacts must exist before this step starts?)
      - Outputs (what artifacts must this step produce for downstream steps?)
      - Agents (which AI agents / models / skills?)
      - Tools (SaaS, CLI, IDE, SDK — required vs. optional?)
      - Enforcement (required / recommended / optional)
```

**Inference rule:** If the user's tech stack is visible (e.g. Cursor + Claude Code in `.claude/`, Vitest in `package.json`, Vercel in project config), pre-fill tools and agents and ask for confirmation rather than asking from scratch.

### Step 4 — Write the files

Write files in this order:

1. Each `workflows/{name}.md` file
2. The root `workflow.md` manifest (generated from the workflow files)

Use the exact format from the [format spec](../docs/workflow-md.md). Enforce field limits:
- description ≤ 200 chars
- notes ≤ 300 chars
- inputs/outputs ≤ 8 items each, ≤ 80 chars per item
- tool alternatives ≤ 4

### Step 5 — Confirm and summarize

After writing:
- Show the user the file list created
- Show the token count for each file (estimate: `ceil(chars / 3.8)`)
- Suggest adding the load instruction to `CLAUDE.md` (show the snippet)
- Offer to open the visual editor: `flowz.app/canvas` (import the generated files)

---

## Output format

### `workflow.md` (manifest)

```markdown
---
name: {workspace name}
version: 1.0.0
team: {team name}
exported: {ISO timestamp}
---

# Workflow Manifest: {workspace name}

## Load Instructions

This file is the workspace index. When starting a session, read this manifest first.
Load only the workflow files relevant to your current task.
Match your task to the workflow descriptions and tags below.

```yaml
workspace:
  name: {workspace name}
  version: 1.0.0
  workflows:
    - id: {id}
      name: {name}
      file: workflows/{slug}.md
      description: {one line}
      tags: [{tag1}, {tag2}]
      tokens: {estimate}
``

## Workflow Index

- **[{name}](workflows/{slug}.md)** — {description} *(≈{tokens} tokens)*
```

### `workflows/{slug}.md` (workflow file)

```markdown
---
name: {workflow name}
version: 1.0.0
description: {description}
tags: [{tags}]
exported: {ISO timestamp}
---

# Workflow: {workflow name}

{one paragraph description}
See `workflow.md` in the project root for the full workspace manifest.

## Conventions

- `actor: human` — must be performed by a person
- `actor: agent` — can be fully delegated to an AI agent
- `actor: either` — human or agent, at the team's discretion
- `enforcement: required` — this step must be completed before proceeding
- `enforcement: recommended` — skip only with documented justification
- `enforcement: optional` — use at team discretion
- `alternatives` — acceptable substitutes when the primary tool is unavailable

---

## Phase: {phase name}

{phase description}

```yaml
phase:
  id: {phase-id}
  name: {phase name}
  steps:
    - id: {step-id}
      name: {step name}
      description: {description}
      inputs: [...]
      outputs: [...]
      agents:
        - name: {agent name}
          model: {model id}
          skills: [...]
          harness: {harness}
      tools:
        - name: {tool name}
          type: {tool type}
          required: {true|false}
          alternatives: [...]
      actor: {human|agent|either}
      enforcement: {required|recommended|optional}
      notes: {optional}
``
```

---

## CLAUDE.md snippet to suggest

```markdown
## Workflow context

A `workflow.md` file exists at the project root. It is the manifest for this team's
product workflow. When starting any work session:

1. Read `workflow.md` to understand what workflow files exist.
2. Identify which workflow(s) are relevant to the current task based on descriptions and tags.
3. Read only those workflow files from the `workflows/` directory.
4. Only perform steps where `actor` is `agent` or `either`. Steps marked `actor: human`
   require a person and must not be executed autonomously.
5. Before starting a step, verify its inputs exist. A step's outputs become the required
   inputs for downstream steps — do not skip producing them.
6. Follow enforcement levels: complete `required` steps, use judgment on `recommended`,
   skip `optional` unless specifically helpful.
7. Prefer the listed tools and agents unless there is a documented reason to deviate.
```

---

## Examples

See [`examples/`](./examples/) for sample output files.
