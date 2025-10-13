import { Request, Response } from 'express'
import { announcementDAO } from './announcement.dao'
import { handleControllerError } from '../utils/error/errorHandler'
import type { AnnouncementDoc } from './announcement.types'

const getAnnouncement = async (_req: Request, res: Response): Promise<void> => {
  try {
    const announcement: AnnouncementDoc | null = await announcementDAO.read()

    if (!announcement) {
      res.status(404).json({ status: false, message: 'No announcement found' })
      return
    }

    res.json(announcement)
  } catch (error) {
    handleControllerError(res, error)
  }
}

const setAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body

    if (!message) {
      res.status(400).json({ status: false, message: 'Message is required' })
      return
    }

    const updated: AnnouncementDoc = await announcementDAO.createOrUpdate(message)
    res.json(updated)
  } catch (error) {
    handleControllerError(res, error)
  }
}

const deleteAnnouncement = async (_req: Request, res: Response): Promise<void> => {
  try {
    const deleted: AnnouncementDoc | null = await announcementDAO.deleteAnn()

    if (!deleted) {
      res.status(404).json({ status: false, message: 'No announcement to delete' })
      return
    }

    res.json({ status: true, message: 'Announcement deleted', deleted })
  } catch (error) {
    handleControllerError(res, error)
  }
}

export const announcementController = {
  getAnnouncement,
  setAnnouncement,
  deleteAnnouncement
}
