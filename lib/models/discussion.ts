import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReply {
  authorId: mongoose.Types.ObjectId
  content: string
  createdAt: Date
}

export interface IDiscussion extends Document {
  _id: mongoose.Types.ObjectId
  groupId: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  title: string
  content: string
  replies: IReply[]
  createdAt: Date
  updatedAt: Date
}

const ReplySchema = new Schema<IReply>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const DiscussionSchema = new Schema<IDiscussion>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true },
    replies: [ReplySchema],
  },
  {
    timestamps: true,
  }
)

// Indexes
DiscussionSchema.index({ groupId: 1 })
DiscussionSchema.index({ authorId: 1 })
DiscussionSchema.index({ createdAt: -1 })

const Discussion: Model<IDiscussion> =
  mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema)

export default Discussion
