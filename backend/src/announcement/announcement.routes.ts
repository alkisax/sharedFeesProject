import express from 'express'
import { announcementController } from './announcement.controller'
import { middleware } from '../login/middleware/verification.middleware'

const router = express.Router()

router.get('/', announcementController.getAnnouncement)
router.post('/',middleware.verifyToken, middleware.checkRole('ADMIN'), announcementController.setAnnouncement)
router.delete('/', middleware.verifyToken, middleware.checkRole('ADMIN'), announcementController.deleteAnnouncement)

export default router
