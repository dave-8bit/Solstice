/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from 'react'




import type { ReactNode } from 'react'

import { gameReducer } from './gameReducer'
import { initialState } from './GameState'
import { persistGameProgress, rehydrateGameState } from '../utils/gamePersistence'

import { puzzles } from '../utils/puzzles'

import type { GameContextValue } from './GameState'

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const puzzlesCount = puzzles.length

  // Single-run hydration marker to guard persistence writes.
  // Note: we do NOT use this ref during reducer init to avoid render-time ref access.
  const hydrationComplete = useReducer(() => true, false)[0]




  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    const persisted = rehydrateGameState(puzzlesCount)

    if (persisted) console.log('[HYDRATION_APPLIED]', { puzzlesCount })
    else console.log('[HYDRATION_SKIPPED]', { puzzlesCount })

    // Strict rule: merge persisted ONLY at init.
    return persisted ? { ...initialState, ...persisted } : initialState
  })

  // Persistence write must be gated by hydration completion.
  useEffect(() => {
    if (!hydrationComplete) return


    if (state.screen === 'game' || state.screen === 'ending') {
      console.log('[PERSISTENCE_WRITE]')
      persistGameProgress(state, puzzlesCount)
    }
  }, [hydrationComplete, state, puzzlesCount])



  return <GameContext.Provider value={{ state, dispatch } as GameContextValue}>{children}</GameContext.Provider>
}


export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}


