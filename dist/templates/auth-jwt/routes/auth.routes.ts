import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// POST /auth/login
router.post('/login', (req, res) => authController.login(req, res));

// GET /auth/verify
router.get('/verify', (req, res) => authController.verify(req, res));

export const authRoutes = router;
