import express from 'express';
const router = express.Router();
import upload from './multer.service';
import { uploadController } from './upload.controller';
import { middleware } from '../login/middleware/verification.middleware';

router.get('/', uploadController.renderUploadPage);
// προσοχ: το upload.single είναι σαν middleware του multer. αυτό κανει το upload. ο controller στέλνει απλώς success message ή/και σώζη στην mongo
// router.post('/', middleware.verifyToken, middleware.checkRole('ADMIN'), upload.single('image'), uploadController.uploadFile);
// router.delete('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), uploadController.deleteUpload);

// delete when auth and swap TODO
router.post('/', middleware.verifyToken, upload.single('file'), uploadController.uploadFile);
router.delete('/:id', middleware.verifyToken, uploadController.deleteUpload);

export default router;
