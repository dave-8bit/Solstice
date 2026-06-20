export type FeedbackCategory =
  | 'structure mismatch'
  | 'correct length but wrong mapping'
  | 'pattern partially detected'
  | 'close alignment detected'

export type EvaluateAttemptResult = {
  feedbackCategory: FeedbackCategory
  // legacy name used by existing UI
  similarityScore: number
  // NEW position-aware diagnostics
  accuracyPercent: number
  firstMismatchIndex: number | null
  exactMatch: boolean
  // keep compatibility with existing escalation
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
      accuracyPercent: 0,
      firstMismatchIndex: null,
      exactMatch: false,
      updatedAttemptCount,
      updatedFailurePatternHistory: [...history.slice(-5), 'structure mismatch'],
    }
  }

  if (!a || !b) return safeFeedback()

  // ----- Position-aware comparison (Escape-room Cognition v3) -----
  // Compare normalized input against normalized target.
  // Never reveal missing characters / exact plaintext.
  const totalCharacters = Math.max(a.length, b.length)
  const minLen = Math.min(a.length, b.length)

  let matchingCharacters = 0
  let firstMismatchIndex: number | null = null

  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) {
      matchingCharacters++
    } else if (firstMismatchIndex === null) {
      firstMismatchIndex = i
    }
  }

  const accuracyPercent = totalCharacters === 0 ? 0 : (matchingCharacters / totalCharacters) * 100
  const exactMatch = a === b

  // Similarity score (existing behavior: character set overlap)
  const setA = new Set(a.split(''))
  const setB = new Set(b.split(''))
  let overlap = 0
  for (const ch of setA) {
    if (setB.has(ch)) overlap++
  }
  const denom = Math.max(1, new Set([...setA, ...setB]).size)
  const similarityScore = overlap / denom

  // ----- Diagnostic rules (no solution revelation) -----
  // 0-30: incoherent
  // 30-60: partial pattern detected
  // 60-90: alignment detected near position X
  // 90-99: signal stable except final deviations
  // 100: solved
  const diagnosticCategory = (() => {
    if (exactMatch) return 'close alignment detected' as const

    if (accuracyPercent < 30) return 'structure mismatch' as const
    if (accuracyPercent < 60) return 'pattern partially detected' as const
    if (accuracyPercent < 90) return 'correct length but wrong mapping' as const
    // 90..99
    return 'close alignment detected' as const
  })()

  // For existing UI: map v3 diagnostics to legacy feedback categories.
  // We keep cipherType-based structure checks to preserve old behavior for binary puzzles.
  const baseCategory = (() => {
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

    const lenDelta = Math.abs(a.length - b.length)
    const closeLen = lenDelta === 0

    if (closeLen && similarityScore > 0.25) return 'close alignment detected' as const
    if (similarityScore > 0.1) return 'pattern partially detected' as const
    if (closeLen) return 'correct length but wrong mapping' as const
    return 'structure mismatch' as const
  })()

  const updatedAttemptCount = attemptCount + 1
  const lastCategory: FeedbackCategory | null = history.length ? history[history.length - 1] : null
  const repeatedCategory = lastCategory === baseCategory
  const upgradedAfter = updatedAttemptCount >= 3

  // Combine legacy escalation with v3 diagnostic category.
  let feedbackCategory: FeedbackCategory = diagnosticCategory

  if (upgradedAfter) {
    if (repeatedCategory) {
      feedbackCategory =
        feedbackCategory === 'structure mismatch'
          ? 'structure mismatch'
          : feedbackCategory === 'correct length but wrong mapping'
            ? 'close alignment detected'
            : feedbackCategory
    } else {
      if (similarityScore >= 0.22) {
        feedbackCategory = feedbackCategory === 'pattern partially detected' ? 'close alignment detected' : feedbackCategory
      } else if (similarityScore <= 0.1) {
        feedbackCategory = 'structure mismatch'
      }
    }
  }

  const updatedFailurePatternHistory = [...history.slice(-5), feedbackCategory]

  return {
    feedbackCategory,
    similarityScore,
    accuracyPercent: Math.round(accuracyPercent),
    // rule wants FIRST STRUCTURAL DEVIATION POSITION X (1-based for UI friendliness)
    // but we return index; UI can format. We do not reveal missing characters.
    firstMismatchIndex: firstMismatchIndex === null ? null : firstMismatchIndex + 1,
    exactMatch,
    updatedAttemptCount,
    updatedFailurePatternHistory,
  }
}


