# Flowz

**A multi-actor contract format for human and AI teams — and the tools to author it.**

Flowz defines `WORKFLOW.md`: a structured document that specifies, for each step in a workflow, who is eligible to perform it (`actor: human | agent | either`), what inputs it requires, what outputs it produces, and what enforcement level applies. The typed outputs of one step become the required inputs of the next — making it a contract between workers, not just documentation about them.

Any worker reading a workflow file — human or AI — can immediately identify which steps they are eligible to perform, what must exist before they start, and what they must produce before the next step can begin.

---

## The WORKFLOW.md format

A workspace is split into two tiers to keep LLM context lean:

| File | Size | Purpose |
|------|------|---------|
| `WORKFLOW.md` (root) | ~200 tokens | Manifest/index. Always load first. |
| `workflows/*.md` | 400–2,000 tokens each | Full detail per workflow. Load only what's relevant. |

Each workflow file contains a flat list of steps:

```yaml
- id: research-synthesis
  name: User Research Synthesis
  description: Synthesize interviews and analytics into insights.
  actor: either
  enforcement: required
  inputs:
    - "Interview recordings"
    - "Analytics exports"
  outputs:
    - "Insight brief"
    - "User journey map"
  ai:
    - name: Claude Sonnet
      model: claude-sonnet-4-6
      skills: [summarize, extract-themes]
      harness: claude-code
  tools:
    - name: Notion
      type: saas
      required: true
      alternatives: [Confluence, Miro]
```

The `actor` field is what distinguishes this from a documentation format. Steps marked `actor: human` must not be executed autonomously by an agent. Steps marked `actor: agent` are fully delegatable. `actor: either` leaves it to the team's discretion.

Full format specification: [`docs/workflow-md.md`](docs/workflow-md.md) or [lets-flowz.vercel.app/workflow_md](https://lets-flowz.vercel.app/workflow_md).

---

## Three ways to author WORKFLOW.md

### 1. Visual canvas (this app)

The Flowz web app provides a node graph editor for building workflow files. Steps are cards on the canvas; the right panel edits all fields including `actor`, `enforcement`, inputs, outputs, `ai`, and tools. Export generates `WORKFLOW.md` + `workflows/*.md` directly.

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 2. Claude Code skill

Install the Flowz skill into any project and build `WORKFLOW.md` conversationally:

```bash
npx flowz-skill
```

This copies the skill into `.agents/skills/flowz/` in your project. Invoke it in a Claude Code session with `/flowz`. The skill interviews you about your team's workflows, infers tools from your repo, and writes the files directly.

See [`skill/README.md`](skill/README.md) for details.

### 3. Write by hand

The format is plain Markdown with YAML code blocks — no tooling required. Use [`docs/workflow-md.md`](docs/workflow-md.md) as the spec and [`skill/examples/`](skill/examples/) as reference output.

---

## Using WORKFLOW.md with LLMs

Add this to your project's `CLAUDE.md` or system prompt:

```markdown
## Workflow context

A `WORKFLOW.md` file exists at the project root. It is the manifest for this team's
product workflow. When starting any work session:

1. Read `WORKFLOW.md` to understand what workflow files exist.
2. Identify which workflow(s) are relevant to the current task based on descriptions and tags.
3. Read only those workflow files from the `workflows/` directory.
4. Only perform steps where `actor` is `agent` or `either`. Steps marked `actor: human`
   require a person and must not be executed autonomously.
5. Before starting a step, verify its inputs exist. A step's outputs become the required
   inputs for downstream steps — do not skip producing them.
6. Follow enforcement levels: complete `required` steps, use judgment on `recommended`,
   skip `optional` unless specifically helpful.
7. Prefer the listed `ai:` and `tools:` entries unless there is a documented reason to deviate.
```

The manifest's built-in Load Instructions section includes this text automatically in every Flowz export.

---

## Intended uses

- **Document your team's AI-assisted workflows** — capture which steps humans own, which AI can handle, what flows between them
- **Onboard agents to your process** — drop `WORKFLOW.md` into a project root and agents immediately understand the team's process, tool preferences, and handoff boundaries
- **Enforce actor boundaries** — use `actor: human` to mark steps that must not be delegated (sign-off gates, judgment calls, stakeholder reviews)
- **Build shared process libraries** — version-control your team's workflow definitions alongside the code they govern
- **Integrate with multi-agent pipelines** — the typed `inputs`/`outputs` structure maps naturally to agent handoff protocols

---

## Project structure

```
flowz/
  src/
    app/
      page.tsx              # Landing page
      canvas/page.tsx       # Visual workflow editor
      templates/page.tsx    # Starter workspace gallery
      workflow_md/page.tsx  # Format spec documentation
    components/canvas/      # React Flow nodes, edges, panels
    lib/
      store.ts              # Zustand state (workspace, workflows, steps)
      export.ts             # Serialize to WORKFLOW.md + JSON
      types.ts              # TypeScript interfaces + token estimation
      templates/            # Built-in starter workspaces
  skill/
    SKILL.md                # Claude Code skill definition
    README.md               # Skill installation guide
    bin/install.js          # npx flowz-skill installer
    examples/               # Sample WORKFLOW.md output files
  docs/
    workflow-md.md          # Format specification (repo-readable)
```

---

## Tech stack

- **Next.js 16** (App Router, static export, no backend)
- **@xyflow/react** — node graph canvas
- **Framer Motion** — animations
- **Zustand** — client state with localStorage persistence
- **js-yaml** — YAML serialization
- **Tailwind CSS** — utility styling with TechSimple design tokens

All data stays in the browser. No accounts, no API calls, no telemetry.

---

## Development

```bash
npm install
npm run dev        # development server → localhost:3000
npm run build      # production build
npx tsc --noEmit   # type check
```

---

## Contributing

Contributions welcome. Areas where help is most useful:

- Additional starter templates (`src/lib/templates/`)
- Import parsers for other workflow formats
- Export targets beyond Markdown/JSON
- Skill improvements (`skill/SKILL.md`)

Please open an issue before starting significant work.

---

## License

Apache 2.0. See [LICENSE](LICENSE).

The `WORKFLOW.md` format itself is an open specification — implementations, tooling, and parsers are encouraged without restriction.

---

## Authorship

Built by The Flowz Authors. Contributions are listed in git history.
