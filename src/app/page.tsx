import { Hero } from '@/components/landing/Hero'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink-950">
      <Hero />
      <FeatureGrid />

      {/* CTA section */}
      <section className="py-24 px-4 text-center">
        <div
          className="max-w-2xl mx-auto rounded-2xl px-8 py-12"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(124,92,255,0.2), rgba(8,9,13,0) 70%)',
            border: '1px solid rgba(124,92,255,0.25)',
          }}
        >
          <h2
            className="text-3xl font-semibold tracking-tight mb-4"
            style={{ color: '#EEF1F7', letterSpacing: '-0.03em' }}
          >
            Your team has a workflow.
            <br />
            Now you can show it.
          </h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Build your workflow in minutes. Export as{' '}
            <code className="font-mono text-violet-300 text-sm">workflow.md</code> and give every
            agent on your team the context it needs.
          </p>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 bg-violet-500 text-white rounded-[10px] px-6 py-3 text-sm font-medium hover:brightness-110 transition-all"
          >
            Open the canvas
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center">
        <p className="text-xs text-slate-500">
          Flowz — built for AI-native teams ·{' '}
          <Link href="/templates" className="text-slate-400 hover:text-mist-100 transition-colors">
            Templates
          </Link>
          {' · '}
          <Link href="/canvas" className="text-slate-400 hover:text-mist-100 transition-colors">
            Canvas
          </Link>
        </p>
      </footer>
    </main>
  )
}
