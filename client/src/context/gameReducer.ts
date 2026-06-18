import { clampDecay, initialState, phaseFromTime } from './gameState'
import type { GameAction, GameState } from './gameState'

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

