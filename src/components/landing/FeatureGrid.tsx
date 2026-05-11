'use client'

import { motion } from 'framer-motion'
import { Cpu, Wrench, Layers, FileDown, LayoutTemplate, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    color: '#22D3EE',
    title: 'Full lifecycle coverage',
    description: 'From ideation to CI/CD. Map every phase of your product process in a single canvas.',
  },
  {
    icon: Cpu,
    color: '#7C5CFF',
    title: 'Agents & skills',
    description: 'Assign AI agents with specific models, skills, and harnesses to each step in your workflow.',
  },
  {
    icon: Wrench,
    color: '#3B82F6',
    title: 'Tools with alternatives',
    description: 'Document required tools vs. optional ones. List valid substitutes so teams can adapt.',
  },
  {
    icon: ShieldCheck,
    color: '#F59E0B',
    title: 'Enforcement levels',
    description: 'Mark steps as Required, Recommended, or Optional. Be explicit about what can be skipped.',
  },
  {
    icon: FileDown,
    color: '#22C55E',
    title: 'Export as WORKFLOW.md',
    description: 'One-click export to a Markdown doc with embedded YAML. Drop it in your repo for LLM context.',
  },
  {
    icon: LayoutTemplate,
    color: '#B4A2FF',
    title: 'Starter templates',
    description: 'Begin with AI-native, LLM API, or data science workflows. Customize from a proven starting point.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function FeatureGrid() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2
          className="text-3xl font-semibold tracking-tight mb-4"
          style={{ color: '#EEF1F7', letterSpacing: '-0.03em' }}
        >
          Everything your workflow needs
        </h2>
        <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
          Flowz gives AI-native teams the structure to document how they work — and the format to share it.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.12 } }}
            className="rounded-2xl p-6 cursor-default"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
            >
              <f.icon size={20} style={{ color: f.color }} />
            </div>
            <h3 className="text-sm font-semibold text-mist-100 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
