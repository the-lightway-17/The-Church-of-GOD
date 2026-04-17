import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  description: string
  image?: string
  ownerId: mongoose.Types.ObjectId
  members: mongoose.Types.ObjectId[]
  moderators: mongoose.Types.ObjectId[]
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    image: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

// Indexes
GroupSchema.index({ name: 'text', description: 'text' })
GroupSchema.index({ ownerId: 1 })
GroupSchema.index({ 'members': 1 })

const Group: Model<IGroup> =
  mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema)

export default Group
