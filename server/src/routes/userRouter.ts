import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import {
  getUserFolderTreeHandler,
  getUserById,
  updateUserHandler,
  userStorage,
} from '../controllers/userController';
import { upload } from '../middleware/upload';

const userRouter = Router();

userRouter.get('/:id', ensureAuthenticated, getUserById);
userRouter.put(
  '/:id',
  ensureAuthenticated,
  upload.single('profileImage'),
  updateUserHandler
);
userRouter.get('/:id/storage', ensureAuthenticated, userStorage);
userRouter.get(
  '/:id/folder_tree',
  ensureAuthenticated,
  getUserFolderTreeHandler
);
export default userRouter;
