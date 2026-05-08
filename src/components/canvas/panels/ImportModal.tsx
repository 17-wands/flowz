'use client'

import { useRef, useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useFlowzStore } from '@/lib/store'
import { importWorkflowMarkdown, importJson } from '@/lib/export'
import type { Workspace } from '@/lib/types'

interface ImportModalProps {
  open: boolean
  onClose: () => void
}

export function ImportModal({ open, onClose }: ImportModalProps) {
  const loadWorkspace = useFlowzStore((s) => s.loadWorkspace)
  const addWorkflow = useFlowzStore((s) => s.addWorkflow)
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  function processFile(file: File) {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string

      if (file.name.endsWith('.json')) {
        const parsed = importJson(content) as Workspace | null
        if (!parsed) { setError('Could not parse .json file.'); return }
        loadWorkspace(parsed)
        onClose()
        return
      }

      // .md file — import as a single workflow added to the current workspace
      const wf = importWorkflowMarkdown(content)
      if (!wf) { setError('Could not parse workflow.md. Make sure it was exported from Flowz or matches the format spec.'); return }
      // Add the imported workflow as a new workflow in the workspace
      const newWf = addWorkflow(wf.name)
      useFlowzStore.getState().updateWorkflow(newWf.id, wf)
      onClose()
    }
    reader.readAsText(file)
  }

  return (
    <Modal open={open} onClose={onClose} title="Import Workflow" width="max-w-lg">
      <div className="p-6 space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f) }}
          onClick={() => fileRef.current?.click()}
          className="rounded-2xl p-8 text-center cursor-pointer transition-all"
          style={{
            border: `2px dashed ${dragging ? '#7C5CFF' : 'rgba(255,255,255,0.12)'}`,
            background: dragging ? 'rgba(124,92,255,0.08)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,92,255,0.15)' }}>
              <Upload size={20} style={{ color: '#7C5CFF' }} />
            </div>
          </div>
          <p className="text-sm text-mist-100 font-medium mb-1">Drop your workflow file here</p>
          <p className="text-xs text-slate-500">
            Supports <code className="font-mono">workflow.md</code> and <code className="font-mono">.json</code> files
          </p>
          <input ref={fileRef} type="file" accept=".md,.json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
        </div>

        {error && (
          <div className="rounded-xl p-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-start gap-3">
            <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-300 font-medium mb-1">Import tips</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <code className="font-mono">workflow.md</code> — adds as a new workflow in your current workspace</li>
                <li>• <code className="font-mono">.json</code> — replaces the entire workspace (preserves positions)</li>
                <li>• See <a href="/workflow_md" className="text-violet-400 hover:text-violet-300">format spec</a> for the expected structure</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
          <Button variant="primary" icon={<Upload size={14} />} onClick={() => fileRef.current?.click()} className="flex-1 justify-center">
            Choose file
          </Button>
        </div>
      </div>
    </Modal>
  )
}
