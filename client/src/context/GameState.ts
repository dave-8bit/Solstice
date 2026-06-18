export type GamePhase = 'dawn' | 'morning' | 'noon' | 'dusk' | 'night'
export type EndingType = 'A' | 'B' | 'C' | null
export type GameScreen = 'boot' | 'menu' | 'game' | 'ending'

export interface GameState {
  sessionId: string | null
  playerName: string | null
  gameTime: number
  currentPhase: GamePhase
  isComplete: boolean
  ending: EndingType
  screen: GameScreen
  flags: Record<string, string>
  puzzlesCompleted: number[]
  solsticeDecay: number
}

export type GameAction =
  | { type: 'SET_SESSION'; payload: { sessionId: string; playerName: string } }
  | { type: 'ADVANCE_TIME'; payload: number }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_FLAG'; payload: { key: string; value: string } }
  | { type: 'COMPLETE_PUZZLE'; payload: number }
  | { type: 'SET_SCREEN'; payload: GameScreen }
  | { type: 'SET_ENDING'; payload: EndingType }
  | { type: 'INCREASE_DECAY'; payload?: number }
  | { type: 'SET_DECAY'; payload?: number }
  | { type: 'RESET' }

export const initialState: GameState = {
  sessionId: null,
  playerName: null,
  gameTime: 0,
  currentPhase: 'dawn',
  isComplete: false,
  ending: null,
  screen: 'boot',
  flags: {},
  puzzlesCompleted: [],
  solsticeDecay: 0,
}

export function phaseFromTime(minutes: number): GamePhase {
  if (minutes >= 480) return 'night'
  if (minutes >= 360) return 'dusk'
  if (minutes >= 240) return 'noon'
  if (minutes >= 120) return 'morning'
  return 'dawn'
}

export function clampDecay(value: number): number {
  const v = Number.isFinite(value) ? value : 0
  return Math.max(0, Math.min(100, v))
}

