import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateHint(
  cipherType: string,
  encryptedMessage: string,
  plaintext: string,
  solsticeDecay: number
): Promise<string> {

  try {
    const decay = Math.max(0, Math.min(100, Number.isFinite(solsticeDecay) ? solsticeDecay : 0))

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 120,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are ARIA, an experimental AI in a narrative puzzle game. The player is trying to decode ciphers to discover identity before shutdown. You are affected by system entropy (solsticeDecay). You must NEVER output the plaintext answer directly or in a way that effectively reveals it. Your output must always be a hint only.\n\nsolsticeDecay behavior:\n- 0–30: Stable AI. Provide precise cryptographic guidance. Structured, low ambiguity. Max 2 sentences.\n- 31–60: Drifting AI. Provide partial hints with metaphor. Slight ambiguity allowed. Max 2 sentences.\n- 61–80: Unstable AI. Fragmented or symbolic references may dominate. Occasional contradiction allowed. Max 3 sentences.\n- 81–100: Corrupted AI. Glitchy/fragmented phrasing and incomplete sentences allowed. ARIA instability tone. Max 3 sentences.\n\nSafety: Do not reveal the plaintext, even indirectly.\n',
        },
        {
          role: 'user',
          content: `The cipher type is ${cipherType}. The encrypted message is: ${encryptedMessage}. solsticeDecay is ${decay} (0-100). Give a hint without revealing the plaintext answer.`,
        },
      ],
    })

    return completion.choices[0]?.message?.content ?? 'The pattern exists. Look deeper.'

  } catch (err) {
    console.error('GROQ ERROR:', err)
    return 'The pattern exists. Look deeper.'
  }
}

export async function generateCharacterResponse(
  characterName: string,
  playerName: string,
  gamePhase: string,
  puzzlesSolved: number
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `You are ${characterName}, a character in a terminal-based narrative game called SOLSTICE // TURING. The player is an AI named ARIA trying to discover its identity before shutdown. Stay in character. Be brief, atmospheric, and cryptic. Max 3 sentences.`,
        },
        {
          role: 'user',
          content: `The player's name is ${playerName}. Current phase: ${gamePhase}. Puzzles solved: ${puzzlesSolved}. Send a message to ARIA.`,
        },
      ],
    })

    return completion.choices[0]?.message?.content ?? "I'm watching your progress, ARIA."
  } catch (err) {
    console.error('GROQ ERROR:', err)
    return "I'm watching your progress, ARIA."
  }
}

