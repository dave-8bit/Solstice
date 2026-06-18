

import { useGame } from './context/GameContext'

import BootScreen from './pages/BootScreen'
import MenuScreen from './pages/MenuScreen'
import GameScreen from './pages/GameScreen'
import EndingScreen from './pages/EndingScreen'

export default function App() {
  const { state } = useGame()

  const screen = state.screen

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0a0a0a',
        position: 'relative',
      }}
    >
      {screen === 'boot' && <BootScreen />}
      {screen === 'menu' && <MenuScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'ending' && <EndingScreen />}
    </div>
  )
}

