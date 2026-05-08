import yaml from 'js-yaml'
import type { Workspace, Workflow, WorkflowStep, WorkflowMeta } from './types'
import { tokenCountFromString } from './types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function serializeStep(step: WorkflowStep) {
  return {
    id: step.id,
    name: step.name,
    description: step.description || undefined,
    inputs: step.inputs.length ? step.inputs : undefined,
    outputs: step.outputs.length ? step.outputs : undefined,
    agents: step.agents.length
      ? step.agents.map((a) => ({
          name: a.name,
          model: a.model,
          skills: a.skills.length ? a.skills : undefined,
          harness: a.harness || undefined,
        }))
      : undefined,
    tools: step.tools.length
      ? step.tools.map((t) => ({
          name: t.name,
          type: t.type,
          required: t.required,
          alternatives: t.alternatives.length ? t.alternatives : undefined,
        }))
      : undefined,
    actor: step.actor,
    enforcement: step.enforcement,
    notes: step.notes || undefined,
  }
}

function conventionsSection(): string {
  return [
    '## Conventions',
    '',
    '- `actor: human` — must be performed by a person',
    '- `actor: agent` — can be fully delegated to an AI agent',
    '- `actor: either` — human or agent, at the team\'s discretion',
    '- `enforcement: required` — this step must be completed before proceeding',
    '- `enforcement: recommended` — skip only with documented justification',
    '- `enforcement: optional` — use at team discretion',
    '- `alternatives` — acceptable substitutes when the primary tool is unavailable',
    '',
    '---',
    '',
  ].join('\n')
}

// ─── Single workflow export ───────────────────────────────────────────────────

export function exportWorkflowMarkdown(workflow: Workflow, workspace: Workspace): string {
  const now = new Date().toISOString()
  const lines: string[] = []

  lines.push('---')
  lines.push(`name: ${workflow.name}`)
  lines.push(`version: ${workflow.version || '1.0.0'}`)
  if (workspace.team) lines.push(`team: ${workspace.team}`)
  if (workflow.description) lines.push(`description: ${workflow.description}`)
  if (workflow.tags?.length) lines.push(`tags: [${workflow.tags.join(', ')}]`)
  if (workflow.dependsOn?.length) lines.push(`depends_on: [${workflow.dependsOn.join(', ')}]`)
  lines.push(`exported: ${now}`)
  lines.push('---')
  lines.push('')
  lines.push(`# Workflow: ${workflow.name}`)
  lines.push('')
  if (workflow.description) {
    lines.push(workflow.description)
    lines.push('')
  }
  lines.push(
    'This document describes a focused workflow. Load it when working within this domain.'
  )
  lines.push('See `workflow.md` in the project root for the full workspace manifest.')
  lines.push('')
  lines.push(conventionsSection())

  lines.push('## Steps')
  lines.push('')
  lines.push('```yaml')
  lines.push(
    yaml
      .dump(
        { workflow: { id: workflow.id, name: workflow.name, steps: workflow.steps.map(serializeStep) } },
        { lineWidth: 100, quotingType: '"' }
      )
      .trim()
  )
  lines.push('```')
  lines.push('')

  return lines.join('\n')
}

export function exportWorkflowSummary(workflow: Workflow): string {
  const data = {
    workflow: {
      name: workflow.name,
      steps: workflow.steps.map((s) => ({ name: s.name, actor: s.actor })),
    },
  }
  return [
    `# Summary: ${workflow.name}`,
    '',
    '```yaml',
    yaml.dump(data, { lineWidth: 100 }).trim(),
    '```',
    '',
  ].join('\n')
}

// ─── Workspace manifest export ───────────────────────────────────────────────

