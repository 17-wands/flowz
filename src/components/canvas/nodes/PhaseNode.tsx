'use client'

import { memo } from 'react'
import { type NodeProps, NodeResizer } from '@xyflow/react'
import type { Phase } from '@/lib/types'

export const PhaseNode = memo(({ data, selected }: NodeProps) => {
  const phase = (data as { phase: Phase }).phase

  return (
    <div
      className="relative rounded-2xl h-full"
      style={{
        background: `${phase.color}08`,
        border: `1px solid ${phase.color}25`,
        minWidth: 580,
        minHeight: 300,
      }}
    >
      <NodeResizer
        minWidth={300}
        minHeight={200}
        isVisible={selected}
        lineStyle={{ border: `1px dashed ${phase.color}50` }}
        handleStyle={{ background: phase.color, border: 'none', width: 8, height: 8, borderRadius: 4 }}
      />

      {/* Phase label */}
      <div
        className="absolute -top-px left-4 flex items-center gap-2 rounded-b-lg px-3 py-1"
        style={{ background: `${phase.color}20`, border: `1px solid ${phase.color}30`, borderTop: 'none' }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: phase.color }} />
        <span className="text-xs font-semibold" style={{ color: phase.color }}>
          {phase.name}
        </span>
      </div>

      {/* Description hint if no steps */}
      {phase.steps.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-600 pointer-events-none">
          Add steps via the toolbar
        </div>
      )}
    </div>
  )
})

PhaseNode.displayName = 'PhaseNode'
