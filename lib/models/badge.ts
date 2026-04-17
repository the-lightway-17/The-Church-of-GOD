import mongoose, { Schema, Document, Model } from 'mongoose'

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type BadgeRequirementType =
  | 'questions_asked'
  | 'answers_posted'
  | 'accepted_answers'
  | 'upvotes_received'
  | 'streak_days'
  | 'groups_joined'
  | 'groups_created'
  | 'followers'
  | 'level_reached'
  | 'polls_created'
  | 'profile_completed'

export interface IBadge extends Document {
  _id: mongoose.Types.ObjectId
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

const BadgeSchema = new Schema<IBadge>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    required: true,
  },
  requirement: {
    type: { type: String, required: true },
    threshold: { type: Number, required: true },
  },
  pointsAwarded: { type: Number, default: 10 },
})

const Badge: Model<IBadge> =
  mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema)

export default Badge
