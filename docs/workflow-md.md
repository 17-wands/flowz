# The workflow.md Format

A structured Markdown document that gives LLMs context about how your team works — analogous to `CLAUDE.md` for code conventions or `DESIGN.md` for design systems.

---

## What is workflow.md?

`workflow.md` is a **multi-actor contract**: a structured document that specifies, for each step in a workflow, who is eligible to perform it (`actor`), what inputs it requires, what outputs it produces, and what happens next. It is designed for teams where human and AI agents work together — the typed outputs of one step become the required inputs of the next.

Any worker reading a workflow file — human or agent — can immediately identify:
- Which steps they are eligible to perform (`actor: human | agent | either`)
- What artifacts must exist before they start (`inputs`)
- What they must produce before the next step can begin (`outputs`)
- Which steps are non-negotiable (`enforcement: required`)

---

## Two-tier structure

A workspace is split into two tiers to avoid bloating any single LLM context:

| File | Size | Purpose |
|------|------|---------|
| `workflow.md` (root) | ~200 tokens | Manifest/index. Always load first. |
| `workflows/*.md` | 400–2,000 tokens each | Full detail per workflow. Load only what's relevant. |

The manifest contains a **Load Instructions** section that tells the LLM exactly what to do.

---

## Manifest format (`workflow.md`)

```markdown
---
name: Acme Engineering
version: 1.0.0
team: Acme Platform Team
exported: 2026-05-08T10:00:00Z
---

# Workflow Manifest: Acme Engineering

## Load Instructions

This file is the workspace index. When starting a session, read this manifest first.
Load only the workflow files relevant to your current task.
Match your task to the workflow descriptions and tags below.

```yaml
workspace:
  name: Acme Engineering
  version: 1.0.0
  workflows:
    - id: discovery
      name: Discovery & Requirements
      file: workflows/discovery.md
      description: User research, design, and PRD drafting
      tags: [discovery, ux, requirements]
      tokens: 1420
    - id: development
      name: Development
      file: workflows/development.md
      description: AI-assisted feature development and testing
      tags: [dev, claude-code, cursor, testing]
      depends_on: [discovery]
      tokens: 2180
``

## Workflow Index

- **[Discovery & Requirements](workflows/discovery.md)** — User research, design, and PRD drafting *(≈1,420 tokens)*
- **[Development](workflows/development.md)** — AI-assisted feature development and testing *(≈2,180 tokens)*
```

---

## Workflow file format (`workflows/*.md`)

Each workflow file: YAML frontmatter + conventions section + one YAML block per phase.

```markdown
---
name: Discovery & Requirements
version: 1.0.0
description: User research, design, and PRD drafting.
tags: [discovery, ux, requirements]
exported: 2026-05-08T10:00:00Z
---

# Workflow: Discovery & Requirements

## Conventions

- `actor: human` — must be performed by a person
- `actor: agent` — can be fully delegated to an AI agent
- `actor: either` — human or agent, at the team's discretion
- `enforcement: required` — this step must be completed before proceeding
- `enforcement: recommended` — skip only with documented justification
- `enforcement: optional` — use at team discretion
- `alternatives` — acceptable substitutes when the primary tool is unavailable

---

## Phase: Discovery

Synthesize user interviews and analytics into product insights.

```yaml
phase:
  id: discovery
  name: Discovery
  steps:
    - id: research-synthesis
      name: User Research Synthesis
      description: Synthesize interviews and analytics into insights.
      inputs:
        - "Interview recordings"
        - "Analytics exports"
      outputs:
        - "Insight brief"
        - "User journey map"
      agents:
        - name: Claude Sonnet
          model: claude-sonnet-4-6
          skills: [summarize, extract-themes]
          harness: claude-code
      tools:
        - name: Notion
          type: saas
          required: true
          alternatives: [Confluence, Miro]
      actor: either
      enforcement: required
``
```

---

## Field reference

| Field | Type | Limit | Description |
|-------|------|-------|-------------|
| `id` | string | — | Unique identifier (slug format) |
| `name` | string | 80 chars | Human-readable step name |
| `description` | string | 200 chars | What this step accomplishes |
| `inputs` | string[] | 8 items × 80 chars | Artifacts consumed — must exist before this step starts |
| `outputs` | string[] | 8 items × 80 chars | Artifacts produced — required inputs for downstream steps |
| `actor` | enum | — | `human` \| `agent` \| `either` — who is eligible to perform this step |
| `enforcement` | enum | — | `required` \| `recommended` \| `optional` |
| `notes` | string | 300 chars | Caveats, constraints, edge cases |
| `agents[].name` | string | 60 chars | Agent display name |
| `agents[].model` | string | — | Model ID, e.g. `claude-sonnet-4-6` |
| `agents[].skills` | string[] | — | Skills the agent uses at this step |
| `agents[].harness` | string | — | e.g. `claude-code`, `langchain`, `custom` |
| `tools[].name` | string | 60 chars | Tool name |
| `tools[].type` | enum | — | `saas` \| `ai-tool` \| `cli` \| `sdk` \| `ide` \| `local-config` |
| `tools[].required` | boolean | — | Required vs. optional |
| `tools[].alternatives` | string[] | 4 items | Acceptable substitutes |

---

## Token budget methodology

Token counts are estimated as `ceil(serializedChars / 3.8)`.

The constant **3.8 chars/token** is the empirical midpoint for mixed YAML + English content, based on published benchmarks against the cl100k tokenizer. Accuracy is ±8% on typical workflow files.

| Content type | Chars/token | Notes |
|-------------|-------------|-------|
| English prose | 3.9–4.1 | Technical terms tokenize slightly smaller |
| YAML keys and structure | 3.3–3.6 | Punctuation and indentation overhead |
| Mixed YAML + English | 3.7–3.9 | Workflow files — we use **3.8** |
| Code / model IDs | 3.0–3.5 | Subword tokenization of identifiers |

**Budget guidelines:**
- Manifest: ≤ 300 tokens
- Individual workflow files: ≤ 2,000 tokens each
- Single working session context: load ≤ 3 workflow files at a time

---

## Using with LLMs

Add to your `CLAUDE.md` or system prompt:

```
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

## Install the skill

The Flowz skill lets you build a `workflow.md` conversationally inside Claude Code:

```bash
npx flowz-skill
```

This installs the skill into `.agents/skills/flowz/` in your project. Invoke it in Claude Code with `/flowz`.

See [`skill/README.md`](../skill/README.md) for details.

---

## See also

- [Flowz canvas](https://flowz.vercel.app/canvas) — visual editor for workflow.md
- [Templates](https://flowz.vercel.app/templates) — starter workspaces
- [skill/SKILL.md](../skill/SKILL.md) — the Claude Code skill definition
