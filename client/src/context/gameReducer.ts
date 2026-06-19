import { clampDecay, initialState, phaseFromTime } from './GameState'
import type { GameAction, GameState } from './GameState'

const PUZZLE_SEQUENCE_LENGTH = 5
const clampPuzzleIndex = (idx: number) => Math.max(0, Math.min(PUZZLE_SEQUENCE_LENGTH - 1, idx))



export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'SET_SESSION': {
      return {
        ...state,
        sessionId: action.payload.sessionId,
        playerName: action.payload.playerName,
        // Ensure sequential progression starts from Puzzle 1.
        currentPuzzleIndex: 0,
        completedPuzzles: [],
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

      // Layer 2: reducer source of truth.
      // Only allow completing the currently active puzzle.
      const expectedPuzzleId = clampPuzzleIndex(state.currentPuzzleIndex) + 1
      if (puzzleId !== expectedPuzzleId) {
        return state
      }

      const completedAlready = state.completedPuzzles.includes(puzzleId)
      const completedPuzzles = completedAlready ? state.completedPuzzles : [...state.completedPuzzles, puzzleId]

      // Unlock exactly next puzzle.
      const nextIndex = Math.min(state.currentPuzzleIndex + 1, PUZZLE_SEQUENCE_LENGTH - 1)

      return {
        ...state,
        completedPuzzles,
        currentPuzzleIndex: nextIndex,
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

