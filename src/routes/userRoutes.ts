import { Router } from 'express';
import { signUp } from '../controllers/authController';

const router = Router();

router.post('/singup', signUp);
router.post('/login');
router.get('/logout');

router.post('/forgotPassword');
router.patch('/forgotPassword/:token');

export { router as userRouter };
