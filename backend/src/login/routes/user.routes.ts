import express from 'express'
const router = express.Router()
import { userController } from '../controllers/user.controller'
import { middleware } from '../middleware/verification.middleware'
// import { limiter } from '../../utils/limiter'

// ------------------ create ------------------

// signup
// router.post('/signup/user', limiter(15,5), userController.createUser)
router.post('/signup/user', userController.createUser)

// create admin
// router.post('/signup/admin', middleware.verifyToken, middleware.checkRole('ADMIN'), limiter(15,5), userController.createAdmin)
router.post('/signup/admin', middleware.verifyToken, middleware.checkRole('ADMIN'), userController.createAdmin)

// ------------------ read ------------------

// get all users (admin only)
router.get('/', middleware.verifyToken, middleware.checkRole('ADMIN'), userController.findAll)

// get by username
router.get('/username/:username', middleware.verifyToken, middleware.checkRole('ADMIN'), userController.readByUsername)

// get by email
router.get('/email/:email', middleware.verifyToken, userController.readByEmail)

// endpoint for getting the user balance (admin sees any user)
router.get('/:id/balance', middleware.verifyToken, middleware.checkRole('ADMIN'), userController.getUserBalance)

// endpoint for getting *own* balance (self)
router.get('/me/balance', middleware.verifyToken, userController.getMyBalance)

// get by id (self or admin only)
router.get('/:id', middleware.verifyToken, middleware.checkSelfOrAdmin, userController.readById)

// ------------------ update ------------------

// update by id (self or admin)
router.put('/:id', middleware.verifyToken, middleware.checkSelfOrAdmin, userController.updateById)

// toggle admin role
router.put('/toggle-admin/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), userController.toggleRoleById)

// ------------------ delete ------------------

// delete self
router.delete('/self/:id', middleware.verifyToken, middleware.checkSelfOrAdmin, userController.deleteById)

// delete by id (admin only)
router.delete('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), userController.deleteById)

export default router
