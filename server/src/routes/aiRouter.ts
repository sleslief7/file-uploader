import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { aiGenerateHandler } from '../controllers/aiController';

const aiRouter = Router();

aiRouter.post('/', ensureAuthenticated, aiGenerateHandler);

export default aiRouter;
