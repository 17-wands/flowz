'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { useFlowzStore } from '@/lib/store'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { WorkflowStep, AgentRef, ToolRef, Enforcement, ToolType, Actor } from '@/lib/types'

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

function TagListEditor({
  label,
  items,
  onAdd,
  onRemove,
  maxItems = 8,
  maxLength = 80,
  placeholder,
}: {
  label: string
  items: string[]
  onAdd: (v: string) => void
  onRemove: (i: number) => void
  maxItems?: number
  maxLength?: number
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-300 uppercase tracking-wider block mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#AEB6C7' }}
          >
            {item}
            <button
              onClick={() => onRemove(i)}
              className="text-slate-500 hover:text-red-400 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      {items.length < maxItems && (
        <input
          placeholder={placeholder ?? `Add ${label.toLowerCase()}…`}
          maxLength={maxLength}
          className="w-full h-8 rounded-lg bg-ink-900 border border-slate-700 px-3 text-xs text-mist-100 placeholder:text-slate-600
            focus:outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(124,92,255,0.2)] transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              const v = (e.target as HTMLInputElement).value.trim()
              if (v) {
                onAdd(v)
                ;(e.target as HTMLInputElement).value = ''
              }
            }
          }}
        />
      )}
      <p className="text-[10px] text-slate-600 mt-1">Press Enter to add</p>
    </div>
  )
}

