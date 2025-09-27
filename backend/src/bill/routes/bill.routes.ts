import express from 'express'
const router = express.Router()
import { billController } from '../controllers/bill.comtroller'
import { middleware } from '../../login/middleware/verification.middleware'
// import { limiter } from '../../utils/limiter'

// create
router.post('/', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.createBill)

// read
router.get('/', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.findAllBills)
router.get('/me', middleware.verifyToken, billController.findMyBills)

// update
router.patch('/:id/pay', middleware.verifyToken, billController.markBillAsPaid)
router.patch('/:id/approve', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.approveBill)
router.put('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.updateBillById)

// delete
router.delete('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.deleteBillById)

export default router
