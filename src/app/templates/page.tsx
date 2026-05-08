'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ExternalLink, ArrowRight, Workflow } from 'lucide-react'
import Link from 'next/link'
import { useFlowzStore } from '@/lib/store'
import { TEMPLATES, COMMUNITY_TEMPLATES } from '@/lib/templates'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { estimateTokens } from '@/lib/types'

export default function TemplatesPage() {
  const loadWorkspace = useFlowzStore((s) => s.loadWorkspace)
  const router = useRouter()

  function useTemplate(id: string) {
    const template = TEMPLATES.find((t) => t.id === id)
    if (!template) return
    loadWorkspace({ ...template.workspace })
    router.push('/canvas')
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-ink-900">
        <Link href="/">
          <div className="text-sm font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(124,92,255,0.15)', color: '#B4A2FF' }}>
            Flowz
          </div>
        </Link>
        <span className="text-slate-500">·</span>
        <span className="text-sm text-slate-300 font-medium">Workflow Templates</span>
        <div className="flex-1" />
        <Link href="/canvas">
          <Button variant="secondary" size="sm" icon={<Workflow size={14} />}>Open canvas</Button>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-3" style={{ color: '#EEF1F7', letterSpacing: '-0.04em' }}>
            Start from a template
          </h1>
          <p className="text-slate-300 text-base">
            Each template is a <strong>workspace</strong> with multiple focused workflow files — ready to export as a manifest + individual <code className="font-mono text-violet-300">workflow.md</code> files.
          </p>
        </motion.div>

        <section className="mb-16">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Starter workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template, i) => {
              const totalWorkflows = template.workspace.workflows.length
              const totalSteps = template.workspace.workflows.reduce(
                (s, wf) => s + wf.phases.reduce((sp, p) => sp + p.steps.length, 0), 0
              )
              const totalTokens = template.workspace.workflows.reduce(
                (s, wf) => s + estimateTokens(wf), 0
              )

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div>
                    <div className="text-2xl mb-3">{template.icon}</div>
                    <h3 className="text-sm font-semibold text-mist-100 mb-1">{template.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{template.description}</p>
                  </div>

                  {/* Workflow list */}
                  <div className="space-y-1">
                    {template.workspace.workflows.map((wf) => (
                      <div key={wf.id} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-violet-500/60" />
                        <span className="text-[11px] text-slate-400">{wf.name}</span>
                        {wf.dependsOn.length > 0 && (
                          <span className="text-[10px] text-slate-600">→ depends on {wf.dependsOn.length}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.slice(0, 4).map((tag) => <Badge key={tag} label={tag} />)}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono border-t border-white/[0.06] pt-3">
                    <span>{totalWorkflows} workflows</span>
                    <span>·</span>
                    <span>{totalSteps} steps</span>
                    <span>·</span>
                    <span>≈ {totalTokens.toLocaleString()} tokens total</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight size={14} />}
                    onClick={() => useTemplate(template.id)}
                    className="w-full justify-center"
                  >
                    Use this template
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Community resources</h2>
          <p className="text-xs text-slate-600 mb-4">
            External workflow libraries — download and import as <code className="font-mono">workflow.md</code>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMUNITY_TEMPLATES.map((ct, i) => (
              <motion.a
                key={ct.name}
                href={ct.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                className="flex items-start gap-4 rounded-xl p-4 group transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(174,182,199,0.1)' }}>
                  <ExternalLink size={14} style={{ color: '#AEB6C7' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-mist-100 group-hover:text-violet-300 transition-colors">{ct.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(174,182,199,0.1)', color: '#687083' }}>{ct.source}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{ct.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center space-y-2">
          <p className="text-sm text-slate-500">Prefer to start from scratch?</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/canvas"><Button variant="secondary" icon={<Workflow size={14} />}>Open blank canvas</Button></Link>
            <Link href="/workflow_md"><Button variant="tertiary" size="sm">Read the format spec</Button></Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
