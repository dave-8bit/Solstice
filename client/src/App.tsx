import React from 'react'

export default function App() {
  const styles: Record<string, React.CSSProperties> = {
    root: {
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    glow: {
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(circle at center, rgba(0, 255, 65, 0.18) 0%, rgba(0, 255, 65, 0.10) 22%, rgba(0, 255, 65, 0.05) 45%, rgba(10, 10, 10, 0) 70%)',
      pointerEvents: 'none',
    },
    card: {
      position: 'relative',
      zIndex: 1,
      background: 'rgba(0, 255, 65, 0.05)',
      border: '1px solid rgba(0, 255, 65, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '3rem 4rem',
      boxSizing: 'border-box',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
    line1: {
      fontSize: '2rem',
      color: '#00ff41',
      letterSpacing: '0.2em',
      fontFamily: "'Courier New', monospace",
      textShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
      whiteSpace: 'nowrap',
    },
    line2: {
      fontSize: '1rem',
      color: '#008f11',
      fontFamily: "'Courier New', monospace",
      whiteSpace: 'nowrap',
    },
    cursor: {
      color: '#ffb000',
      display: 'inline-block',
      width: '0.6ch',
      marginLeft: '2px',
      animation: 'solsticeBlink 1s steps(2, end) infinite',
    },
  }

  return (
    <div style={styles.root}>
      <style>
        {`@keyframes solsticeBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}
      </style>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.line1}>SOLSTICE // TURING</div>
        <div style={styles.line2}>
          SYSTEM INITIALIZING...
          <span style={styles.cursor} aria-hidden="true">
            ▋
          </span>
        </div>
      </div>
    </div>
  )
}

