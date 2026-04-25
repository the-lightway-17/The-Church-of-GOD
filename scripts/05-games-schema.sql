-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('scripture_scenario', 'trivia', 'commentary', 'verse_matching')),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')) DEFAULT 'medium',
  category TEXT DEFAULT 'general',
  question_text TEXT NOT NULL,
  content JSONB NOT NULL, -- Stores game-specific content (options, correct answer, commentary, etc.)
  points_on_complete INTEGER DEFAULT 10,
  points_on_perfect INTEGER DEFAULT 25,
  is_active BOOLEAN DEFAULT TRUE,
  daily_challenge BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_attempts table (tracks user attempts)
CREATE TABLE IF NOT EXISTS game_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answer JSONB,
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_leaderboard table (cached leaderboard stats)
CREATE TABLE IF NOT EXISTS game_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_games_played INTEGER DEFAULT 0,
  total_games_won INTEGER DEFAULT 0,
  total_game_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  average_score NUMERIC DEFAULT 0,
  last_game_at TIMESTAMP WITH TIME ZONE,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_achievements table (special badges from games)
CREATE TABLE IF NOT EXISTS game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_emoji TEXT,
  requirement_type TEXT CHECK (requirement_type IN ('wins', 'perfect_score', 'streak', 'difficulty', 'games_played')),
  requirement_value INTEGER,
  points_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_game_achievements table (tracks earned achievements)
CREATE TABLE IF NOT EXISTS user_game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES game_achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_games_type ON games(type);
CREATE INDEX IF NOT EXISTS idx_games_difficulty ON games(difficulty);
CREATE INDEX IF NOT EXISTS idx_games_daily_challenge ON games(daily_challenge);
CREATE INDEX IF NOT EXISTS idx_game_attempts_user_id ON game_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_game_attempts_game_id ON game_attempts(game_id);
CREATE INDEX IF NOT EXISTS idx_game_attempts_created_at ON game_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_leaderboard_rank ON game_leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_user_game_achievements_user_id ON user_game_achievements(user_id);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_achievements ENABLE ROW LEVEL SECURITY;

-- Games RLS policies
CREATE POLICY "Games are viewable by everyone" 
  ON games FOR SELECT 
  USING (is_active = TRUE);

CREATE POLICY "Only authenticated users can insert game attempts" 
  ON game_attempts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game attempts" 
  ON game_attempts FOR SELECT 
  USING (auth.uid() = user_id OR game_id IN (SELECT id FROM games WHERE is_active = TRUE));

CREATE POLICY "Game leaderboard is public" 
  ON game_leaderboard FOR SELECT 
  USING (TRUE);

CREATE POLICY "Achievements are viewable by everyone" 
  ON game_achievements FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can view earned achievements" 
  ON user_game_achievements FOR SELECT 
  USING (TRUE);
