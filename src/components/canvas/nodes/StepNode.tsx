'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Wrench, GitBranch, Terminal, User, Bot, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { WorkflowStep } from '@/lib/types'
import { NODE_TYPE_META } from '@/lib/types'
import { useFlowzStore } from '@/lib/store'

const ACTOR_META = {
  human:  { icon: User,  color: '#22D3EE', label: 'Human' },
  agent:  { icon: Bot,   color: '#7C5CFF', label: 'Agent' },
  either: { icon: Users, color: '#AEB6C7', label: 'Either' },
}

const TYPE_ICONS = {
  step: ArrowRight,
  agent: Cpu,
  tool: Wrench,
  decision: GitBranch,
  'local-config': Terminal,
}

export const StepNode = memo(({ data, id, selected }: NodeProps) => {
  const step = (data as { step: WorkflowStep }).step
  const selectNode = useFlowzStore((s) => s.selectNode)
  const meta = NODE_TYPE_META[step.type]
  const Icon = TYPE_ICONS[step.type]
  const actor = ACTOR_META[step.actor ?? 'either']
  const ActorIcon = actor.icon

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => selectNode(id)}
      className="cursor-pointer select-none"
      style={{ width: 220 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.12 } }}
    >
      <div
        className="relative rounded-2xl p-4 transition-all"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: selected
            ? `1px solid ${meta.color}`
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: selected
            ? `0 0 0 2px ${meta.color}50, 0 8px 32px rgba(0,0,0,0.3)`
            : '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
          >
            <Icon size={14} style={{ color: meta.color }} />
          </div>
          {/* Actor indicator — top-right corner */}
          <div
            className="absolute top-3 right-3 w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: `${actor.color}15`, border: `1px solid ${actor.color}30` }}
            title={`Actor: ${actor.label}`}
          >
            <ActorIcon size={11} style={{ color: actor.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold leading-tight text-mist-100 truncate">{step.name}</div>
            {step.description && (
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                {step.description}
              </div>
            )}
          </div>
        </div>

        {/* Enforcement badge */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge label={step.enforcement} variant="enforcement" />
          {step.agents.length > 0 && (
            <Badge label={`${step.agents.length} agent${step.agents.length > 1 ? 's' : ''}`} color="#7C5CFF" />
          )}
          {step.tools.length > 0 && (
            <Badge label={`${step.tools.length} tool${step.tools.length > 1 ? 's' : ''}`} color="#3B82F6" />
          )}
        </div>

        {/* Inputs/outputs summary */}
        {(step.inputs.length > 0 || step.outputs.length > 0) && (
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex gap-3 text-[10px] text-slate-500">
            {step.inputs.length > 0 && (
              <span>{step.inputs.length} input{step.inputs.length > 1 ? 's' : ''}</span>
            )}
            {step.outputs.length > 0 && (
              <span>{step.outputs.length} output{step.outputs.length > 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: meta.color, border: 'none', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: meta.color, border: 'none', width: 8, height: 8 }}
      />
    </motion.div>
  )
})

StepNode.displayName = 'StepNode'
