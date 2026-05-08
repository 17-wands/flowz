'use client'

import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  maxLength?: number
  showCount?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, maxLength, showCount, className = '', value, ...props }, ref) => {
    const count = typeof value === 'string' ? value.length : 0
    const atLimit = maxLength !== undefined && count >= maxLength

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={`h-10 w-full rounded-[10px] bg-ink-900 border border-slate-700 px-3 text-sm text-mist-100 placeholder:text-slate-500
            focus:outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.24)]
            transition-all duration-[120ms] ease-out ${className}`}
          {...props}
        />
        {(hint || showCount) && (
          <div className="flex justify-between">
            {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
            {showCount && maxLength && (
              <span className={`text-[11px] ml-auto ${atLimit ? 'text-amber-500' : 'text-slate-500'}`}>
                {count}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  maxLength?: number
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, maxLength, showCount, className = '', value, ...props }, ref) => {
    const count = typeof value === 'string' ? value.length : 0
    const atLimit = maxLength !== undefined && count >= maxLength

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={`w-full rounded-[10px] bg-ink-900 border border-slate-700 px-3 py-2.5 text-sm text-mist-100 placeholder:text-slate-500 resize-none
            focus:outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.24)]
            transition-all duration-[120ms] ease-out ${className}`}
          {...props}
        />
        {(hint || showCount) && (
          <div className="flex justify-between">
            {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
            {showCount && maxLength && (
              <span className={`text-[11px] ml-auto ${atLimit ? 'text-amber-500' : 'text-slate-500'}`}>
                {count}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
