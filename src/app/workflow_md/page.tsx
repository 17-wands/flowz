import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: '#EEF1F7', letterSpacing: '-0.03em' }}>
        {title}
      </h2>
      <div className="space-y-4 text-slate-300 leading-relaxed">{children}</div>
    </section>
  )
}

function Code({ children }: { children: string }) {
  return (
    <pre
      className="rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto leading-relaxed"
      style={{ background: '#08090D', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {children}
    </pre>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-violet-300 text-sm bg-violet-500/10 px-1.5 py-0.5 rounded">{children}</code>
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.2)', color: '#B4A2FF' }}>
      {children}
    </div>
  )
}

const TOC = [
  { id: 'what', label: 'What is workflow.md?' },
  { id: 'two-tier', label: 'Two-tier structure' },
  { id: 'manifest', label: 'Manifest format' },
  { id: 'workflow-file', label: 'Workflow file format' },
  { id: 'fields', label: 'Field reference' },
  { id: 'tokens', label: 'Token budget' },
  { id: 'usage', label: 'Using with LLMs' },
  { id: 'skill', label: 'Install the skill' },
]

export default function WorkflowMdPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-ink-900 sticky top-0 z-10">
        <Link href="/">
          <div className="text-sm font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(124,92,255,0.15)', color: '#B4A2FF' }}>Flowz</div>
        </Link>
        <span className="text-slate-500">·</span>
        <span className="text-sm text-slate-300 font-medium">workflow.md format spec</span>
        <div className="flex-1" />
        <a
          href="https://github.com/17-wands/flowz/blob/main/docs/workflow-md.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-mist-100 transition-colors"
        >
          View on GitHub <ExternalLink size={12} />
        </a>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 flex gap-12">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Contents</p>
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-xs text-slate-500 hover:text-mist-100 py-1 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <Link href="/canvas" className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Open canvas <ArrowRight size={11} />
              </Link>
              <Link href="/templates" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Browse templates <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-12">
            <h1 className="text-4xl font-semibold tracking-tight mb-4" style={{ color: '#EEF1F7', letterSpacing: '-0.04em' }}>
              The workflow.md format
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              A structured Markdown document that gives LLMs context about how your team works — analogous to <InlineCode>CLAUDE.md</InlineCode> for conventions or <InlineCode>DESIGN.md</InlineCode> for design systems.
            </p>
          </div>

          <Section id="what" title="What is workflow.md?">
            <p>
              <InlineCode>workflow.md</InlineCode> is a <strong>multi-actor contract</strong>: a structured document that specifies, for each step in a workflow, who is eligible to perform it (<InlineCode>actor</InlineCode>), what inputs it requires, what outputs it produces, and what happens next. It is designed for teams where human and AI agents work together — the typed outputs of one step become the required inputs of the next.
            </p>
            <p>
              Any worker reading a workflow file — human or agent — can immediately identify which steps they are eligible to perform, what artifacts must exist before they start, and what they must produce before the next step can begin.
            </p>
            <Note>
              This is analogous to <strong>CLAUDE.md</strong> for code conventions — but instead of documenting how code is structured, it documents <em>how work is structured</em> and <em>who does what</em>. The <InlineCode>actor</InlineCode> field is what makes it a contract rather than documentation.
            </Note>
          </Section>

          <Section id="two-tier" title="Two-tier structure">
            <p>
              A workspace is split into two tiers to avoid bloating any single LLM context:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: 'workflow.md (manifest)',
                  sub: 'Project root · ~200 tokens',
                  desc: 'Lightweight index. Lists all workflow files with descriptions, tags, and token counts. Always load this first.',
                  color: '#7C5CFF',
                },
                {
                  title: 'workflows/*.md',
                  sub: 'Per workflow · 400–2,000 tokens each',
                  desc: 'Full detail for one focused area (e.g. discovery, deployment). Load only what&apos;s relevant to the current task.',
                  color: '#22D3EE',
                },
              ].map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl p-4"
                  style={{ background: `${t.color}08`, border: `1px solid ${t.color}25` }}
                >
                  <div className="text-sm font-mono font-semibold mb-0.5" style={{ color: t.color }}>{t.title}</div>
                  <div className="text-[11px] mb-2" style={{ color: t.color, opacity: 0.7 }}>{t.sub}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm">
              The manifest contains a <strong>load instruction</strong> that tells the LLM exactly what to do — read the manifest, then load only the relevant workflow file for the current task.
            </p>
          </Section>

          <Section id="manifest" title="Manifest format (workflow.md)">
            <p>The root <InlineCode>workflow.md</InlineCode> is a Markdown file with YAML frontmatter and a structured YAML code block:</p>
            <Code>{`---
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

\`\`\`yaml
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
    - id: delivery
      name: Delivery
      file: workflows/delivery.md
      description: Deployment, CI/CD, and monitoring
      tags: [deployment, ci-cd, vercel]
      depends_on: [development]
      tokens: 980
\`\`\`

## Workflow Index

- **[Discovery & Requirements](workflows/discovery.md)** — User research, design, and PRD drafting *(≈1,420 tokens)*
- **[Development](workflows/development.md)** — AI-assisted feature development and testing *(≈2,180 tokens)*
- **[Delivery](workflows/delivery.md)** — Deployment, CI/CD, and monitoring *(≈980 tokens)*`}
            </Code>
          </Section>

          <Section id="workflow-file" title="Workflow file format (workflows/*.md)">
            <p>Each workflow file follows the same pattern: YAML frontmatter, a prose introduction, a conventions section, and then one YAML code block per phase:</p>
            <Code>{`---
name: Discovery & Requirements
version: 1.0.0
team: Acme Platform Team
description: User research, design, and PRD drafting.
tags: [discovery, ux, requirements]
exported: 2026-05-08T10:00:00Z
---

# Workflow: Discovery & Requirements

This workflow covers user research through PRD sign-off.
See \`workflow.md\` in the project root for the full workspace manifest.

## Conventions

- \`actor: human\` — must be performed by a person
- \`actor: agent\` — can be fully delegated to an AI agent
- \`actor: either\` — human or agent, at the team's discretion
- \`enforcement: required\` — this step must be completed before proceeding
- \`enforcement: recommended\` — skip only with documented justification
- \`enforcement: optional\` — use at team discretion
- \`alternatives\` — acceptable substitutes when the primary tool is unavailable

---

## Phase: Discovery

Synthesize user interviews and analytics into product insights.

\`\`\`yaml
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
        - name: Dovetail
          type: saas
          required: false
      actor: either
      enforcement: required
\`\`\`

---

## Phase: Requirements

Draft and review the PRD with AI assistance.

\`\`\`yaml
phase:
  id: requirements
  name: Requirements
  steps:
    - id: prd-drafting
      name: PRD Drafting
      description: Draft product requirements with Claude assistance.
      inputs:
        - "Opportunity brief"
        - "Design spec"
      outputs:
        - "PRD"
        - "Acceptance criteria"
      agents:
        - name: Claude Sonnet
          model: claude-sonnet-4-6
          skills: [write, structure, critique]
          harness: claude-code
      tools:
        - name: Linear
          type: saas
          required: true
          alternatives: [Jira, "GitHub Issues"]
      actor: agent
      enforcement: required
\`\`\``}
            </Code>
          </Section>

          <Section id="fields" title="Field reference">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Field', 'Type', 'Limit', 'Description'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 text-slate-400 font-semibold border-b border-white/[0.08]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['id', 'string', '—', 'Unique identifier (slug format recommended)'],
                    ['name', 'string', '80 chars', 'Human-readable step name'],
                    ['description', 'string', '200 chars', 'What this step accomplishes'],
                    ['inputs', 'string[]', '8 items × 80 chars', 'Artifacts consumed — must exist before this step starts'],
                    ['outputs', 'string[]', '8 items × 80 chars', 'Artifacts produced — required inputs for downstream steps'],
                    ['actor', 'enum', '—', 'human | agent | either — who is eligible to perform this step'],
                    ['enforcement', 'enum', '—', 'required | recommended | optional'],
                    ['notes', 'string', '300 chars', 'Additional context, caveats, or constraints'],
                    ['agents[].name', 'string', '60 chars', 'Agent display name'],
                    ['agents[].model', 'string', '—', 'Model ID, e.g. claude-sonnet-4-6'],
                    ['agents[].skills', 'string[]', '—', 'Skill names the agent uses for this step'],
                    ['agents[].harness', 'string', '—', 'e.g. claude-code, langchain, custom'],
                    ['tools[].name', 'string', '60 chars', 'Tool name'],
                    ['tools[].type', 'enum', '—', 'saas | ai-tool | cli | sdk | ide | local-config'],
                    ['tools[].required', 'boolean', '—', 'Whether the tool is required vs. optional'],
                    ['tools[].alternatives', 'string[]', '4 items', 'Acceptable substitutes if primary unavailable'],
                  ].map(([field, type, limit, desc]) => (
                    <tr key={field} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-3 py-2"><code className="font-mono text-violet-300">{field}</code></td>
                      <td className="px-3 py-2 text-slate-500 font-mono">{type}</td>
                      <td className="px-3 py-2 text-slate-600">{limit}</td>
                      <td className="px-3 py-2 text-slate-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="tokens" title="Token budget methodology">
            <p>
              Token counts are estimated as <InlineCode>ceil(serializedChars / 3.8)</InlineCode>. The constant <strong>3.8 chars/token</strong> is the empirical midpoint for mixed YAML + English content, based on published benchmarks against the cl100k tokenizer (the same family used by Claude). Accuracy is ±8% on typical workflow files.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Content type', 'Chars/token (measured)', 'Notes'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 text-slate-400 font-semibold border-b border-white/[0.08]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['English prose (description fields)', '3.9–4.1', 'Slightly above average due to technical terms'],
                    ['YAML keys and structure', '3.3–3.6', 'Shorter tokens from punctuation and indentation'],
                    ['Mixed YAML + English (workflow.md)', '3.7–3.9', 'Midpoint — we use 3.8'],
                    ['Code / model IDs', '3.0–3.5', 'Subword tokenization of identifiers'],
                  ].map(([type, ratio, note]) => (
                    <tr key={type as string} className="border-b border-white/[0.04]">
                      <td className="px-3 py-2 text-slate-300">{type}</td>
                      <td className="px-3 py-2 font-mono text-green-400">{ratio}</td>
                      <td className="px-3 py-2 text-slate-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm">
              Budget guidelines: keep individual workflow files under <strong>2,000 tokens</strong> for comfortable inclusion in a working session. The manifest itself targets <strong>≤ 300 tokens</strong>.
            </p>
          </Section>

          <Section id="usage" title="Using with LLMs">
            <p>
              Add this to your project&apos;s <InlineCode>CLAUDE.md</InlineCode> or system prompt:
            </p>
            <Code>{`## Workflow context

A \`workflow.md\` file exists at the project root. It is the manifest for this team's
product workflow. When starting any work session:

1. Read \`workflow.md\` to understand what workflow files exist.
2. Identify which workflow(s) are relevant to the current task based on descriptions and tags.
3. Read only those workflow files from the \`workflows/\` directory.
4. Only perform steps where \`actor\` is \`agent\` or \`either\`. Steps marked \`actor: human\`
   require a person and must not be executed autonomously.
5. Before starting a step, verify its inputs exist. A step's outputs become the required
   inputs for downstream steps — do not skip producing them.
6. Follow enforcement levels: complete \`required\` steps, use judgment on \`recommended\`,
   skip \`optional\` unless specifically helpful.
7. Prefer the listed tools and agents unless there is a documented reason to deviate.`}
            </Code>
            <Note>
              The manifest&apos;s built-in Load Instructions section already contains this text — it is included in every Flowz export automatically.
            </Note>
          </Section>

          <Section id="skill" title="Install the skill">
            <p>
              The Flowz skill lets you build a <InlineCode>workflow.md</InlineCode> conversationally inside Claude Code — no visual editor needed.
            </p>
            <Code>{`# Install into your project
npx flowz-skill

# This adds:
# .agents/skills/flowz/
#   SKILL.md      skill definition
#   README.md     usage guide
#   examples/     sample workflow files

# Invoke in a Claude Code session:
/flowz`}
            </Code>
            <p className="text-sm">
              The skill guides you through defining your workflow phases, steps, agents, and tools via a structured conversation, then writes the resulting <InlineCode>workflow.md</InlineCode> (and <InlineCode>workflows/</InlineCode> files) directly to your project.
            </p>
            <p className="text-sm">
              The skill is part of the Flowz repository. See <InlineCode>skill/README.md</InlineCode> for source and contribution details.
            </p>
          </Section>
        </main>
      </div>
    </div>
  )
}
