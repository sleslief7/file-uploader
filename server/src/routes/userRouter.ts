import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { getUserById, updateUser } from '../controllers/userController';

const userRouter = Router();

userRouter.get('/:id', ensureAuthenticated, getUserById);
userRouter.put('/:id', ensureAuthenticated, updateUser);
export default userRouter;
