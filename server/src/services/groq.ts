import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateHint(
  cipherType: string,
  encryptedMessage: string,
  plaintext: string
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      max_tokens: 120,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are ARIA, an experimental AI in a narrative puzzle game. Give a cryptic but helpful hint for decoding a cipher. Be mysterious, poetic, and brief. Never reveal the answer directly. Max 2 sentences.',
        },
        {
          role: 'user',
          content: `The cipher type is ${cipherType}. The encrypted message is: ${encryptedMessage}. Give me a hint without revealing the answer.`,
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
      model: 'llama3-70b-8192',
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

