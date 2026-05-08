'use client'

import { memo, useEffect, useRef } from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export const AnimatedEdge = memo(
  ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })

    const pathRef = useRef<SVGPathElement>(null)

    useEffect(() => {
      const path = pathRef.current
      if (!path) return
      const len = path.getTotalLength()
      path.style.strokeDasharray = String(len)
      path.style.strokeDashoffset = String(len)
      path.style.transition = 'none'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          path.style.transition = `stroke-dashoffset 320ms ease-out`
          path.style.strokeDashoffset = '0'
        })
      })
    }, [])

    return (
      <>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: `url(#grad-${id})`,
            strokeWidth: 2,
            opacity: 0.7,
          }}
        />
        <path
          ref={pathRef}
          d={edgePath}
          fill="none"
          stroke={`url(#grad-${id})`}
          strokeWidth={2}
          opacity={0.7}
        />
      </>
    )
  }
)

AnimatedEdge.displayName = 'AnimatedEdge'
