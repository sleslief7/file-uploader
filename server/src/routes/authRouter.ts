import { Router } from 'express';
import {
  signUp,
  logIn,
  logOut,
  checkAuthStatus,
} from '../controllers/authController';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/login', logIn);
authRouter.post('/logout', logOut);
authRouter.get('/auth', checkAuthStatus);

export default authRouter;
