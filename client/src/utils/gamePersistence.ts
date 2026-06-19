import type { GameState } from '../context/GameState'
import { clampDecay } from '../context/GameState'

const STORAGE_KEY = 'solstice.gameState.v1'

function safeParse(json: string | null): unknown {
  if (!json) return null
  try {
    return JSON.parse(json) as unknown
  } catch {
    return null
  }
}

export function rehydrateGameState(puzzlesCount: number): Partial<GameState> | null {
  // Layer 0 (required for acceptance): on refresh, restore progression state.
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY))
  if (!parsed || typeof parsed !== 'object') return null

  const candidate = parsed as Partial<GameState>

  const currentPuzzleIndex =
    typeof candidate.currentPuzzleIndex === 'number'
      ? Math.max(0, Math.min(puzzlesCount - 1, Math.floor(candidate.currentPuzzleIndex)))
      : undefined

  const completedPuzzles = Array.isArray(candidate.completedPuzzles)
    ? candidate.completedPuzzles
        .filter((id) => typeof id === 'number')
        .map((id) => Math.floor(id))
        .filter((id) => id >= 1 && id <= puzzlesCount)
    : undefined

  const solsticeDecay = typeof candidate.solsticeDecay === 'number' ? clampDecay(candidate.solsticeDecay) : undefined

  const screen = candidate.screen
  const ending = candidate.ending
  const isComplete = candidate.isComplete

  // Conservative hydrate: never restore mid-session if the stored screen is not `game`.
  // (If you want stricter, remove these checks.)
  if (screen !== 'game' && screen !== 'ending') return null
  if (ending !== null && ending !== 'A' && ending !== 'B' && ending !== 'C') return null

  return {
    ...(typeof currentPuzzleIndex === 'number' ? { currentPuzzleIndex } : null),
    ...(completedPuzzles ? { completedPuzzles } : null),
    ...(typeof solsticeDecay === 'number' ? { solsticeDecay } : null),
    // If it was in ending screen, keep it.
    ...(screen ? { screen } : null),
    ...(typeof ending !== 'undefined' ? { ending: ending as GameState['ending'] } : null),

    ...(typeof isComplete === 'boolean' ? { isComplete } : null),
  }
}

export function persistGameProgress(state: GameState, puzzlesCount: number) {
  const safeCompleted = state.completedPuzzles
    .filter((id) => typeof id === 'number')
    .map((id) => Math.floor(id))
    .filter((id) => id >= 1 && id <= puzzlesCount)

  const payload: Partial<GameState> = {
    currentPuzzleIndex: Math.max(0, Math.min(puzzlesCount - 1, Math.floor(state.currentPuzzleIndex ?? 0))),
    completedPuzzles: safeCompleted,
    solsticeDecay: clampDecay(state.solsticeDecay ?? 0),
    screen: state.screen,
    ending: state.ending,
    isComplete: state.isComplete,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearGamePersistence() {
  localStorage.removeItem(STORAGE_KEY)
}

