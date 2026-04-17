import type { BadgeTier, BadgeRequirementType } from '../models/badge'

export interface BadgeDefinition {
  name: string
  description: string
  icon: string
  tier: BadgeTier
  requirement: {
    type: BadgeRequirementType
    threshold: number
  }
  pointsAwarded: number
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Participation Badges
  {
    name: 'First Steps',
    description: 'Ask your first question',
    icon: 'message-circle-question',
    tier: 'bronze',
    requirement: { type: 'questions_asked', threshold: 1 },
    pointsAwarded: 10,
  },
  {
    name: 'Helping Hand',
    description: 'Post your first answer',
    icon: 'hand-helping',
    tier: 'bronze',
    requirement: { type: 'answers_posted', threshold: 1 },
    pointsAwarded: 10,
  },
  {
    name: 'Curious Mind',
    description: 'Ask 10 questions',
    icon: 'brain',
    tier: 'silver',
    requirement: { type: 'questions_asked', threshold: 10 },
    pointsAwarded: 25,
  },
  {
    name: 'Scholar',
    description: 'Post 25 answers',
    icon: 'graduation-cap',
    tier: 'silver',
    requirement: { type: 'answers_posted', threshold: 25 },
    pointsAwarded: 25,
  },
  {
    name: 'Theologian',
    description: 'Have 10 accepted answers',
    icon: 'book-open',
    tier: 'gold',
    requirement: { type: 'accepted_answers', threshold: 10 },
    pointsAwarded: 50,
  },
  {
    name: 'Elder',
    description: 'Reach Level 10',
    icon: 'crown',
    tier: 'platinum',
    requirement: { type: 'level_reached', threshold: 10 },
    pointsAwarded: 100,
  },
  
  // Streak Badges
  {
    name: 'Faithful',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    tier: 'bronze',
    requirement: { type: 'streak_days', threshold: 7 },
    pointsAwarded: 15,
  },
  {
    name: 'Dedicated',
    description: 'Maintain a 30-day streak',
    icon: 'flame',
    tier: 'silver',
    requirement: { type: 'streak_days', threshold: 30 },
    pointsAwarded: 50,
  },
  {
    name: 'Devoted',
    description: 'Maintain a 100-day streak',
    icon: 'flame',
    tier: 'gold',
    requirement: { type: 'streak_days', threshold: 100 },
    pointsAwarded: 100,
  },
  
  // Community Badges
  {
    name: 'Peacemaker',
    description: 'Join 5 groups',
    icon: 'users',
    tier: 'bronze',
    requirement: { type: 'groups_joined', threshold: 5 },
    pointsAwarded: 15,
  },
  {
    name: 'Shepherd',
    description: 'Create a group with 10+ members',
    icon: 'user-plus',
    tier: 'silver',
    requirement: { type: 'groups_created', threshold: 1 },
    pointsAwarded: 30,
  },
  {
    name: 'Influencer',
    description: 'Have 50 followers',
    icon: 'star',
    tier: 'gold',
    requirement: { type: 'followers', threshold: 50 },
    pointsAwarded: 50,
  },
]

export const BADGE_TIER_COLORS = {
  bronze: 'bg-bronze text-bronze-foreground',
  silver: 'bg-silver text-silver-foreground',
  gold: 'bg-gold text-gold-foreground',
  platinum: 'bg-platinum text-platinum-foreground',
} as const

export const BADGE_TIER_STYLES = {
  bronze: {
    bg: 'bg-amber-700/20',
    border: 'border-amber-700/30',
    text: 'text-amber-800 dark:text-amber-300',
    icon: 'text-amber-700 dark:text-amber-400',
  },
  silver: {
    bg: 'bg-slate-400/20',
    border: 'border-slate-400/30',
    text: 'text-slate-700 dark:text-slate-300',
    icon: 'text-slate-600 dark:text-slate-400',
  },
  gold: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  platinum: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/30',
    text: 'text-violet-700 dark:text-violet-300',
    icon: 'text-violet-600 dark:text-violet-400',
  },
} as const
