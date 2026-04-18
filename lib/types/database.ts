export interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  points: number
  level: number
  streak_days: number
  last_active_date: string | null
  questions_count: number
  answers_count: number
  best_answers_count: number
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  bible_references: string[]
  vote_count: number
  answer_count: number
  view_count: number
  is_answered: boolean
  accepted_answer_id: string | null
  status: 'open' | 'closed' | 'answered'
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export interface Answer {
  id: string
  question_id: string
  user_id: string
  content: string
  bible_references: string[]
  vote_count: number
  is_accepted: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export interface Comment {
  id: string
  user_id: string
  question_id: string | null
  answer_id: string | null
  content: string
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export interface Vote {
  id: string
  user_id: string
  question_id: string | null
  answer_id: string | null
  vote_type: -1 | 1
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string | null
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  category: 'participation' | 'streak' | 'community' | 'special'
  requirement_type: string | null
  requirement_value: number | null
  points_reward: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  // Joined fields
  badge?: Badge
}

export interface Group {
  id: string
  name: string
  description: string | null
  image_url: string | null
  owner_id: string
  member_count: number
  is_private: boolean
  tags: string[]
  created_at: string
  updated_at: string
  // Joined fields
  owner?: Profile
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: 'owner' | 'admin' | 'moderator' | 'member'
  joined_at: string
  // Joined fields
  user?: Profile
}

export interface Discussion {
  id: string
  group_id: string
  user_id: string
  title: string
  content: string
  reply_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export interface DiscussionReply {
  id: string
  discussion_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export interface Poll {
  id: string
  user_id: string
  question: string
  options: { text: string; votes: number }[]
  bible_reference: string | null
  total_votes: number
  ends_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export interface PollVote {
  id: string
  poll_id: string
  user_id: string
  option_index: number
  created_at: string
}

export interface DailyVerse {
  id: string
  verse_text: string
  reference: string
  reflection: string | null
  date: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'answer' | 'comment' | 'vote' | 'badge' | 'follow' | 'mention' | 'accepted_answer'
  title: string
  message: string | null
  link: string | null
  is_read: boolean
  actor_id: string | null
  created_at: string
  // Joined fields
  actor?: Profile
}

export interface Follower {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  // Joined fields
  follower?: Profile
  following?: Profile
}

export interface Bookmark {
  id: string
  user_id: string
  question_id: string | null
  answer_id: string | null
  created_at: string
  // Joined fields
  question?: Question
  answer?: Answer
}
