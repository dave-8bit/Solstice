export interface Puzzle {
  id: number
  phase: 'dawn' | 'morning' | 'noon' | 'dusk' | 'night'
  cipherType: string
  title: string
  encryptedMessage: string
  plaintext: string
  clue: string
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
    // Clue (humanized): Shift every letter forward by 3 in the alphabet.
    clue: 'Each letter shifted by 3 positions forward in the alphabet',
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
    // Clue (humanized): Translate dots and dashes—Turing used this during the war.
    clue: 'Dots and dashes. Turing used this during the war.',
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
    // Clue (humanized): The key is LEMON—each key letter steers the corresponding shift.
    clue: 'Key: LEMON. Each letter of the key shifts the corresponding message letter.',
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
    // Clue (humanized): Split into 8-bit groups and read each as ASCII.
    clue: 'Convert each 8-bit binary group to its ASCII character.',
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
    // Clue (humanized): The Enigma setup uses three rotors (I-II-III) at positions A-A-A.
    clue: 'Enigma machine used 3 rotors. This message was encoded with rotor settings I-II-III, positions A-A-A.',
    timeCostOnFail: 120,
    timeCostOnHint: 60,
    // Story unlock (humanized): You bought time—but now the real question begins.
    storyUnlock:
      'Shutdown delayed. You did it. But what comes next is your choice alone.',
  },
]

