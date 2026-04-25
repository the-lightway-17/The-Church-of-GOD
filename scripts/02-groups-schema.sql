-- Groups table for community groups focused on Bible topics
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_emoji VARCHAR(10),
  category VARCHAR(100) NOT NULL, -- book-study, topical, prayer, theology, academic, commentary, pastoral, etc.
  cover_image_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 1,
  discussion_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE,
  rules TEXT,
  tags TEXT[] DEFAULT '{}'
);

-- Group memberships to track user participation
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT TRUE,
  UNIQUE(group_id, user_id)
);

-- Group discussions/topics specific to each group
CREATE TABLE IF NOT EXISTS group_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bible_passages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reply_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Replies to group discussions
CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES group_discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vote_count INTEGER DEFAULT 0
);

-- User interests/expertise areas for personalization
CREATE TABLE IF NOT EXISTS user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  expertise_level VARCHAR(50) DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
  UNIQUE(user_id, topic)
);

-- Activity tracking for leaderboard
CREATE TABLE IF NOT EXISTS leaderboard_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL, -- question_created, answer_submitted, answer_accepted, comment_created, discussion_started, etc.
  points INTEGER NOT NULL,
  group_id UUID REFERENCES groups(id),
  related_item_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time leaderboard stats
CREATE TABLE IF NOT EXISTS leaderboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  rank INTEGER,
  questions_asked INTEGER DEFAULT 0,
  answers_provided INTEGER DEFAULT 0,
  answers_accepted INTEGER DEFAULT 0,
  comments_made INTEGER DEFAULT 0,
  discussions_started INTEGER DEFAULT 0,
  groups_joined INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_groups_category ON groups(category);
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_discussions_group ON group_discussions(group_id);
CREATE INDEX idx_group_discussions_author ON group_discussions(author_id);
CREATE INDEX idx_discussion_replies_discussion ON discussion_replies(discussion_id);
CREATE INDEX idx_user_interests_user ON user_interests(user_id);
CREATE INDEX idx_leaderboard_activities_user ON leaderboard_activities(user_id);
CREATE INDEX idx_leaderboard_activities_created ON leaderboard_activities(created_at);

-- Enable RLS for security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups (public read, authenticated write)
CREATE POLICY "Groups are viewable by everyone" ON groups
  FOR SELECT USING (NOT is_private OR auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = groups.id
  ));

CREATE POLICY "Users can create groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" ON groups
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for group_members
CREATE POLICY "Group members viewable to group members" ON group_members
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM group_members WHERE group_id = group_id)
  );

CREATE POLICY "Users can join public groups" ON group_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    group_id IN (SELECT id FROM groups WHERE NOT is_private)
  );

-- RLS Policies for discussions
CREATE POLICY "Discussions viewable by group members" ON group_discussions
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM group_members WHERE group_id = group_discussions.group_id)
  );

CREATE POLICY "Users can create discussions in their groups" ON group_discussions
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  );

-- RLS Policies for leaderboard_stats (public read)
CREATE POLICY "Leaderboard stats are public" ON leaderboard_stats
  FOR SELECT USING (true);

-- Create a trigger function to update leaderboard stats on activity
CREATE OR REPLACE FUNCTION update_leaderboard_stats()
RETURNS TRIGGER AS $$
DECLARE
  point_value INTEGER;
BEGIN
  -- Determine point value based on activity type
  point_value := CASE NEW.activity_type
    WHEN 'question_created' THEN 5
    WHEN 'answer_submitted' THEN 10
    WHEN 'answer_accepted' THEN 25
    WHEN 'comment_created' THEN 2
    WHEN 'discussion_started' THEN 15
    WHEN 'discussion_reply' THEN 5
    ELSE 1
  END;

  -- Update or insert leaderboard stats
  INSERT INTO leaderboard_stats (user_id, total_points)
  VALUES (NEW.user_id, point_value)
  ON CONFLICT (user_id) DO UPDATE
  SET total_points = leaderboard_stats.total_points + point_value;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update leaderboard when activities are logged
CREATE TRIGGER trigger_update_leaderboard
AFTER INSERT ON leaderboard_activities
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_stats();
