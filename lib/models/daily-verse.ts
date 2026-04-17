import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDailyVerse extends Document {
  _id: mongoose.Types.ObjectId
  reference: string
  text: string
  translation: string
  date: Date
}

const DailyVerseSchema = new Schema<IDailyVerse>({
  reference: { type: String, required: true },
  text: { type: String, required: true },
  translation: { type: String, default: 'NIV' },
  date: { type: Date, required: true, unique: true },
})

// Index for date lookups
DailyVerseSchema.index({ date: 1 })

const DailyVerse: Model<IDailyVerse> =
  mongoose.models.DailyVerse || mongoose.model<IDailyVerse>('DailyVerse', DailyVerseSchema)

export default DailyVerse
