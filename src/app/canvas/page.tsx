'use client'

import { useState } from 'react'
import { FlowCanvas } from '@/components/canvas/FlowCanvas'
import { ToolbarPanel } from '@/components/canvas/panels/ToolbarPanel'
import { PhaseSidebar } from '@/components/canvas/panels/PhaseSidebar'
import { NodeDetailPanel } from '@/components/canvas/panels/NodeDetailPanel'
import { ExportModal } from '@/components/canvas/panels/ExportModal'
import { ImportModal } from '@/components/canvas/panels/ImportModal'

export default function CanvasPage() {
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-ink-950 overflow-hidden">
      <ToolbarPanel onImport={() => setImportOpen(true)} />

      <div className="flex flex-1 min-h-0">
        <PhaseSidebar />

        <div className="flex flex-1 min-w-0 min-h-0 relative">
          <FlowCanvas />
        </div>

        <NodeDetailPanel />
      </div>

      <ExportModal />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
