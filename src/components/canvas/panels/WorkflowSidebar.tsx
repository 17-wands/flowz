'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Workflow, Pencil, Trash2, Copy } from 'lucide-react'
import { useFlowzStore } from '@/lib/store'

export function WorkflowSidebar() {
  const workspace = useFlowzStore((s) => s.workspace)
  const activeWorkflowId = useFlowzStore((s) => s.activeWorkflowId)
  const activeWorkflow = useFlowzStore((s) => s.activeWorkflow)()
  const setActiveWorkflow = useFlowzStore((s) => s.setActiveWorkflow)
  const addWorkflow = useFlowzStore((s) => s.addWorkflow)
  const duplicateWorkflow = useFlowzStore((s) => s.duplicateWorkflow)
  const deleteWorkflow = useFlowzStore((s) => s.deleteWorkflow)
  const updateWorkflow = useFlowzStore((s) => s.updateWorkflow)

  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-white/[0.06] bg-ink-900 overflow-y-auto">
      {/* Workflows section */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Workflow size={12} className="text-slate-500" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
            Workflows
          </span>
        </div>
        <button
          onClick={() => addWorkflow()}
          className="text-slate-600 hover:text-violet-400 transition-colors"
          title="New workflow"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 py-2 space-y-0.5 px-2">
        {workspace.workflows.map((wf) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
          >
            {editingWorkflowId === wf.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => {
                  if (editingName.trim()) updateWorkflow(wf.id, { name: editingName.trim() })
                  setEditingWorkflowId(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (editingName.trim()) updateWorkflow(wf.id, { name: editingName.trim() })
                    setEditingWorkflowId(null)
                  }
                  if (e.key === 'Escape') setEditingWorkflowId(null)
                }}
                className="w-full px-3 py-1.5 text-xs bg-ink-800 border border-violet-500 rounded-lg text-mist-100 focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setActiveWorkflow(wf.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
                style={{
                  background: activeWorkflowId === wf.id ? 'rgba(124,92,255,0.15)' : 'transparent',
                  border: activeWorkflowId === wf.id ? '1px solid rgba(124,92,255,0.3)' : '1px solid transparent',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: activeWorkflowId === wf.id ? '#7C5CFF' : '#2A2F3D' }}
                />
                <span
                  className="text-xs flex-1 truncate"
                  style={{ color: activeWorkflowId === wf.id ? '#B4A2FF' : '#687083' }}
                >
                  {wf.name}
                </span>
                {wf.steps.length > 0 && (
                  <span
                    className="text-[10px] shrink-0"
                    style={{ color: activeWorkflowId === wf.id ? '#7C5CFF' : '#2A2F3D' }}
                  >
                    {wf.steps.length}s
                  </span>
                )}
              </button>
            )}

            {/* Hover actions */}
            {editingWorkflowId !== wf.id && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5 bg-ink-900 pl-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingWorkflowId(wf.id); setEditingName(wf.name) }}
                  className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  <Pencil size={10} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateWorkflow(wf.id) }}
                  className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  <Copy size={10} />
                </button>
                {workspace.workflows.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteWorkflow(wf.id) }}
                    className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Step count for active workflow */}
      {activeWorkflow && (
        <div className="px-4 py-2 border-t border-white/[0.06]">
          <p className="text-[10px] text-slate-600">
            {activeWorkflow.steps.length} step{activeWorkflow.steps.length !== 1 ? 's' : ''} in this workflow
          </p>
        </div>
      )}

      <div className="p-3 border-t border-white/[0.06]">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          Each workflow exports as its own <span className="font-mono">workflow.md</span> file.
        </p>
      </div>
    </aside>
  )
}
