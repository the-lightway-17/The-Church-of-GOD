import connectToDatabase from './db'
import User, { IUser } from './models/user'
import Badge from './models/badge'
import Question from './models/question'
import Answer from './models/answer'
import Group from './models/group'
import { POINTS, calculateLevel } from './constants/points'
import { BADGE_DEFINITIONS, type BadgeDefinition } from './constants/badges'

export async function awardPoints(
  userId: string,
  action: keyof typeof POINTS,
  multiplier: number = 1
): Promise<{ newPoints: number; newLevel: number; leveledUp: boolean }> {
  await connectToDatabase()
  
  const points = POINTS[action] * multiplier
  const user = await User.findById(userId)
  
  if (!user) {
    throw new Error('User not found')
  }
  
  const oldLevel = user.level
  user.points += points
  user.level = calculateLevel(user.points)
  
  await user.save()
  
  const leveledUp = user.level > oldLevel
  
  if (leveledUp) {
    // Add notification for level up
    user.notifications.push({
      type: 'badge',
      message: `Congratulations! You've reached Level ${user.level}!`,
      read: false,
      createdAt: new Date(),
    })
    await user.save()
  }
  
  return {
    newPoints: user.points,
    newLevel: user.level,
    leveledUp,
  }
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeDefinition[]> {
  await connectToDatabase()
  
  const user = await User.findById(userId).populate('badges')
  if (!user) return []
  
  const earnedBadges: BadgeDefinition[] = []
  const userBadgeNames = new Set((user.badges as unknown as { name: string }[]).map((b) => b.name))
  
  // Get user stats
  const [questionsCount, answersCount, acceptedAnswersCount, groupsJoinedCount] = await Promise.all([
    Question.countDocuments({ authorId: userId }),
    Answer.countDocuments({ authorId: userId }),
    Answer.countDocuments({ authorId: userId, isAccepted: true }),
    Group.countDocuments({ members: userId }),
  ])
  
  const stats: Record<string, number> = {
    questions_asked: questionsCount,
    answers_posted: answersCount,
    accepted_answers: acceptedAnswersCount,
    streak_days: user.streakDays,
    groups_joined: groupsJoinedCount,
    followers: user.followers.length,
    level_reached: user.level,
  }
  
  for (const badgeDef of BADGE_DEFINITIONS) {
    // Skip if already earned
    if (userBadgeNames.has(badgeDef.name)) continue
    
    const statValue = stats[badgeDef.requirement.type] ?? 0
    
    if (statValue >= badgeDef.requirement.threshold) {
      // Award badge
      let badge = await Badge.findOne({ name: badgeDef.name })
      
      if (!badge) {
        badge = await Badge.create(badgeDef)
      }
      
      user.badges.push(badge._id)
      user.points += badgeDef.pointsAwarded
      user.level = calculateLevel(user.points)
      
      user.notifications.push({
        type: 'badge',
        message: `You earned the "${badgeDef.name}" badge! +${badgeDef.pointsAwarded} points`,
        read: false,
        createdAt: new Date(),
      })
      
      earnedBadges.push(badgeDef)
    }
  }
  
  if (earnedBadges.length > 0) {
    await user.save()
  }
  
  return earnedBadges
}

export async function getLeaderboard(limit: number = 10): Promise<IUser[]> {
  await connectToDatabase()
  
  return User.find()
    .select('name image points level streakDays badges')
    .sort({ points: -1 })
    .limit(limit)
    .lean()
}

export async function getUserRank(userId: string): Promise<number> {
  await connectToDatabase()
  
  const user = await User.findById(userId)
  if (!user) return -1
  
  const rank = await User.countDocuments({ points: { $gt: user.points } })
  return rank + 1
}

export async function updateStreak(userId: string): Promise<{ streakDays: number; bonusPoints: number }> {
  await connectToDatabase()
  
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  
  const now = new Date()
  const lastActive = user.lastActiveDate
  
  if (!lastActive) {
    user.streakDays = 1
    user.lastActiveDate = now
    await user.save()
    return { streakDays: 1, bonusPoints: POINTS.DAILY_LOGIN_BASE }
  }
  
  // Check if it's a new day
  const lastActiveDay = new Date(lastActive).setHours(0, 0, 0, 0)
  const today = new Date(now).setHours(0, 0, 0, 0)
  
  if (lastActiveDay === today) {
    // Same day, no streak update needed
    return { streakDays: user.streakDays, bonusPoints: 0 }
  }
  
  const diffDays = Math.floor((today - lastActiveDay) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    // Consecutive day
    user.streakDays += 1
  } else {
    // Streak broken
    user.streakDays = 1
  }
  
  user.lastActiveDate = now
  
  const bonusPoints = Math.min(POINTS.DAILY_LOGIN_BASE * user.streakDays, POINTS.DAILY_LOGIN_MAX)
  user.points += bonusPoints
  user.level = calculateLevel(user.points)
  
  await user.save()
  
  return { streakDays: user.streakDays, bonusPoints }
}
