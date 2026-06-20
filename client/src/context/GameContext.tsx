/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from 'react'


import type { ReactNode } from 'react'

import { gameReducer } from './gameReducer'
import { initialState } from './GameState'
import { persistGameProgress, rehydrateGameState, clearGamePersistence } from '../utils/gamePersistence'
import { puzzles } from '../utils/puzzles'


import type { GameContextValue } from './GameState'



const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const puzzlesCount = puzzles.length

  const hydrated = typeof window !== 'undefined' ? rehydrateGameState(puzzlesCount) : null
  const startingState = hydrated ? { ...initialState, ...hydrated } : initialState

  const [state, dispatch] = useReducer(gameReducer, startingState)

  // Save only progression-relevant fields.
  // This must not change gameplay logic; it only hydrates on refresh.
  useEffect(() => {

    if (state.screen === 'boot' || state.screen === 'menu') {
      clearGamePersistence()
      return
    }
    persistGameProgress(state, puzzlesCount)
  }, [state, puzzlesCount])


  return <GameContext.Provider value={{ state, dispatch } as GameContextValue}>{children}</GameContext.Provider>
}


export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

