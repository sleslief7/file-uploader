import { Router } from 'express';
import { signUp, logIn, logOut } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/signUp', signUp);
authRouter.post('/logIn', logIn);
authRouter.post('/logOut', logOut);

export default authRouter;
