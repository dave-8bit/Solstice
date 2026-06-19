import { useMemo, useState } from 'react'


import type { Puzzle } from '../utils/puzzles'
import { useGame } from '../context/GameContext'
import { useGroqHint } from '../hooks/useGroqHint'
import { getNeuralStabilityPercent } from '../utils/ariaStabilityPercent'

interface Props {
  puzzle: Puzzle
  onSolved: () => void
  visibility?: 'current' | 'completed' | 'locked'
}

export default function PuzzlePanel({ puzzle, onSolved, visibility = 'current' }: Props) {

  const { dispatch, state } = useGame()

  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSolved, setIsSolved] = useState(false)
  const [hintRequested, setHintRequested] = useState(false)
  // Layer-2 hint escalation: per-puzzle (local state only)
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0)

  const { loading, fetchHint, error: hintError } = useGroqHint()


  const displayedHint: string | null = hintRequested
    ? hintError
      ? null
      : hintLevel === 0
        ? puzzle.hintLayers.weakSignal.trim()
        : hintLevel === 1
          ? puzzle.hintLayers.structuralHint.trim()
          : puzzle.hintLayers.strongHint.trim()
    : null






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

  const ariaStabilityPercent = useMemo(() => getNeuralStabilityPercent(state.solsticeDecay), [state.solsticeDecay])

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

  if (visibility === 'locked') {
    return (
      <div style={styles.root}>
        <div style={styles.title}>[ LOCKED TRANSMISSION ]</div>
        <div style={{ color: '#ffb000', fontSize: '0.95rem', fontFamily: "'Courier New', monospace" }}>SIGNAL UNAVAILABLE</div>
      </div>
    )
  }


  function computeAttemptFeedback(input: string, target: string, cipherType: string): {
    category: 'structure mismatch' | 'correct length but wrong mapping' | 'pattern partially detected' | 'close alignment detected'
    similarity: number
  } {
    // Internal-only analysis; never reveals plaintext.
    const a = input.trim().toLowerCase()
    const b = target.trim().toLowerCase()

    if (!a || !b) {
      return { category: 'structure mismatch', similarity: 0 }
    }

    // Character overlap similarity (safe + generic).
    const setA = new Set(a.split(''))
    const setB = new Set(b.split(''))
    let overlap = 0
    for (const ch of setA) {
      if (setB.has(ch)) overlap++
    }
    const denom = Math.max(1, new Set([...setA, ...setB]).size)
    const similarity = overlap / denom

    // Cipher-specific lightweight structure checks.
    // We only look at *shape* of the strings, not content mapping.
    if (cipherType === 'binary') {
      // Expect 8-bit chunks separated by spaces.
      const parts = a.split(/\s+/).filter(Boolean)
      const targetParts = b.split(/\s+/).filter(Boolean)
      const correctChunkCount = Math.abs(parts.length - targetParts.length) === 0
      const all8Bit = parts.every((p) => /^[01]{8}$/.test(p))
      if (correctChunkCount && all8Bit && similarity > 0.15) {
        return { category: 'pattern partially detected', similarity }
      }
      if (parts.length === targetParts.length && all8Bit && similarity <= 0.15) {
        return { category: 'close alignment detected', similarity }
      }
      if (parts.length !== targetParts.length || !all8Bit) {
        return { category: 'structure mismatch', similarity }
      }
    }

    // Generic length/mapping category.
    const lenDelta = Math.abs(a.length - b.length)
    const closeLen = lenDelta === 0

    if (closeLen && similarity > 0.25) {
      return { category: 'close alignment detected', similarity }
    }

    // If user input has some overlap but not enough.
    if (similarity > 0.1) {
      return { category: 'pattern partially detected', similarity }
    }

    // If input length matches but overlap is low.
    if (closeLen) {
      return { category: 'correct length but wrong mapping', similarity }
    }

    return { category: 'structure mismatch', similarity }
  }

  function onSubmit() {
    if (isSolved) return
    setError(null)

    if (normalizedAnswer === correctAnswer) {
      setIsSolved(true)
      dispatch({ type: 'COMPLETE_PUZZLE', payload: puzzle.id })
      onSolved()
      return
    }

    const feedback = computeAttemptFeedback(normalizedAnswer, correctAnswer, puzzle.cipherType)
    console.log('[ATTEMPT ANALYSIS]', { puzzleId: puzzle.id, similarity: feedback.similarity, category: feedback.category })

    // Diagnostic feedback only; never reveals plaintext.
    setError(
      `DECRYPTION FAILED — DIAGNOSTIC: ${feedback.category.toUpperCase()} — TIME PENALTY: ${puzzle.timeCostOnFail} MIN`
    )
    dispatch({ type: 'ADVANCE_TIME', payload: puzzle.timeCostOnFail })
    dispatch({ type: 'INCREASE_DECAY', payload: puzzle.timeCostOnFail * 0.5 })
  }


  function onRequestHint() {
    if (isSolved) return

    // Escape-room style escalation: weak(0) -> structural(1) -> strong(2)
    // Track locally per puzzle panel instance.
    const nextLevel = hintLevel === 2 ? 2 : ((hintLevel + 1) as 0 | 1 | 2)

    const selectedHintType: 'weakSignal' | 'structuralHint' | 'strongHint' =
      nextLevel === 0 ? 'weakSignal' : nextLevel === 1 ? 'structuralHint' : 'strongHint'

    console.log(`[HINT SYSTEM] puzzle=${puzzle.id} level=${nextLevel} type=${selectedHintType === 'weakSignal' ? 'weak' : selectedHintType === 'structuralHint' ? 'structural' : 'strong'}`)


    setHintRequested(true)

    setError(null)
    dispatch({ type: 'ADVANCE_TIME', payload: puzzle.timeCostOnHint })
    dispatch({ type: 'INCREASE_DECAY', payload: puzzle.timeCostOnHint * 0.3 })

    fetchHint(puzzle.cipherType, puzzle.encryptedMessage, puzzle.plaintext, 0, nextLevel)
    setHintLevel(nextLevel)
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
            ) : hintError ? (
              <div style={styles.clueProminent}>{hintError}</div>
            ) : displayedHint ? (
              <div style={styles.clueProminent}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,176,0,0.95)', marginBottom: '0.35rem' }}>
                  NEURAL STABILITY: {ariaStabilityPercent}%
                </div>
                {displayedHint}
              </div>
            ) : null
          ) : null}
        </>
      ) : (
        <>
          <div style={{ marginTop: '0.65rem' }}>
            <div style={styles.successHeader}>STORY UNLOCKED</div>
            <div style={styles.successUnlock}>{puzzle.storyUnlock}</div>

            {shouldShowNarrativeText ? <div style={styles.narrativeText}>{narrativeText}</div> : null}
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
            <button type="button" style={styles.button} onClick={onSubmit}>
              SUBMIT —
            </button>

            <button type="button" style={styles.buttonSecondary} onClick={onRequestHint}>
              REQUEST HINT
            </button>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}
        </>
      ) : null}
    </div>
  )
}

