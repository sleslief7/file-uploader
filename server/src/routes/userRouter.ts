import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import {
  getUserFolderTreeHandler,
  getUserById,
  updateUser,
  userStorage,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/:id', ensureAuthenticated, getUserById);
userRouter.put('/:id', ensureAuthenticated, updateUser);
userRouter.get('/:id/storage', ensureAuthenticated, userStorage);
userRouter.get(
  '/:id/folder_tree',
  ensureAuthenticated,
  getUserFolderTreeHandler
);
export default userRouter;
