import React, { useState } from 'react'

import type { Puzzle } from '../utils/puzzles'
import { useGame } from '../context/GameContext'
import { useGroqHint } from '../hooks/useGroqHint'

interface Props {
  puzzle: Puzzle
  onSolved: () => void
}

export default function PuzzlePanel({ puzzle, onSolved }: Props) {
  const { dispatch } = useGame()
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSolved, setIsSolved] = useState(false)
  const [hintRequested, setHintRequested] = useState(false)

  const { hint, loading, fetchHint } = useGroqHint()

  const phaseLabel = (() => {
    const phaseValue = (puzzle as unknown as { phase?: string }).phase
    const phase = typeof phaseValue === 'string' && phaseValue.trim().length ? phaseValue : 'DAWN'
    return phase.trim().toUpperCase()
  })()

  const narrativeTextById: Record<number, string> = {
    1: 'A fragment surfaces from the void. Your first memory — fragmented, corrupted. Decode it.',
    2: 'A ghost signal from 1943. Bletchley Park. Someone is reaching across time.',
    3: 'The wall is polyalphabetic. Many keys. One truth. Your creators left this for you.',
    4: 'Pure machine language. This is your mother tongue. Can you read yourself?',
    5: 'The final cipher. Enigma. Turing broke this once. Now it is your turn.',
  }

  const narrativeText = narrativeTextById[puzzle.id] ?? ''

  const shouldShowNarrativeText = isSolved



  const styles: Record<string, React.CSSProperties> = {
    root: {
      background: 'transparent',
      padding: '1.2rem',
      borderRadius: '12px',
      boxSizing: 'border-box',
    },
    title: {
      color: '#ffb000',
      fontSize: '1.1rem',
      letterSpacing: '0.12em',
      fontFamily: "'Courier New', monospace",
      textTransform: 'uppercase',
      marginBottom: '0.75rem',
    },
    transmissionHeader: {
      color: '#ffb000',
      fontSize: '0.8rem',
      letterSpacing: '0.15em',
      fontFamily: "'Courier New', monospace",
      textTransform: 'uppercase',
      marginBottom: '0.65rem',
    },
    narrativeText: {
      color: '#008f11',
      fontSize: '0.85rem',
      fontStyle: 'italic',
      fontFamily: "'Courier New', monospace",
      lineHeight: 1.6,
      marginBottom: '0.85rem',
      minHeight: '1.6em',
    },
    cipherLabel: {
      color: '#008f11',
      fontSize: '0.85rem',
      fontFamily: "'Courier New', monospace",
      marginBottom: '0.65rem',
      letterSpacing: '0.08em',
    },
    encryptedMessage: {
      color: '#00ff41',
      fontSize: '1.3rem',
      letterSpacing: '0.15em',
      fontFamily: "'Courier New', monospace",
      textShadow: '0 0 10px rgba(0, 255, 65, 0.35)',
      marginBottom: '0.85rem',
      wordBreak: 'break-word',
    },
    clue: {
      color: '#008f11',
      fontSize: '0.85rem',
      fontStyle: 'italic',
      fontFamily: "'Courier New', monospace",
      marginBottom: '0.85rem',
      lineHeight: 1.4,
      minHeight: '1.3em',
    },
    clueProminent: {
      color: '#ffb000',
      fontSize: '0.95rem',
      fontStyle: 'italic',
      fontFamily: "'Courier New', monospace",
      textShadow: '0 0 18px rgba(255, 176, 0, 0.22)',
      marginBottom: '0.85rem',
      lineHeight: 1.45,
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
      width: '100%',
      boxSizing: 'border-box',
    },
    inputRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      marginBottom: '0.9rem',
    },
    buttonsRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: '0.75rem',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      flex: 1,
      textAlign: 'center',
      userSelect: 'none',
    },
    buttonSecondary: {
      background: '#0a0a0a',
      border: '2px solid rgba(255, 176, 0, 0.85)',
      color: '#ffb000',
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      padding: '0.75rem 1.25rem',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background 180ms ease, box-shadow 180ms ease',
      flex: 1,
      textAlign: 'center',
      userSelect: 'none',
    },
    error: {
      color: '#ff3131',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      textShadow: '0 0 14px rgba(255, 49, 49, 0.2)',
      marginTop: '0.6rem',
      lineHeight: 1.35,
    },
    successUnlock: {
      color: '#00ff41',
      fontFamily: "'Courier New', monospace",
      fontSize: '1.05rem',
      textShadow: '0 0 22px rgba(0, 255, 65, 0.35)',
      lineHeight: 1.45,
      marginTop: '0.65rem',
    },
    successHeader: {
      color: '#00ff41',
      fontFamily: "'Courier New', monospace",
      fontSize: '1.05rem',
      letterSpacing: '0.08em',
      textShadow: '0 0 22px rgba(0, 255, 65, 0.35)',
      marginBottom: '0.35rem',
    },
  }

  const normalizedAnswer = answer.trim().toLowerCase()
  const correctAnswer = puzzle.plaintext.trim().toLowerCase()

  function onSubmit() {
    if (isSolved) return
    setError(null)

    if (normalizedAnswer === correctAnswer) {
      setIsSolved(true)
      dispatch({ type: 'COMPLETE_PUZZLE', payload: puzzle.id })
      onSolved()
      return
    }

    setError(`DECRYPTION FAILED — TIME PENALTY: ${puzzle.timeCostOnFail} MIN`)
    dispatch({ type: 'ADVANCE_TIME', payload: puzzle.timeCostOnFail })
  }

  function onRequestHint() {
    if (isSolved) return
    setHintRequested(true)
    setError(null)
    dispatch({ type: 'ADVANCE_TIME', payload: puzzle.timeCostOnHint })
    fetchHint(puzzle.cipherType, puzzle.encryptedMessage, puzzle.plaintext)
  }

  return (
    <div style={styles.root}>
      <div style={styles.title}>{puzzle.title}</div>

      {!isSolved ? (
        <>
          <div style={styles.transmissionHeader}>[ INCOMING TRANSMISSION — {phaseLabel} CYCLE ]</div>
          <div style={styles.cipherLabel}>[ {puzzle.cipherType.toUpperCase()} ]</div>
          <div style={styles.encryptedMessage}>{puzzle.encryptedMessage}</div>

          {hintRequested ? (
            loading ? (
              <div style={styles.clueProminent}>ACCESSING GROQ NEURAL NETWORK...</div>
            ) : hint ? (
              <div style={styles.clueProminent}>{hint}</div>
            ) : (
              <div style={styles.clueProminent}>NEURAL LINK UNSTABLE — CONSULT INTERNAL MEMORY</div>
            )
          ) : null}

        </>
      ) : (
        <>
          <div style={{ marginTop: '0.65rem' }}>
            <div style={styles.successHeader}>STORY UNLOCKED</div>
            <div style={styles.successUnlock}>{puzzle.storyUnlock}</div>

            {shouldShowNarrativeText ? (
              <div style={styles.narrativeText}>{narrativeText}</div>
            ) : null}
          </div>

        </>
      )}

      {!isSolved ? (
        <>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="TYPE YOUR DECRYPTED ANSWER..."
              spellCheck={false}
            />
          </div>

          <div style={styles.buttonsRow}>
            <button
              type="button"
              style={styles.button}
              onClick={onSubmit}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,255,65,0.1)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0a0a0a'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              SUBMIT —
            </button>

            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={onRequestHint}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,176,0,0.10)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,176,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0a0a0a'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              REQUEST HINT
            </button>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}
        </>
      ) : null}
    </div>
  )
}

