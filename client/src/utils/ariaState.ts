export type ARIATone = 'stable' | 'hesitant' | 'fragmented' | 'corrupted'

export interface ARIAState {
  /** 0–100 */
  stability: number
  tone: ARIATone
  memoryIntegrity: number
}

export function clamp01To100(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

/**
 * Client-only derived state.
 * solsticeDecay is the single source of truth; stability = 100 - solsticeDecay.
 */
export function getARIAStateFromDecay(solsticeDecay: number): ARIAState {
  const decay = clamp01To100(solsticeDecay)
  const stability = clamp01To100(100 - decay)
  const memoryIntegrity = stability

  let tone: ARIATone
  if (stability >= 80) tone = 'stable'
  else if (stability >= 50) tone = 'hesitant'
  else if (stability >= 20) tone = 'fragmented'
  else tone = 'corrupted'

  return { stability, tone, memoryIntegrity }
}

