-- Add missing profile statistics columns with default 0 values
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS questions_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS answers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS games_won INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS game_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS groups_joined INTEGER DEFAULT 0;

-- Ensure all existing profiles have default values
UPDATE profiles 
SET 
  questions_count = COALESCE(questions_count, 0),
  answers_count = COALESCE(answers_count, 0),
  comments_count = COALESCE(comments_count, 0),
  helpful_count = COALESCE(helpful_count, 0),
  games_played = COALESCE(games_played, 0),
  games_won = COALESCE(games_won, 0),
  game_score = COALESCE(game_score, 0),
  level = COALESCE(level, 1),
  badges = COALESCE(badges, ARRAY[]::TEXT[]),
  groups_joined = COALESCE(groups_joined, 0)
WHERE questions_count IS NULL
   OR answers_count IS NULL
   OR comments_count IS NULL
   OR helpful_count IS NULL
   OR games_played IS NULL
   OR games_won IS NULL
   OR game_score IS NULL
   OR level IS NULL
   OR badges IS NULL
   OR groups_joined IS NULL;
