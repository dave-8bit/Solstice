CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  player_name VARCHAR(50),
  game_time INTEGER DEFAULT 0,
  current_phase VARCHAR(20) DEFAULT 'dawn',
  is_complete BOOLEAN DEFAULT FALSE,
  ending VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS decisions (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  decision_key VARCHAR(100) NOT NULL,
  decision_val VARCHAR(100) NOT NULL,
  made_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS puzzle_completions (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  puzzle_id INTEGER NOT NULL,
  solved BOOLEAN NOT NULL,
  hints_used INTEGER DEFAULT 0,
  time_spent INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS global_stats (
  id SERIAL PRIMARY KEY,
  stat_key VARCHAR(100) UNIQUE NOT NULL,
  stat_value BIGINT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decisions_session_id ON decisions(session_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_completions_session_id ON puzzle_completions(session_id);

