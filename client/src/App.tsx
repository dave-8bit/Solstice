

import { useGame } from './context/GameContext'

import BootScreen from './pages/BootScreen'
import MenuScreen from './pages/MenuScreen'
import GameScreen from './pages/GameScreen'
import EndingScreen from './pages/EndingScreen'

export default function App() {
  const { state } = useGame()

  const screen = state.screen
  // Temporary UI diagnostics (mobile tap tracing only)



  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background: '#0a0a0a',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Temporary visible diagnostics: current state.screen + last action (mobile tracing only) */}
      <div
        style={{
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.6)',
          color: '#ffb000',
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          padding: '6px 8px',
          borderRadius: 8,
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.95,
        }}
      >
        {`screen=${screen}`}
      </div>

      {screen === 'boot' && <BootScreen />}
      {screen === 'menu' && <MenuScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'ending' && <EndingScreen />}
    </div>
  )
}