export function NodeDetailPanel() {
  const selectedNodeId = useFlowzStore((s) => s.selectedNodeId)
  const activeWorkflow = useFlowzStore((s) => s.activeWorkflow())
  const updateStep = useFlowzStore((s) => s.updateStep)
  const deleteStep = useFlowzStore((s) => s.deleteStep)
  const selectNode = useFlowzStore((s) => s.selectNode)

  const step: WorkflowStep | undefined = activeWorkflow?.steps.find((s) => s.id === selectedNodeId)

  const isOpen = !!step

  function update(changes: Partial<WorkflowStep>) {
    if (!step) return
    updateStep(step.id, changes)
  }

  return (
    <AnimatePresence>
      {isOpen && step && (
        <motion.aside
          key="detail-panel"
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-80 shrink-0 flex flex-col border-l border-white/[0.06] bg-ink-900 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] sticky top-0 bg-ink-900 z-10">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step Details
            </span>
            <button
              onClick={() => selectNode(null)}
              className="text-slate-500 hover:text-mist-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-5">
            {/* Name */}
            <Input
              label="Name"
              value={step.name}
              onChange={(e) => update({ name: e.target.value })}
              maxLength={80}
            />

            {/* Type */}
            <div>
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider block mb-2">
                Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['step', 'agent', 'tool', 'decision', 'local-config'] as WorkflowStep['type'][]).map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ type: t })}
                    className="text-xs px-3 py-1.5 rounded-lg text-left transition-all capitalize"
                    style={{
                      background: step.type === t ? 'rgba(124,92,255,0.2)' : 'rgba(255,255,255,0.04)',
                      border: step.type === t ? '1px solid rgba(124,92,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: step.type === t ? '#B4A2FF' : '#687083',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Actor */}
            <div>
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider block mb-2">
                Actor
              </label>
              <div className="flex gap-2">
                {([
                  { value: 'human', label: 'Human', color: '#22D3EE' },
                  { value: 'agent', label: 'Agent', color: '#7C5CFF' },
                  { value: 'either', label: 'Either', color: '#AEB6C7' },
                ] as { value: Actor; label: string; color: string }[]).map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => update({ actor: value })}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: step.actor === value ? `${color}20` : 'rgba(255,255,255,0.04)',
                      border: step.actor === value ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.08)',
                      color: step.actor === value ? color : '#687083',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enforcement */}
            <div>
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider block mb-2">
                Enforcement
              </label>
              <div className="flex gap-2">
                {(['required', 'recommended', 'optional'] as Enforcement[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => update({ enforcement: e })}
                    className="flex-1"
                  >
                    <Badge label={e} variant="enforcement" />
                  </button>
                ))}
              </div>
              <div className="mt-1.5">
                <Badge label={step.enforcement} variant="enforcement" />
                <span className="text-[10px] text-slate-600 ml-2">selected</span>
              </div>
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              value={step.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={2}
              maxLength={200}
              showCount
              placeholder="What does this step accomplish?"
            />

            {/* Inputs */}
            <TagListEditor
              label="Inputs"
              items={step.inputs}
              onAdd={(v) => update({ inputs: [...step.inputs, v] })}
              onRemove={(i) => update({ inputs: step.inputs.filter((_, idx) => idx !== i) })}
              placeholder="Add an input…"
            />

            {/* Outputs */}
            <TagListEditor
              label="Outputs"
              items={step.outputs}
              onAdd={(v) => update({ outputs: [...step.outputs, v] })}
              onRemove={(i) => update({ outputs: step.outputs.filter((_, idx) => idx !== i) })}
              placeholder="Add an output…"
            />

            {/* Agents */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Agents
                </label>
                <button
                  onClick={() =>
                    update({
                      agents: [
                        ...step.agents,
                        { id: uid(), name: 'Claude Sonnet', model: 'claude-sonnet-4-6', skills: [], harness: 'claude-code' },
                      ],
                    })
                  }
                  className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {step.agents.map((agent, ai) => (
                  <AgentEditor
                    key={agent.id}
                    agent={agent}
                    onChange={(updates) => {
                      const agents = [...step.agents]
                      agents[ai] = { ...agent, ...updates }
                      update({ agents })
                    }}
                    onRemove={() => update({ agents: step.agents.filter((_, i) => i !== ai) })}
                  />
                ))}
                {step.agents.length === 0 && (
                  <p className="text-[11px] text-slate-600">No agents assigned</p>
                )}
              </div>
            </div>

            {/* Tools */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Tools
                </label>
                <button
                  onClick={() =>
                    update({
                      tools: [
                        ...step.tools,
                        { id: uid(), name: 'New Tool', type: 'saas', required: false, alternatives: [] },
                      ],
                    })
                  }
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {step.tools.map((tool, ti) => (
                  <ToolEditor
                    key={tool.id}
                    tool={tool}
                    onChange={(updates) => {
                      const tools = [...step.tools]
                      tools[ti] = { ...tool, ...updates }
                      update({ tools })
                    }}
                    onRemove={() => update({ tools: step.tools.filter((_, i) => i !== ti) })}
                  />
                ))}
                {step.tools.length === 0 && (
                  <p className="text-[11px] text-slate-600">No tools assigned</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <Textarea
              label="Notes"
              value={step.notes}
              onChange={(e) => update({ notes: e.target.value })}
              rows={2}
              maxLength={300}
              showCount
              placeholder="Additional context or constraints…"
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.06]">
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={() => {
                deleteStep(step.id)
              }}
              className="w-full justify-center"
            >
              Delete step
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function AgentEditor({
  agent,
  onChange,
  onRemove,
}: {
  agent: AgentRef
  onChange: (u: Partial<AgentRef>) => void
  onRemove: () => void
}) {
  const MODELS = [
    'claude-opus-4-7',
    'claude-sonnet-4-6',
    'claude-haiku-4-5-20251001',
    'gpt-4o',
    'gemini-2.0-flash',
    'custom',
  ]

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{ background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.2)' }}
    >
      <div className="flex items-center gap-2">
        <input
          value={agent.name}
          onChange={(e) => onChange({ name: e.target.value })}
          maxLength={60}
          placeholder="Agent name"
          className="flex-1 h-7 bg-transparent text-xs text-mist-100 placeholder:text-slate-600 focus:outline-none border-b border-transparent focus:border-violet-500 transition-colors"
        />
        <button onClick={onRemove} className="text-slate-600 hover:text-red-400 transition-colors">
          <X size={12} />
        </button>
      </div>
      <select
        value={agent.model}
        onChange={(e) => onChange({ model: e.target.value })}
        className="w-full h-7 bg-ink-900 border border-slate-700 rounded-lg text-xs text-mist-100 px-2 focus:outline-none focus:border-violet-500"
      >
        {MODELS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <input
        value={agent.harness}
        onChange={(e) => onChange({ harness: e.target.value })}
        placeholder="Harness (e.g. claude-code)"
        className="w-full h-7 bg-ink-900 border border-slate-700 rounded-lg text-xs text-mist-100 px-2 focus:outline-none focus:border-violet-500 transition-all"
      />
      <SkillsEditor
        skills={agent.skills}
        onChange={(skills) => onChange({ skills })}
      />
    </div>
  )
}

function SkillsEditor({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-1">
        {skills.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5"
            style={{ background: 'rgba(124,92,255,0.15)', color: '#B4A2FF' }}
          >
            {s}
            <button onClick={() => onChange(skills.filter((_, idx) => idx !== i))}>
              <X size={8} />
            </button>
          </span>
        ))}
      </div>
      <input
        placeholder="Add skill (Enter)"
        className="w-full h-7 bg-transparent text-[11px] text-slate-400 placeholder:text-slate-600 focus:outline-none border-b border-transparent focus:border-violet-500/50 transition-colors"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const v = (e.target as HTMLInputElement).value.trim()
            if (v && !skills.includes(v)) {
              onChange([...skills, v])
              ;(e.target as HTMLInputElement).value = ''
            }
          }
        }}
      />
    </div>
  )
}

