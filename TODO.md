# TODO - Solstice strict sequential puzzle progression

## Layer 1: State enforcement
- [ ] Add `currentPuzzleIndex` (or equivalent) to `client/src/context/GameState.ts`
- [ ] Ensure `active puzzle` is derived from state in `client/src/pages/GameScreen.tsx` (no UI-driven selection)

## Layer 2: Reducer enforcement
- [ ] Update `client/src/context/gameReducer.ts` so `COMPLETE_PUZZLE` only works for the current active puzzle
- [ ] Advance exactly to the next puzzle id (Puzzle 1 -> 2 -> 3 -> 4 -> 5)
- [ ] Preserve `puzzlesCompleted` (no removing/overwriting)

## Layer 3: Data redaction (critical)
- [ ] Update `client/src/components/PuzzlePanel.tsx` to support `visibility` modes: current / completed / locked
- [ ] For locked puzzles, render only:
  - `[ LOCKED TRANSMISSION ]`
  - `SIGNAL UNAVAILABLE`
- [ ] Ensure locked puzzles never render puzzle `title`, `cipherType`, `encryptedMessage`, or `plaintext`
- [ ] Ensure future puzzle data is never passed into `PuzzlePanel` for locked puzzles

## UI gating (no skipping)
- [ ] Update `client/src/pages/GameScreen.tsx` inbox list:
  - completed: visible as completed, non-interactive
  - current: only active/interactable
  - future: locked placeholder only

## Verification
- [ ] Manually verify solving puzzles 1..5 unlocks strictly next puzzle
- [ ] Confirm future puzzle DOM/React tree never contains locked puzzle title/cipher/encrypted/answers
- [ ] Confirm hint + time + decay + story unlock still work

