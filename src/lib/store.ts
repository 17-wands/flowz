'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Node, Edge } from '@xyflow/react'
import type { Workspace, Workflow, WorkflowStep } from './types'

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

function emptyWorkflow(name = 'Untitled Workflow'): Workflow {
  return {
    id: uid(),
    name,
    version: '1.0.0',
    team: '',
    description: '',
    tags: [],
    dependsOn: [],
    steps: [],
  }
}

function emptyWorkspace(): Workspace {
  const firstWorkflow = emptyWorkflow('Untitled Workflow')
  return {
    id: uid(),
    name: 'Untitled Workspace',
    description: '',
    team: '',
    version: '1.0.0',
    workflows: [firstWorkflow],
  }
}

interface FlowzState {
  workspace: Workspace
  activeWorkflowId: string
  selectedNodeId: string | null
  exportModalOpen: boolean
  exportMode: 'full' | 'summary' | 'manifest'

  // Convenience: get the active Workflow
  activeWorkflow: () => Workflow

  // Workspace meta
  setWorkspaceName: (name: string) => void
  setWorkspaceMeta: (meta: Partial<Pick<Workspace, 'name' | 'description' | 'team' | 'version'>>) => void

  // Workflows within workspace
  addWorkflow: (name?: string) => Workflow
  duplicateWorkflow: (workflowId: string) => Workflow
  updateWorkflow: (workflowId: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (workflowId: string) => void
  setActiveWorkflow: (workflowId: string) => void
  loadWorkspace: (workspace: Workspace) => void

  // Steps (within active workflow)
  addStep: (step?: Partial<WorkflowStep>) => WorkflowStep
  updateStep: (stepId: string, updates: Partial<WorkflowStep>) => void
  deleteStep: (stepId: string) => void

  // Selection
  selectNode: (id: string | null) => void

  // Export modal
  setExportModalOpen: (open: boolean) => void
  setExportMode: (mode: 'full' | 'summary' | 'manifest') => void
}

function updateActiveWorkflow(
  workspace: Workspace,
  activeId: string,
  fn: (w: Workflow) => Workflow
): Workspace {
  return {
    ...workspace,
    workflows: workspace.workflows.map((w) => (w.id === activeId ? fn(w) : w)),
  }
}

export const useFlowzStore = create<FlowzState>()(
  persist(
    (set, get) => ({
      workspace: emptyWorkspace(),
      activeWorkflowId: '',
      selectedNodeId: null,
      exportModalOpen: false,
      exportMode: 'full',

      activeWorkflow: () => {
        const { workspace, activeWorkflowId } = get()
        return (
          workspace.workflows.find((w) => w.id === activeWorkflowId) ??
          workspace.workflows[0]
        )
      },

      // ── Workspace ──────────────────────────────────────────────────────────
      setWorkspaceName: (name) =>
        set((s) => ({ workspace: { ...s.workspace, name } })),

      setWorkspaceMeta: (meta) =>
        set((s) => ({ workspace: { ...s.workspace, ...meta } })),

      loadWorkspace: (workspace) => {
        set({
          workspace,
          activeWorkflowId: workspace.workflows[0]?.id ?? '',
          selectedNodeId: null,
        })
      },

      // ── Workflows ──────────────────────────────────────────────────────────
      addWorkflow: (name = 'New Workflow') => {
        const wf = emptyWorkflow(name)
        set((s) => ({
          workspace: { ...s.workspace, workflows: [...s.workspace.workflows, wf] },
          activeWorkflowId: wf.id,
        }))
        return wf
      },

      duplicateWorkflow: (workflowId) => {
        const src = get().workspace.workflows.find((w) => w.id === workflowId)
        if (!src) return emptyWorkflow()
        const copy: Workflow = {
          ...JSON.parse(JSON.stringify(src)),
          id: uid(),
          name: `${src.name} (copy)`,
        }
        set((s) => ({
          workspace: { ...s.workspace, workflows: [...s.workspace.workflows, copy] },
          activeWorkflowId: copy.id,
        }))
        return copy
      },

      updateWorkflow: (workflowId, updates) =>
        set((s) => ({
          workspace: {
            ...s.workspace,
            workflows: s.workspace.workflows.map((w) =>
              w.id === workflowId ? { ...w, ...updates } : w
            ),
          },
        })),

      deleteWorkflow: (workflowId) => {
        const { workspace, activeWorkflowId } = get()
        if (workspace.workflows.length <= 1) return
        const remaining = workspace.workflows.filter((w) => w.id !== workflowId)
        set({
          workspace: { ...workspace, workflows: remaining },
          activeWorkflowId:
            activeWorkflowId === workflowId ? (remaining[0]?.id ?? '') : activeWorkflowId,
        })
      },

      setActiveWorkflow: (workflowId) => set({ activeWorkflowId: workflowId, selectedNodeId: null }),

      // ── Steps ─────────────────────────────────────────────────────────────
      addStep: (step = {}) => {
        const newStep: WorkflowStep = {
          id: uid(),
          type: 'step',
          name: 'New Step',
          description: '',
          inputs: [],
          outputs: [],
          agents: [],
          tools: [],
          actor: 'either',
          enforcement: 'optional',
          notes: '',
          position: { x: 100, y: 100 },
          ...step,
        }
        set((s) => ({
          workspace: updateActiveWorkflow(s.workspace, s.activeWorkflowId, (w) => ({
            ...w,
            steps: [...w.steps, newStep],
          })),
        }))
        return newStep
      },

      updateStep: (stepId, updates) =>
        set((s) => ({
          workspace: updateActiveWorkflow(s.workspace, s.activeWorkflowId, (w) => ({
            ...w,
            steps: w.steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)),
          })),
        })),

      deleteStep: (stepId) =>
        set((s) => ({
          workspace: updateActiveWorkflow(s.workspace, s.activeWorkflowId, (w) => ({
            ...w,
            steps: w.steps.filter((step) => step.id !== stepId),
          })),
          selectedNodeId: s.selectedNodeId === stepId ? null : s.selectedNodeId,
        })),

      selectNode: (id) => set({ selectedNodeId: id }),
      setExportModalOpen: (open) => set({ exportModalOpen: open }),
      setExportMode: (mode) => set({ exportMode: mode }),
    }),
    {
      name: 'flowz-workspace',
      partialize: (state) => ({
        workspace: state.workspace,
        activeWorkflowId: state.activeWorkflowId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.activeWorkflowId && state.workspace.workflows.length > 0) {
          state.activeWorkflowId = state.workspace.workflows[0].id
        }
      },
    }
  )
)

// ── React Flow helpers ──────────────────────────────────────────────────────

export function workflowToReactFlow(workflow: Workflow): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const COLS = 3
  const GAP_X = 280
  const GAP_Y = 180

  workflow.steps.forEach((step, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    nodes.push({
      id: step.id,
      type: 'stepNode',
      position:
        step.position.x !== 100 || step.position.y !== 100
          ? step.position
          : { x: col * GAP_X, y: row * GAP_Y },
      data: { step },
      draggable: true,
    })
  })

  for (let i = 0; i < workflow.steps.length - 1; i++) {
    edges.push({
      id: `e-${workflow.steps[i].id}-${workflow.steps[i + 1].id}`,
      source: workflow.steps[i].id,
      target: workflow.steps[i + 1].id,
      type: 'animatedEdge',
    })
  }

  return { nodes, edges }
}