function ToolEditor({
  tool,
  onChange,
  onRemove,
}: {
  tool: ToolRef
  onChange: (u: Partial<ToolRef>) => void
  onRemove: () => void
}) {
  const TOOL_TYPES: ToolType[] = ['saas', 'ai-tool', 'cli', 'sdk', 'ide', 'local-config']

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
    >
      <div className="flex items-center gap-2">
        <input
          value={tool.name}
          onChange={(e) => onChange({ name: e.target.value })}
          maxLength={60}
          placeholder="Tool name"
          className="flex-1 h-7 bg-transparent text-xs text-mist-100 placeholder:text-slate-600 focus:outline-none border-b border-transparent focus:border-blue-500 transition-colors"
        />
        <button onClick={onRemove} className="text-slate-600 hover:text-red-400 transition-colors">
          <X size={12} />
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={tool.type}
          onChange={(e) => onChange({ type: e.target.value as ToolType })}
          className="flex-1 h-7 bg-ink-900 border border-slate-700 rounded-lg text-xs text-mist-100 px-2 focus:outline-none focus:border-blue-500"
        >
          {TOOL_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={tool.required}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="accent-violet-500"
          />
          Required
        </label>
      </div>

      {/* Alternatives */}
      <div>
        <div className="flex flex-wrap gap-1 mb-1">
          {tool.alternatives.map((a, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5"
              style={{ background: 'rgba(59,130,246,0.12)', color: '#93C5FD' }}
            >
              {a}
              <button onClick={() => onChange({ alternatives: tool.alternatives.filter((_, idx) => idx !== i) })}>
                <X size={8} />
              </button>
            </span>
          ))}
        </div>
        {tool.alternatives.length < 4 && (
          <input
            placeholder="Add alternative (Enter)"
            className="w-full h-7 bg-transparent text-[11px] text-slate-400 placeholder:text-slate-600 focus:outline-none border-b border-transparent focus:border-blue-500/50 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = (e.target as HTMLInputElement).value.trim()
                if (v) {
                  onChange({ alternatives: [...tool.alternatives, v] })
                  ;(e.target as HTMLInputElement).value = ''
                }
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
