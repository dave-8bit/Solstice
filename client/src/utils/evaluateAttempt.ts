export type FeedbackCategory =
  | 'structure mismatch'
  | 'correct length but wrong mapping'
  | 'pattern partially detected'
  | 'close alignment detected'

export type EvaluateAttemptResult = {
  feedbackCategory: FeedbackCategory
  similarityScore: number
  updatedAttemptCount: number
  updatedFailurePatternHistory: FeedbackCategory[]
}

export function evaluateAttempt(
  input: string,
  target: string,
  cipherType: string,
  attemptCount: number,
  history: FeedbackCategory[]
): EvaluateAttemptResult {
  const a = input.trim().toLowerCase()
  const b = target.trim().toLowerCase()

  const safeFeedback = (): EvaluateAttemptResult => {
    const updatedAttemptCount = attemptCount + 1
    return {
      feedbackCategory: 'structure mismatch',
      similarityScore: 0,
      updatedAttemptCount,
      updatedFailurePatternHistory: [...history.slice(-5), 'structure mismatch'],
    }
  }

  if (!a || !b) return safeFeedback()

  // Similarity score (internal + deterministic): character set overlap.
  const setA = new Set(a.split(''))
  const setB = new Set(b.split(''))
  let overlap = 0
  for (const ch of setA) {
    if (setB.has(ch)) overlap++
  }
  const denom = Math.max(1, new Set([...setA, ...setB]).size)
  const similarityScore = overlap / denom

  const baseCategory = (() => {
    // Cipher-specific lightweight structure checks.
    // We only look at *shape* of the strings, not content mapping.
    if (cipherType === 'binary') {
      const parts = a.split(/\s+/).filter(Boolean)
      const targetParts = b.split(/\s+/).filter(Boolean)
      const correctChunkCount = Math.abs(parts.length - targetParts.length) === 0
      const all8Bit = parts.every((p) => /^[01]{8}$/.test(p))

      if (correctChunkCount && all8Bit && similarityScore > 0.15) {
        return 'pattern partially detected' as const
      }
      if (parts.length === targetParts.length && all8Bit && similarityScore <= 0.15) {
        return 'close alignment detected' as const
      }
      if (parts.length !== targetParts.length || !all8Bit) {
        return 'structure mismatch' as const
      }
    }

    // Generic length/mapping category.
    const lenDelta = Math.abs(a.length - b.length)
    const closeLen = lenDelta === 0

    if (closeLen && similarityScore > 0.25) {
      return 'close alignment detected' as const
    }

    if (similarityScore > 0.1) {
      return 'pattern partially detected' as const
    }

    if (closeLen) {
      return 'correct length but wrong mapping' as const
    }

    return 'structure mismatch' as const
  })()

  // Escape-room Cognition v2: attempt escalation after threshold
  const updatedAttemptCount = attemptCount + 1
  const lastCategory: FeedbackCategory | null = history.length ? history[history.length - 1] : null
  const repeatedCategory = lastCategory === baseCategory

  const upgradedAfter = updatedAttemptCount >= 3

  let feedbackCategory: FeedbackCategory = baseCategory

  if (upgradedAfter) {
    if (repeatedCategory) {

      // Increase severity without revealing extra solution info.
      // Deterministic remap when repeatedly failing.
      feedbackCategory =
        feedbackCategory === 'structure mismatch'
          ? 'structure mismatch'
          : feedbackCategory === 'correct length but wrong mapping'
            ? 'close alignment detected'
            : feedbackCategory
    } else {
      // Use similarity to nudge toward more precise diagnostics.
      if (similarityScore >= 0.22) {
        feedbackCategory =
          feedbackCategory === 'pattern partially detected'
            ? 'close alignment detected'
            : feedbackCategory
      } else if (similarityScore <= 0.1) {
        feedbackCategory = 'structure mismatch'
      }

    }
  }

  const updatedFailurePatternHistory = [...history.slice(-5), feedbackCategory]

  return {
    feedbackCategory,
    similarityScore,
    updatedAttemptCount,
    updatedFailurePatternHistory,
  }
}

