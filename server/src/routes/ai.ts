import { Router } from 'express'

import { generateCharacterResponse, generateHint } from '../services/groq'

export const aiRouter = Router()

aiRouter.post('/hint', async (req, res) => {
  try {
    const { cipherType, encryptedMessage, plaintext, solsticeDecay } = req.body as {
      cipherType?: string
      encryptedMessage?: string
      plaintext?: string
      solsticeDecay?: number
    }

    if (!cipherType || !encryptedMessage || !plaintext) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const decay = typeof solsticeDecay === 'number' ? solsticeDecay : 0

    const hint = await generateHint(cipherType, encryptedMessage, plaintext, decay)
    return res.status(200).json({ hint })
  } catch {
    return res.status(500).json({ error: 'Failed to generate hint' })
  }
})


aiRouter.post('/character', async (req, res) => {
  try {
    const { characterName, playerName, gamePhase, puzzlesSolved } = req.body as {
      characterName?: string
      playerName?: string
      gamePhase?: string
      puzzlesSolved?: number
    }

    if (!characterName || !playerName || !gamePhase || puzzlesSolved === undefined || puzzlesSolved === null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const response = await generateCharacterResponse(characterName, playerName, gamePhase, puzzlesSolved)
    return res.status(200).json({ response })
  } catch {
    return res.status(500).json({ error: 'Failed to generate response' })
  }
})

