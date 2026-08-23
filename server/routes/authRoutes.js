import express from 'express';
import { googleLogin, getCurrentUser, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/google', googleLogin);
router.get('/me', authenticate, getCurrentUser); //
router.post('/logout', logout);

export default router;