export function exportManifest(workspace: Workspace): string {
  const now = new Date().toISOString()
  const workflowMetas: Array<WorkflowMeta & { tokens: number }> = workspace.workflows.map((wf) => {
    const content = exportWorkflowMarkdown(wf, workspace)
    return {
      id: wf.id,
      name: wf.name,
      description: wf.description,
      tags: wf.tags ?? [],
      file: `workflows/${wf.name.replace(/\s+/g, '-').toLowerCase()}.md`,
      dependsOn: wf.dependsOn ?? [],
      tokens: tokenCountFromString(content),
    }
  })

  const manifestData = {
    workspace: {
      name: workspace.name,
      version: workspace.version || '1.0.0',
      team: workspace.team || undefined,
      description: workspace.description || undefined,
      exported: now,
      workflows: workflowMetas.map((m) => ({
        id: m.id,
        name: m.name,
        file: m.file,
        description: m.description || undefined,
        tags: m.tags.length ? m.tags : undefined,
        depends_on: m.dependsOn.length ? m.dependsOn : undefined,
        tokens: m.tokens,
      })),
    },
  }

  const lines: string[] = []
  lines.push('---')
  lines.push(`name: ${workspace.name}`)
  lines.push(`version: ${workspace.version || '1.0.0'}`)
  if (workspace.team) lines.push(`team: ${workspace.team}`)
  lines.push(`exported: ${now}`)
  lines.push('---')
  lines.push('')
  lines.push(`# Workflow Manifest: ${workspace.name}`)
  lines.push('')
  if (workspace.description) {
    lines.push(workspace.description)
    lines.push('')
  }
  lines.push('## Load Instructions')
  lines.push('')
  lines.push(
    'This file is the workspace index. When starting a session, read this manifest first.'
  )
  lines.push(
    'Load only the workflow files relevant to your current task — do not load all workflows.'
  )
  lines.push('Match your task to the workflow descriptions and tags below.')
  lines.push('')
  lines.push('```yaml')
  lines.push(yaml.dump(manifestData, { lineWidth: 100 }).trim())
  lines.push('```')
  lines.push('')
  lines.push('## Workflow Index')
  lines.push('')

  for (const m of workflowMetas) {
    lines.push(
      `- **[${m.name}](${m.file})** — ${m.description || 'No description'} *(≈${m.tokens.toLocaleString()} tokens)*`
    )
    if (m.tags.length) lines.push(`  Tags: ${m.tags.join(', ')}`)
    if (m.dependsOn.length) lines.push(`  Depends on: ${m.dependsOn.join(', ')}`)
  }

  lines.push('')
  return lines.join('\n')
}

export interface WorkspaceExportBundle {
  manifest: { filename: string; content: string }
  workflows: Array<{ filename: string; content: string }>
  json: { filename: string; content: string }
}

export function exportWorkspaceBundle(workspace: Workspace): WorkspaceExportBundle {
  const baseName = workspace.name.replace(/\s+/g, '-').toLowerCase()
  return {
    manifest: {
      filename: 'workflow.md',
      content: exportManifest(workspace),
    },
    workflows: workspace.workflows.map((wf) => ({
      filename: `workflows/${wf.name.replace(/\s+/g, '-').toLowerCase()}.md`,
      content: exportWorkflowMarkdown(wf, workspace),
    })),
    json: {
      filename: `${baseName}-workspace.json`,
      content: JSON.stringify(workspace, null, 2),
    },
  }
}

export function exportJson(workspace: Workspace): string {
  return JSON.stringify(workspace, null, 2)
}

// ─── Import ───────────────────────────────────────────────────────────────────

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

export function importWorkflowMarkdown(content: string): Workflow | null {
  try {
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    const meta: Record<string, string> = {}
    if (fmMatch) {
      fmMatch[1].split('\n').forEach((line) => {
        const [k, ...v] = line.split(': ')
        if (k) meta[k.trim()] = v.join(': ').trim()
      })
    }

    const yamlBlocks = [...content.matchAll(/```yaml\n([\s\S]*?)```/g)]
    let steps: WorkflowStep[] = []

    for (const match of yamlBlocks) {
      const parsed = yaml.load(match[1]) as { workflow?: { steps?: unknown[] } }
      const rawSteps = parsed?.workflow?.steps
      if (!Array.isArray(rawSteps)) continue

      steps = (rawSteps as Array<Record<string, unknown>>).map((s, i) => ({
        id: String(s.id || uid()),
        type: 'step' as const,
        name: String(s.name || ''),
        description: String(s.description || ''),
        inputs: (s.inputs as string[]) || [],
        outputs: (s.outputs as string[]) || [],
        agents: ((s.agents as Array<Record<string, unknown>>) || []).map((a) => ({
          id: uid(),
          name: String(a.name || ''),
          model: String(a.model || ''),
          skills: (a.skills as string[]) || [],
          harness: String(a.harness || ''),
        })),
        tools: ((s.tools as Array<Record<string, unknown>>) || []).map((t) => ({
          id: uid(),
          name: String(t.name || ''),
          type: (t.type as 'saas') || 'saas',
          required: Boolean(t.required),
          alternatives: (t.alternatives as string[]) || [],
        })),
        actor: (['human', 'agent', 'either'].includes(s.actor as string) ? s.actor : 'either') as 'human' | 'agent' | 'either',
        enforcement: (s.enforcement as 'required') || 'optional',
        notes: String(s.notes || ''),
        position: { x: (i % 3) * 280, y: Math.floor(i / 3) * 180 },
      }))
      break // use the first workflow block found
    }

    return {
      id: uid(),
      name: meta.name || 'Imported Workflow',
      version: meta.version || '1.0.0',
      team: meta.team || '',
      description: meta.description || '',
      tags: [],
      dependsOn: [],
      steps,
    }
  } catch {
    return null
  }
}

export function importJson(content: string): Workspace | null {
  try {
    return JSON.parse(content) as Workspace
  } catch {
    return null
  }
}
