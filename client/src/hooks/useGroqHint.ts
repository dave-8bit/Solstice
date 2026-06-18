import { useState, useCallback } from 'react';

export function useGroqHint() {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHint = useCallback(
    async (cipherType: string, encryptedMessage: string, plaintext: string, solsticeDecay: number) => {
      const safeDecay = Number.isFinite(solsticeDecay) ? solsticeDecay : 0

      setLoading(true);

      setError(null);

      try {
        const res = await fetch('/api/ai/hint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cipherType, encryptedMessage, plaintext, solsticeDecay: safeDecay }),

        });


        if (!res.ok) {
          throw new Error('Request failed');
        }

        const data = await res.json();
        setHint(data?.hint ?? null);
      } catch {
        setError('HINT UNAVAILABLE — CONSULT YOUR MEMORY');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { hint, loading, error, fetchHint };
}

