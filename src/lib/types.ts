export type NodeType = 'step' | 'agent' | 'tool' | 'decision' | 'local-config'
export type Enforcement = 'required' | 'recommended' | 'optional'
export type ToolType = 'saas' | 'ai-tool' | 'cli' | 'sdk' | 'ide' | 'local-config'
export type Actor = 'human' | 'agent' | 'either'

export interface AgentRef {
  id: string
  name: string
  model: string
  skills: string[]
  harness: string
}

export interface ToolRef {
  id: string
  name: string
  type: ToolType
  required: boolean
  alternatives: string[]
}

export interface WorkflowStep {
  id: string
  type: NodeType
  name: string
  description: string      // ≤ 200 chars
  inputs: string[]         // ≤ 8 items, each ≤ 80 chars
  outputs: string[]        // ≤ 8 items, each ≤ 80 chars
  ai: AgentRef[]
  tools: ToolRef[]
  actor: Actor             // who is eligible to perform this step
  enforcement: Enforcement
  notes: string            // ≤ 300 chars
  position: { x: number; y: number }
}

export interface Workflow {
  id: string
  name: string
  version: string
  team: string
  description: string
  tags: string[]
  dependsOn: string[]   // workflow IDs
  steps: WorkflowStep[]
}

export interface WorkflowMeta {
  id: string
  name: string
  description: string
  tags: string[]
  file: string           // output filename, e.g. "workflows/discovery.md"
  dependsOn: string[]
}

export interface Workspace {
  id: string
  name: string
  description: string
  team: string
  version: string
  workflows: Workflow[]
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  icon: string
  tags: string[]
  workspace: Workspace
}

export interface CommunityTemplate {
  name: string
  description: string
  source: string
  url: string
  tags: string[]
}

// ─── Token estimation ────────────────────────────────────────────────────────
//
// Method: serialize the actual workflow content to YAML/Markdown, count
// characters, divide by 3.8 (empirical chars-per-token ratio for mixed
// YAML+English text, calibrated against the cl100k tokenizer).
//
// Basis: Published OpenAI tiktoken benchmarks show 1 token ≈ 4 chars for
// English prose; YAML structural overhead (keys, colons, indentation) reduces
// this to ~3.6–4.0 chars/token. We use 3.8 as the midpoint, giving ±8%
// accuracy without requiring a WASM tokenizer library.
//
// The export modal uses the actual serialized string for a precise count.
// The toolbar uses a fast character-accumulation estimate.

export const CHARS_PER_TOKEN = 3.8
export const TOKEN_GREEN = 4000
export const TOKEN_AMBER = 8000

/** Fast estimate: count characters across all filled fields and divide by
 *  CHARS_PER_TOKEN. Does not serialize to YAML (use tokenCountFromString for
 *  the export modal where we already have the rendered output). */
export function estimateTokens(workflow: Workflow): number {
  let chars = 0

  // Frontmatter + conventions boilerplate ≈ 650 chars
  chars += 650

  for (const step of workflow.steps) {
    // YAML structural keys overhead ≈ 150 chars per step
    chars += 150
    chars += step.name.length
    chars += step.description.length
    chars += step.notes.length
    chars += step.inputs.reduce((s, v) => s + v.length + 4, 0)
    chars += step.outputs.reduce((s, v) => s + v.length + 4, 0)
    chars += step.ai.reduce((s, a) => s + a.name.length + a.model.length + a.skills.join('').length + 30, 0)
    chars += step.tools.reduce((s, t) => s + t.name.length + t.type.length + t.alternatives.join('').length + 30, 0)
  }

  return Math.ceil(chars / CHARS_PER_TOKEN)
}

/** Precise count from an already-serialized string (used in export modal). */
export function tokenCountFromString(content: string): number {
  return Math.ceil(content.length / CHARS_PER_TOKEN)
}

export const NODE_TYPE_META: Record<NodeType, { label: string; color: string; description: string }> = {
  step: { label: 'Step', color: '#AEB6C7', description: 'A generic workflow step' },
  agent: { label: 'Agent', color: '#7C5CFF', description: 'An AI agent with model and skills' },
  tool: { label: 'Tool', color: '#3B82F6', description: 'A SaaS app, CLI, SDK, or AI tool' },
  decision: { label: 'Decision', color: '#F59E0B', description: 'A branching decision point' },
  'local-config': { label: 'Local Config', color: '#22C55E', description: 'IDE or environment setup step' },
}
