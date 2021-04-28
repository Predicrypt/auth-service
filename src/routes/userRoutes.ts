import { Router } from 'express';
import { signUp, login, logout } from '../controllers/authController';

const router = Router();

router.post('/singup', signUp);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword');
router.patch('/forgotPassword/:token');

export { router as userRouter };
