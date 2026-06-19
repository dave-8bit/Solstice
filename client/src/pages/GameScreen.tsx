import { useEffect, useMemo, useRef } from 'react'



import { useGame } from '../context/GameContext'
import { puzzles } from '../utils/puzzles'
import PuzzlePanel from '../components/PuzzlePanel'
import { evaluateEnding } from '../utils/endingLogic'

export default function GameScreen() {


  const { dispatch, state } = useGame()


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

  // Layer 1: active puzzle derived from state (no UI-driven selection)
  const activePuzzleIndex = Math.max(0, Math.min(puzzles.length - 1, state.currentPuzzleIndex ?? 0))
  const activePuzzle = puzzles[activePuzzleIndex] ?? puzzles[0]




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

  const decay = typeof state.solsticeDecay === 'number' ? state.solsticeDecay : 0
  const decayLevel: 'normal' | 'flicker' | 'shake' | 'glitch' =
    decay < 30 ? 'normal' : decay < 60 ? 'flicker' : decay < 80 ? 'shake' : 'glitch'

  const decayOverlay =
    decayLevel === 'normal'
      ? null
      : decayLevel === 'flicker'
        ? {
            position: 'absolute' as const,
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none' as const,
            opacity: 0.08,
            background: 'rgba(255,176,0,0.35)',
            mixBlendMode: 'screen' as const,
          }
        : decayLevel === 'shake'
          ? {
              position: 'absolute' as const,
              inset: 0,
              zIndex: 4,
              pointerEvents: 'none' as const,
              opacity: 0.12,
              background: 'rgba(0,255,65,0.25)',
              mixBlendMode: 'screen' as const,
              filter: 'contrast(1.15) saturate(1.2)',
              animation: 'solsticeShake 250ms linear infinite' as const,
            }
          : {
              position: 'absolute' as const,
              inset: 0,
              zIndex: 4,
              pointerEvents: 'none' as const,
              opacity: 0.18,
              background:
                'repeating-linear-gradient(to bottom, rgba(255,176,0,0.20) 0px, rgba(255,176,0,0.20) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)',
              mixBlendMode: 'screen' as const,
              filter: 'contrast(1.35) saturate(1.3) hue-rotate(10deg)',
            }

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
        filter:
          decayLevel === 'glitch'
            ? 'none'
            : decayLevel === 'shake'
              ? 'contrast(1.05)'
              : undefined,
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

      {decayOverlay ? <div style={decayOverlay} /> : null}


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
              {puzzles.map((p, idx) => {
                const isCompleted = state.completedPuzzles.includes(p.id)
                const isCurrent = idx === activePuzzleIndex
                const isLocked = !isCompleted && !isCurrent

                return (
                  <div
                    key={p.id}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      background: isCurrent ? 'rgba(0, 255, 65, 0.10)' : 'rgba(0, 0, 0, 0)',
                      border: '1px solid rgba(0, 255, 65, 0.2)',
                      borderRadius: '10px',
                      cursor: isCurrent ? 'pointer' : 'default',
                      userSelect: 'none',
                      opacity: isLocked ? 0.75 : 1,
                    }}
                  >
                    {isLocked ? (
                      <div style={{ color: '#ffb000', fontFamily: "'Courier New', monospace", fontSize: '0.95rem' }}>
                        [ LOCKED TRANSMISSION ]
                        <div style={{ color: '#008f11', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.15rem' }}>
                          SIGNAL UNAVAILABLE
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ color: '#00ff41', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isCompleted ? '✓' : ''}
                          <span>{isCompleted ? p.title : p.title}</span>
                        </div>
                        <div style={{ color: '#008f11', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.15rem' }}>
                          {isCompleted ? '[ COMPLETED ]' : `[ ${p.phase.toUpperCase()} ]`}
                        </div>
                      </>
                    )}
                  </div>
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
              <PuzzlePanel
                puzzle={activePuzzle}
                visibility="current"
                onSolved={() => {
                  // Let the reducer be the source of truth for unlocking.
                  // After the active puzzle is completed, if all puzzles are completed, transition to ending.
                  const updatedCompleted = [...state.completedPuzzles]
                  if (!updatedCompleted.includes(activePuzzle.id)) {
                    updatedCompleted.push(activePuzzle.id)
                  }

                  if (updatedCompleted.length >= 5) {
                    const ending = evaluateEnding(updatedCompleted, state.flags, state.gameTime)
                    dispatch({ type: 'SET_ENDING', payload: ending })
                    dispatch({ type: 'SET_SCREEN', payload: 'ending' })
                  }
                }}
              />



              <div style={{ marginTop: '0.75rem' }}>
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


