'use client'

import { useRef, useState } from 'react'
import { Upload, FileText, Package, File } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useFlowzStore } from '@/lib/store'
import { parseMarkdownFile, importWorkspaceFromFiles } from '@/lib/export'
import type { ParsedFile } from '@/lib/export'

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
  const [parsed, setParsed] = useState<ParsedFile[] | null>(null)

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  async function processFiles(files: FileList) {
    setError(null)
    setParsed(null)

    const mdFiles = Array.from(files).filter((f) => f.name.endsWith('.md'))
    if (mdFiles.length === 0) {
      setError('No .md files selected. Import only supports WORKFLOW.md files exported from Flowz.')
      return
    }

    const results: ParsedFile[] = []
    for (const file of mdFiles) {
      const content = await readFile(file)
      results.push(parseMarkdownFile(file.name, content))
    }

    const unknowns = results.filter((r) => r.type === 'unknown')
    if (unknowns.length === results.length) {
      setError('None of the selected files could be parsed. Make sure they were exported from Flowz.')
      return
    }

    setParsed(results)
  }

  function doImport() {
    if (!parsed) return
    setError(null)

    const workflows = parsed.filter((p) => p.type === 'workflow' && p.workflow)
    const hasManifest = parsed.some((p) => p.type === 'manifest')

    if (hasManifest || workflows.length > 1) {
      // Multi-file bundle — reconstruct full workspace
      const workspace = importWorkspaceFromFiles(parsed)
      if (!workspace) { setError('Could not reconstruct workspace from these files.'); return }
      loadWorkspace(workspace)
    } else if (workflows.length === 1) {
      // Single workflow file — add to current workspace
      const wf = workflows[0].workflow!
      const newWf = addWorkflow(wf.name)
      useFlowzStore.getState().updateWorkflow(newWf.id, { ...wf, id: newWf.id })
    } else {
      setError('No workflow data found in the selected files.')
      return
    }

    onClose()
    setParsed(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files)
  }

  const manifests = parsed?.filter((p) => p.type === 'manifest') ?? []
  const workflows = parsed?.filter((p) => p.type === 'workflow') ?? []
  const unknowns = parsed?.filter((p) => p.type === 'unknown') ?? []
  const isBundle = manifests.length > 0 || workflows.length > 1

  return (
    <Modal open={open} onClose={() => { onClose(); setParsed(null); setError(null) }} title="Import Workflow" width="max-w-lg">
      <div className="p-6 space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
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
          <p className="text-sm text-mist-100 font-medium mb-1">Drop your workflow files here</p>
          <p className="text-xs text-slate-500">
            Select one or more <code className="font-mono">.md</code> files — single workflow or full bundle
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".md"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) processFiles(e.target.files) }}
          />
        </div>

        {/* File detection results */}
        {parsed && parsed.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-4 py-2.5 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-xs text-slate-400 font-medium">
                {isBundle ? 'Workspace bundle detected' : 'Single workflow detected'} — {parsed.length} file{parsed.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="p-3 space-y-1.5">
              {manifests.map((f) => (
                <div key={f.filename} className="flex items-center gap-2.5">
                  <Package size={12} style={{ color: '#22D3EE' }} className="shrink-0" />
                  <span className="text-xs font-mono text-cyan-300">{f.filename}</span>
                  <span className="text-[10px] text-slate-600 ml-auto">manifest</span>
                </div>
              ))}
              {workflows.map((f) => (
                <div key={f.filename} className="flex items-center gap-2.5">
                  <File size={12} style={{ color: '#B4A2FF' }} className="shrink-0" />
                  <span className="text-xs font-mono text-violet-300">{f.filename}</span>
                  <span className="text-[10px] text-slate-600 ml-auto">
                    {f.workflow?.steps.length ?? 0} steps
                  </span>
                </div>
              ))}
              {unknowns.map((f) => (
                <div key={f.filename} className="flex items-center gap-2.5">
                  <File size={12} className="text-slate-600 shrink-0" />
                  <span className="text-xs font-mono text-slate-600">{f.filename}</span>
                  <span className="text-[10px] text-red-500 ml-auto">unrecognized</span>
                </div>
              ))}
            </div>
            {isBundle && (
              <div className="px-4 py-2.5 border-t border-white/[0.06] text-[11px] text-slate-500" style={{ background: 'rgba(255,255,255,0.02)' }}>
                This will replace your current workspace with the imported bundle.
              </div>
            )}
          </div>
        )}

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
                <li>• Single <code className="font-mono">workflows/*.md</code> — adds a new workflow to your current workspace</li>
                <li>• <code className="font-mono">WORKFLOW.md</code> + <code className="font-mono">workflows/*.md</code> — replaces workspace with full bundle</li>
                <li>• See <a href="/workflow_md" className="text-violet-400 hover:text-violet-300">format spec</a> for the expected structure</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { onClose(); setParsed(null); setError(null) }} className="flex-1 justify-center">
            Cancel
          </Button>
          {parsed && workflows.length > 0 ? (
            <Button variant="primary" icon={<Upload size={14} />} onClick={doImport} className="flex-1 justify-center">
              {isBundle ? 'Import workspace' : 'Add workflow'}
            </Button>
          ) : (
            <Button variant="primary" icon={<Upload size={14} />} onClick={() => fileRef.current?.click()} className="flex-1 justify-center">
              Choose files
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
