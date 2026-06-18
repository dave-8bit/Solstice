import { useState, useCallback } from 'react';

type HintResponse = { hint: string };

export function useGroqHint() {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHint = useCallback(
    async (cipherType: string, encryptedMessage: string, plaintext: string, solsticeDecay: number) => {
      const safeDecay = Number.isFinite(solsticeDecay) ? solsticeDecay : 0;
      const payload = { cipherType, encryptedMessage, plaintext, solsticeDecay: safeDecay };

      setLoading(true);
      setError(null);

      try {
        console.log('[HINT REQUEST]', { payload, endpoint: '/api/ai/hint' });

        const res = await fetch('/api/ai/hint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const responseJson: unknown = await res.json();
        console.log('[HINT RESPONSE]', responseJson);

        if (!res.ok) {
          throw new Error('Request failed');
        }

        // Critical parsing contract: backend response is { hint: string }
        const data = responseJson as Partial<HintResponse>;
        const parsedHint = typeof data?.hint === 'string' ? data.hint : null;
        console.log('[HINT PARSED]', parsedHint);

        if (parsedHint === null) {
          throw new Error('Invalid hint payload');
        }

        setHint(parsedHint);
      } catch (err) {
        console.error('[HINT ERROR]', err);
        setHint(null);
        setError('HINT UNAVAILABLE — CONSULT YOUR MEMORY');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { hint, loading, error, fetchHint };
}

