'use client'

import { useState } from 'react'
import { Copy, Download, Check, Package } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useFlowzStore } from '@/lib/store'
import {
  exportWorkflowMarkdown,
  exportWorkflowSummary,
  exportManifest,
  exportWorkspaceBundle,
  exportJson,
} from '@/lib/export'
import { tokenCountFromString, TOKEN_GREEN, TOKEN_AMBER } from '@/lib/types'

export function ExportModal() {
  const open = useFlowzStore((s) => s.exportModalOpen)
  const setOpen = useFlowzStore((s) => s.setExportModalOpen)
  const mode = useFlowzStore((s) => s.exportMode)
  const setMode = useFlowzStore((s) => s.setExportMode)
  const workspace = useFlowzStore((s) => s.workspace)
  const activeWorkflow = useFlowzStore((s) => s.activeWorkflow())

  const [copied, setCopied] = useState(false)

  const content =
    mode === 'full' && activeWorkflow
      ? exportWorkflowMarkdown(activeWorkflow, workspace)
      : mode === 'summary' && activeWorkflow
      ? exportWorkflowSummary(activeWorkflow)
      : exportManifest(workspace)

  const tokens = tokenCountFromString(content)
  const tokenColor =
    tokens < TOKEN_GREEN ? '#22C55E' : tokens < TOKEN_AMBER ? '#F59E0B' : '#EF4444'

  const totalSteps =
    mode === 'manifest'
      ? workspace.workflows.reduce((s, w) => s + w.steps.length, 0)
      : (activeWorkflow?.steps.length ?? 0)

  function copy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadFile(filename: string, text: string) {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadBundle() {
    const bundle = exportWorkspaceBundle(workspace)
    const baseName = workspace.name.replace(/\s+/g, '-').toLowerCase()
    downloadFile('WORKFLOW.md', bundle.manifest.content)
    bundle.workflows.forEach((wf) => {
      setTimeout(() => downloadFile(wf.filename.replace('workflows/', `${baseName}-`), wf.content), 100)
    })
  }

  const activeFilename =
    mode === 'manifest'
      ? 'WORKFLOW.md'
      : `workflows/${activeWorkflow?.name.replace(/\s+/g, '-').toLowerCase() ?? 'workflow'}.md`

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Export" width="max-w-3xl">
      <div className="p-6 space-y-4">
        {/* Token summary */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: `${tokenColor}10`, border: `1px solid ${tokenColor}20` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: tokenColor }} />
          <span className="text-sm font-mono" style={{ color: tokenColor }}>
            ≈ {tokens.toLocaleString()} tokens
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-xs text-slate-400">{totalSteps} steps</span>
          <span className="text-xs text-slate-600 ml-auto italic">
            measured from serialized output ÷ 3.8 chars/token
          </span>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'full', label: 'This workflow' },
            { id: 'summary', label: 'Summary' },
            { id: 'manifest', label: 'Workspace manifest' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as typeof mode)}
              className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: mode === m.id ? 'rgba(124,92,255,0.2)' : 'transparent',
                color: mode === m.id ? '#B4A2FF' : '#687083',
                border: mode === m.id ? '1px solid rgba(124,92,255,0.3)' : '1px solid transparent',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Manifest mode explanation */}
        {mode === 'manifest' && (
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}
          >
            <p className="text-xs text-cyan-300 leading-relaxed">
              <strong>Manifest export</strong> creates a lightweight <code className="font-mono">WORKFLOW.md</code> index that lists all {workspace.workflows.length} workflow{workspace.workflows.length !== 1 ? 's' : ''} with token counts and descriptions.
              LLMs read the manifest first, then load only the workflows relevant to the current task.
              Use <strong>Download bundle</strong> to get all files at once.
            </p>
          </div>
        )}

        {/* Content preview */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <span className="text-xs font-mono text-slate-500">{activeFilename}</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-mist-100 transition-colors"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre
            className="text-xs font-mono text-slate-300 p-4 overflow-auto max-h-64 leading-relaxed"
            style={{ background: '#08090D' }}
          >
            {content || '(empty — add steps first)'}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          {mode === 'manifest' ? (
            <>
              <Button
                variant="primary"
                icon={<Download size={14} />}
                onClick={() => downloadFile('WORKFLOW.md', content)}
                className="flex-1 justify-center"
              >
                Download WORKFLOW.md
              </Button>
              <Button
                variant="secondary"
                icon={<Package size={14} />}
                onClick={downloadBundle}
              >
                Download bundle
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                icon={<Download size={14} />}
                onClick={() => downloadFile(activeFilename, content)}
                className="flex-1 justify-center"
              >
                Download .md
              </Button>
              <Button
                variant="secondary"
                icon={<Download size={14} />}
                onClick={() => downloadFile(
                  `${workspace.name.replace(/\s+/g, '-').toLowerCase()}-workspace.json`,
                  exportJson(workspace)
                )}
              >
                Download .json
              </Button>
            </>
          )}
        </div>

        {/* Usage hint */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.15)' }}
        >
          <p className="text-xs text-violet-300 leading-relaxed">
            Place <code className="font-mono">WORKFLOW.md</code> (the manifest) in your project root.
            Place individual workflow files in <code className="font-mono">workflows/</code>.
            The manifest tells agents what exists; individual files provide the detail.
            Re-import the <code className="font-mono">.json</code> into Flowz to resume editing.
          </p>
        </div>
      </div>
    </Modal>
  )
}
