'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, children, className = '', ...props }, ref) => {
    const base =
      'inline-flex items-center gap-2 font-medium rounded-[10px] cursor-pointer transition-all duration-[120ms] ease-out focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none'

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-[18px] py-3 text-sm',
    }

    const variants = {
      primary:
        'bg-violet-500 text-white hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,92,255,0.4)] active:brightness-95',
      secondary:
        'bg-white/[0.06] border border-white/[0.12] text-mist-100 hover:bg-white/10',
      tertiary:
        'bg-transparent text-slate-300 hover:text-mist-100',
      danger:
        'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
