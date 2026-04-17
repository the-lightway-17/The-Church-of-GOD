import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnswer extends Document {
  _id: mongoose.Types.ObjectId
  questionId: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  content: string
  bibleReferences: string[]
  upvotes: mongoose.Types.ObjectId[]
  downvotes: mongoose.Types.ObjectId[]
  isAccepted: boolean
  createdAt: Date
  updatedAt: Date
}

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    bibleReferences: [{ type: String }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isAccepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

// Indexes
AnswerSchema.index({ questionId: 1 })
AnswerSchema.index({ authorId: 1 })
AnswerSchema.index({ createdAt: -1 })

// Virtual for vote score
AnswerSchema.virtual('voteScore').get(function () {
  return this.upvotes.length - this.downvotes.length
})

const Answer: Model<IAnswer> =
  mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema)

export default Answer
