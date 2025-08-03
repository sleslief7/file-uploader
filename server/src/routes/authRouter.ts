import { Router } from 'express';
import {
  signUp,
  logIn,
  logOut,
  checkAuthStatus,
  googleLogin,
  googleLoginCallback,
} from '../controllers/authController';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/login', logIn);
authRouter.post('/logout', logOut);
authRouter.get('/auth', checkAuthStatus);
authRouter.get('/login/google', googleLogin);
authRouter.get('/login/google/callback', googleLoginCallback);

export default authRouter;
