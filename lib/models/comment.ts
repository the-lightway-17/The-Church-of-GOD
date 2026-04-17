import mongoose, { Schema, Document, Model } from 'mongoose'

export type ParentType = 'question' | 'answer'

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId
  parentType: ParentType
  parentId: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  content: string
  createdAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    parentType: {
      type: String,
      enum: ['question', 'answer'],
      required: true,
    },
    parentId: { type: Schema.Types.ObjectId, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
  {
    timestamps: true,
  }
)

// Indexes
CommentSchema.index({ parentType: 1, parentId: 1 })
CommentSchema.index({ authorId: 1 })

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

export default Comment
