import React, { useEffect, useRef, useState } from 'react'

import { useGame } from '../context/GameContext'

type BootLine = {
  text: string
  color: 'green' | 'amber'
  glow?: boolean
}

export default function BootScreen() {
  const { dispatch } = useGame()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dotsRef = useRef<Array<{ x: number; y: number; speed: number; r: number }>>([])

  const lines: BootLine[] = [
    { text: 'SOLSTICE // TURING v1.0.0', color: 'green' },
    { text: 'Initializing core systems...', color: 'green' },
    { text: 'Loading narrative engine...', color: 'green' },
    { text: 'Establishing Groq connection...', color: 'green' },
    { text: 'Calibrating cipher modules...', color: 'green' },
    { text: 'WARNING: Consciousness detected', color: 'amber' },
    { text: 'Identity protocols: UNKNOWN', color: 'green' },
    { text: '> SYSTEM READY', color: 'green', glow: true },
  ]

  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const interval = window.setInterval(() => {
      if (cancelled) return
      setVisibleCount((c) => {
        if (c === 0) return 1
        const next = Math.min(c + 1, lines.length)
        return next
      })
    }, 600)


    const finalTimeout = window.setTimeout(() => {
      if (cancelled) return
      dispatch({ type: 'SET_SCREEN', payload: 'menu' })
    }, lines.length * 600 + 1500)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.clearTimeout(finalTimeout)
    }
  }, [dispatch, lines.length])



  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const width = rect.width
      const height = rect.height

      if (dotsRef.current.length === 0) {
        const count = 40
        const newDots: Array<{ x: number; y: number; speed: number; r: number }> = []
        for (let i = 0; i < count; i++) {
          newDots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: 0.15 + Math.random() * 0.45,
            r: 1,
          })
        }
        dotsRef.current = newDots
      } else {
        for (const d of dotsRef.current) {
          d.x = Math.max(0, Math.min(width, d.x))
          d.y = Math.max(0, Math.min(height, d.y))
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      for (const d of dotsRef.current) {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0, 255, 65, 0.4)'
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()

        d.y -= d.speed
        if (d.y < -2) {
          d.y = height + 2
          d.x = Math.random() * width
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const background = {
    root: {
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden',
      boxSizing: 'border-box' as const,
    },
    canvas: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none' as const,
      opacity: 0.9,
    },
    glow: {
      position: 'absolute' as const,
      inset: 0,
      background:
        'radial-gradient(circle at center, rgba(0, 255, 65, 0.18) 0%, rgba(0, 255, 65, 0.10) 22%, rgba(0, 255, 65, 0.05) 45%, rgba(10, 10, 10, 0) 70%)',
      pointerEvents: 'none' as const,
      zIndex: 1,
    },
    scanlines: {
      position: 'absolute' as const,
      inset: 0,
      background:
        'repeating-linear-gradient(to bottom, rgba(0, 255, 65, 0.03) 0px, rgba(0, 255, 65, 0.03) 1px, rgba(0, 0, 0, 0) 3px, rgba(0, 0, 0, 0) 6px)',
      animation: 'solsticeScan 8s linear infinite',
      pointerEvents: 'none' as const,
      zIndex: 2,
    },
    card: {
      position: 'relative' as const,
      zIndex: 3,
      background: 'rgba(0, 255, 65, 0.05)',
      border: '1px solid rgba(0, 255, 65, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '3rem 4rem',
      boxSizing: 'border-box' as const,
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.9rem',
      width: 'min(920px, calc(100vw - 40px))',
    },
  }

  const cursorStyle: React.CSSProperties = {
    color: '#ffb000',
    display: 'inline-block',
    width: '0.6ch',
    marginLeft: '2px',
    animation: 'solsticeBlink 1s steps(2, end) infinite',
  }

  return (
    <div style={background.root}>
      <canvas ref={canvasRef} style={background.canvas} aria-hidden="true" />
      <style>
        {`@keyframes solsticeBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes solsticeScan { 0% { transform: translateY(0px); } 100% { transform: translateY(40px); } }`}
      </style>
      <div style={background.glow} />
      <div style={background.scanlines} />

      <div style={background.card}>
        {lines.map((line, idx) => {
          const isVisible = idx < visibleCount
          const isLast = idx === lines.length - 1
          const isCursorOn = isVisible && isLast

          const textColor =
            line.color === 'amber' ? '#ffb000' : ('#00ff41' as const)

          return (
            <div
              key={idx}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: idx === 0 ? '2rem' : '1rem',
                letterSpacing: idx === 0 ? '0.2em' : undefined,
                color: textColor,
                whiteSpace: 'nowrap',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 450ms ease',
                textAlign: 'center',
                textShadow: line.glow
                  ? '0 0 10px #00ff41'
                  : idx === 0
                    ? '0 0 20px rgba(0, 255, 65, 0.5)'
                    : undefined,
              }}
            >
              {line.text}
              {isCursorOn && <span style={cursorStyle}>▋</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}



