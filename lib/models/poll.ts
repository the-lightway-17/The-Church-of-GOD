import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPollOption {
  text: string
  votes: mongoose.Types.ObjectId[]
}

export interface IPoll extends Document {
  _id: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  groupId?: mongoose.Types.ObjectId
  question: string
  options: IPollOption[]
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PollOptionSchema = new Schema<IPollOption>({
  text: { type: String, required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

const PollSchema = new Schema<IPoll>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
    question: { type: String, required: true, maxlength: 300 },
    options: [PollOptionSchema],
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
)

// Indexes
PollSchema.index({ authorId: 1 })
PollSchema.index({ groupId: 1 })
PollSchema.index({ createdAt: -1 })
PollSchema.index({ expiresAt: 1 })

const Poll: Model<IPoll> =
  mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema)

export default Poll
