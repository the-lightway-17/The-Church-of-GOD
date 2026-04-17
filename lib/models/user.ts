import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INotification {
  type: 'badge' | 'answer' | 'upvote' | 'follow' | 'mention' | 'accepted' | 'welcome'
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  image?: string
  bio?: string
  points: number
  level: number
  streakDays: number
  lastActiveDate?: Date
  badges: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  followers: mongoose.Types.ObjectId[]
  groups: mongoose.Types.ObjectId[]
  savedQuestions: mongoose.Types.ObjectId[]
  notifications: INotification[]
  preferences: {
    theme: 'light' | 'dark' | 'system'
    emailNotifications: boolean
    pushNotifications: boolean
  }
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>({
  type: {
    type: String,
    enum: ['badge', 'answer', 'upvote', 'follow', 'mention', 'accepted', 'welcome'],
    required: true,
  },
  message: { type: String, required: true },
  link: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    bio: { type: String, default: '' },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    savedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    notifications: [NotificationSchema],
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
    },
    emailVerified: { type: Date },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
UserSchema.index({ email: 1 })
UserSchema.index({ points: -1 })
UserSchema.index({ name: 'text', bio: 'text' })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
