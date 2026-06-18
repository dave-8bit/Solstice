import { clamp01To100 } from './ariaState'

// re-exported utility for UI
export function getNeuralStabilityPercent(solsticeDecay: number): number {
  // stability = 100 - decay
  const d = Number.isFinite(solsticeDecay) ? solsticeDecay : 0
  return clamp01To100(100 - d)
}

