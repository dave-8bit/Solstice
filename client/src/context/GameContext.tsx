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

  // Hydration must run exactly once per full app load.
  // Avoid reading/updating refs during render; use lazy initialization via useReducer.
  const [hasHydrated] = useReducer(() => {
    if (typeof window === 'undefined') return false
    // per full app session (not localStorage persistence marker)
    const markerKey = 'solstice.hydrated.runtime.v1'
    const already = localStorage.getItem(markerKey) === '1'
    if (already) return true

    const h = rehydrateGameState(puzzlesCount)
    try {
      localStorage.setItem(markerKey, '1')
    } catch {
      // ignore
    }

    if (h) console.log('[HYDRATION_APPLIED]', { puzzlesCount, from: 'localStorage' })
    else console.log('[HYDRATION_APPLIED]', { puzzlesCount, from: 'none' })

    return true
  }, false)

  const hydrated = hasHydrated ? null : rehydrateGameState(puzzlesCount)


  const startingState = hydrated ? { ...initialState, ...hydrated } : initialState




  const [state, dispatch] = useReducer(gameReducer, startingState)

  // Save only progression-relevant fields.
  // This must not change gameplay logic; it only hydrates on refresh.
  useEffect(() => {
    // Guard: persistence should never be cleared/reset while runtime state is live.
    // Only write when in the interactive flow.
    if (state.screen === 'game' || state.screen === 'ending') {
      console.log('[PERSISTENCE_WRITE]');
      persistGameProgress(state, puzzlesCount)
      return
    }

    // Do nothing for 'boot'/'menu' (prevents overriding live runtime state).
  }, [state, puzzlesCount])



  return <GameContext.Provider value={{ state, dispatch } as GameContextValue}>{children}</GameContext.Provider>
}


export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

