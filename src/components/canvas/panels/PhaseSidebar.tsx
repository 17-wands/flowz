'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronRight, Layers, Workflow, Pencil, Trash2, Copy } from 'lucide-react'
import { useFlowzStore } from '@/lib/store'
import { LIFECYCLE_PHASES } from '@/lib/types'

export function PhaseSidebar() {
  const workspace = useFlowzStore((s) => s.workspace)
  const activeWorkflowId = useFlowzStore((s) => s.activeWorkflowId)
  const activeWorkflow = useFlowzStore((s) => s.activeWorkflow)()
  const setActiveWorkflow = useFlowzStore((s) => s.setActiveWorkflow)
  const addWorkflow = useFlowzStore((s) => s.addWorkflow)
  const duplicateWorkflow = useFlowzStore((s) => s.duplicateWorkflow)
  const deleteWorkflow = useFlowzStore((s) => s.deleteWorkflow)
  const updateWorkflow = useFlowzStore((s) => s.updateWorkflow)
  const addPhase = useFlowzStore((s) => s.addPhase)

  const [phasesOpen, setPhasesOpen] = useState(true)
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const existingPhaseNames = new Set(activeWorkflow?.phases.map((p) => p.name) ?? [])

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-white/[0.06] bg-ink-900 overflow-y-auto">
      {/* Workflows section */}
      <div className="border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-2.5">
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

        <div className="pb-2 space-y-0.5 px-2">
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
                  {wf.phases.length > 0 && (
                    <span
                      className="text-[10px] shrink-0"
                      style={{ color: activeWorkflowId === wf.id ? '#7C5CFF' : '#2A2F3D' }}
                    >
                      {wf.phases.length}p
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
      </div>

      {/* Phases section — for active workflow */}
      {activeWorkflow && (
        <div className="flex-1">
          <button
            onClick={() => setPhasesOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers size={12} className="text-slate-500" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Add Phase
              </span>
            </div>
            <motion.div animate={{ rotate: phasesOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
              <ChevronRight size={12} className="text-slate-600" />
            </motion.div>
          </button>

          <AnimatePresence>
            {phasesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="p-2 space-y-0.5">
                  {LIFECYCLE_PHASES.map((phase, i) => {
                    const exists = existingPhaseNames.has(phase.name)
                    return (
                      <motion.button
                        key={phase.name}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={() => { if (!exists) addPhase(phase) }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left group transition-all"
                        style={{
                          background: exists ? `${phase.color}10` : 'transparent',
                          border: exists ? `1px solid ${phase.color}25` : '1px solid transparent',
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: phase.color, opacity: exists ? 1 : 0.35 }}
                        />
                        <span
                          className="text-xs flex-1 truncate"
                          style={{ color: exists ? phase.color : '#687083' }}
                        >
                          {phase.name}
                        </span>
                        {!exists && (
                          <Plus size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: phase.color }} />
                        )}
                        {exists && (
                          <span className="text-[9px] rounded-full px-1.5 py-0.5" style={{ background: `${phase.color}20`, color: phase.color }}>
                            ✓
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="px-4 pb-3">
                  <button
                    onClick={() => addPhase({ name: 'Custom Phase', color: '#687083', description: '' })}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all border border-dashed border-white/[0.08]"
                  >
                    <Plus size={11} /> Custom phase
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer hint */}
      <div className="p-3 border-t border-white/[0.06]">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          Each workflow exports as its own <span className="font-mono">workflow.md</span> file.
        </p>
      </div>
    </aside>
  )
}
