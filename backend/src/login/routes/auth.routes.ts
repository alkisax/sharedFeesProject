import express from 'express';
const router = express.Router();
import { authController } from '../controllers/auth.controller';
// import { limiter } from '../../utils/limiter';
import { middleware } from '../middleware/verification.middleware'

//>     "username": "alkisax",
//>     "password": "AdminPass1!"
// router.post('/', limiter(15,5), authController.login);
// router.post('/refresh', limiter(15,5), authController.refreshToken);

// TODO add limiter later
router.post('/', authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/is-logedin', middleware.verifyToken, authController.isLogedin)

export default router;