import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useGame } from '../context/GameContext'

export default function GameScreen() {
  const { state } = useGame()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dotsRef = useRef<Array<{ x: number; y: number; speed: number; r: number }>>([])

  const playerName = state.playerName ?? 'UNKNOWN'

  const pad2 = (n: number) => String(n).padStart(2, '0')

  const hhmm = useMemo(() => {
    const totalMinutes = Math.max(0, Math.floor(state.gameTime || 0))
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
    const minutes = totalMinutes % 60
    return `${pad2(hours)}:${pad2(minutes)}`
  }, [state.gameTime])

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

  const inboxMessages = [
    'SUBCHANNEL 3: CIPHERS UNSEALED',
    'SUBCHANNEL 1: SIGNAL STABILIZED',
    'SUBCHANNEL 7: MEMORY FRAGMENTS VERIFIED',
  ]

  const [activeMessageIdx, setActiveMessageIdx] = useState<number>(0)

  const activeMessage = inboxMessages[Math.min(activeMessageIdx, inboxMessages.length - 1)]

  const cursorStyle: React.CSSProperties = {
    color: '#ffb000',
    display: 'inline-block',
    width: '0.6ch',
    marginLeft: '2px',
    animation: 'solsticeBlink 1s steps(2, end) infinite',
  }

  const glass = {
    background: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
  } as const

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      />

      <style>
        {`@keyframes solsticeBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes solsticeScan { 0% { transform: translateY(0px); } 100% { transform: translateY(40px); } }`}
      </style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at center, rgba(0, 255, 65, 0.18) 0%, rgba(0, 255, 65, 0.10) 22%, rgba(0, 255, 65, 0.05) 45%, rgba(10, 10, 10, 0) 70%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          animation: 'solsticeScan 8s linear infinite',
          background:
            'repeating-linear-gradient(to bottom, rgba(0, 255, 65, 0.03) 0px, rgba(0, 255, 65, 0.03) 1px, rgba(0, 0, 0, 0) 3px, rgba(0, 0, 0, 0) 6px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: 'min(1100px, calc(100vw - 40px))',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            ...glass,
            padding: '0.9rem 1.2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            alignItems: 'center',
            gap: '0.75rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              textAlign: 'left',
              fontFamily: "'Courier New', monospace",
              color: '#00ff41',
              fontSize: '1rem',
            }}
          >
            ARIA // {playerName}
          </div>

          <div
            style={{
              textAlign: 'center',
              fontFamily: "'Courier New', monospace",
              color: '#ffb000',
              fontSize: '1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {String(state.currentPhase).toUpperCase()}
          </div>

          <div
            style={{
              textAlign: 'right',
              fontFamily: "'Courier New', monospace",
              color: '#00ff41',
              fontSize: '1rem',
            }}
          >
            {hhmm}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: '1rem',
          }}
        >
          <div style={{ ...glass, padding: '1.2rem', boxSizing: 'border-box' }}>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#00ff41',
                fontSize: '1.1rem',
                marginBottom: '0.9rem',
              }}
            >
              {'>'} INBOX
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {inboxMessages.map((m, idx) => {
                const isActive = idx === activeMessageIdx
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setActiveMessageIdx(idx)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      background: isActive ? 'rgba(0, 255, 65, 0.10)' : 'rgba(0, 0, 0, 0)',
                      border: '1px solid rgba(0, 255, 65, 0.2)',
                      color: '#00ff41',
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.95rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ ...glass, padding: '1.2rem', boxSizing: 'border-box' }}>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#00ff41',
                fontSize: '1.1rem',
                marginBottom: '0.9rem',
              }}
            >
              {'>'} ACTIVE TRANSMISSION
            </div>

            <div
              style={{
                color: '#00ff41',
                fontFamily: "'Courier New', monospace",
                fontSize: '1rem',
                lineHeight: 1.5,
                minHeight: '6rem',
              }}
            >
              {activeMessage}
              <div style={{ marginTop: '0.75rem' }}>
                AWAITING DECRYPTION...
                <span style={cursorStyle} aria-hidden="true">
                  ▋
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

