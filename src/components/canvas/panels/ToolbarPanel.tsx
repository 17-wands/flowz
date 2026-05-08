'use client'

import { useState } from 'react'
import { Plus, Download, FolderOpen, LayoutTemplate, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useFlowzStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { estimateTokens, TOKEN_GREEN, TOKEN_AMBER, NODE_TYPE_META, type NodeType } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

const NODE_TYPES: NodeType[] = ['step', 'agent', 'tool', 'decision', 'local-config']

interface ToolbarPanelProps {
  onImport: () => void
}

export function ToolbarPanel({ onImport }: ToolbarPanelProps) {
  const workspace = useFlowzStore((s) => s.workspace)
  const activeWorkflow = useFlowzStore((s) => s.activeWorkflow)()
  const setWorkspaceName = useFlowzStore((s) => s.setWorkspaceName)
  const setExportModalOpen = useFlowzStore((s) => s.setExportModalOpen)
  const addStep = useFlowzStore((s) => s.addStep)

  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)

  const tokens = activeWorkflow ? estimateTokens(activeWorkflow) : 0
  const totalSteps = activeWorkflow?.steps.length ?? 0

  const tokenColor =
    tokens < TOKEN_GREEN ? '#22C55E' : tokens < TOKEN_AMBER ? '#F59E0B' : '#EF4444'

  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-ink-900 shrink-0">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <div className="text-sm font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(124,92,255,0.15)', color: '#B4A2FF' }}>
          Flowz
        </div>
      </Link>

      <div className="w-px h-5 bg-white/[0.08]" />

      {/* Workspace name */}
      {editingName ? (
        <input
          autoFocus
          value={workspace.name}
          onChange={(e) => setWorkspaceName(e.target.value)}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
          className="bg-transparent text-sm font-medium text-mist-100 focus:outline-none border-b border-violet-500 pb-0.5 min-w-0 max-w-48"
        />
      ) : (
        <button
          onClick={() => setEditingName(true)}
          className="text-sm font-medium text-mist-100 hover:text-white transition-colors truncate max-w-48"
          title="Click to rename workspace"
        >
          {workspace.name}
        </button>
      )}

      {/* Active workflow badge */}
      {activeWorkflow && (
        <span
          className="hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full shrink-0"
          style={{ background: 'rgba(124,92,255,0.1)', color: '#B4A2FF', border: '1px solid rgba(124,92,255,0.2)' }}
        >
          {activeWorkflow.name}
        </span>
      )}

      <div className="flex-1" />

      {/* Token estimate for active workflow */}
      {activeWorkflow && (
        <div
          className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full"
          style={{ background: `${tokenColor}12`, color: tokenColor, border: `1px solid ${tokenColor}25` }}
          title="Token estimate for this workflow (3.8 chars/token)"
        >
          <span>≈ {tokens.toLocaleString()} tokens</span>
          <span className="text-slate-600">·</span>
          <span>{totalSteps} steps</span>
        </div>
      )}

      {/* Add node */}
      <div className="relative">
        <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setAddMenuOpen((v) => !v)}>
          Add node
          <ChevronDown size={12} />
        </Button>

        <AnimatePresence>
          {addMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-50 rounded-xl overflow-hidden min-w-44"
              style={{ background: '#181B24', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseLeave={() => setAddMenuOpen(false)}
            >
              {NODE_TYPES.map((type) => {
                const meta = NODE_TYPE_META[type]
                return (
                  <button
                    key={type}
                    onClick={() => {
                      addStep({ type })
                      setAddMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                    <span className="text-mist-100">{meta.label}</span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button variant="secondary" size="sm" icon={<FolderOpen size={14} />} onClick={onImport}>
        Import
      </Button>

      <Link href="/templates">
        <Button variant="secondary" size="sm">
          Templates
        </Button>
      </Link>

      <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={() => setExportModalOpen(true)}>
        Export
      </Button>
    </header>
  )
}
