import { Router } from 'express';
import { signUp, login, logout, requestNewPassword, changePassword } from '../controllers/authController';

const router = Router();

router.post('/singup', signUp);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', requestNewPassword);
router.patch('/forgotPassword/:token', changePassword);

export { router as userRouter };
