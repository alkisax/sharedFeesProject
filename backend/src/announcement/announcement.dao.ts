import Announcement from './announcement.model'
import type { AnnouncementDoc } from './announcement.types'

const read = async (): Promise<AnnouncementDoc | null> => {
  const announcement = await Announcement.findOne()
  return announcement
}

const createOrUpdate = async (message: string): Promise<AnnouncementDoc> => {
  let announcement = await Announcement.findOne()

  if (!announcement) {
    announcement = new Announcement({ message })
  } else {
    announcement.message = message
  }

  announcement.updatedAt = new Date()
  await announcement.save()

  return announcement
}

// 🔹 Delete the single announcement
const deleteAnn = async (): Promise<AnnouncementDoc | null> => {
  const announcement = await Announcement.findOne()

  if (announcement) {
    await announcement.deleteOne()
    return announcement
  }

  return null
}

export const announcementDAO = {
  read,
  createOrUpdate,
  deleteAnn
}
