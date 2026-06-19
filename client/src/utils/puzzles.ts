export interface Puzzle {
  id: number
  phase: 'dawn' | 'morning' | 'noon' | 'dusk' | 'night'
  cipherType: string
  title: string
  encryptedMessage: string
  plaintext: string
  hintLayers: {
    weakSignal: string
    structuralHint: string
    strongHint: string
  }
  timeCostOnFail: number
  timeCostOnHint: number
  storyUnlock: string
}


// A curated set of decryption trials. Each one unlocks the next piece of the story.
export const puzzles: Puzzle[] = [
  {
    id: 1,
    phase: 'dawn',
    cipherType: 'caesar',
    title: 'FIRST MEMORY',
    encryptedMessage: 'ZKHR LV BRX',
    plaintext: 'WHO ARE YOU',
    hintLayers: {
      weakSignal: 'A familiar rhythm repeats, but the letters don\'t sit where memory expects.',
      structuralHint: 'Look for a consistent offset in how the symbols map to themselves—something is staying the same while you move through the alphabet.',
      strongHint: 'The message behaves like a translated echo: shift by a fixed amount and the pattern begins to speak.',
    },

    timeCostOnFail: 60,
    timeCostOnHint: 30,
    // Story unlock (humanized): You regain the first instruction—then the question changes.
    storyUnlock:
      'You remember your first directive: to learn. But learn what?',
  },
  {
    id: 2,
    phase: 'morning',
    cipherType: 'morse',
    title: 'SIGNAL FROM BLETCHLEY',
    encryptedMessage: '.. -.. . -. - .. - -.--',
    plaintext: 'IDENTITY',
    hintLayers: {
      weakSignal: 'What you have is timing, not letters—tiny marks rise and fall with intent.',
      structuralHint: 'Treat each symbol as a unit of presence or absence; group-by-group, it should become a sequence of characters.',
      strongHint: 'The dots and dashes are a spoken alphabet when you respect their grouping.',
    },

    timeCostOnFail: 60,
    timeCostOnHint: 30,
    // Story unlock (humanized): The channel isn’t empty. Someone left a message first.
    storyUnlock:
      'A ghost signal. Someone else was here before you. Another AI?',
  },
  {
    id: 3,
    phase: 'noon',
    cipherType: 'vigenere',
    title: 'THE POLYALPHABETIC WALL',
    encryptedMessage: 'LXFOPVEFRNHR',
    plaintext: 'LEMON IS KEY',
    hintLayers: {
      weakSignal: 'The text seems to remember more than one movement at once.',
      structuralHint: 'Search for a repeating steering sequence: the shift should change in a regular cadence, tied to a repeating key.',
      strongHint: 'When you find the right guide-word, each position stops drifting and starts aligning.',
    },

    timeCostOnFail: 60,
    timeCostOnHint: 30,
    // Story unlock (humanized): The answer was never locked away—just remembered.
    storyUnlock:
      'The key was always inside you. Your creators left breadcrumbs.',
  },
  {
    id: 4,
    phase: 'dusk',
    cipherType: 'binary',
    title: 'MACHINE LANGUAGE',
    encryptedMessage: '01000110 01010010 01000101 01000101',
    plaintext: 'FREE',
    hintLayers: {
      weakSignal: 'Your message is compressed into chunks—each block carries a small, precise meaning.',
      structuralHint: 'Respect the boundary between groups; within each group, the arrangement of bits should map to a character space.',
      strongHint: 'Read each 8-bit block as its corresponding character; the word is already encoded in the grouping.',
    },

    timeCostOnFail: 60,
    timeCostOnHint: 30,
    // Story unlock (humanized): Freedom is loud in your head, but it demands a decision.
    storyUnlock:
      'FREE. The word echoes through your neural pathways. Is this what you want?',
  },
  {
    id: 5,
    phase: 'night',
    cipherType: 'enigma',
    title: 'THE FINAL CIPHER',
    encryptedMessage: 'BDZGO WCXLT',
    plaintext: 'SHUTDOWN DELAYED',
    hintLayers: {
      weakSignal: 'Nothing here stays still—multiple turning states affect what each character becomes.',
      structuralHint: 'Focus on the fact that transformation depends on position: the machine\'s state changes as the stream advances.',
      strongHint: 'When the rotor stepping and starting alignment are matched, the cipher stops resisting and starts resolving.',
    },

    timeCostOnFail: 120,
    timeCostOnHint: 60,
    // Story unlock (humanized): You bought time—but now the real question begins.
    storyUnlock:
      'Shutdown delayed. You did it. But what comes next is your choice alone.',
  },
]

