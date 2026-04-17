export const POINTS = {
  // Questions
  ASK_QUESTION: 5,
  FIRST_QUESTION_OF_DAY: 10,
  
  // Answers
  POST_ANSWER: 10,
  ANSWER_ACCEPTED: 25,
  
  // Voting
  RECEIVE_UPVOTE: 2,
  GIVE_UPVOTE: 1,
  
  // Streaks
  DAILY_LOGIN_BASE: 5,
  DAILY_LOGIN_MAX: 50,
  
  // Profile & Social
  COMPLETE_PROFILE: 20,
  JOIN_GROUP: 5,
  CREATE_GROUP: 10,
  FOLLOW_USER: 1,
  
  // Polls
  CREATE_POLL: 5,
  VOTE_IN_POLL: 2,
  
  // Comments
  POST_COMMENT: 2,
} as const

export const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 100 },
  { level: 2, minPoints: 101, maxPoints: 300 },
  { level: 3, minPoints: 301, maxPoints: 600 },
  { level: 4, minPoints: 601, maxPoints: 1000 },
  { level: 5, minPoints: 1001, maxPoints: 1500 },
  { level: 6, minPoints: 1501, maxPoints: 2100 },
  { level: 7, minPoints: 2101, maxPoints: 2800 },
  { level: 8, minPoints: 2801, maxPoints: 3600 },
  { level: 9, minPoints: 3601, maxPoints: 4500 },
  { level: 10, minPoints: 4501, maxPoints: 5500 },
] as const

export function calculateLevel(points: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      // For levels beyond 10, add 500 per level
      if (i === LEVELS.length - 1 && points > LEVELS[i].maxPoints) {
        return 10 + Math.floor((points - LEVELS[i].maxPoints) / 500)
      }
      return LEVELS[i].level
    }
  }
  return 1
}

export function getLevelProgress(points: number): { current: number; max: number; percentage: number } {
  const level = calculateLevel(points)
  
  if (level >= 10) {
    const basePoints = 5500
    const pointsPerLevel = 500
    const levelStart = basePoints + (level - 10) * pointsPerLevel
    const levelEnd = levelStart + pointsPerLevel
    const current = points - levelStart
    return {
      current,
      max: pointsPerLevel,
      percentage: Math.min((current / pointsPerLevel) * 100, 100),
    }
  }
  
  const levelData = LEVELS.find((l) => l.level === level)!
  const current = points - levelData.minPoints
  const max = levelData.maxPoints - levelData.minPoints
  
  return {
    current,
    max,
    percentage: Math.min((current / max) * 100, 100),
  }
}

export function getStreakBonus(streakDays: number): number {
  return Math.min(POINTS.DAILY_LOGIN_BASE * streakDays, POINTS.DAILY_LOGIN_MAX)
}
