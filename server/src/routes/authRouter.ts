import { Router } from 'express';
import { signUp, logIn, logOut } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/login', logIn);
authRouter.post('/logout', logOut);

export default authRouter;
