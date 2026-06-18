import type { ARIAState } from './ariaState'

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function splitIntoWordsPreserveSpaces(text: string): string[] {
  // Keep spaces as separate tokens so we can rebuild accurately.
  const tokens = text.match(/\s+|\S+/g)
  return tokens ?? []
}

/**
 * UI-only adaptive reveal.
 * Returns an already-built string for the current frame.
 */
export async function revealHintByARIA(
  aria: ARIAState,
  hint: string,
  opts?: { signal?: AbortSignal }
): Promise<{ final: string }> {
  const { signal } = opts ?? {}

  if (signal?.aborted) return { final: '' }

  if (aria.tone === 'stable') {
    return { final: hint }
  }

  if (aria.tone === 'hesitant') {
    const delay = 300 + Math.floor(Math.random() * 401) // 300–700
    await sleep(delay)
    if (signal?.aborted) return { final: '' }
    return { final: hint }
  }

  if (aria.tone === 'fragmented') {
    const words = splitIntoWordsPreserveSpaces(hint)
    let built = ''
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) return { final: '' }
      built += words[i]
      // small delay per word/token
      await sleep(45 + Math.floor(Math.random() * 55)) // ~45–100ms

      // Reveal in chunks; avoid too many frames.
      if (i % 10 === 9) {
        // allow time for React paint
        if (signal?.aborted) return { final: '' }
      }
    }
    return { final: built }
  }

  // corrupted
  // Simulate partial reveal then correction.
  const words = splitIntoWordsPreserveSpaces(hint)
  const partialCount = Math.max(1, Math.floor(words.length * 0.35))
  let partial = ''
  for (let i = 0; i < partialCount; i++) partial += words[i]

  // Return partial first? Caller controls frames; here we only return final.
  // We'll mimic UI-only corruption by returning a lightly truncated final when 'corrupted'
  // is used with caller's own intermediate state.
  // For simplicity & safety, final still equals the real hint.
  return { final: partial ? hint : hint }
}

