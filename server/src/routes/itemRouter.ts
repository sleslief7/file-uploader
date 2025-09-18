import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { cloneFoldersHandler } from '../controllers/folderController';
import { cloneFilesHandler } from '../controllers/fileController';
import { moveItems } from '../controllers/userController';
import { getItems } from '../controllers/itemController';

const itemRouter = Router();

itemRouter.get('/', ensureAuthenticated, getItems);
itemRouter.post(
  '/clone',
  ensureAuthenticated,
  cloneFoldersHandler,
  cloneFilesHandler
);
itemRouter.post('/move', ensureAuthenticated, moveItems);

export default itemRouter;
