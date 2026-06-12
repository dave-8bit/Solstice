import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App'
import { GameProvider } from './context/GameContext'

// Mount the app and provide game state via context.
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)

