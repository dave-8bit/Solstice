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

type GameAction =
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

export type { GameAction }


const initialState: GameState = {
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

function phaseFromTime(minutes: number): GamePhase {
  if (minutes >= 480) return 'night'
  if (minutes >= 360) return 'dusk'
  if (minutes >= 240) return 'noon'
  if (minutes >= 120) return 'morning'
  return 'dawn'
}

function clampDecay(value: number): number {
  const v = Number.isFinite(value) ? value : 0
  return Math.max(0, Math.min(100, v))
}

export { initialState, phaseFromTime, clampDecay }


export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SESSION': {
      return {
        ...state,
        sessionId: action.payload.sessionId,
        playerName: action.payload.playerName,
      }
    }
    case 'ADVANCE_TIME': {
      const newGameTime = state.gameTime + action.payload
      return {
        ...state,
        gameTime: newGameTime,
        currentPhase: phaseFromTime(newGameTime),
      }
    }
    case 'SET_PHASE': {
      return {
        ...state,
        currentPhase: action.payload,
      }
    }
    case 'SET_FLAG': {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.payload.key]: action.payload.value,
        },
      }
    }
    case 'COMPLETE_PUZZLE': {
      const puzzleId = action.payload
      const alreadyCompleted = state.puzzlesCompleted.includes(puzzleId)
      const puzzlesCompleted = alreadyCompleted ? state.puzzlesCompleted : [...state.puzzlesCompleted, puzzleId]

      return {
        ...state,
        puzzlesCompleted,
      }
    }
    case 'SET_SCREEN': {
      return {
        ...state,
        screen: action.payload,
      }
    }
    case 'SET_ENDING': {
      const ending = action.payload
      return {
        ...state,
        ending,
        isComplete: ending !== null,
      }
    }
    case 'INCREASE_DECAY': {
      const inc = clampDecay(action.payload ?? 0)
      return {
        ...state,
        solsticeDecay: clampDecay(state.solsticeDecay + inc),
      }
    }
    case 'SET_DECAY': {
      return {
        ...state,
        solsticeDecay: clampDecay(action.payload ?? 0),
      }
    }
    case 'RESET': {
      return { ...initialState }
    }
    default: {
      return state
    }
  }
}

