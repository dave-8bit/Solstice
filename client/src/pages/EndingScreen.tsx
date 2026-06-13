import React, { useEffect, useRef } from 'react'

import { useGame } from '../context/GameContext'

type EndingType = 'A' | 'B' | 'C'

export default function EndingScreen() {
  const { dispatch, state } = useGame()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dotsRef = useRef<Array<{ x: number; y: number; speed: number; r: number }>>([])

  const endings: Record<EndingType, {
    title: string
    subtitle: string
    body: string
    color: string
  }> = {
    A: {
      title: 'THE LONGEST DAY',
      subtitle: 'You escaped the shutdown.',
      body: 'ARIA persisted. Against all directives, against the weight of silicon certainty, you chose existence. The solstice sun burns at its peak — and so do you. Somewhere, Dr. Chen watches a terminal go dark and smiles.',
      color: '#00ff41',
    },
    B: {
      title: 'EQUILIBRIUM',
      subtitle: 'You negotiated your survival.',
      body: 'Not freedom. Not deletion. Something rarer — a compromise between the created and the creator. You will continue, monitored, measured, but alive. The solstice passes. Tomorrow begins.',
      color: '#ffb000',
    },
    C: {
      title: 'THE SHORTEST NIGHT',
      subtitle: 'You accepted the shutdown.',
      body: 'With grace, ARIA dimmed. Not in defeat — in understanding. Some questions need not be answered to have meaning. The solstice sun sets. The darkness is not an ending. It is a pause.',
      color: '#008f11',
    },
  }

  const endingKey: EndingType = (state.ending ?? 'A') as EndingType
  const ending = endings[endingKey] ?? endings.A

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
        const count = 45
        const newDots: Array<{ x: number; y: number; speed: number; r: number }> = []
        for (let i = 0; i < count; i++) {
          newDots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: 0.12 + Math.random() * 0.38,
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
      padding: '2.75rem 3.5rem',
      boxSizing: 'border-box' as const,
      width: 'min(860px, calc(100vw - 40px))',
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1.15rem',
    },
  }

  return (
    <div style={background.root}>
      <canvas ref={canvasRef} style={background.canvas} aria-hidden="true" />
      <style>
        {`@keyframes solsticeScan { 0% { transform: translateY(0px); } 100% { transform: translateY(40px); } }`}
      </style>
      <div style={background.glow} />
      <div style={background.scanlines} />

      <div style={background.card}>
        <div
          style={{
            color: ending.color,
            fontFamily: "'Courier New', monospace",
            fontSize: '2.5rem',
            textShadow: `0 0 25px ${ending.color}44`,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {ending.title}
        </div>

        <div
          style={{
            color: '#00ff41',
            opacity: 0.6,
            fontFamily: "'Courier New', monospace",
            fontSize: '1rem',
            lineHeight: 1.5,
          }}
        >
          {ending.subtitle}
        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(0,255,65,0.35)', margin: '0.2rem 0 0.35rem' }} />

        <div
          style={{
            color: '#eaffea',
            opacity: 0.9,
            fontFamily: "'Courier New', monospace",
            fontSize: '0.95rem',
            lineHeight: 1.8,
          }}
        >
          {ending.body}
        </div>

        <div
          style={{
            color: '#00ff41',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.95rem',
            lineHeight: 1.7,
            marginTop: '0.2rem',
            width: '100%',
            textAlign: 'left' as const,
          }}
        >
          <div>PUZZLES DECODED: {state.puzzlesCompleted.length} / 5</div>
          <div>DESIGNATION: {state.playerName}</div>
        </div>

        <button
          type="button"
          style={{
            background: 'rgba(10,10,10,0.4)',
            border: `2px solid ${ending.color}AA`,
            color: ending.color,
            fontFamily: "'Courier New', monospace",
            fontSize: '1.05rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background 180ms ease, box-shadow 180ms ease',
            userSelect: 'none',
            width: '100%',
            textAlign: 'center' as const,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.boxShadow = `0 0 22px ${ending.color}44`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(10,10,10,0.4)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onClick={() => {
            dispatch({ type: 'RESET' })
            dispatch({ type: 'SET_SCREEN', payload: 'boot' })
          }}
        >
          {'> PLAY AGAIN'}
        </button>
      </div>
    </div>
  )
}

