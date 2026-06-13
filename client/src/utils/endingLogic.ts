export function evaluateEnding(
  puzzlesCompleted: number[],
  flags: Record<string, string>,
  gameTime: number
): 'A' | 'B' | 'C' {
  void flags

  if (puzzlesCompleted.length >= 4 && gameTime < 420) return 'A'
  if (puzzlesCompleted.length >= 3 && gameTime < 540) return 'B'
  return 'C'
}

