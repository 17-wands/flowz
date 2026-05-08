'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Workflow, Cpu, Wrench } from 'lucide-react'
import { Button } from '../ui/Button'

const DEMO_NODES = [
  { x: 80, y: 60, label: 'Problem Framing', type: 'step', color: '#7C5CFF', delay: 0.3 },
  { x: 320, y: 60, label: 'Claude Sonnet', type: 'agent', color: '#7C5CFF', delay: 0.5 },
  { x: 560, y: 60, label: 'Research Synthesis', type: 'step', color: '#22D3EE', delay: 0.7 },
  { x: 80, y: 180, label: 'Notion', type: 'tool', color: '#3B82F6', delay: 0.9 },
  { x: 320, y: 180, label: 'PRD Drafting', type: 'step', color: '#B4A2FF', delay: 1.1 },
  { x: 560, y: 180, label: 'GitHub Actions', type: 'tool', color: '#22C55E', delay: 1.3 },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* AI Glow gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,92,255,0.35), rgba(8,9,13,0) 55%)' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(42,47,61,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42,47,61,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Signal line top accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7C5CFF 30%, #22D3EE 70%, transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-medium"
          style={{
            background: 'rgba(124,92,255,0.12)',
            border: '1px solid rgba(124,92,255,0.3)',
            color: '#B4A2FF',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Built for AI-native teams
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl font-semibold tracking-tight mb-6"
          style={{ color: '#EEF1F7', letterSpacing: '-0.04em', lineHeight: 1.1 }}
        >
          Model the way your<br />
          <span
            style={{
              background: 'linear-gradient(90deg, #7C5CFF 0%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            team actually works
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Visualize your product lifecycle as a node graph. Define agents, tools, and skills at each step.
          Export as <code className="font-mono text-violet-300 text-sm">workflow.md</code> — context your AI tools can actually use.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/canvas">
            <Button variant="primary" icon={<ArrowRight size={16} />}>
              Start building
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="secondary" icon={<Workflow size={16} />}>
              Browse templates
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Demo canvas preview */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-16 w-full max-w-3xl mx-auto rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-amber-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-4 text-xs text-slate-500 font-mono">flowz — AI-Native Full Stack</span>
        </div>

        {/* Canvas preview */}
        <div
          className="relative h-64 overflow-hidden"
          style={{
            background: '#08090D',
            backgroundImage: `
              linear-gradient(rgba(42,47,61,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(42,47,61,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        >
          {DEMO_NODES.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: node.delay, ease: [0.16, 1, 0.3, 1] }}
              className="absolute rounded-xl px-3 py-2 text-xs font-medium"
              style={{
                left: node.x,
                top: node.y,
                background: `${node.color}15`,
                border: `1px solid ${node.color}30`,
                color: node.type === 'agent' ? '#B4A2FF' : node.type === 'tool' ? '#93C5FD' : '#EEF1F7',
                minWidth: 140,
              }}
            >
              <div className="flex items-center gap-2">
                {node.type === 'agent' ? (
                  <Cpu size={12} style={{ color: '#7C5CFF' }} />
                ) : node.type === 'tool' ? (
                  <Wrench size={12} style={{ color: '#3B82F6' }} />
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ background: node.color }} />
                )}
                {node.label}
              </div>
            </motion.div>
          ))}

          {/* Animated connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {[
              [200, 75, 320, 75],
              [460, 75, 560, 75],
              [150, 90, 150, 180],
              [390, 90, 390, 180],
            ].map(([x1, y1, x2, y2], i) => (
              <motion.line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="url(#signalGrad)"
                strokeWidth={1.5}
                strokeOpacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
              />
            ))}
            <defs>
              <linearGradient id="signalGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
