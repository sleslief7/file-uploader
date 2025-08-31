import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import {
  getUserFolderTree,
  getUserById,
  updateUser,
  userStorage,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/:id', ensureAuthenticated, getUserById);
userRouter.put('/:id', ensureAuthenticated, updateUser);
userRouter.get('/:id/storage', ensureAuthenticated, userStorage);
userRouter.get('/:id/folder_tree', ensureAuthenticated, getUserFolderTree);
export default userRouter;
