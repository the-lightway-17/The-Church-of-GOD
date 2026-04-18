-- Seed badges data

INSERT INTO public.badges (id, name, description, icon, tier, category, points_reward) VALUES
-- Participation badges
('first-question', 'Curious Mind', 'Asked your first question', 'HelpCircle', 'bronze', 'participation', 10),
('ten-questions', 'Inquisitive', 'Asked 10 questions', 'MessageCircle', 'silver', 'participation', 25),
('fifty-questions', 'Scholar', 'Asked 50 questions', 'BookOpen', 'gold', 'participation', 50),
('first-answer', 'Helper', 'Posted your first answer', 'MessageSquare', 'bronze', 'participation', 10),
('ten-answers', 'Guide', 'Posted 10 answers', 'Users', 'silver', 'participation', 25),
('fifty-answers', 'Teacher', 'Posted 50 answers', 'GraduationCap', 'gold', 'participation', 50),
('first-accepted', 'Problem Solver', 'Had your first answer accepted', 'CheckCircle', 'bronze', 'quality', 15),
('ten-accepted', 'Trusted Voice', 'Had 10 answers accepted', 'Award', 'silver', 'quality', 40),
('fifty-accepted', 'Sage', 'Had 50 answers accepted', 'Crown', 'gold', 'quality', 100),

-- Streak badges
('week-streak', 'Dedicated', '7 day activity streak', 'Flame', 'bronze', 'streak', 20),
('month-streak', 'Committed', '30 day activity streak', 'Fire', 'silver', 'streak', 50),
('quarter-streak', 'Devoted', '90 day activity streak', 'Zap', 'gold', 'streak', 100),

-- Community badges
('first-group', 'Community Member', 'Joined your first group', 'Users', 'bronze', 'community', 5),
('group-creator', 'Community Builder', 'Created a study group', 'UserPlus', 'silver', 'community', 25),
('popular-group', 'Community Leader', 'Your group reached 50 members', 'Star', 'gold', 'community', 75),

-- Voting badges
('first-vote', 'Voter', 'Cast your first vote', 'ThumbsUp', 'bronze', 'voting', 5),
('hundred-votes', 'Active Voter', 'Cast 100 votes', 'Vote', 'silver', 'voting', 25),

-- Special badges
('early-adopter', 'Early Adopter', 'Joined during the first month', 'Sparkles', 'platinum', 'special', 50),
('top-contributor', 'Top Contributor', 'Reached the weekly leaderboard top 10', 'Trophy', 'gold', 'special', 100)
ON CONFLICT (id) DO NOTHING;

-- Seed some sample daily verses
INSERT INTO public.daily_verses (date, book, chapter, verse_start, verse_end, text, reflection) VALUES
(CURRENT_DATE, 'Philippians', 4, 13, NULL, 'I can do all things through Christ who strengthens me.', 'This verse reminds us that with faith, we can overcome any challenge. What obstacles are you facing today that you can surrender to God?'),
(CURRENT_DATE - INTERVAL '1 day', 'Proverbs', 3, 5, 6, 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', 'Sometimes we try to figure everything out on our own. This passage encourages us to trust God''s wisdom above our own limited perspective.'),
(CURRENT_DATE - INTERVAL '2 days', 'Psalm', 23, 1, 3, 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.', 'In the busyness of life, we often forget to rest. How can you allow God to restore your soul today?')
ON CONFLICT (date) DO NOTHING;
