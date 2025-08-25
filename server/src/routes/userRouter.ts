import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import {
  getUserById,
  updateUser,
  userStorage,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/:id', ensureAuthenticated, getUserById);
userRouter.put('/:id', ensureAuthenticated, updateUser);
userRouter.get('/:id/storage', ensureAuthenticated, userStorage);
export default userRouter;
