import { Router } from 'express';

const router = Router();

router.post('/singup');
router.post('/login');
router.get('/logout');

router.post('/forgotPassword');
router.patch('/forgotPassword/:token');

