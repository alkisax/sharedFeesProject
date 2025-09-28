import express from 'express'
const router = express.Router()
import { globalBillController } from '../controllers/globalBill.controller'
// import { middleware } from '../../login/middleware/verification.middleware'
// import { limiter } from '../../utils/limiter'

// create
router.post( '/', globalBillController.createGlobalBill )

// read
router.get( '/', globalBillController.findAllGlobal )

router.get( '/:id', globalBillController.readGlobalById )

// update
router.put( '/:id', globalBillController.updateGlobalById )

// delete
router.delete( '/:id', globalBillController.deleteGlobalById )

// read only open
router.get( '/status/open', globalBillController.findOpenGlobal );

// // middleware turned off
// // create
// router.post( '/', middleware.verifyToken, middleware.checkRole('ADMIN'),  globalBillController.createGlobalBill )

// // read
// router.get( '/', middleware.verifyToken, globalBillController.findAllGlobal )

// router.get( '/:id', middleware.verifyToken, globalBillController.readGlobalById )

// // update
// router.put( '/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), globalBillController.updateGlobalById )

// // delete
// router.delete( '/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), globalBillController.deleteGlobalById )

// // read only open
// router.get( '/status/open', middleware.verifyToken,middleware.checkRole("ADMIN"),globalBillController.findOpenGlobal );

export default router
