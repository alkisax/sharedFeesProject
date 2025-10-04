// backend/src/email/email.routes.ts
import express from 'express'
import { middleware } from '../login/middleware/verification.middleware'
import { emailController } from './email.controller'

const router = express.Router()

// Single-user notification (legacy)
router.post('/send-new', middleware.verifyToken, middleware.checkRole('ADMIN'), emailController.sendNewBillEmail)


// Mass mail per building
router.post('/send-mass', middleware.verifyToken, middleware.checkRole('ADMIN'), emailController.sendMassEmailToBuilding)

export default router
