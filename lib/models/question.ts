import mongoose, { Schema, Document, Model } from 'mongoose'

export type QuestionCategory = 'theological' | 'practical' | 'historical' | 'devotional'

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  title: string
  content: string
  bibleReferences: string[]
  tags: string[]
  category: QuestionCategory
  upvotes: mongoose.Types.ObjectId[]
  downvotes: mongoose.Types.ObjectId[]
  answerCount: number
  viewCount: number
  isPinned: boolean
  isClosed: boolean
  acceptedAnswerId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    bibleReferences: [{ type: String }],
    tags: [{ type: String }],
    category: {
      type: String,
      enum: ['theological', 'practical', 'historical', 'devotional'],
      default: 'theological',
    },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    answerCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    acceptedAnswerId: { type: Schema.Types.ObjectId, ref: 'Answer' },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
QuestionSchema.index({ authorId: 1 })
QuestionSchema.index({ category: 1 })
QuestionSchema.index({ tags: 1 })
QuestionSchema.index({ createdAt: -1 })
QuestionSchema.index({ title: 'text', content: 'text' })

// Virtual for vote score
QuestionSchema.virtual('voteScore').get(function () {
  return this.upvotes.length - this.downvotes.length
})

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema)

export default Question
