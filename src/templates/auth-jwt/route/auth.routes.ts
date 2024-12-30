import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// GET /auth/verify
router.get('/verify', (req, res) => authController.verify(req, res));

export const authRoutes = router;
