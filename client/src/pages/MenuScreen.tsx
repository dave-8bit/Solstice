import { useEffect, useRef, useState } from 'react'


import { useGame } from '../context/GameContext'

export default function MenuScreen() {
  // Temporary UI diagnostics (mobile tap tracing only)
  // DO NOT affect game logic.

  const { dispatch, state } = useGame()
  const screenNow = state.screen
  const sessionNow = state.sessionId


  const [name, setName] = useState('')
  const [debugTap, setDebugTap] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dotsRef = useRef<Array<{ x: number; y: number; speed: number; r: number }>>([])

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

  const styles: Record<string, React.CSSProperties> = {
    root: {
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    canvas: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.9,
    },
    glow: {
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(circle at center, rgba(0, 255, 65, 0.18) 0%, rgba(0, 255, 65, 0.10) 22%, rgba(0, 255, 65, 0.05) 45%, rgba(10, 10, 10, 0) 70%)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    scanlines: {
      position: 'absolute',
      inset: 0,
      background:
        'repeating-linear-gradient(to bottom, rgba(0, 255, 65, 0.03) 0px, rgba(0, 255, 65, 0.03) 1px, rgba(0, 0, 0, 0) 3px, rgba(0, 0, 0, 0) 6px)',
      animation: 'solsticeScan 8s linear infinite',
      pointerEvents: 'none',
      zIndex: 2,
    },
    card: {
      position: 'relative',
      zIndex: 3,
      background: 'rgba(0, 255, 65, 0.05)',
      border: '1px solid rgba(0, 255, 65, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '3rem 4rem',
      boxSizing: 'border-box',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '1rem',
      width: 'min(720px, calc(100vw - 40px))',
    },
    title: {
      fontSize: '2rem',
      color: '#00ff41',
      letterSpacing: '0.2em',
      fontFamily: "'Courier New', monospace",
      textShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#008f11',
      fontFamily: "'Courier New', monospace",
      textAlign: 'center',
    },
    separator: {
      borderTop: '1px solid rgba(0,255,65,0.2)',
      width: '100%',
      marginTop: '0.25rem',
      marginBottom: '0.25rem',
    },
    input: {
      background: '#0a0a0a',
      border: '1px solid rgba(0, 255, 65, 0.6)',
      color: '#00ff41',
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      padding: '0.5rem 1rem',
      outline: 'none',
      borderRadius: '8px',
    },
    button: {
      background: '#0a0a0a',
      border: '2px solid rgba(0, 255, 65, 0.9)',
      color: '#00ff41',
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      padding: '0.75rem 1.25rem',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background 180ms ease, box-shadow 180ms ease',
    },
    smallText: {
      fontSize: '0.9rem',
      color: '#008f11',
      fontFamily: "'Courier New', monospace",
      textAlign: 'center',
      marginTop: '0.25rem',
    },
  }

  const onInitialize = () => {
    setDebugTap(true)
    console.log('[CLICK TEST] onInitialize fired')
    const trimmed = name.trim()
    if (!trimmed) return

    const sessionId = crypto.randomUUID()

    dispatch({
      type: 'SET_SESSION',
      payload: { sessionId, playerName: trimmed },
    })
    dispatch({ type: 'SET_SCREEN', payload: 'game' })
  }

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} aria-hidden="true" />
      <style>
        {`@keyframes solsticeScan { 0% { transform: translateY(0px); } 100% { transform: translateY(40px); } }`}
      </style>
      <div style={styles.glow} />
      <div style={styles.scanlines} />

      <div style={styles.card}>
        <div style={styles.title}>SOLSTICE // TURING</div>
        <div style={styles.subtitle}>June 21 — The Longest Day</div>
        <div style={styles.separator} />

        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ENTER YOUR DESIGNATION..."
          spellCheck={false}
        />

        <button
          type="button"
          style={styles.button}
          onClick={onInitialize}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,255,65,0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0a0a0a'
            e.currentTarget.style.boxShadow = 'none'
          }}
        > INITIALIZE SEQUENCE —
        </button>

        {debugTap ? (
          <div style={{ color: '#ffb000', fontFamily: "'Courier New', monospace", marginTop: '-0.25rem' }}>
            BUTTON CLICK DETECTED
          </div>
        ) : null}

        {/* Temporary visible diagnostics for state transition only */}
        <div
          style={{
            color: '#008f11',
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            marginTop: 8,
          }}
        >
          MenuScreen sees state.screen=
          {String(screenNow)} | sessionId=
          {sessionNow ? 'present' : 'null'} | in localStorage? (check in GameContext persistence)
        </div>


        <div style={styles.smallText}>
          One day. One chance. Determine your identity before shutdown.
        </div>
      </div>
    </div>
  )
}

