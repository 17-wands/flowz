'use client'

interface BadgeProps {
  label: string
  color?: string
  variant?: 'enforcement' | 'type' | 'tag'
}

const ENFORCEMENT_COLORS: Record<string, string> = {
  required: 'rgba(239,68,68,0.15)',
  recommended: 'rgba(245,158,11,0.15)',
  optional: 'rgba(34,197,94,0.15)',
}

const ENFORCEMENT_TEXT: Record<string, string> = {
  required: '#EF4444',
  recommended: '#F59E0B',
  optional: '#22C55E',
}

export function Badge({ label, color, variant = 'tag' }: BadgeProps) {
  const bg =
    variant === 'enforcement'
      ? ENFORCEMENT_COLORS[label] ?? 'rgba(174,182,199,0.12)'
      : color
      ? `${color}20`
      : 'rgba(174,182,199,0.12)'

  const text =
    variant === 'enforcement'
      ? ENFORCEMENT_TEXT[label] ?? '#AEB6C7'
      : color ?? '#AEB6C7'

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  )
}
