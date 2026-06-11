export type GamePhase = 'dawn' | 'morning' | 'noon' | 'dusk' | 'night';

export type EndingType = 'A' | 'B' | 'C' | null;

export interface Session {
  id: string;
  playerName: string;
  gameTime: number;
  currentPhase: GamePhase;
  isComplete: boolean;
  ending: EndingType;
  createdAt: string;
  lastActive: string;
}

export interface Decision {
  id: number;
  sessionId: string;
  decisionKey: string;
  decisionVal: string;
  madeAt: string;
}

export interface PuzzleCompletion {
  id: number;
  sessionId: string;
  puzzleId: number;
  solved: boolean;
  hintsUsed: number;
  timeSpent: number;
  completedAt: string;
}

export interface GlobalStat {
  statKey: string;
  statValue: number;
}

