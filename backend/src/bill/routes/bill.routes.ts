import express from 'express'
const router = express.Router()
import { billController } from '../controllers/bill.comtroller'
import { middleware } from '../../login/middleware/verification.middleware'
// import { limiter } from '../../utils/limiter'

// ✅ create (admin only)
router.post('/', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.createBill)

// ✅ read
router.get('/', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.findAllBills)
router.get('/me', middleware.verifyToken, billController.findMyBills)

// ✅ update
router.patch('/:id/pay', middleware.verifyToken, billController.markBillAsPaid)
router.patch('/:id/approve', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.approveBill)
// new endpoint for cash payments (admin only)
router.patch('/:id/pay-cash', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.markBillPaidInCash)
router.put('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.updateBillById)

// ✅ cancel (admin only)
router.patch('/:id/cancel', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.cancelBill)

// ✅ delete (admin only)
router.delete('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), billController.deleteBillById)

export default router
