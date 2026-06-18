/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer } from 'react'

import type { ReactNode } from 'react'

import { gameReducer } from './gameReducer'
import { initialState } from './gameState'
import type { GameContextValue } from './GameState'


const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return <GameContext.Provider value={{ state, dispatch } as GameContextValue}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

