import { Router } from 'express';
import { OAuthController } from '../controllers/oauth.controller';

const router = Router();
const oauthController = new OAuthController();

router.post('/authenticate', (req, res) => oauthController.authenticate(req, res));
router.post('/refresh', (req, res) => oauthController.refreshToken(req, res));

export default router;
