import { Router } from 'express';
import { signUp, login, logout, requestNewPassword, changePassword, getAllUsers } from '../controllers/authController';

const router = Router();

router.post('/api/auth/singup', signUp);
router.post('/api/auth/login', login);
router.get('/api/auth/logout', logout);
router.get('/api/auth/users', getAllUsers)

router.post('/api/auth/forgotPassword', requestNewPassword);
router.patch('/api/auth/forgotPassword/:token', changePassword);

export { router as userRouter };
