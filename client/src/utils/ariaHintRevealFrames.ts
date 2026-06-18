import type { ARIAState } from './ariaState'

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function splitIntoWordsPreserveSpaces(text: string): string[] {
  const tokens = text.match(/\s+|\S+/g)
  return tokens ?? []
}

export type RevealFrame = { text: string }

export async function* revealHintFramesByARIA(
  aria: ARIAState,
  hint: string,
  opts?: { signal?: AbortSignal }
): AsyncGenerator<RevealFrame, void, void> {
  const { signal } = opts ?? {}

  const guard = () => {
    if (signal?.aborted) {
      throw new Error('aborted')
    }
  }

  if (aria.tone === 'stable') {
    guard()
    yield { text: hint }
    return
  }

  if (aria.tone === 'hesitant') {
    const delay = 300 + Math.floor(Math.random() * 401) // 300–700
    await sleep(delay)
    guard()
    yield { text: hint }
    return
  }

  if (aria.tone === 'fragmented') {
    const words = splitIntoWordsPreserveSpaces(hint)
    let built = ''
    for (let i = 0; i < words.length; i++) {
      guard()
      built += words[i]
      // chunked reveal for performance
      if (i % 2 === 0) {
        yield { text: built }
      }
      await sleep(45 + Math.floor(Math.random() * 55))
    }
    guard()
    yield { text: hint }
    return
  }

  // corrupted
  const words = splitIntoWordsPreserveSpaces(hint)
  const partialCount = Math.max(1, Math.floor(words.length * 0.35))
  let partial = ''
  for (let i = 0; i < partialCount; i++) partial += words[i]

  // garble partial
  const corrupted = partial
    .split('')
    .map((ch, idx) => {
      if (idx % 7 === 0 && ch !== ' ') return '░'
      if (idx % 11 === 0 && ch !== ' ') return '▓'
      return ch
    })
    .join('')


  guard()
  yield { text: corrupted }
  await sleep(220 + Math.floor(Math.random() * 220))
  guard()
  yield { text: hint }
}

