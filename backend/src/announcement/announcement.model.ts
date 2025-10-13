// backend\src\announcement\announcement.model.ts
import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Announcement', announcementSchema)
