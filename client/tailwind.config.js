/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0a0a0a',
        'terminal-green': '#00ff41',
        'terminal-dim': '#008f11',
        'terminal-amber': '#ffb000',
        'terminal-danger': '#ff3131',
        'terminal-white': '#e0e0e0',
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}


